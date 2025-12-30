import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/auth": "http://localhost:5050",
      "/complaints": "http://localhost:5050",
      "/projects": "http://localhost:5050",
      "/alerts": "http://localhost:5050",
      "/transport": "http://localhost:5050",
    },
  },
  build: {
    outDir: "../server/public",
    emptyOutDir: true,
  },
});