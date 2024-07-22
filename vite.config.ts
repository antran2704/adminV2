import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["crypto", "process", "stream", "util"],
      globals: { global: true, process: true },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src/"),
      "@assets": `${path.resolve(__dirname, "./src/assets")}`,
    },
  },
});
