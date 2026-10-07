import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset URLs resolve against the document directory, so the same
  // build works at "/" locally and under "/deriv/" on Vercel.
  base: './',
  build: { outDir: 'dist', emptyOutDir: true },
});
