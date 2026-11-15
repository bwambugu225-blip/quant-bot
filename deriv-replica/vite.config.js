import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Absolute asset URLs so deep client routes resolve from the origin root.
  base: '/',
  build: { outDir: 'dist', emptyOutDir: true },
  // The dev/preview server is reached through an external host in the sandbox.
  preview: { allowedHosts: true },
  server: { allowedHosts: true },
});
