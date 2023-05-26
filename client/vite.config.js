// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'
const root = resolve(__dirname, '')
export default defineConfig({
  root,
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        nested: resolve(root, 'nested/page.html'),
      },
    },
  },
})