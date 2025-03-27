import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import Font from 'vite-plugin-font';

export default defineConfig({
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
  },
  // build: {
  //   rollupOptions: {
  //     external: ['public/MZPXorig.ttf']
  //   }
  // },
  plugins: [react(),Font.vite({
    scanFiles: ['src/**/*.{vue,ts,tsx,js,jsx,json}'],
  }),
  ],
  server: {
    port: 4000,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    }
  }
});