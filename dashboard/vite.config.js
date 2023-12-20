import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: './build'
  },
  server: {
    host: true,
    port: 7005
  },
  base: "/notion-scrum-review/"
})
