import { useEffect, useRef, useState } from "react";
import { CATEGORIES, GLAZES, formatPrice } from "../data/products.js";
import { SORTS, filterProducts, unitPrice, MAX_QTY } from "../lib/shop.js";
import { CloseIcon, MinusIcon, PlusIcon } from "./icons.jsx";

export function Catalog({ filters, onFilters, onOpen, onAdd }) {
  const list = filterProducts(filters);
  const set = (patch) => onFilters({ ...filters, ...patch });
  const active = filters.categoria || filters.esmalte;

  return (
    <section id="coleccion" aria-labelledby="coleccion-title" className="scroll-mt-16 px-5 py-24 sm:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 id="coleccion-title" className="text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
              La <em>colección</em>
            </h2>
            <p className="mt-3 max-w-[46ch] text-ink-soft">
              Series cortas torneadas a mano. Cuando una pieza se agota, la siguiente tanda tarda unas tres semanas.
            </p>
          </div>
          <label className="flex items-center gap-3 text-sm text-ink-soft">
            Ordenar
            <select name="orden" value={filters.orden} onChange={(e) => set({ orden: e.target.value })} className="field w-auto min-w-52 cursor-pointer">
              {Object.entries(SORTS).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-10 grid gap-5 border-y border-line py-5 md:grid-cols-[auto_1fr] md:items-center md:gap-x-8">
          <ChipGroup
            legend="Tipo de pieza"
            value={filters.categoria}
            options={CATEGORIES}
            allLabel="Todo"
            onChange={(categoria) => set({ categoria })}
          />
          <ChipGroup
            legend="Esmalte"
            value={filters.esmalte}
            options={Object.fromEntries(Object.entries(GLAZES).map(([k, g]) => [k, g.label]))}
            allLabel="Todos"
            swatches
            onChange={(esmalte) => set({ esmalte })}
          />
        </div>

        <div className="mt-4 flex min-h-11 items-center justify-between gap-4 text-sm text-ink-soft">
          <p role="status" aria-live="polite">
            {list.length === 1 ? "1 pieza" : `${list.length} piezas`}
          </p>
          {active && (
            <button type="button" onClick={() => set({ categoria: "", esmalte: "" })} className="min-h-11 underline underline-offset-4 hover:text-ink">
              Quitar filtros
            </button>
          )}
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-paper px-6 py-16 text-center">
            <p className="text-lg">No tenemos piezas de ese tipo con ese esmalte ahora mismo.</p>
            <button type="button" onClick={() => set({ categoria: "", esmalte: "" })} className="btn btn-ghost mt-6">
              Ver toda la colección
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => (
              <li key={p.id} className="reveal">
                <ProductCard product={p} onOpen={() => onOpen(p.id)} onAdd={() => onAdd(p.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function ChipGroup({ legend, value, options, allLabel, swatches = false, onChange }) {
  const entries = [["", allLabel], ...Object.entries(options)];
  return (
    <fieldset className="contents">
      <legend className="text-sm font-medium md:col-start-1">{legend}</legend>
      <div className="flex flex-wrap gap-2 md:col-start-2">
        {entries.map(([id, label]) => (
          <label key={id || "all"} className="relative cursor-pointer">
            <input
              type="radio"
              name={legend}
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="peer absolute inset-0 cursor-pointer opacity-0"
            />
            <span className="flex min-h-10 items-center gap-2 rounded-full px-4 text-[0.9375rem] ring-1 ring-line transition hover:ring-stone peer-checked:bg-ink peer-checked:text-bone peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
              {swatches && id && <span className={`swatch-${id} -ml-1.5 size-5 rounded-full ring-1 ring-inset ring-ink/15`} aria-hidden="true" />}
              {label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ProductCard({ product: p, onOpen, onAdd }) {
  return (
    <article className="group">
      <div className="relative overflow-hidden rounded-2xl bg-paper">
        <button type="button" onClick={onOpen} className="block w-full cursor-pointer" aria-label={`Ver ${p.name}`}>
          <img
            src={p.img.src}
            width={p.img.w}
            height={p.img.h}
            alt={p.alt}
            loading="lazy"
            decoding="async"
            className="aspect-[4/5] w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
          />
        </button>
        <button
          type="button"
          onClick={onAdd}
          className="absolute bottom-3 right-3 grid size-11 cursor-pointer place-items-center rounded-full bg-paper/90 text-ink shadow-[0_2px_10px_rgb(27_26_23/0.12)] transition hover:bg-ink hover:text-bone"
          aria-label={`Añadir ${p.name} al carrito`}
        >
          <PlusIcon />
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium leading-snug">
            <button type="button" onClick={onOpen} className="cursor-pointer text-left hover:underline hover:underline-offset-4">
              {p.name}
            </button>
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-soft">
            <span className={`swatch-${p.glaze} size-3 rounded-full ring-1 ring-inset ring-ink/15`} aria-hidden="true" />
            {GLAZES[p.glaze].label}
          </p>
        </div>
        <p className="tabular-nums font-medium">{formatPrice(p.price)}</p>
      </div>
    </article>
  );
}

/** Ficha de producto en un <dialog> nativo: atrapa el foco y se cierra con Escape sin código extra. */
export function ProductDialog({ product, onClose, onAdd }) {
  const ref = useRef(null);
  const [option, setOption] = useState(product?.options?.[0]?.id);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const d = ref.current;
    if (product && !d.open) {
      setOption(product.options?.[0]?.id);
      setQty(1);
      d.showModal();
    }
    if (!product && d.open) d.close();
  }, [product]);

  const price = product ? unitPrice(product, option) : 0;

  return (
    <dialog ref={ref} className="modal m-auto" onClose={onClose} aria-labelledby="pd-title" onClick={(e) => e.target === ref.current && ref.current.close()}>
      {product && (
        <div className="grid max-h-[calc(100dvh-2rem)] overflow-y-auto md:grid-cols-2">
          <img src={product.img.src} width={product.img.w} height={product.img.h} alt={product.alt} className="aspect-[4/5] w-full object-cover md:h-full md:aspect-auto" />
          <div className="relative flex flex-col p-6 sm:p-9">
            <button type="button" onClick={() => ref.current.close()} className="absolute right-4 top-4 grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5" aria-label="Cerrar">
              <CloseIcon />
            </button>
            <h2 id="pd-title" className="pr-10 text-3xl font-semibold tracking-[-0.025em]">
              {product.name}
            </h2>
            <p className="mt-2 text-xl tabular-nums">{formatPrice(price)}</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
              <span className={`swatch-${product.glaze} size-3.5 rounded-full ring-1 ring-inset ring-ink/15`} aria-hidden="true" />
              Esmalte {GLAZES[product.glaze].label.toLowerCase()} · {CATEGORIES[product.category]}
            </p>
            <p className="mt-5 text-ink-soft">{product.description}</p>
            <ul className="mt-5 space-y-1.5 border-t border-line pt-5 text-sm">
              {product.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>

            {product.options && (
              <fieldset className="mt-6">
                <legend className="mb-2 text-sm font-medium">Formato</legend>
                <div className="flex flex-wrap gap-2">
                  {product.options.map((o) => (
                    <label key={o.id} className="relative cursor-pointer">
                      <input type="radio" name="pd-option" value={o.id} checked={option === o.id} onChange={() => setOption(o.id)} className="peer absolute inset-0 cursor-pointer opacity-0" />
                      <span className="flex min-h-11 items-center rounded-full px-4 ring-1 ring-line transition hover:ring-stone peer-checked:bg-ink peer-checked:text-bone peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                        {o.label}
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              <Stepper value={qty} onChange={setQty} label={`Cantidad de ${product.name}`} />
              <button
                type="button"
                className="btn btn-primary flex-1"
                onClick={() => {
                  onAdd(product.id, option, qty);
                  ref.current.close();
                }}
              >
                Añadir al carrito · <span className="tabular-nums">{formatPrice(price * qty)}</span>
              </button>
            </div>
            <p className="mt-4 text-sm text-ink-soft">Envío gratis desde 80 € · Recogida gratis en el taller</p>
          </div>
        </div>
      )}
    </dialog>
  );
}

export function Stepper({ value, onChange, label, min = 1 }) {
  return (
    <div className="flex items-center rounded-full ring-1 ring-line" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Quitar una">
        <MinusIcon size={18} />
      </button>
      <span className="w-7 text-center tabular-nums" aria-live="polite">
        {value}
      </span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-35" aria-label="Añadir una">
        <PlusIcon size={18} />
      </button>
    </div>
  );
}
