import { defineConfig } from "vite";

export default defineConfig({
  root: ".",
  build: {
    outDir: "web-dist",
    emptyOutDir: true,
  },
});
