import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Served under /deriv/ on Vercel (bot.html stays at the root), so asset
  // URLs must be absolute to that base rather than relative.
  base: '/deriv/',
  build: { outDir: 'dist', emptyOutDir: true },
});
