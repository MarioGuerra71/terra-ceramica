import { useEffect, useState } from "react";
import Story from "./components/Story.jsx";
import { Catalog, ProductDialog } from "./components/Shop.jsx";
import { CartSheet, Checkout } from "./components/Cart.jsx";
import { BagIcon } from "./components/icons.jsx";
import { findProduct, credits } from "./data/products.js";
import { addToCart, setQty, cartCount, parseStoredCart, parseFilters, filtersToSearch } from "./lib/shop.js";

const STORAGE_KEY = "terra-cart";

// El navegador puede bloquear localStorage (modo privado, cookies bloqueadas): nunca debe romper la tienda
const loadCart = () => {
  try {
    return parseStoredCart(localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
};

export default function App() {
  const [cart, setCart] = useState(loadCart);
  const [filters, setFilters] = useState(() => parseFilters(location.search));
  const [glaze, setGlaze] = useState("hueso");
  const [productId, setProductId] = useState(null);
  const [panel, setPanel] = useState(null); // "cart" | "checkout" | null
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map(({ productId, optionId, qty }) => ({ productId, optionId, qty }))));
    } catch {
      /* sin almacenamiento: el carrito dura lo que dure la pestaña */
    }
  }, [cart]);

  // Los filtros viven en la URL para poder compartir una búsqueda
  useEffect(() => {
    history.replaceState(null, "", `${location.pathname}${filtersToSearch(filters)}${location.hash}`);
  }, [filters]);

  // Cabecera con fondo en cuanto se deja atrás la historia del jarrón
  useEffect(() => {
    const story = document.querySelector(".story");
    const onScroll = () => document.documentElement.classList.toggle("chrome-solid", story.getBoundingClientRect().bottom < 56);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const add = (id, optionId, qty = 1) => {
    setCart((c) => addToCart(c, id, optionId, qty));
    setToast(`${findProduct(id).name} añadido al carrito`);
  };

  const showGlaze = () => {
    setFilters((f) => ({ ...f, esmalte: glaze, categoria: "" }));
    document.getElementById("coleccion").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const count = cartCount(cart);

  return (
    <>
      <a href="#coleccion" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bone">
        Saltar a la colección
      </a>

      <header className="chrome fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between px-5 transition-colors duration-300 sm:px-10">
        <a href="#" className="text-lg font-semibold tracking-[-0.03em]" aria-label="Terra, inicio">
          terra
        </a>
        <nav aria-label="Principal" className="flex items-center gap-1 text-sm">
          <a href="#coleccion" className="hidden min-h-11 items-center rounded-full px-3 hover:bg-ink/5 sm:flex">
            Colección
          </a>
          <a href="#taller" className="hidden min-h-11 items-center rounded-full px-3 hover:bg-ink/5 sm:flex">
            El taller
          </a>
          <button
            type="button"
            onClick={() => setPanel("cart")}
            className="relative flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-paper px-4 ring-1 ring-ink/10 hover:bg-bone"
            aria-label={`Carrito, ${count} ${count === 1 ? "pieza" : "piezas"}`}
          >
            <BagIcon size={18} />
            <span className="tabular-nums">{count}</span>
          </button>
        </nav>
      </header>

      <main>
        <Story glaze={glaze} onGlaze={setGlaze} onShowGlaze={showGlaze} />

        <section id="taller" aria-labelledby="taller-title" className="scroll-mt-16 bg-paper px-5 py-24 sm:px-10 lg:py-32">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-12 lg:gap-x-8">
            <div className="reveal lg:col-span-5 lg:pt-10">
              <h2 id="taller-title" className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                Un taller de <em>dos tornos</em>.
              </h2>
              <p className="mt-5 max-w-[42ch] text-lg text-ink-soft">
                Terra es un taller pequeño en Triana: dos tornos, un horno eléctrico y una mesa larga donde se esmalta
                todo a mano. Trabajamos en series cortas y cada pieza lleva el sello del taller en la base.
              </p>
              <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
                <div>
                  <dt className="text-sm text-ink-soft">Cocción</dt>
                  <dd className="mt-1 text-xl font-semibold tabular-nums">1.240 °C</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Secado</dt>
                  <dd className="mt-1 text-xl font-semibold">7 días</dd>
                </div>
                <div>
                  <dt className="text-sm text-ink-soft">Esmaltes</dt>
                  <dd className="mt-1 text-xl font-semibold">5 propios</dd>
                </div>
              </dl>
            </div>
            <figure className="lg:col-span-7">
              <img src="/img/taller-torno.webp" width="1400" height="933" alt="Manos de un alfarero dando forma a una vasija en el torno" loading="lazy" decoding="async" className="reveal-img aspect-[3/2] w-full rounded-[1.25rem] object-cover" />
            </figure>
            <figure className="lg:col-span-4 lg:col-start-2">
              <img src="/img/taller-manos.webp" width="1200" height="1800" alt="Manos presionando el barro sobre el torno para abrir la pieza" loading="lazy" decoding="async" className="reveal-img aspect-[4/5] w-full rounded-[1.25rem] object-cover" />
            </figure>
            <figure className="lg:col-span-5 lg:col-start-7 lg:mt-24">
              <img src="/img/taller-barro.webp" width="1200" height="1800" alt="Manos cubiertas de barro sujetando una pieza recién torneada" loading="lazy" decoding="async" className="reveal-img aspect-[4/5] w-full rounded-[1.25rem] object-cover" />
            </figure>
          </div>
        </section>

        <Catalog filters={filters} onFilters={setFilters} onOpen={setProductId} onAdd={(id) => add(id)} />

        <section aria-label="Envíos y cuidados" className="border-t border-line px-5 py-14 sm:px-10">
          <ul className="mx-auto grid max-w-7xl gap-8 text-sm sm:grid-cols-3">
            <li>
              <p className="font-medium">Envío gratis desde 80 €</p>
              <p className="mt-1 text-ink-soft">Estándar en 48–72 h a península. Cada pieza va envuelta a mano.</p>
            </li>
            <li>
              <p className="font-medium">Recogida en el taller</p>
              <p className="mt-1 text-ink-soft">Gratis, en Triana, de lunes a viernes por la mañana.</p>
            </li>
            <li>
              <p className="font-medium">Gres para el día a día</p>
              <p className="mt-1 text-ink-soft">Apto para lavavajillas y microondas salvo que la ficha diga lo contrario.</p>
            </li>
          </ul>
        </section>
      </main>

      <footer className="on-dark bg-ink px-5 py-14 text-bone sm:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 text-sm md:grid-cols-3">
          <div>
            <p className="text-2xl font-semibold tracking-[-0.03em]">terra</p>
            <p className="mt-2 text-bone/70">Cerámica torneada a mano en Sevilla.</p>
          </div>
          <div>
            <h2 className="font-medium">Proyecto de demostración</h2>
            <p className="mt-2 text-bone/70">
              Terra no existe: piezas, precios, taller y pedidos son ficticios, y el pago es simulado. Diseño y
              desarrollo:{" "}
              <a href="https://github.com/MarioGuerra71" className="text-bone underline underline-offset-4" rel="author">
                Mario Guerra
              </a>
              .
            </p>
          </div>
          <div>
            <h2 className="font-medium">Fotografías</h2>
            <p className="mt-2 text-bone/70">
              De{" "}
              <a href="https://unsplash.com/license" className="text-bone underline underline-offset-4">
                Unsplash
              </a>
              :{" "}
              {credits.map((c, i) => (
                <span key={c.url}>
                  <a href={c.url} className="underline underline-offset-4 hover:text-bone">
                    {c.author}
                  </a>
                  {i < credits.length - 1 ? ", " : "."}
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>

      <ProductDialog product={productId ? findProduct(productId) : null} onClose={() => setProductId(null)} onAdd={add} />
      <CartSheet open={panel === "cart"} cart={cart} onClose={() => setPanel((p) => (p === "cart" ? null : p))} onQty={(key, q) => setCart((c) => setQty(c, key, q))} onCheckout={() => setPanel("checkout")} />
      <Checkout open={panel === "checkout"} cart={cart} onClose={() => setPanel(null)} onDone={() => setCart([])} />

      <p role="status" aria-live="polite" className={`fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm text-bone shadow-[0_8px_24px_rgb(27_26_23/0.2)] transition ${toast ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}>
        {toast}
      </p>
    </>
  );
}
