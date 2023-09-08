import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tsconfigPaths({ parseNative: true }),
    react(),
    VitePWA({ registerType: "autoUpdate" }),
  ],
});
