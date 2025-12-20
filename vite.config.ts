import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA as pwa } from 'vite-plugin-pwa';
import { analyzer } from 'vite-bundle-analyzer';

/**
 * https://vitejs.dev/config/
 */
export default defineConfig({
  base: process.env.VITE_BASE_URL || '/skyline/',
  plugins: [
    svgr({
      svgrOptions: {
        icon: true,
        svgProps: {
          className: 'g-icon',
        },
      },
    }),
    react(),
    analyzer({
      enabled: process.env.ENABLE_ANALYZER === '1',
    }),
    pwa({
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Skyline Overlay',
        short_name: 'Skyline',
        description: 'A modern customizable horizon FFXIV miniparse overlay.',
        icons: [{ src: 'favicon.svg', sizes: 'any' }],
        theme_color: '#8aa2d3',
      },
      workbox: {
        runtimeCaching: [
          // webfonts
          {
            urlPattern: /^https?:\/\/.*\/.woff2.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 }, 
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
    emptyOutDir: true,
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
  },
});
