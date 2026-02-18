/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import checker from 'vite-plugin-checker';
import loadVersion from 'vite-plugin-package-version';

// eslint-disable-next-line no-restricted-syntax
export default defineConfig({
  server: {
    port: 7654
  },
  plugins: [
    loadVersion(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    tsconfigPaths({ parseNative: true }),
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint --ext .tsx,.ts ./src'
      },
      overlay: false
    }),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Кэшировать все статические файлы при установке SW
        globPatterns: ['**/*.{js,css,html,ico,png,svg,gif,woff,woff2,webp}'],
        // Для SPA: отдавать index.html для всех навигационных запросов
        navigateFallback: 'index.html',
        // Cache-first для всего — приложение работает полностью офлайн
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              ['document', 'script', 'style', 'image', 'font'].includes(request.destination),
            handler: 'CacheFirst',
            options: {
              cacheName: 'app-assets',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
              },
            },
          },
        ],
      },
      manifest: {
        name: 'Evolution of Artificial Life',
        short_name: 'Artificial Life',
        background_color: 'black',
        theme_color: 'black',
        orientation: 'any',
        icons: [
          {
            src: '512x512@2x.png',
            sizes: '1024x1024',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
});
