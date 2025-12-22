import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // Use root for custom domain (anugrahiyyan.is-a.dev)
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: false,
  },
});
