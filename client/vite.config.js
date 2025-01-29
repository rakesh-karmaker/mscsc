import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      slate: "slate/dist/slate.min.js",
    },
  },
  build: { outDir: "build" },
  server: { mimeTypes: { "application/javascript": ["js"] } },
});
