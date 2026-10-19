// Escena 3D del jarrón. Se carga bajo demanda (import dinámico) para no pesar en la carga inicial.
// El jarrón es una superficie de revolución: igual que en el torno, se gira un perfil alrededor de un eje.
import * as THREE from "three";

const N = 64; // puntos del perfil

// Fases del torno: bola centrada → paredes subidas → jarrón con panza y cuello
const KEYS = [
  [[0, 0], [0.86, 0.02], [0.98, 0.24], [0.9, 0.55], [0.62, 0.82], [0.26, 0.96], [0.02, 0.99]],
  [[0, 0], [0.62, 0.02], [0.64, 0.6], [0.62, 1.3], [0.58, 1.9], [0.6, 2.15]],
  [[0, 0], [0.5, 0.02], [0.82, 0.5], [0.95, 0.98], [0.8, 1.55], [0.43, 2.07], [0.33, 2.36], [0.42, 2.62]],
];

/** Remuestrea una curva de control en N puntos equidistantes. */
function sample(points) {
  const curve = new THREE.SplineCurve(points.map(([x, y]) => new THREE.Vector2(x, y)));
  return curve.getSpacedPoints(N - 1);
}
const SAMPLED = KEYS.map(sample);

const smooth = (t) => t * t * (3 - 2 * t);
const clamp01 = (t) => Math.min(1, Math.max(0, t));
export const range = (p, a, b) => clamp01((p - a) / (b - a));

/** Perfil en el instante `form` (0 = bola, 1 = jarrón terminado). */
function profileAt(form) {
  const seg = form < 0.5 ? 0 : 1;
  const t = smooth(seg === 0 ? form * 2 : form * 2 - 1);
  const a = SAMPLED[seg];
  const b = SAMPLED[seg + 1];
  return a.map((pa, i) => new THREE.Vector2(pa.x + (b[i].x - pa.x) * t, pa.y + (b[i].y - pa.y) * t));
}

/** Textura de las "líneas de torno": anillos finos que deja el dedo al subir el barro. */
function throwingLines() {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 256;
  const g = c.getContext("2d");
  for (let y = 0; y < 256; y++) {
    const v = 128 + 70 * Math.sin(y * 0.55) + 30 * Math.sin(y * 0.13);
    g.fillStyle = `rgb(${v},${v},${v})`;
    g.fillRect(0, y, 4, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/** Sombra de contacto suave, dibujada en un canvas (sin imágenes externas). */
function contactShadow() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,0.45)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export function createVaseScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 2.6, 10.8);
  camera.lookAt(0, 0.85, 0);

  scene.add(new THREE.HemisphereLight(0xfff6ea, 0x3b3029, 1.35));
  const key = new THREE.DirectionalLight(0xfff1e0, 2.4);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xdfe6ff, 0.9);
  rim.position.set(-4, 3, -3);
  scene.add(rim);

  // Torno: plato giratorio sobre su base
  const wheel = new THREE.Group();
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(1.45, 1.5, 0.12, 72),
    new THREE.MeshStandardMaterial({ color: 0x6d5f55, roughness: 0.55, metalness: 0.15 }),
  );
  plate.position.y = -0.06;
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.75, 0.9, 48),
    new THREE.MeshStandardMaterial({ color: 0x3d3632, roughness: 0.8 }),
  );
  base.position.y = -0.57;
  wheel.add(plate, base);
  scene.add(wheel);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 3.2),
    new THREE.MeshBasicMaterial({ map: contactShadow(), transparent: true, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.005;
  scene.add(shadow);

  const lines = throwingLines();
  lines.repeat.set(1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x9b6a4d,
    roughness: 0.92,
    metalness: 0,
    bumpMap: lines,
    bumpScale: 0.6,
    side: THREE.DoubleSide,
    emissive: 0xff6a1a,
    emissiveIntensity: 0,
  });
  const vase = new THREE.Mesh(new THREE.LatheGeometry(profileAt(0), 120), material);
  scene.add(vase);

  const raw = new THREE.Color(0x9b6a4d); // barro húmedo
  const glaze = new THREE.Color(0xe7e1d4);
  let lastForm = -1;
  let state = { p: 0, glaze: "#e7e1d4", offsetX: 0, offsetY: 0, zoom: 1 };

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.zoom = state.zoom;
    // En escritorio el jarrón se desplaza a la derecha para dejar sitio al texto; en móvil, hacia arriba
    camera.setViewOffset(w, h, -state.offsetX * w, state.offsetY * h, w, h);
    camera.updateProjectionMatrix();
  }

  /** Dibuja la escena para un progreso de scroll p (0–1). */
  function render(p = state.p, glazeHex = state.glaze) {
    state.p = p;
    state.glaze = glazeHex;
    const form = range(p, 0.08, 0.4);
    if (Math.abs(form - lastForm) > 0.0005) {
      vase.geometry.dispose();
      vase.geometry = new THREE.LatheGeometry(profileAt(form), 120);
      lastForm = form;
    }
    // El torno gira con el scroll: rápido al tornear, despacio al final
    const spin = p * Math.PI * 10 - range(p, 0.45, 1) * Math.PI * 5;
    vase.rotation.y = spin;
    plate.rotation.y = spin;

    glaze.set(glazeHex);
    material.color.copy(raw).lerp(glaze, smooth(range(p, 0.4, 0.55)));
    material.bumpScale = 0.6 * (1 - range(p, 0.4, 0.55)) + 0.08;
    material.roughness = 0.92 - 0.12 * range(p, 0.7, 0.85);

    // Horno: el brillo sube y baja alrededor del panel 4 (p = 0,75)
    const kiln = range(p, 0.63, 0.72) * (1 - range(p, 0.8, 0.88));
    material.emissiveIntensity = kiln * 0.9;

    // Al final el jarrón "sale" del torno: el plato baja y se desvanece
    const out = smooth(range(p, 0.88, 0.99));
    wheel.position.y = -out * 1.2;
    wheel.visible = out < 0.99;
    plate.material.opacity = base.material.opacity = 1 - out;
    plate.material.transparent = base.material.transparent = out > 0;

    renderer.render(scene, camera);
  }

  function setOffset(x, y = 0, zoom = 1) {
    state.offsetX = x;
    state.offsetY = y;
    state.zoom = zoom;
    resize();
    render();
  }

  const ro = new ResizeObserver(() => {
    resize();
    render();
  });
  ro.observe(canvas);
  resize();

  return {
    render,
    setOffset,
    dispose() {
      ro.disconnect();
      renderer.dispose();
      vase.geometry.dispose();
      material.dispose();
      lines.dispose();
    },
  };
}
