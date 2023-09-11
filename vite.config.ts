/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
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
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Evolution of Artificial Life',
        short_name: 'Artificial Life',
        background_color: 'black',
        theme_color: 'black',
        orientation: 'any',
        icons: [
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '512x512@2x.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
