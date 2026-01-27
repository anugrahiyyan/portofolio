import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  // Use '/' for production (GitHub Pages), './' for local dev
  base: command === 'build' ? '/' : './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: false,
  },
}));
