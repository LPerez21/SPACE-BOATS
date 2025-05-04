// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // proxy any request starting with /api
      '/api': {
        target: 'http://127.0.0.1:8000',  // your FastAPI URL
        changeOrigin: true,
        secure: false,                    // set to false if you're using HTTP
        // strip `/api` so /api/login → /login on the backend
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});

