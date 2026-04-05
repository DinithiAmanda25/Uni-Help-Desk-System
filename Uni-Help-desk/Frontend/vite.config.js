import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy /api/* calls to the backend during development
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      // Proxy /uploads/* to backend static files
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
