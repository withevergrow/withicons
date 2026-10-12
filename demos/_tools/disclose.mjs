#!/usr/bin/env node
// Marks every published demo page (site/demos/<slug>.html, not the hub) as a demo, idempotently:
//   - <title> becomes "<Name> (demo) · with icons"; the meta description starts by saying it is a demo of a fictional business
//   - <meta name="robots" content="noindex, follow"> (never block them in robots.txt: crawlers must see the noindex)
//   - a small visible note at the top of <body> linking to the hub and withicons.com
//   node demos/_tools/disclose.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const DIR = path.join(ROOT, 'site', 'demos')
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'demos', '_data', 'demos.json'), 'utf8'))
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const DESC_PRE = 'Demo page with a fictional '
const NOTE_RE = /\n?<!-- with-demo-note -->[\s\S]*?<!-- \/with-demo-note -->\n?/

let n = 0
for (const d of data.demos) {
  const file = path.join(DIR, `${d.slug}.html`)
  if (!fs.existsSync(file)) { console.warn('! missing', path.relative(ROOT, file)); continue }
  let h = fs.readFileSync(file, 'utf8')
  const what = d.kind === 'shop' ? 'shop' : 'event'
  h = h.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(d.title)} (demo) · with icons</title>`)
  h = h.replace(/<meta name="description" content="([^"]*)">/, (m, c) => {
    if (c.startsWith(DESC_PRE)) c = c.replace(/^Demo page with a fictional [^:]*: /, '')
    return `<meta name="description" content="${DESC_PRE}${what}, made to show the with icons library: ${c}">`
  })
  h = h.replace(/\n?<meta name="robots"[^>]*>/, '')
  h = h.replace(/(<meta name="description"[^>]*>)/, '$1\n<meta name="robots" content="noindex, follow">')
  h = h.replace(NOTE_RE, '\n')
  const note = `<!-- with-demo-note -->
<aside aria-label="About this page" style="position:relative;z-index:1;margin:0;padding:7px 16px;background:#111318;color:#f4f1ea;font:500 13px/1.45 system-ui,-apple-system,'Segoe UI',sans-serif;text-align:center;letter-spacing:0">
  <strong style="font-weight:700">Demo:</strong> ${esc(d.title)} is a fictional ${what}, made to show the with icons library.
  <a href="index.html" style="color:#ffd76a;text-decoration:underline">All demos</a> · <a href="https://withicons.com/" style="color:#ffd76a;text-decoration:underline">withicons.com</a>
</aside>
<!-- /with-demo-note -->`
  h = h.replace(/(<body[^>]*>)/, `$1\n${note}`)
  fs.writeFileSync(file, h); n++
}
console.log('marked', n, 'demo pages as demos')
