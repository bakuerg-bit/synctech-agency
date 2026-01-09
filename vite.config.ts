import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Synctech is now a fully independent project - componentTagger removed
  plugins: [react()],
  base: '/', // Absolute path for custom domain root
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});