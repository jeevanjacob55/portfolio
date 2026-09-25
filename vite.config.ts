import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages serves project sites from https://<user>.github.io/<repo>/
// A relative base keeps every built asset path relative to index.html,
// so the site works whether it lives at the domain root or in a
// sub-path repo folder — no manual base editing required.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
