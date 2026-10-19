import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Sin estilos ni scripts en línea: la CSP de vercel.json no permite 'unsafe-inline'
  // Three.js va en su propio chunk (≈134 kB gzip) y se carga bajo demanda desde Story.jsx
  build: { assetsInlineLimit: 0, modulePreload: { polyfill: false }, chunkSizeWarningLimit: 600 },
});
