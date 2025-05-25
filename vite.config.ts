import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@Components": "/src/components",
      "@Pages": "/src/pages",
      "@Routes": "/src/routes",
      "@Services": "/src/services",
      "@Assets": "/src/assets",
      "@Hooks": "/src/hooks",
      "@Utils": "/src/utils",
      "@Features": "/src/features",
      "@": path.resolve(__dirname, "src"),
    },
  },
})
