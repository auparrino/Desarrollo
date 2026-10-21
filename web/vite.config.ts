import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// BASE permite publicar en un subdirectorio (p. ej. GitHub Pages: /Desarrollo/).
export default defineConfig({
  base: process.env.BASE ?? "/",
  plugins: [react()],
  worker: { format: "es" },
  build: { chunkSizeWarningLimit: 2500 },
});
