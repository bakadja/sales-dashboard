import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // react-charts package.json points to a missing ESM entry; alias to the actual .mjs file.
      'react-charts': 'react-charts/dist/react-charts.min.mjs',
    },
  },
})
