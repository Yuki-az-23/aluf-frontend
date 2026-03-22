import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/konimbo-live': {
        target: 'https://alufshop.konimbo.co.il',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/konimbo-live/, ''),
      },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'AlufApp',
      formats: ['iife'],
      fileName: () => 'aluf-app.js',
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        assetFileNames: 'aluf-app.[ext]',
      },
    },
    minify: 'terser',
  },
});
