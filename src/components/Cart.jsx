import { useEffect, useRef, useState } from "react";
import { GLAZES, formatPrice } from "../data/products.js";
import { cartLines, cartTotals, FREE_SHIPPING_FROM, SHIPPING, validateCheckout, orderNumber } from "../lib/shop.js";
import { CheckIcon, CloseIcon } from "./icons.jsx";
import { Stepper } from "./Shop.jsx";

/** Abre o cierra un <dialog> según `open`, y avisa cuando el usuario lo cierra (Escape, botón, fondo). */
function useDialog(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  const props = {
    ref,
    onClose,
    onClick: (e) => e.target === ref.current && ref.current.close(),
  };
  return [ref, props];
}

export function CartSheet({ open, cart, onClose, onQty, onCheckout }) {
  const [ref, dialogProps] = useDialog(open, onClose);
  const lines = cartLines(cart);
  const { subtotal } = cartTotals(cart);
  const left = FREE_SHIPPING_FROM - subtotal;

  return (
    <dialog {...dialogProps} className="sheet" aria-labelledby="cart-title">
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="cart-title" className="text-lg font-semibold">
            Tu carrito
          </h2>
          <button type="button" onClick={() => ref.current.close()} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5" aria-label="Cerrar el carrito">
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="text-lg">Todavía no has elegido ninguna pieza.</p>
            <a href="#coleccion" onClick={() => ref.current.close()} className="btn btn-primary">
              Ver la colección
            </a>
          </div>
        ) : (
          <>
            <p className="border-b border-line bg-bone px-6 py-3 text-sm" aria-live="polite">
              {left > 0 ? (
                <>
                  Te faltan <strong className="tabular-nums">{formatPrice(left)}</strong> para el envío gratis.
                </>
              ) : (
                <>Tienes el envío estándar gratis.</>
              )}
            </p>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <img src={l.product.img.src} width={l.product.img.w} height={l.product.img.h} alt="" className="size-20 flex-none rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-3">
                      <p className="font-medium leading-snug">{l.product.name}</p>
                      <p className="tabular-nums">{formatPrice(l.total)}</p>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {GLAZES[l.product.glaze].label}
                      {l.option && ` · ${l.option.label}`}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <Stepper value={l.qty} min={1} onChange={(q) => onQty(l.key, q)} label={`Cantidad de ${l.product.name}`} />
                      <button type="button" onClick={() => onQty(l.key, 0)} className="min-h-11 cursor-pointer text-sm text-ink-soft underline underline-offset-4 hover:text-ink">
                        Quitar
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t border-line px-6 py-5">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="tabular-nums font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-sm text-ink-soft">El envío se calcula en el siguiente paso.</p>
              <button type="button" onClick={onCheckout} className="btn btn-primary mt-5 w-full">
                Tramitar pedido
              </button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}

const STEPS = ["Tus datos", "Entrega", "Resumen"];
const STEP_FIELDS = [["name", "email", "phone"], ["shipping", "address", "zip", "city"], ["terms"]];
const EMPTY = { name: "", email: "", phone: "", shipping: "estandar", address: "", zip: "", city: "", notes: "", terms: false };

export function Checkout({ open, cart, onClose, onDone }) {
  const [ref, dialogProps] = useDialog(open, onClose);
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [shown, setShown] = useState({});
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (open) {
      setStep(0);
      setShown({});
      setOrder(null);
    }
  }, [open]);

  const { errors } = validateCheckout(data);
  const totals = cartTotals(cart, data.shipping);
  const lines = cartLines(cart);
  const set = (k) => (e) => setData((d) => ({ ...d, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const next = (e) => {
    e.preventDefault();
    const fields = STEP_FIELDS[step];
    const bad = fields.filter((f) => errors[f]);
    setShown((s) => ({ ...s, ...Object.fromEntries(fields.map((f) => [f, true])) }));
    if (bad.length) {
      ref.current.querySelector(`[name="${bad[0]}"]`)?.focus();
      return;
    }
    if (step < 2) return setStep(step + 1);
    // Pago simulado: no se envía nada a ningún sitio
    setOrder({ number: orderNumber(), total: totals.total, email: data.email.trim() });
    onDone();
  };

  const err = (k) => shown[k] && errors[k];
  const field = (k, label, props = {}) => (
    <div className={props.wide ? "sm:col-span-2" : ""}>
      <label htmlFor={`co-${k}`} className="mb-1.5 block text-sm font-medium">
        {label}
        {props.optional && <span className="font-normal text-ink-soft"> (opcional)</span>}
      </label>
      <input
        id={`co-${k}`}
        name={k}
        value={data[k]}
        onChange={set(k)}
        onBlur={() => setShown((s) => ({ ...s, [k]: true }))}
        aria-invalid={Boolean(err(k))}
        aria-describedby={err(k) ? `co-${k}-err` : undefined}
        className="field"
        {...props.input}
      />
      {err(k) && (
        <p id={`co-${k}-err`} className="err">
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <dialog {...dialogProps} className="modal m-auto" aria-labelledby="co-title">
      <div className="max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-6 py-4 sm:px-9">
          <h2 id="co-title" className="text-lg font-semibold">
            {order ? "Pedido confirmado" : "Tramitar pedido"}
          </h2>
          <button type="button" onClick={() => ref.current.close()} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5" aria-label="Cerrar">
            <CloseIcon />
          </button>
        </header>

        {order ? (
          <div className="px-6 py-12 text-center sm:px-9">
            <div className="mx-auto grid size-14 place-items-center rounded-full bg-ink text-bone">
              <CheckIcon size={26} />
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-tight">Gracias por tu pedido</p>
            <p className="mt-2 text-ink-soft">
              Número de pedido <strong className="tabular-nums text-ink">{order.number}</strong> · Total{" "}
              <strong className="tabular-nums text-ink">{formatPrice(order.total)}</strong>
            </p>
            <p className="mx-auto mt-6 max-w-md rounded-xl bg-bone px-5 py-4 text-sm">
              Es una compra simulada: no se ha cobrado nada ni se ha enviado ningún dato. En una tienda real, la
              confirmación llegaría a {order.email}.
            </p>
            <button type="button" onClick={() => ref.current.close()} className="btn btn-primary mt-8">
              Seguir mirando
            </button>
          </div>
        ) : (
          <form onSubmit={next} noValidate className="grid gap-8 px-6 py-7 sm:px-9 lg:grid-cols-[1fr_18rem]">
            <div>
              <ol className="mb-7 flex gap-2 text-sm" aria-label="Pasos del pedido">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex flex-1 flex-col gap-2" aria-current={i === step ? "step" : undefined}>
                    <span className={`h-1 rounded-full ${i <= step ? "bg-ink" : "bg-line"}`} />
                    <span className={i === step ? "font-medium" : "text-ink-soft"}>
                      {i + 1}. {s}
                    </span>
                  </li>
                ))}
              </ol>

              {step === 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("name", "Nombre y apellidos", { wide: true, input: { autoComplete: "name", maxLength: 80 } })}
                  {field("email", "Correo electrónico", { input: { type: "email", autoComplete: "email", maxLength: 120 } })}
                  {field("phone", "Teléfono", { optional: true, input: { type: "tel", autoComplete: "tel", inputMode: "tel", maxLength: 16 } })}
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-5">
                  <fieldset>
                    <legend className="mb-2 text-sm font-medium">¿Cómo lo quieres recibir?</legend>
                    <div className="grid gap-2">
                      {Object.entries(SHIPPING).map(([id, m]) => {
                        const price = cartTotals(cart, id).shipping;
                        return (
                          <label key={id} className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3.5 ring-1 ring-line transition hover:ring-stone has-[:checked]:ring-2 has-[:checked]:ring-ink">
                            <input type="radio" name="shipping" value={id} checked={data.shipping === id} onChange={set("shipping")} className="size-4" />
                            <span className="flex-1">
                              <span className="block font-medium">{m.label}</span>
                              <span className="block text-sm text-ink-soft">{m.eta}</span>
                            </span>
                            <span className="tabular-nums">{price ? formatPrice(price) : "Gratis"}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                  {data.shipping !== "recogida" ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field("address", "Dirección", { wide: true, input: { autoComplete: "street-address", maxLength: 120 } })}
                      {field("zip", "Código postal", { input: { autoComplete: "postal-code", inputMode: "numeric", maxLength: 5 } })}
                      {field("city", "Localidad", { input: { autoComplete: "address-level2", maxLength: 60 } })}
                    </div>
                  ) : (
                    <p className="rounded-xl bg-bone px-4 py-3 text-sm">
                      Te avisaremos por correo cuando esté listo. El taller abre de lunes a viernes de 10:00 a 14:00
                      (dirección ficticia de demostración).
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-5">
                  <dl className="grid gap-3 rounded-xl bg-bone px-5 py-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-ink-soft">Para</dt>
                      <dd className="font-medium">{data.name}</dd>
                      <dd>{data.email}</dd>
                    </div>
                    <div>
                      <dt className="text-ink-soft">Entrega</dt>
                      <dd className="font-medium">{SHIPPING[data.shipping].label}</dd>
                      {data.shipping !== "recogida" && (
                        <dd>
                          {data.address}, {data.zip} {data.city}
                        </dd>
                      )}
                    </div>
                  </dl>
                  <p className="rounded-xl px-5 py-4 text-sm ring-1 ring-line">
                    <strong className="font-medium">Pago simulado.</strong> Esta tienda es una demostración: no pide
                    tarjeta ni datos bancarios, y al confirmar no se cobra nada.
                  </p>
                  <label className="flex cursor-pointer items-start gap-3 text-sm">
                    <input type="checkbox" name="terms" checked={data.terms} onChange={set("terms")} className="mt-0.5 size-4" aria-invalid={Boolean(err("terms"))} aria-describedby={err("terms") ? "co-terms-err" : undefined} />
                    Acepto las condiciones de compra y que mis datos se usen solo para este pedido.
                  </label>
                  {err("terms") && (
                    <p id="co-terms-err" className="err -mt-3">
                      {errors.terms}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(step - 1)} className="btn btn-ghost">
                    Atrás
                  </button>
                )}
                <button type="submit" className="btn btn-primary min-w-48 flex-1 sm:flex-none">
                  {step < 2 ? "Continuar" : `Confirmar pedido · ${formatPrice(totals.total)}`}
                </button>
              </div>
            </div>

            <aside className="rounded-2xl bg-bone p-5 text-sm lg:self-start" aria-label="Resumen del carrito">
              <ul className="space-y-3">
                {lines.map((l) => (
                  <li key={l.key} className="flex justify-between gap-3">
                    <span>
                      {l.qty} × {l.product.name}
                      {l.option && <span className="text-ink-soft"> · {l.option.label}</span>}
                    </span>
                    <span className="tabular-nums">{formatPrice(l.total)}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-1.5 border-t border-line pt-4">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(totals.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Envío</dt>
                  <dd className="tabular-nums">{totals.shipping ? formatPrice(totals.shipping) : "Gratis"}</dd>
                </div>
                <div className="flex justify-between pt-1.5 text-base font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-ink-soft">IVA incluido. Precios de demostración.</p>
            </aside>
          </form>
        )}
      </div>
    </dialog>
  );
}
