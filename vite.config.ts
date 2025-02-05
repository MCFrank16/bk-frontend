import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: 'https://bk-frontend-production.up.railway.app/',
  plugins: [react(), tailwindcss()],
});

