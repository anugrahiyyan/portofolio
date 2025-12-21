import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portofolio/', // Repository name for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: false,
  },
});
