import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          workbox: {
            navigateFallbackDenylist: [/^\/sitemap\.xml(?:$|\?)/, /^\/robots\.txt(?:$|\?)/, /^\/api(?:\/|$)/],
            skipWaiting: true,
            clientsClaim: true,
          },
          includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
          devOptions: {
            enabled: true
          },
          manifest: {
            name: 'MyshopMyhome.shop',
            short_name: 'MyshopMyhome',
            description: 'Mobile Accessories & Home Store',
            theme_color: '#2874f0',
            background_color: '#ffffff',
            display: 'standalone',
            start_url: '/',
            orientation: 'portrait',
            scope: '/',
            icons: [
              {
                src: 'https://cdn-icons-png.flaticon.com/512/1041/1041888.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any maskable'
              },
              {
                src: 'https://cdn-icons-png.flaticon.com/512/1041/1041888.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any maskable'
              }
            ]
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
