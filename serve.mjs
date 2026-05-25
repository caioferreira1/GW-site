import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// Load .env.local for local development
try {
  const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  for (const line of envFile.split('\n')) {
    const [key, ...vals] = line.split('=');
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  }
} catch { /* no .env.local */ }

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch { reject(new Error('Invalid JSON')); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  let urlPath = req.url.split('?')[0];

  // API route
  if (urlPath === '/api/book' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const { default: handler } = await import('./api/book.js');
      const mockRes = {
        _status: 200,
        _body: null,
        status(code) { this._status = code; return this; },
        json(obj) { this._body = obj; return this; },
      };
      await handler({ method: req.method, body }, mockRes);
      res.writeHead(mockRes._status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(mockRes._body));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (urlPath === '/') urlPath = '/index.html';
  if (urlPath === '/book') urlPath = '/book.html';

  const filePath = path.join(__dirname, urlPath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`GroundWave dev server running at http://localhost:${PORT}`);
});
