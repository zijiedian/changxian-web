import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleCodexRequest } from './server/codex-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.join(__dirname, 'dist');
const port = process.env.PORT || 5173;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const filePath = decoded === '/' ? '/index.html' : decoded;
  const normalized = path.normalize(filePath);
  const resolved = path.join(root, normalized);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/generate-cards') || req.url?.startsWith('/api/generate-article')) {
    handleCodexRequest(req, res);
    return;
  }
  const resolved = safePath(req.url || '/');
  if (!resolved) {
    res.writeHead(400);
    res.end('Bad request');
    return;
  }

  fs.readFile(resolved, (err, data) => {
    if (!err) {
      const ext = path.extname(resolved).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
      return;
    }

    if (!path.extname(resolved)) {
      const fallback = path.join(root, 'index.html');
      fs.readFile(fallback, (fallbackErr, fallbackData) => {
        if (fallbackErr) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fallbackData);
      });
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });
});

server.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
  console.log('Tip: run \"npm run build\" to generate /dist before serving.');
});
