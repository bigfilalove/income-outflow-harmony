import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(async ({ mode }) => {
  let componentTagger;
  if (mode === 'development') {
    const { componentTagger: tagger } = await import("lovable-tagger");
    componentTagger = tagger;
  }

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:5050',
          changeOrigin: true,
          // Удаляем rewrite, чтобы сохранить префикс /api
        },
      },
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    base: './',
    build: {
      outDir: 'dist',
      sourcemap: true,
      chunkSizeWarningLimit: 1000,
    },
  };
});