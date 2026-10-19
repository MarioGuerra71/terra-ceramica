import { useEffect, useRef, useState } from "react";
import { GLAZES } from "../data/products.js";
import { ArrowDownIcon, ArrowRightIcon } from "./icons.jsx";

// Fondo de cada fase. Cada panel lleva el suyo, así el contraste es correcto aunque no haya JavaScript,
// y al hacer scroll el fondo de la fase siguiente barre al anterior por detrás del jarrón.
const STAGE_BG = ["bg-[#decbba]", "bg-[#e8e1d6]", "bg-[#cfd6c6]", "bg-kiln", "bg-bone"];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Story({ glaze, onGlaze, onShowGlaze }) {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const glazeRef = useRef(GLAZES[glaze].color);
  const [webgl, setWebgl] = useState(true);

  // Escena 3D: se carga bajo demanda y se dibuja solo cuando cambia el scroll
  useEffect(() => {
    let cancelled = false;
    let frame = 0;
    let visible = true;
    const root = rootRef.current;
    const reduce = prefersReducedMotion();

    const progress = () => {
      const r = root.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    };

    const paint = () => {
      frame = 0;
      const p = progress();
      // Cabecera clara mientras el horno (fondo oscuro) pasa por debajo de ella
      const kiln = document.getElementById("horno").getBoundingClientRect();
      document.documentElement.classList.toggle("chrome-dark", kiln.top <= 28 && kiln.bottom > 28);
      // Con movimiento reducido el jarrón se queda terminado y quieto
      sceneRef.current?.render(reduce ? 1 : p, glazeRef.current);
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(paint);
    };

    const layout = () => {
      const desktop = window.matchMedia("(min-width: 64rem)").matches;
      // En móvil el jarrón sube y se reduce para dejar la mitad de abajo al texto
      sceneRef.current?.setOffset(desktop ? 0.2 : 0, desktop ? 0 : 0.2, desktop ? 1 : 0.66);
      paint();
    };

    import("../lib/vase.js")
      .then(({ createVaseScene }) => {
        if (cancelled) return;
        sceneRef.current = createVaseScene(canvasRef.current);
        layout();
      })
      .catch(() => setWebgl(false)); // sin WebGL: se muestra una foto en su lugar

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) onScroll();
    });
    io.observe(root);
    const mq = window.matchMedia("(min-width: 64rem)");
    mq.addEventListener("change", layout);
    window.addEventListener("scroll", onScroll, { passive: true });
    paint();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      mq.removeEventListener("change", layout);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.classList.remove("chrome-dark");
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, []);

  // Cambiar de esmalte repinta el jarrón al momento
  useEffect(() => {
    glazeRef.current = GLAZES[glaze].color;
    window.dispatchEvent(new Event("scroll"));
  }, [glaze]);

  return (
    <section ref={rootRef} aria-label="Cómo se hace una pieza" className="story relative">
      {/* El jarrón va por encima de los paneles; no captura clics para no tapar botones */}
      <div className="pointer-events-none sticky top-0 z-10 h-svh overflow-hidden" aria-hidden="true">
        {webgl ? (
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        ) : (
          <img
            src="/img/jarron-anfora.webp"
            alt=""
            width="900"
            height="1350"
            className="absolute right-0 top-0 h-full w-full object-cover opacity-90 lg:w-1/2"
          />
        )}
      </div>

      <div className="relative -mt-[100svh]">
        <Panel stage={0}>
          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            Todo empieza con un puñado de <em>barro</em>.
          </h1>
          <p className="mt-5 max-w-[30ch] text-lg text-ink-soft">
            Cerámica torneada a mano en un pequeño taller de Sevilla. Baja y mira cómo se hace un jarrón.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#coleccion" className="btn btn-primary">
              Ver la colección
            </a>
            <a href="#torno" className="btn text-ink-soft hover:text-ink">
              Cómo trabajamos <ArrowDownIcon size={18} />
            </a>
          </div>
        </Panel>

        <Panel stage={1} id="torno">
          <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            En el torno, las manos le dan <em>forma</em>.
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg text-ink-soft">
            Centramos el barro, abrimos el hueco y subimos las paredes poco a poco. Una pieza así lleva unos veinte
            minutos de torno y una semana de secado.
          </p>
        </Panel>

        <Panel stage={2}>
          <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Esmaltes mate, mezclados en el <em>taller</em>.
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg text-ink-soft">Elige uno y mira cómo queda.</p>
          <fieldset className="mt-6">
            <legend className="sr-only">Esmalte del jarrón</legend>
            <div className="flex flex-wrap gap-2">
              {Object.entries(GLAZES).map(([id, g]) => (
                <label key={id} className="group relative cursor-pointer">
                  <input
                    type="radio"
                    name="glaze"
                    value={id}
                    checked={glaze === id}
                    onChange={() => onGlaze(id)}
                    className="peer absolute inset-0 cursor-pointer opacity-0"
                  />
                  <span className="flex min-h-11 items-center gap-2 rounded-full bg-paper/70 py-1.5 pl-1.5 pr-4 text-[0.9375rem] ring-1 ring-ink/10 transition peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                    <Swatch id={id} />
                    {g.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button type="button" onClick={onShowGlaze} className="btn btn-ghost mt-6">
            Ver piezas en {GLAZES[glaze].label.toLowerCase()} <ArrowRightIcon size={18} />
          </button>
        </Panel>

        <Panel stage={3} id="horno" dark>
          <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            A 1.240 °C, el barro se vuelve <em>piedra</em>.
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg text-bone/75">
            Doce horas de cocción y otras doce de enfriado. Por eso el gres aguanta el lavavajillas, el microondas y el
            día a día.
          </p>
        </Panel>

        <Panel stage={4}>
          <h2 className="text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Y llega a tu <em>mesa</em>.
          </h2>
          <p className="mt-5 max-w-[34ch] text-lg text-ink-soft">
            Cada pieza sale única: el moteado, el goteo del esmalte y las líneas del torno no se repiten.
          </p>
          <a href="#coleccion" className="btn btn-primary mt-8">
            Ver la colección
          </a>
        </Panel>
      </div>
    </section>
  );
}

function Panel({ children, id, stage, dark = false }) {
  return (
    <div
      id={id}
      className={`${STAGE_BG[stage]} flex min-h-svh items-end px-5 pb-[9svh] pt-[52svh] sm:px-10 lg:items-center lg:px-[max(2.5rem,calc((100vw-80rem)/2))] lg:py-0 ${dark ? "on-dark text-bone" : "text-ink"}`}
    >
      <div className="max-w-xl">
        {children}
      </div>
    </div>
  );
}

function Swatch({ id }) {
  // El color sale del catálogo; sin estilos en línea para no romper la CSP
  return <span className={`swatch swatch-${id} block size-8 rounded-full ring-1 ring-inset ring-ink/15`} aria-hidden="true" />;
}
