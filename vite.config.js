import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import Sitemap from 'vite-plugin-sitemap'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  Sitemap({
    hostname: 'https://big2.live',
    lastmod: new Date().toISOString(),
    dynamicRoutes: ['/'],
    readable: true,
    outDir: 'dist',
    changefreq: 'weekly',
    priority: 1.0
  })],
})
