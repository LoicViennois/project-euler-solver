import { execSync } from 'node:child_process';

import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function resolveCommitSha(): string {
  if (process.env.VERCEL_GIT_COMMIT_SHA) {
    return process.env.VERCEL_GIT_COMMIT_SHA;
  }
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

export default defineConfig({
  define: {
    __COMMIT_SHA__: JSON.stringify(resolveCommitSha()),
  },
  worker: {
    format: 'es',
  },
  plugins: [
    // Must come before the React plugin
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    VitePWA({
      // Registered from src/lib/update.ts, which asks before activating an update.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.64.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Project Euler Solver',
        short_name: 'Euler Solver',
        description:
          'Solutions to Project Euler problems, solved live in your browser.',
        theme_color: '#0f1a24',
        background_color: '#0f1a24',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          ...iconSizes.map((size) => ({
            src: `icons/icon-${size}x${size}.png`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            purpose: 'any',
          })),
          {
            src: 'icons/maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallback: '/index.html',
        // The solver worker bundles every solution and its input data.
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
