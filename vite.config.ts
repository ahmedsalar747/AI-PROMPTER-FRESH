import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  define: {
    global: 'globalThis',
    // Allow eval in development
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Prompter Fresh - AI Prompt Architect',
        short_name: 'Prompter',
        description: 'Professional AI prompt enhancement and architecture tool',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openai\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'openai-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    // Performance optimizations
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          utils: ['axios'],
          i18n: ['i18n-js']
        }
      }
    },
    // Compress assets
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  server: {
    host: true,
    port: 3000,
    // Remove all CSP restrictions completely
    headers: {}
  },
  // Production optimizations
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Allow eval in development
    legalComments: 'none',
  }
}) 