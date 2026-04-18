import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-i18n': ['i18next', 'react-i18next'],
          'vendor-misc': ['react-helmet-async', 'posthog-js'],
          'blog-content': ['./src/data/blog-content'],
          'landing-content': ['./src/data/landing-content'],
        },
      },
    },
  },
})
