import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    assetsDir: "bundle",
    rollupOptions: {
      input: {
        main: "dev.html",
        case: "case.html",
        writing: "writing.html",
      },
    },
  },
});
