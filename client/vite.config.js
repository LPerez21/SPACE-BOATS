// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // your FastAPI server
        changeOrigin: true,
        secure: false,                   // only needed if you’re not using HTTPS locally
        // no rewrite: /api/login → http://127.0.0.1:8000/api/login
      },
    },
  },
});
