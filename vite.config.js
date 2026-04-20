import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensures assets use relative paths — required for Vercel/Netlify sub-path deploys
  base: '/',
  build: {
    // Generate sourcemaps for easier debugging in production
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split vendor chunks for better caching — function form required by Vite v8
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'firebase';
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('react-router-dom')) return 'vendor';
        },
      },
    },
  },
  // Fallback to index.html for all unmatched routes during local preview
  preview: {
    port: 4173,
  },
});
