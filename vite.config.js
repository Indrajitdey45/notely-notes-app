import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/notely-notes-app/',
  base: process.env.VERCEL ? '/' : '/notely-notes-app/',
})
