import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Absolute asset URLs so deep client routes ("/markets/forex", "/trader")
  // resolve assets from the origin root rather than a nested directory. The
  // app is deployed at "/", and Vercel's SPA rewrite serves index.html for
  // every non-asset path.
  base: '/',
  build: { outDir: 'dist', emptyOutDir: true },
  // The dev/preview server is reached through an external host in the sandbox,
  // so allow that hostname rather than pinning to localhost.
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
});
