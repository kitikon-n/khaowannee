import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {proxy: {
      '/api': {
        target: 'https://n8n.rerankmeister.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: [
      '.ngrok-free.app', // Or your specific Ngrok subdomain, e.g., 'your-subdomain.ngrok-free.app'
      'localhost', // Keep localhost if you also access it directly
      'n8n.rerankmeister.com'
    ],
  },
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})