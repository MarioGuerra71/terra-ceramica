import { test } from "node:test";
import assert from "node:assert/strict";
import {
  addToCart, setQty, cartLines, cartCount, cartTotals, parseStoredCart,
  parseFilters, filtersToSearch, filterProducts, validateCheckout, orderNumber, MAX_QTY,
} from "../src/lib/shop.js";

test("añadir el mismo producto suma cantidad en la misma línea", () => {
  let cart = addToCart([], "cuenco-alba");
  cart = addToCart(cart, "cuenco-alba", undefined, 2);
  assert.equal(cart.length, 1);
  assert.equal(cartCount(cart), 3);
});

test("cada opción es una línea distinta y cambia el precio", () => {
  let cart = addToCart([], "vaso-salvia", "uno");
  cart = addToCart(cart, "vaso-salvia", "par");
  const lines = cartLines(cart);
  assert.equal(lines.length, 2);
  assert.deepEqual(lines.map((l) => l.unit), [2200, 4000]);
});

test("opción inexistente cae en la primera; producto inexistente se ignora", () => {
  assert.equal(addToCart([], "vaso-salvia", "trampa")[0].optionId, "uno");
  assert.deepEqual(addToCart([], "no-existe"), []);
});

test("la cantidad se limita entre 1 y el máximo, y 0 borra la línea", () => {
  let cart = addToCart([], "cuenco-alba", undefined, 99);
  assert.equal(cart[0].qty, MAX_QTY);
  cart = setQty(cart, cart[0].key, 0);
  assert.deepEqual(cart, []);
});

test("envío: gratis desde 80 € en estándar, urgente siempre se paga, recogida gratis", () => {
  const small = addToCart([], "cuenco-alba"); // 28 €
  assert.deepEqual(cartTotals(small, "estandar"), { subtotal: 2800, shipping: 590, total: 3390 });
  assert.equal(cartTotals(small, "recogida").shipping, 0);
  const big = addToCart([], "jarrones-duna"); // 89 €
  assert.equal(cartTotals(big, "estandar").shipping, 0);
  assert.equal(cartTotals(big, "express").shipping, 990);
  assert.equal(cartTotals([], "express").total, 0);
});

test("el carrito guardado se valida al leerlo", () => {
  assert.deepEqual(parseStoredCart("no es json"), []);
  assert.deepEqual(parseStoredCart('{"a":1}'), []);
  const cart = parseStoredCart(JSON.stringify([{ productId: "cuenco-alba", qty: 500 }, { productId: "hack" }, null]));
  assert.equal(cart.length, 1);
  assert.equal(cart[0].qty, MAX_QTY);
});

test("filtros desde la URL: solo valores conocidos", () => {
  assert.deepEqual(parseFilters("?categoria=jarrones&esmalte=<script>&orden=precio-asc"), { categoria: "jarrones", esmalte: "", orden: "precio-asc" });
  assert.equal(filtersToSearch({ categoria: "", esmalte: "salvia", orden: "destacados" }), "?esmalte=salvia");
  assert.equal(filtersToSearch({ categoria: "", esmalte: "", orden: "destacados" }), "");
});

test("filtrar y ordenar el catálogo", () => {
  const jarrones = filterProducts({ categoria: "jarrones", esmalte: "", orden: "precio-asc" });
  assert.ok(jarrones.every((p) => p.category === "jarrones"));
  assert.deepEqual(jarrones.map((p) => p.price), [...jarrones.map((p) => p.price)].sort((a, b) => a - b));
  assert.ok(filterProducts({ categoria: "", esmalte: "salvia", orden: "" }).every((p) => p.glaze === "salvia"));
});

test("checkout: recogida no pide dirección, envío sí", () => {
  const base = { name: "Ana López", email: "ana@correo.es", phone: "", terms: "on" };
  assert.equal(validateCheckout({ ...base, shipping: "recogida" }).ok, true);
  const { errors } = validateCheckout({ ...base, shipping: "estandar", zip: "99999" });
  assert.deepEqual(Object.keys(errors).sort(), ["address", "city", "zip"]);
  assert.ok(validateCheckout({ ...base, email: "ana@", shipping: "recogida", terms: false }).errors.terms);
});

test("número de pedido con formato TR-XXXXXX", () => {
  assert.match(orderNumber(), /^TR-[0-9A-Z]{6}$/);
});
