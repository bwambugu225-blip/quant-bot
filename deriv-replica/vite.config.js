import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const SC_DIST = 'node_modules/@deriv-com/smartcharts-champion/dist';

// SmartCharts loads its chunks, Flutter chart bundle and sprite asynchronously
// at runtime from the path set by setSmartChartsPublicPath('/smartcharts/'), so
// they must ship as real static files beside the build. Copy them with a small
// recursive walker — the file layout has to be preserved exactly (`chart/…`,
// `canvaskit/…`), which a glob-copy plugin does not guarantee.
function copySmartCharts() {
  return {
    name: 'copy-smartcharts',
    apply: 'build',
    closeBundle() {
      const src = resolve(SC_DIST);
      const dest = resolve('dist/smartcharts');
      if (!existsSync(src)) return;
      const walk = dir => {
        for (const entry of readdirSync(join(src, dir), { withFileTypes: true })) {
          const rel = join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(rel);
          } else if (entry.name.includes('.smartcharts.') || entry.name.startsWith('sprite-')) {
            mkdirSync(dirname(join(dest, rel)), { recursive: true });
            copyFileSync(join(src, rel), join(dest, rel));
          }
        }
      };
      walk('.');
      const chartSrc = join(src, 'chart');
      if (existsSync(chartSrc)) {
        const copyTree = (from, to) => {
          mkdirSync(to, { recursive: true });
          for (const entry of readdirSync(from, { withFileTypes: true })) {
            const f = join(from, entry.name), t = join(to, entry.name);
            if (entry.isDirectory()) copyTree(f, t);
            else copyFileSync(f, t);
          }
        };
        copyTree(chartSrc, join(dest, 'chart'));
        // Flutter's assetBase is the public path root, so its AssetManifest and
        // fonts live at /smartcharts/assets while the chart entrypoint and
        // canvaskit live under /smartcharts/chart.
        copyTree(join(src, 'assets'), join(dest, 'assets'));
        copyTree(join(src, 'assets'), join(dest, 'chart', 'assets'));
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copySmartCharts()],
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
