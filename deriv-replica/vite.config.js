import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs resolve against the document directory, so the same
  // build works at "/" locally and under "/deriv/" on Vercel.
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
  // The dev/preview server is reached through an external host in the sandbox,
  // so allow that hostname rather than pinning to localhost.
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
});
