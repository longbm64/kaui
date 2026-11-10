
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DEMO_ROOT = path.join(ROOT, 'demo');
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon', '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

function send(res, statusCode, body, headers = {}) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8', ...headers });
  res.end(body);
}

function resolveFile(urlPath) {
  let decodedPath;
  try { decodedPath = decodeURIComponent(urlPath); } catch { return null; }
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const root = relativePath.startsWith('dist/') || relativePath.startsWith('src/')
    ? ROOT
    : DEMO_ROOT;
  const filePath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, filePath);
  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) return null;
  try { return fs.statSync(filePath).isDirectory() ? path.join(filePath, 'index.html') : filePath; }
  catch { return filePath; }
}

const server = http.createServer((req, res) => {
  const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  if (requestUrl.pathname === '/health') { send(res, 200, 'ok\n'); return; }
  if (requestUrl.pathname === '/demo' || requestUrl.pathname.startsWith('/demo/')) {
    res.writeHead(301, { Location: requestUrl.pathname.replace(/^\/demo(?=\/|$)/, '') || '/' });
    res.end();
    return;
  }
  if (!['GET', 'HEAD'].includes(req.method)) { send(res, 405, 'Method Not Allowed\n', { Allow: 'GET, HEAD' }); return; }

  const filePath = resolveFile(requestUrl.pathname);
  if (!filePath) { send(res, 403, 'Forbidden\n'); return; }
  fs.stat(filePath, (statError, stats) => {
    if (statError || !stats.isFile()) { send(res, 404, 'Not Found\n'); return; }
    res.writeHead(200, {
      'Cache-Control': path.extname(filePath) === '.html' ? 'no-cache' : 'public, max-age=3600',
      'Content-Length': stats.size,
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    });
    if (req.method === 'HEAD') { res.end(); return; }
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => console.log(`KAUI Railway server listening on ${HOST}:${PORT}`));
function shutdown(signal) { console.log(`${signal} received; shutting down`); server.close(() => process.exit(0)); }
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
