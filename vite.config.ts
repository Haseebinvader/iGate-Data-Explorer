import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ----------------------------------------------------
// Vite Configuration
// ----------------------------------------------------
// This file configures the Vite build tool for the project.
// - Adds React and Tailwind plugins
// - Sets up a dev server proxy for API requests
// ----------------------------------------------------

export default defineConfig({
  // --------------------------------
  // Plugins
  // --------------------------------
  // - react(): enables React Fast Refresh, JSX, etc.
  // - tailwindcss(): integrates Tailwind with Vite
  plugins: [react(), tailwindcss()],

  // --------------------------------
  // Dev Server Configuration
  // --------------------------------
  server: {
    proxy: {
      // Intercept requests to `/api/latestblock` during development
      '/api/latestblock': {
        // Forward them to the blockchain.info public API
        target: 'https://blockchain.info',
        changeOrigin: true, // change the origin header to match target
        // Rewrite the path: /api/latestblock -> /latestblock
        // (because the real API endpoint is at /latestblock)
        rewrite: (path) => path.replace(/^\/api\/latestblock$/, '/latestblock'),
        secure: true, // verify SSL certs when proxying
      },
    },
  },
})
