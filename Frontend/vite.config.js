import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Make environment variables available at build time
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL),
  },
})
