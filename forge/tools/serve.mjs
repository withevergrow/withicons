#!/usr/bin/env node
// Static server for site/. node forge/tools/serve.mjs [port]
import http from 'http'; import fs from 'fs'; import path from 'path'
import { ROOT } from '../lib/load.mjs'
const dir = path.join(ROOT, 'site'), port = Number(process.argv[2] || 4321)
const T = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.png': 'image/png', '.webp': 'image/webp', '.ico': 'image/x-icon' }
http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html'
  let f = path.join(dir, p); if (!f.startsWith(dir)) { r.writeHead(403); return r.end() }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html'
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404, { 'Content-Type': 'text/plain' }); return r.end('404') } r.writeHead(200, { 'Content-Type': T[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); r.end(d) })
}).listen(port, () => console.log(`site: http://localhost:${port}`))
