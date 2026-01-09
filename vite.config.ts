import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Synctech is now a fully independent project - componentTagger removed
  plugins: [react()],
  base: './', // Using ./ ensures assets load correctly on GitHub Pages
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});