
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Base path configuration for deployment flexibility
  base: './',
  build: {
    // Output directory for production build
    outDir: 'dist',
    // Generate source maps for easier debugging
    sourcemap: true,
    // Optimize chunk size for better performance
    chunkSizeWarningLimit: 1000,
  },
}));
