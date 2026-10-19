# Terra · tienda de cerámica con historia en 3D

**Demo:** https://terra-ceramica.vercel.app
**Código:** https://github.com/MarioGuerra71/terra-ceramica

Tienda online de un taller de cerámica **ficticio** de Sevilla, hecha como pieza de portfolio. Piezas, precios, taller y pedidos son inventados, y el pago es simulado.

## La idea

Al hacer scroll se ve cómo se hace un jarrón, como en las páginas de producto de Apple:

1. **Barro:** una bola de barro sobre el torno.
2. **Torno:** se abre y suben las paredes. El jarrón es una *superficie de revolución* (`LatheGeometry` de Three.js), igual que en el torno: un perfil que gira alrededor de un eje y que se interpola entre tres fases.
3. **Esmalte:** el visitante elige el esmalte y el jarrón cambia de color al momento. El botón «Ver piezas en…» filtra el catálogo por ese esmalte.
4. **Horno:** el jarrón se pone incandescente sobre fondo negro, y la cabecera cambia de color para seguir siendo legible.
5. **Mesa:** el torno desaparece y empieza la tienda.

Cada fase tiene su propio color de fondo, que barre al anterior por detrás del jarrón. Las secciones de más abajo aparecen con **animaciones de scroll nativas de CSS** (`animation-timeline: view()`), sin librerías.

## La tienda

- **Catálogo con filtros** por tipo y esmalte, y orden por precio. Los filtros se guardan en la URL para poder compartir una búsqueda.
- **Ficha de producto** con formatos (unidad o pareja, tamaño) y cantidad.
- **Carrito lateral** guardado en `localStorage`. Al leerlo se valida, porque cualquiera puede manipularlo.
- **Checkout en tres pasos** (datos, entrega y resumen) con validación completa:
  - el envío estándar es gratis desde 80 €, el urgente se paga siempre y la recogida en el taller es gratis;
  - el pago es simulado: no hay ningún campo de tarjeta.
- **Precios en céntimos**, para evitar errores de redondeo.

## Stack

- React 19, Vite 8 y Tailwind CSS 4: las mismas versiones que mi portfolio.
- Three.js, cargado bajo demanda (`import()`) para que no retrase la primera pantalla.
- Fuentes autoalojadas con Fontsource: Geist e Instrument Serif (licencia OFL).
- 10 tests de la lógica de la tienda con el runner nativo de Node (`node --test`).

## Accesibilidad y rendimiento

- **Movimiento reducido:** con `prefers-reduced-motion` el jarrón aparece terminado y quieto, y todo el contenido sigue visible.
- **Sin WebGL**, se muestra una foto en lugar de la escena 3D.
- **Diálogos nativos** (`<dialog>`) para la ficha, el carrito y el checkout: atrapan el foco y se cierran con Escape.
- **Lighthouse móvil:** 100 en accesibilidad, buenas prácticas y SEO. LCP de 0,9 s con CPU ×4 y 4G simulada, y CLS 0.

## Seguridad

- **CSP estricta** en [vercel.json](vercel.json): solo recursos propios, sin `unsafe-inline` ni `eval`, y `frame-ancestors 'none'`.
- **Cabeceras:** HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy` (incluido `payment=()`) y COOP.
- **Sin scripts de terceros ni rastreadores.**
- **Validación de entradas:** los datos que vienen de la URL y de `localStorage` se validan contra listas de valores permitidos.

## Uso

```powershell
npm install
npm run dev      # http://localhost:5173
npm test         # tests de carrito, catálogo y checkout
npm run build
npm run preview
```

## Créditos

Fotografías de [Unsplash](https://unsplash.com/license), con los autores en el pie de la web. Diseño y desarrollo: [Mario Guerra](https://github.com/MarioGuerra71).
