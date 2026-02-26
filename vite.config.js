import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { handleCodexRequest } from './server/codex-handler.js';

const codexApiPlugin = () => ({
  name: 'codex-api',
  configureServer(server) {
    server.middlewares.use('/api/generate-cards', (req, res) => {
      handleCodexRequest(req, res);
    });
    server.middlewares.use('/api/generate-article', (req, res) => {
      handleCodexRequest(req, res);
    });
  },
});

export default defineConfig({
  plugins: [react(), codexApiPlugin()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
});
