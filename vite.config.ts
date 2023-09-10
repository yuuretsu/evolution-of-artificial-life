import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
  plugins: [
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tsconfigPaths({ parseNative: true }),
    react(),
    VitePWA({ registerType: 'autoUpdate' }),
  ],
});
