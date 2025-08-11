import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.ts',
        'dist/',
        'android/',
        'ios/',
      ],
    },
    include: ['src/**/*.{test,spec}.{js,ts,tsx}'],
    exclude: ['node_modules', 'dist', 'android', 'ios'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}) 