import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server : {
    headers : {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin"
    },
    proxy : {
        "/cdn" : {
            target : "https://cdnjs.cloudflare.com/ajax/libs",
            changeOrigin : true,
            rewrite : (path) => path.replace(/^\/cdn/, "")
        }
    }
  }
})