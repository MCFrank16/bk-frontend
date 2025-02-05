import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 4173, // Or use process.env.PORT if required
  },
  preview: {
    host: 'bk-frontend-production.up.railway.app',
    port: 4173,
  },
  plugins: [react(), tailwindcss()],
});

