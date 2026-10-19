// Lógica pura de la tienda: carrito, catálogo y checkout. Sin React, para poder probarla con node --test.
import { products, findProduct, CATEGORIES, GLAZES } from "../data/products.js";

export const MAX_QTY = 10;
export const FREE_SHIPPING_FROM = 8000;

export const SHIPPING = {
  recogida: { label: "Recogida en el taller (Sevilla)", eta: "Lista en 2 días laborables", price: 0 },
  estandar: { label: "Envío estándar", eta: "48–72 h en península", price: 590 },
  express: { label: "Envío urgente", eta: "24 h en península", price: 990 },
};

/* ---------- Carrito ---------- */

const lineKey = (productId, optionId) => `${productId}:${optionId ?? ""}`;

/** Precio unitario de un producto con su opción (talla, juego…). */
export function unitPrice(product, optionId) {
  const option = product.options?.find((o) => o.id === optionId);
  return product.price + (option?.delta ?? 0);
}

/** Devuelve un carrito nuevo; nunca modifica el anterior. */
export function addToCart(cart, productId, optionId, qty = 1) {
  const product = findProduct(productId);
  if (!product) return cart;
  if (product.options && !product.options.some((o) => o.id === optionId)) optionId = product.options[0].id;
  if (!product.options) optionId = undefined;
  const key = lineKey(productId, optionId);
  const existing = cart.find((l) => l.key === key);
  if (existing) return setQty(cart, key, existing.qty + qty);
  return [...cart, { key, productId, optionId, qty: clampQty(qty) }];
}

export function setQty(cart, key, qty) {
  if (qty <= 0) return cart.filter((l) => l.key !== key);
  return cart.map((l) => (l.key === key ? { ...l, qty: clampQty(qty) } : l));
}

const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(n) || 1)));

/** Líneas con producto y precios calculados; descarta lo que ya no exista en el catálogo. */
export function cartLines(cart) {
  return cart
    .map((l) => {
      const product = findProduct(l.productId);
      if (!product) return null;
      const unit = unitPrice(product, l.optionId);
      const option = product.options?.find((o) => o.id === l.optionId);
      return { ...l, product, option, unit, total: unit * l.qty };
    })
    .filter(Boolean);
}

export const cartCount = (cart) => cart.reduce((n, l) => n + l.qty, 0);

export function cartTotals(cart, shippingId = "estandar") {
  const subtotal = cartLines(cart).reduce((n, l) => n + l.total, 0);
  const method = SHIPPING[shippingId] ?? SHIPPING.estandar;
  // El envío estándar es gratis desde 80 €; el urgente se paga siempre
  const free = subtotal === 0 || (shippingId === "estandar" && subtotal >= FREE_SHIPPING_FROM);
  const shipping = free ? 0 : method.price;
  return { subtotal, shipping, total: subtotal + shipping };
}

/** Lee el carrito guardado sin fiarse de su contenido (lo puede haber tocado cualquiera). */
export function parseStoredCart(raw) {
  try {
    const data = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return [];
    return data.reduce((cart, l) => (l && typeof l.productId === "string" ? addToCart(cart, l.productId, l.optionId, l.qty) : cart), []);
  } catch {
    return [];
  }
}

/* ---------- Catálogo ---------- */

export const SORTS = { destacados: "Destacados", "precio-asc": "Precio: de menor a mayor", "precio-desc": "Precio: de mayor a menor" };

/** Filtros a partir de la URL, aceptando solo valores conocidos. */
export function parseFilters(search) {
  const p = new URLSearchParams(search);
  const pick = (key, allowed) => (Object.hasOwn(allowed, p.get(key) ?? "") ? p.get(key) : "");
  return { categoria: pick("categoria", CATEGORIES), esmalte: pick("esmalte", GLAZES), orden: pick("orden", SORTS) || "destacados" };
}

export function filtersToSearch({ categoria, esmalte, orden }) {
  const p = new URLSearchParams();
  if (categoria) p.set("categoria", categoria);
  if (esmalte) p.set("esmalte", esmalte);
  if (orden && orden !== "destacados") p.set("orden", orden);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function filterProducts({ categoria, esmalte, orden }, list = products) {
  const out = list.filter((p) => (!categoria || p.category === categoria) && (!esmalte || p.glaze === esmalte));
  if (orden === "precio-asc") return [...out].sort((a, b) => a.price - b.price);
  if (orden === "precio-desc") return [...out].sort((a, b) => b.price - a.price);
  return out;
}

/* ---------- Checkout (simulado) ---------- */

export function validateCheckout(data) {
  const errors = {};
  const s = (k) => String(data[k] ?? "").trim();
  if (s("name").length < 2) errors.name = "Escribe tu nombre y apellidos.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s("email"))) errors.email = "Revisa el correo (por ejemplo, nombre@correo.es).";
  const phone = s("phone").replace(/[\s.-]/g, "");
  if (phone && !/^(\+34)?[6789]\d{8}$/.test(phone)) errors.phone = "Escribe un teléfono español de 9 cifras o déjalo vacío.";
  if (!Object.hasOwn(SHIPPING, s("shipping"))) errors.shipping = "Elige cómo quieres recibir el pedido.";
  if (s("shipping") !== "recogida") {
    if (s("address").length < 5) errors.address = "Escribe la calle y el número.";
    if (!/^(0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(s("zip"))) errors.zip = "El código postal tiene 5 cifras (por ejemplo, 41001).";
    if (s("city").length < 2) errors.city = "Escribe la localidad.";
  }
  if (data.terms !== true && data.terms !== "on") errors.terms = "Acepta las condiciones para continuar.";
  return { ok: Object.keys(errors).length === 0, errors };
}

/** Número de pedido de mentira, pero con un generador seguro. */
export function orderNumber() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return "TR-" + [...bytes].map((b) => b.toString(36).padStart(2, "0")).join("").slice(0, 6).toUpperCase();
}
