import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Dominios do ngrok liberados para compartilhar o site em testes.
// Sem isso o Vite responde "Blocked request" para quem abre pelo link.
const dominiosNgrok = ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.io']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    allowedHosts: dominiosNgrok,
  },
  preview: {
    host: true,
    allowedHosts: dominiosNgrok,
  },
})
