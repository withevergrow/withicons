#!/usr/bin/env node
// "Download all" zips for the website: one per style, plus one with every style when it stays small enough.
//   site/downloads/with-icons-<style>.zip
//     with-icons-<style>/svg/<name>.svg   every icon, standalone (CSS variables flattened like @withicons/static's
//                                         dist/svg files; gradient ids kept, they are unique per file anyway)
//     with-icons-<style>/index.html       offline viewer: one self-contained page (inline CSS + JS + every SVG),
//                                         search, preview, copy and download that work straight from file://
//     with-icons-<style>/LICENSE.txt      the repo's MIT licence
//     with-icons-<style>/README.txt       what is inside and how to use it
//   site/downloads/with-icons-all.zip     every style as svg/<style>/<name>.svg (no viewers: get those from the style zips),
//                                         skipped when it would be bigger than ALL_LIMIT
//   site/data/downloads.json              { version, styles: { <style>: { file, bytes, icons, sha } }, all }
//   site/data/downloads.js                the same as window.WITH_DOWNLOADS (the site also works from file://)
//
// The zips are deterministic (fixed timestamps, sorted entries, fixed deflate level): the same icons give the same
// bytes, so scripts/deploy.mjs (MD5 vs S3 ETag) only uploads the zips that really changed. A zip is only rewritten
// when its bytes differ.
//
// forge/build.mjs calls build(ctx) with its renders. Standalone:
//   node forge/tools/site-downloads.mjs                 every style (+ the all-styles zip)
//   node forge/tools/site-downloads.mjs line clay       just these styles (no all-styles zip; downloads.json is merged)
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import crypto from 'crypto'
import { pathToFileURL } from 'url'
import { ROOT, listIcons, loadIcon, loadStyles, toSvg, nodesToMarkup, readManifest } from '../lib/load.mjs'
import { sortStyles, styleVars, isPalette, flattenVars } from '../lib/emit-core.mjs'

const OUT = path.join(ROOT, 'site', 'downloads')
const DATA = path.join(ROOT, 'site', 'data')
const ALL_LIMIT = 48 * 1048576   // the all-styles zip is skipped above this (bytes)
const SITE = 'https://withicons.com'

// ------------------------------------------------------------------ deterministic zip writer (no dependencies)
const CRC_TABLE = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c })
const crc32 = typeof zlib.crc32 === 'function' ? b => zlib.crc32(b) >>> 0
  : b => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC_TABLE[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ -1) >>> 0 }
// every entry is dated 2026-01-01 00:00 (local, as ZIP has no zone): fixed, so the same input -> the same zip
const DOS_TIME = 0, DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1
/** entries: [[name, Buffer|string]] (a name ending in "/" is a folder). Sorted here; returns a Buffer. */
export function zipFiles(entries, comment = '') {
  const list = entries.map(([n, d]) => [n, n.endsWith('/') ? Buffer.alloc(0) : Buffer.isBuffer(d) ? d : Buffer.from(String(d), 'utf8')])
  // add the folders of every file (Explorer and Finder show empty-looking trees without them), then sort
  const names = new Set(list.map(e => e[0]))
  for (const [n] of list.slice()) { const parts = n.split('/'); for (let i = 1; i < parts.length; i++) { const d = parts.slice(0, i).join('/') + '/'; if (!names.has(d)) { names.add(d); list.push([d, Buffer.alloc(0)]) } } }
  list.sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)
  const locals = [], centrals = []
  let offset = 0
  for (const [name, data] of list) {
    const n = Buffer.from(name, 'utf8'), dir = name.endsWith('/')
    const method = dir || data.length < 64 ? 0 : 8
    const comp = method ? zlib.deflateRawSync(data, { level: 9, memLevel: 9 }) : data
    const crc = dir ? 0 : crc32(data)
    const h = Buffer.alloc(30)
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(method, 8)
    h.writeUInt16LE(DOS_TIME, 10); h.writeUInt16LE(DOS_DATE, 12); h.writeUInt32LE(crc, 14)
    h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(n.length, 26); h.writeUInt16LE(0, 28)
    locals.push(h, n, comp)
    const c = Buffer.alloc(46)
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE((3 << 8) | 20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8)
    c.writeUInt16LE(method, 10); c.writeUInt16LE(DOS_TIME, 12); c.writeUInt16LE(DOS_DATE, 14); c.writeUInt32LE(crc, 16)
    c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(n.length, 28)
    // unix mode in the high word (0755 folders, 0644 files) + the MS-DOS directory bit for folders
    c.writeUInt32LE(((dir ? 0o40755 : 0o100644) << 16 | (dir ? 0x10 : 0)) >>> 0, 38); c.writeUInt32LE(offset, 42)
    centrals.push(c, n)
    offset += 30 + n.length + comp.length
  }
  if (list.length > 0xffff || offset > 0xffffffff) throw new Error('zip too large for the classic format (no zip64 here)')
  const cd = Buffer.concat(centrals)
  const com = Buffer.from(comment, 'utf8')
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(com.length, 20); end.writeUInt16LE(list.length, 8); end.writeUInt16LE(list.length, 10)
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16)
  return Buffer.concat([...locals, cd, end, com])
}

// Content key of a set of entries (bumped ZIP_REV invalidates every zip). It is stored as the zip comment, so an
// unchanged style skips the deflate work entirely on the next build.
const ZIP_REV = 1
function entriesKey(entries) {
  const h = crypto.createHash('sha256').update('rev' + ZIP_REV)
  for (const [n, d] of entries.slice().sort((a, b) => a[0] < b[0] ? -1 : 1)) h.update(JSON.stringify(n)).update(d)
  return h.digest('hex').slice(0, 24)
}
/** Writes the zip of entries to file unless the file already holds them; returns { buf, wrote }. */
function writeZip(file, entries, label) {
  const key = entriesKey(entries), comment = label + ' ' + key
  if (fs.existsSync(file)) { const old = fs.readFileSync(file); if (old.length > 22 && old.subarray(old.length - Buffer.byteLength(comment)).toString('utf8') === comment) return { buf: old, wrote: false } }
  const buf = zipFiles(entries, comment)
  fs.writeFileSync(file, buf)
  return { buf, wrote: true }
}

// ------------------------------------------------------------------ helpers
const read = rel => { try { return fs.readFileSync(path.join(ROOT, rel), 'utf8') } catch { return '' } }
const sha = b => crypto.createHash('sha256').update(b).digest('hex')
const mb = n => (n / 1048576).toFixed(n < 10 * 1048576 ? 2 : 1) + ' MB'
const CAT_LABEL = { ai: 'AI' }
const catLabel = c => CAT_LABEL[c] || (c.charAt(0).toUpperCase() + c.slice(1)).replace(/-/g, ' ')
// JSON inside <script type="application/json">: never let a "</script" or "<!--" through
const jsonForHtml = v => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
const escHtml = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// the site's signature colour of a style (site/css/tokens.css), light and dark; brand ink/sun when not found
function styleColours(tokens, name) {
  const cut = tokens.indexOf('dark theme')
  const light = cut > 0 ? tokens.slice(0, cut) : tokens, dark = cut > 0 ? tokens.slice(cut) : ''
  const get = (src, k) => { const m = src.match(new RegExp(`--c-${name}${k}:\\s*(#[0-9a-fA-F]{3,8})`)); return m ? m[1] : null }
  return {
    c: get(light, '') || '#FFD23F', text: get(light, '-text') || '#111318', soft: get(light, '-soft') || '#FFF1BF', on: get(light, '-on') || '#111318',
    dc: get(dark, '') || get(light, '') || '#FFD23F', dtext: get(dark, '-text') || get(light, '') || '#FFD23F', dsoft: get(dark, '-soft') || '#3A3014',
  }
}

// search fields straight from the skeletons (ctx.icons carries no synonyms)
function skeletonMeta(name) {
  try {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'icons', `${name}.json`), 'utf8'))
    return { category: raw.category || '', description: raw.description || '', aliases: raw.aliases || [], synonyms: raw.synonyms || [], tags: raw.tags || [] }
  } catch { return { category: '', description: '', aliases: [], synonyms: [], tags: [] } }
}

// ------------------------------------------------------------------ build
export function build(ctx, { allZip = true } = {}) {
  const t0 = Date.now()
  fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(DATA, { recursive: true })
  const manifest = readManifest()
  // the published set: the manifest's icons that have a skeleton (a stray skeleton or a render left over from a removed
  // icon never reaches a zip, so every zip, its README and downloads.json agree with the site's own count)
  const listed = new Set((manifest.icons || []).map(i => i.name))
  const icons = listed.size ? ctx.icons.filter(i => listed.has(i.name)) : ctx.icons
  const tokens = read('site/css/tokens.css')
  const license = read('LICENSE') || 'MIT License\n'
  const mark = read('site/brand/mark.svg').trim()
  const version = ctx.version || JSON.parse(read('package.json') || '{}').withiconsVersion || '0.0.0'
  const meta = Object.fromEntries(icons.map(i => [i.name, skeletonMeta(i.name)]))
  // categories in manifest order, then any new ones
  const cats = [...(manifest.categories || [])]
  for (const i of icons) { const c = meta[i.name].category; if (c && !cats.includes(c)) cats.push(c) }
  // UI glyphs for the viewer: our own line icons (inner markup), drawn with currentColor
  const lineStyle = ctx.styles.find(s => s.name === 'line')
  const ui = {}
  for (const n of ['search', 'download', 'copy', 'check', 'close', 'sun', 'moon', 'image', 'folder-open']) {
    const i = ctx.icons.find(x => x.name === n)
    const r = i && (i.render.line || Object.values(i.render)[0])
    if (r) ui[n] = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${r.inner}</svg>`
  }
  void lineStyle

  const prevJson = (() => { try { return JSON.parse(fs.readFileSync(path.join(DATA, 'downloads.json'), 'utf8')) } catch { return null } })()
  const doc = { version, site: SITE, styles: {}, all: null }
  // a partial standalone run keeps the other styles' entries (their zips are still on disk; a removed style's go)
  if (prevJson && prevJson.styles) for (const [k, v] of Object.entries(prevJson.styles)) if (fs.existsSync(path.join(OUT, `with-icons-${k}.zip`)) && fs.existsSync(path.join(ROOT, 'forge', 'styles', `${k}.mjs`))) doc.styles[k] = { ...v, size: v.size || mb(v.bytes || fs.statSync(path.join(OUT, `with-icons-${k}.zip`)).size) }
  const report = []
  const allEntries = []
  let wrote = 0
  for (const st of ctx.styles) {
    const dir = `with-icons-${st.name}`
    const files = [], svgs = []
    for (const i of icons) {
      const r = i.render[st.name]
      if (!r) continue
      const svg = flattenVars(r.svg || toSvg(st, r.nodes))
      files.push([`${dir}/svg/${i.name}.svg`, svg + '\n'])
      svgs.push([i.name, svg])
    }
    if (!svgs.length) { report.push(`${st.name}: no renders, skipped`); continue }
    const html = viewerHtml({ st, version, svgs, meta, cats, colours: styleColours(tokens, st.name), ui, mark, total: icons.length })
    const readme = readmeText({ st, version, count: svgs.length })
    files.push([`${dir}/index.html`, html], [`${dir}/LICENSE.txt`, license], [`${dir}/README.txt`, readme])
    const { buf, wrote: w } = writeZip(path.join(OUT, `${dir}.zip`), files, `with icons ${st.name} ${version} https://withicons.com`)
    if (w) wrote++
    doc.styles[st.name] = { title: st.title || st.name, file: `downloads/${dir}.zip`, bytes: buf.length, size: mb(buf.length), icons: svgs.length, sha: sha(buf).slice(0, 12) }
    report.push(`${st.name}: ${svgs.length} icons, ${mb(buf.length)} (viewer ${mb(Buffer.byteLength(html))} raw)`)
    if (allZip) {
      for (const [n, svg] of svgs) allEntries.push([`with-icons-all/svg/${st.name}/${n}.svg`, svg + '\n'])
    }
  }
  // order doc.styles by the build's style order (merged entries from earlier partial runs go last)
  const order = ctx.styles.map(s => s.name)
  doc.styles = Object.fromEntries(Object.entries(doc.styles).sort(([a], [b]) => ((order.indexOf(a) + 1 || 1e3) - (order.indexOf(b) + 1 || 1e3)) || (a < b ? -1 : 1)))

  if (allZip) {
    allEntries.push(['with-icons-all/LICENSE.txt', license], ['with-icons-all/README.txt', readmeAll({ version, styles: ctx.styles, count: icons.length })])
    const file = path.join(OUT, 'with-icons-all.zip')
    const { buf, wrote: w } = writeZip(file, allEntries, `with icons all ${version} https://withicons.com`)
    if (w) wrote++
    if (buf.length <= ALL_LIMIT) {
      doc.all = { file: 'downloads/with-icons-all.zip', bytes: buf.length, size: mb(buf.length), icons: icons.length, styles: ctx.styles.length, sha: sha(buf).slice(0, 12) }
      report.push(`all styles: ${mb(buf.length)}`)
    } else {
      if (fs.existsSync(file)) fs.unlinkSync(file)
      report.push(`all styles: ${mb(buf.length)} > ${mb(ALL_LIMIT)}, skipped`)
    }
  } else if (prevJson && prevJson.all && fs.existsSync(path.join(OUT, 'with-icons-all.zip'))) doc.all = prevJson.all

  // stale zips of styles that no longer exist
  const keep = new Set([...Object.values(doc.styles).map(s => path.basename(s.file)), 'with-icons-all.zip'])
  for (const f of fs.readdirSync(OUT)) if (f.endsWith('.zip') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f))

  const json = JSON.stringify(doc, null, 1) + '\n'
  const js = `window.WITH_DOWNLOADS=${JSON.stringify(doc)};\n`
  for (const [f, t] of [[path.join(DATA, 'downloads.json'), json], [path.join(DATA, 'downloads.js'), js]]) if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== t) fs.writeFileSync(f, t)
  const total = Object.values(doc.styles).reduce((a, s) => a + s.bytes, 0) + (doc.all ? doc.all.bytes : 0)
  return `site downloads: ${Object.keys(doc.styles).length} style zips${doc.all ? ' + all' : ''}, ${mb(total)} total, ${wrote} rewritten (${Date.now() - t0} ms)\n  ` + report.join('\n  ')
}

// ------------------------------------------------------------------ README.txt
function readmeText({ st, version, count }) {
  return `with icons: ${st.title || st.name} (${count} icons, version ${version})
${'='.repeat(48)}

${st.description || ''}

What is inside
--------------
  svg/          one standalone SVG per icon, e.g. svg/home.svg (24 x 24 viewBox)
  index.html    an offline viewer: open it in any browser (no internet needed) to
                search every icon by name, alias, tag or category, preview it at
                any size and colour, copy the SVG code, or download an SVG / PNG
  LICENSE.txt   MIT licence: free for personal and commercial use

Using the icons
---------------
  HTML:      <img src="svg/home.svg" width="24" height="24" alt="Home">
  Inline:    paste the file's markup into your page. Parts drawn in
             "currentColor" follow the CSS colour of the text around them.
  Design:    drag the files into Figma, Sketch, Illustrator, Keynote, PowerPoint
             or Google Slides; they scale to any size without blurring.

The files are self-contained: colours are written in, so they look the same in
an <img> tag, a design tool or a slide.

Want React, Vue, Svelte, Angular, Solid, web components, CSS classes, a CLI or an
MCP server for your AI coding tool? Everything is on npm (@withicons/*) and at
${SITE}

Browse all styles, animate icons and build palettes: ${SITE}
with icons, powered by Evergrow.
`
}
function readmeAll({ version, styles, count }) {
  return `with icons: every style (${count} icons x ${styles.length} styles, version ${version})
${'='.repeat(48)}

What is inside
--------------
  svg/<style>/<name>.svg   one standalone SVG per icon and style
  LICENSE.txt              MIT licence: free for personal and commercial use

Each style also has its own zip on withicons.com with an offline viewer
(index.html): search, preview, copy and download, no internet needed.

Styles: ${styles.map(s => s.name).join(', ')}

More (npm packages, CDN, MCP server, animations, palettes): ${SITE}
with icons, powered by Evergrow.
`
}

// ------------------------------------------------------------------ the offline viewer (one self-contained page)
function viewerHtml({ st, version, svgs, meta, cats, colours, ui, mark, total }) {
  const used = new Set(svgs.map(([n]) => meta[n].category))
  const catList = cats.filter(c => used.has(c))
  const ci = Object.fromEntries(catList.map((c, i) => [c, i]))
  const data = {
    v: version, style: st.name, title: st.title || st.name, site: SITE,
    cats: catList.map(c => [c, catLabel(c)]),
    // [name, category index, aliases, synonyms, tags, description]
    icons: svgs.map(([n]) => { const m = meta[n]; return [n, ci[m.category] ?? -1, m.aliases.join(' '), m.synonyms.join(' '), m.tags.join(' '), m.description] }),
    svg: svgs.map(([, s]) => s),
  }
  const title = `${st.title || st.name} icons · with icons`
  const C = colours
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escHtml(title)}</title>
<meta name="description" content="${escHtml(`${svgs.length} ${st.title || st.name} icons from with icons: search, preview, copy and download, offline.`)}">
<meta name="color-scheme" content="light dark">
${mark ? `<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(mark)}">` : ''}
<style>
:root{color-scheme:light;--paper:#FBF8F3;--paper-2:#F3EEE5;--card:#FFFFFF;--ink:#111318;--ink-2:#3A3F4B;--muted:#5F6573;--rule:#E6DFD3;--rule-strong:#D3CABA;--sun:#FFD23F;--sun-soft:#FFF1BF;--evergrow:#8A6A2C;
--s:${C.c};--s-text:${C.text};--s-soft:${C.soft};--s-on:${C.on};--icon:var(--ink);--sz:40px;--pill:999px;--r:16px;
--font:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace;--e:cubic-bezier(.2,.8,.2,1)}
:root[data-theme="dark"]{color-scheme:dark;--paper:#0D0F14;--paper-2:#14171F;--card:#171A22;--ink:#F4F0E8;--ink-2:#C8CBD3;--muted:#969CAA;--rule:#242833;--rule-strong:#323745;--sun-soft:#3A3014;--evergrow:#D5B473;--s:${C.dc};--s-text:${C.dtext};--s-soft:${C.dsoft}}
*{box-sizing:border-box}
html,body{margin:0}
body{background:var(--paper);color:var(--ink);font:400 15px/1.5 var(--font);-webkit-font-smoothing:antialiased}
button,input,select{font:inherit;color:inherit}
a{color:inherit}
:focus-visible{outline:2.5px solid var(--ink);outline-offset:2px;box-shadow:0 0 0 6px color-mix(in srgb,var(--sun) 70%,transparent);border-radius:10px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
header.top{position:sticky;top:0;z-index:5;background:color-mix(in srgb,var(--paper) 88%,transparent);backdrop-filter:saturate(1.4) blur(12px);-webkit-backdrop-filter:saturate(1.4) blur(12px);border-bottom:1px solid var(--rule)}
.wrap{max-width:1280px;margin:0 auto;padding:0 20px}
.bar{display:flex;align-items:center;gap:14px;min-height:64px}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;font-weight:700;letter-spacing:-.02em;font-size:18px;white-space:nowrap}
.brand svg{width:30px;height:30px;border-radius:8px}
.chip-style{display:inline-flex;align-items:center;gap:8px;padding:5px 12px 5px 8px;border-radius:var(--pill);background:var(--s-soft);color:var(--s-text);font-weight:650;font-size:13px;white-space:nowrap}
.chip-style i{width:10px;height:10px;border-radius:50%;background:var(--s)}
.search{flex:1;position:relative;min-width:0}
.search svg{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
.search input{width:100%;height:46px;border-radius:var(--pill);border:1.5px solid var(--rule-strong);background:var(--card);padding:0 74px 0 44px;outline:none;transition:border-color .2s,box-shadow .2s}
.search input:focus{border-color:var(--ink);box-shadow:0 0 0 5px color-mix(in srgb,var(--sun) 55%,transparent)}
.search kbd{position:absolute;right:12px;top:50%;transform:translateY(-50%)}
kbd{display:inline-grid;place-items:center;min-width:1.7em;height:1.7em;padding:0 .45em;border-radius:6px;font:500 12px/1 var(--mono);background:var(--card);border:1px solid var(--rule-strong);border-bottom-width:2px;color:var(--ink-2)}
.ibtn{display:inline-grid;place-items:center;width:42px;height:42px;border-radius:50%;border:1.5px solid var(--rule-strong);background:var(--card);cursor:pointer;flex:none}
.ibtn:hover{border-color:var(--ink)}
.tools{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;padding:12px 0}
.cats{display:flex;gap:6px;overflow-x:auto;padding:2px 2px 8px;scrollbar-width:thin;flex:1 1 100%}
.cat{flex:none;border:1px solid var(--rule-strong);background:var(--card);border-radius:var(--pill);padding:5px 12px;font-size:13px;cursor:pointer;white-space:nowrap;color:var(--ink-2)}
.cat b{font-weight:500;color:var(--muted);margin-left:4px;font-size:12px}
.cat[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:var(--paper)}
.cat[aria-pressed="true"] b{color:inherit;opacity:.7}
.ctl{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted)}
.ctl input[type=range]{width:120px;accent-color:var(--s)}
.ctl input[type=color]{width:34px;height:28px;padding:0;border:1px solid var(--rule-strong);border-radius:8px;background:var(--card);cursor:pointer}
.link{background:none;border:0;padding:0;text-decoration:underline;text-underline-offset:3px;cursor:pointer;color:var(--ink-2);font-size:13px}
.count{margin-left:auto;font-size:13px;color:var(--muted)}
main{padding:8px 0 40px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(calc(var(--sz) + 64px),1fr));gap:10px;list-style:none;margin:0;padding:0}
.t{position:relative;display:flex;flex-direction:column;align-items:center;gap:10px;padding:18px 8px 12px;border-radius:var(--r);background:var(--card);border:1px solid var(--rule);cursor:pointer;color:var(--icon);transition:transform .25s var(--e),border-color .2s,box-shadow .25s var(--e);contain:layout paint}
[hidden]{display:none!important}
.t:hover{border-color:var(--rule-strong);transform:translateY(-2px);box-shadow:0 12px 28px -18px rgba(17,19,24,.45)}
.t:focus-visible{border-color:var(--ink)}
.grid:focus-within .t[aria-selected="true"],body.det .t[aria-selected="true"]{border-color:var(--s);box-shadow:0 0 0 2px var(--s)}
.t .g{width:var(--sz);height:var(--sz);display:grid;place-items:center}
.t .g svg{width:100%;height:100%;display:block}
.t .n{font-size:12px;color:var(--ink-2);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.t .q{position:absolute;top:6px;right:6px;width:30px;height:30px;border-radius:50%;border:0;background:var(--ink);color:var(--paper);display:grid;place-items:center;cursor:pointer;opacity:0;transform:scale(.85);transition:opacity .15s,transform .2s var(--e)}
.t .q svg{width:16px;height:16px}
.t:hover .q,.t:focus-within .q,.t:focus .q{opacity:1;transform:none}
@media (hover:none){.t .q{opacity:1;transform:none;background:var(--paper-2);color:var(--ink)}}
.empty{padding:60px 0;text-align:center;color:var(--muted)}
.empty b{display:block;color:var(--ink);font-size:18px;margin-bottom:4px}
/* detail panel */
.panel{position:fixed;z-index:20;right:16px;top:80px;bottom:16px;width:360px;max-width:calc(100vw - 32px);background:var(--card);border:1px solid var(--rule-strong);border-radius:22px;box-shadow:0 30px 60px -30px rgba(0,0,0,.45);display:flex;flex-direction:column;overflow:auto;transform:translateX(calc(100% + 24px));transition:transform .35s var(--e);visibility:hidden}
.panel.open{transform:none;visibility:visible}
.panel .hd{display:flex;align-items:center;gap:10px;padding:16px 16px 0}
.panel h2{margin:0;font-size:20px;letter-spacing:-.02em;flex:1;min-width:0;overflow-wrap:anywhere}
.stage{margin:14px 16px 0;border-radius:18px;aspect-ratio:1.4;display:grid;place-items:center;background:var(--paper-2);background-image:radial-gradient(circle at 1px 1px,color-mix(in srgb,var(--ink) 12%,transparent) 1px,transparent 1.4px);background-size:16px 16px;color:var(--icon)}
.stage svg{width:45%;height:auto;max-height:80%}
.panel .body{padding:14px 16px 18px;display:flex;flex-direction:column;gap:14px}
.desc{margin:0;color:var(--ink-2);font-size:14px}
.kv{display:flex;flex-wrap:wrap;gap:6px}
.kv span{font-size:12px;padding:3px 9px;border-radius:var(--pill);background:var(--paper-2);color:var(--ink-2)}
.row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 18px;border-radius:var(--pill);border:0;background:var(--ink);color:var(--paper);font-weight:650;cursor:pointer;transition:transform .2s var(--e)}
.btn:active{transform:scale(.97)}
.btn svg{width:18px;height:18px}
.btn.s{background:var(--s);color:var(--s-on)}
.btn.gh{background:transparent;color:var(--ink);box-shadow:inset 0 0 0 1.5px var(--rule-strong)}
.btn.gh:hover{box-shadow:inset 0 0 0 1.5px var(--ink)}
.lbl{font-size:12px;font-weight:650;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
select.sel{height:40px;border-radius:12px;border:1.5px solid var(--rule-strong);background:var(--card);padding:0 10px}
pre.code{margin:0;max-height:160px;overflow:auto;padding:12px;border-radius:12px;background:var(--paper-2);font:12px/1.5 var(--mono);white-space:pre-wrap;word-break:break-all;color:var(--ink-2)}
.hint{font-size:12px;color:var(--muted)}
footer{border-top:1px solid var(--rule);padding:22px 0 34px;color:var(--muted);font-size:13px}
footer .wrap{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center}
footer .eg{color:var(--evergrow);font-weight:650;text-decoration:none}
.keys{display:flex;flex-wrap:wrap;gap:6px 14px}
.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,20px);background:var(--ink);color:var(--paper);padding:10px 16px;border-radius:var(--pill);font-weight:600;font-size:14px;display:flex;gap:8px;align-items:center;opacity:0;pointer-events:none;transition:opacity .2s,transform .3s var(--e);z-index:30}
.toast.on{opacity:1;transform:translate(-50%,0)}
.toast svg{width:18px;height:18px;color:var(--sun)}
@media (max-width:720px){.bar{flex-wrap:wrap;padding:10px 0;gap:10px}.search{order:3;flex:1 1 100%}.chip-style{display:none}.ctl input[type=range]{width:90px}.count{margin-left:0}
.panel{left:8px;right:8px;top:auto;bottom:8px;width:auto;max-height:78vh;transform:translateY(calc(100% + 24px))}.stage{aspect-ratio:2}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style>
</head>
<body>
<header class="top">
  <div class="wrap bar">
    <a class="brand" href="${SITE}" target="_blank" rel="noopener" title="withicons.com">${mark ? mark.replace('<svg ', '<svg aria-hidden="true" ') : ''}<span>with icons</span></a>
    <span class="chip-style"><i></i>${escHtml(st.title || st.name)} · ${svgs.length} icons</span>
    <label class="search"><span class="sr">Search icons</span>${ui.search || ''}<input id="q" type="search" placeholder="Search ${svgs.length} ${escHtml(st.title || st.name)} icons: name, alias, tag, category" autocomplete="off" spellcheck="false"><kbd>/</kbd></label>
    <button class="ibtn" id="theme" type="button" aria-label="Switch light or dark">${ui.moon || ''}</button>
  </div>
</header>
<div class="wrap">
  <div class="tools">
    <div class="cats" id="cats" role="group" aria-label="Categories"></div>
    <label class="ctl">Size <input id="size" type="range" min="16" max="128" step="4" value="40" aria-label="Preview size"><output id="sizeo">40px</output></label>
    <label class="ctl">Colour <input id="ink" type="color" value="#111318" aria-label="Icon colour"></label>
    <button class="link" id="inkreset" type="button" hidden>Reset colour</button>
    <span class="count" id="count" aria-live="polite"></span>
  </div>
</div>
<main class="wrap">
  <div class="grid" id="grid" role="listbox" aria-label="Icons" aria-multiselectable="false"></div>
  <div class="empty" id="empty" hidden><b>No icons match</b>Try a shorter word, or another category.</div>
</main>
<aside class="panel" id="panel" aria-label="Icon details" aria-hidden="true">
  <div class="hd"><h2 id="pname"></h2><button class="ibtn" id="pclose" type="button" aria-label="Close details">${ui.close || '×'}</button></div>
  <div class="stage" id="pstage"></div>
  <div class="body">
    <p class="desc" id="pdesc"></p>
    <div class="kv" id="pkv"></div>
    <div class="row">
      <button class="btn s" id="pdl" type="button">${ui.download || ''}Download SVG</button>
      <button class="btn gh" id="pcopy" type="button">${ui.copy || ''}Copy SVG</button>
    </div>
    <div class="row"><span class="lbl">Export size</span>
      <select class="sel" id="psize" aria-label="Export size">${[16, 20, 24, 32, 48, 64, 96, 128, 256, 512].map(n => `<option value="${n}"${n === 24 ? ' selected' : ''}>${n} px</option>`).join('')}</select>
      <button class="btn gh" id="ppng" type="button">${ui.image || ''}PNG</button>
    </div>
    <p class="hint" id="phint">Downloads use the export size and, when you pick one, your colour. The original file is <code id="pfile"></code>.</p>
    <pre class="code" id="pcode" aria-label="SVG code"></pre>
  </div>
</aside>
<footer>
  <div class="wrap">
    <span><b style="color:var(--ink)">with icons</b> ${escHtml(st.title || st.name)} · v${escHtml(version)} · MIT licence</span>
    <a href="${SITE}" target="_blank" rel="noopener">withicons.com</a>
    <a class="eg" href="${SITE}" target="_blank" rel="noopener">Powered by Evergrow</a>
    <span class="keys"><span><kbd>/</kbd> search</span><span><kbd>←</kbd><kbd>→</kbd> move</span><span><kbd>Enter</kbd> details</span><span><kbd>D</kbd> download</span><span><kbd>C</kbd> copy</span><span><kbd>Esc</kbd> close</span></span>
  </div>
</footer>
<div class="toast" id="toast" role="status">${ui.check || ''}<span></span></div>
<script type="application/json" id="data">${jsonForHtml(data)}</script>
<script>
(function(){'use strict'
var D=document,H=D.documentElement,$=function(i){return D.getElementById(i)}
var DATA=JSON.parse($('data').textContent),N=DATA.icons.length
var UI={sun:${JSON.stringify(ui.sun || '')},moon:${JSON.stringify(ui.moon || '')}}
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
// theme
var th=ls('with-dl-theme')||(matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
function setTheme(t){th=t;H.setAttribute('data-theme',t);$('theme').innerHTML=t==='dark'?UI.sun:UI.moon;if(!custom)$('ink').value=t==='dark'?'#f4f0e8':'#111318'}
// search index: name, aliases, synonyms, tags, category, description (lower case)
var CAT=DATA.cats,IDX=DATA.icons.map(function(r){var c=r[1]>=0?CAT[r[1]]:['',''];return{n:r[0],a:(' '+r[2]+' ').toLowerCase(),o:(r[3]+' '+r[4]+' '+c[0]+' '+c[1]).toLowerCase(),d:r[5].toLowerCase(),c:r[1]}})
var grid=$('grid'),tiles=[],shown=[],cat=-1,custom=false,cur=-1,open=-1
var ESC=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
// tiles: built once, drawn lazily as they come near the viewport
var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){draw(e.target);io.unobserve(e.target)}})},{rootMargin:'600px 0px'}):null
function draw(t){if(t._d)return;t._d=1;t.firstChild.innerHTML=DATA.svg[t._i]}
var frag=D.createDocumentFragment()
for(var i=0;i<N;i++){var t=D.createElement('div');t.className='t';t.setAttribute('role','option');t.tabIndex=-1;t.id='i-'+i;t._i=i
t.setAttribute('aria-label',DATA.icons[i][0]);t.setAttribute('aria-selected','false');t.title=DATA.icons[i][0]
t.innerHTML='<span class="g"></span><span class="n">'+ESC(DATA.icons[i][0])+'</span><button class="q" type="button" tabindex="-1" aria-label="Download '+ESC(DATA.icons[i][0])+'.svg">${ui.download ? ui.download.replace(/'/g, "\\'") : '↓'}</button>'
tiles.push(t);frag.appendChild(t);if(io)io.observe(t);else draw(t)}
grid.appendChild(frag)
// categories
var counts=CAT.map(function(){return 0});IDX.forEach(function(x){if(x.c>=0)counts[x.c]++})
$('cats').innerHTML='<button class="cat" type="button" data-c="-1" aria-pressed="true">All<b>'+N+'</b></button>'+CAT.map(function(c,i){return '<button class="cat" type="button" data-c="'+i+'" aria-pressed="false">'+ESC(c[1])+'<b>'+counts[i]+'</b></button>'}).join('')
$('cats').addEventListener('click',function(e){var b=e.target.closest('.cat');if(!b)return;cat=+b.getAttribute('data-c');Array.prototype.forEach.call(this.children,function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});filter()})
// ranking: every word must match somewhere; name hits rank first
function score(x,ws){var s=0;for(var k=0;k<ws.length;k++){var w=ws[k],p
if(x.n===w)s+=100;else if(x.n.indexOf(w)===0)s+=60;else if((p=x.n.indexOf(w))>=0)s+=x.n.charAt(p-1)==='-'?45:30
else if(x.a.indexOf(' '+w+' ')>=0)s+=70;else if(x.a.indexOf(' '+w)>=0)s+=25;else if(x.a.indexOf(w)>=0)s+=15
else if(x.o.indexOf(w)>=0)s+=10;else if(x.d.indexOf(w)>=0)s+=4;else return 0}return s}
function filter(){var q=$('q').value.trim().toLowerCase().replace(/[^a-z0-9\\s-]/g,' '),ws=q.split(/[\\s]+/).filter(Boolean),list=[]
for(var i=0;i<N;i++){var x=IDX[i];if(cat>=0&&x.c!==cat)continue;var s=ws.length?score(x,ws):1;if(s)list.push([i,s])}
if(ws.length)list.sort(function(a,b){return b[1]-a[1]||(IDX[a[0]].n<IDX[b[0]].n?-1:1)})
shown=list.map(function(r){return r[0]})
var on={};shown.forEach(function(i){on[i]=1})
var f=D.createDocumentFragment();shown.forEach(function(i){f.appendChild(tiles[i])})
tiles.forEach(function(t,i){if(!on[i])t.hidden=true});shown.forEach(function(i){tiles[i].hidden=false})
grid.appendChild(f)
$('empty').hidden=shown.length>0
$('count').textContent=shown.length===N?N+' icons':shown.length+' of '+N+' icons'
if(shown.indexOf(cur)<0)setCur(shown.length?shown[0]:-1,false)}
var qt;$('q').addEventListener('input',function(){clearTimeout(qt);qt=setTimeout(filter,40)})
// size + colour
function setSize(v){H.style.setProperty('--sz',v+'px');$('sizeo').textContent=v+'px';ls('with-dl-size',v)}
$('size').addEventListener('input',function(){setSize(this.value)})
$('ink').addEventListener('input',function(){custom=true;H.style.setProperty('--icon',this.value);$('inkreset').hidden=false;refresh()})
$('inkreset').addEventListener('click',function(){custom=false;H.style.removeProperty('--icon');this.hidden=true;setTheme(th);refresh()})
$('theme').addEventListener('click',function(){setTheme(th==='dark'?'light':'dark');ls('with-dl-theme',th)})
// the markup a download/copy hands out: the original file, resized and recoloured when asked
function out(i){var s=DATA.svg[i],px=+$('psize').value||24
if(px!==24)s=s.replace(/^<svg([^>]*?)\\swidth="[^"]*"/,'<svg$1 width="'+px+'"').replace(/^<svg([^>]*?)\\sheight="[^"]*"/,'<svg$1 height="'+px+'"')
if(custom)s=s.replace(/currentColor/g,$('ink').value)
return s}
function uniq(s,sfx){return s.indexOf('url(#')<0?s:s.replace(/(\\sid="|url\\(#)([^")\\s]+)/g,'$1$2-'+sfx)}
function save(blob,name){var a=D.createElement('a'),u=URL.createObjectURL(blob);a.href=u;a.download=name;D.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)}
function dl(i){save(new Blob([out(i)+'\\n'],{type:'image/svg+xml'}),DATA.icons[i][0]+'.svg');toast('Downloaded '+DATA.icons[i][0]+'.svg')}
function copy(i){var s=out(i)
var done=function(){toast('Copied '+DATA.icons[i][0]+' SVG')},fb=function(){var ta=D.createElement('textarea');ta.value=s;ta.style.position='fixed';ta.style.opacity='0';D.body.appendChild(ta);ta.select();try{D.execCommand('copy');done()}catch(e){toast('Copy failed: select the code and copy it')}ta.remove()}
if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(done,fb);else fb()}
function png(i){var px=+$('psize').value||24,sc=px<128?2:1,img=new Image(),s=out(i)
if(!custom)s=s.replace(/currentColor/g,getComputedStyle(H).getPropertyValue('--ink').trim()||'#111318')
img.onload=function(){var c=D.createElement('canvas');c.width=c.height=px*sc;var g=c.getContext('2d');g.drawImage(img,0,0,c.width,c.height)
try{c.toBlob(function(b){if(b){save(b,DATA.icons[i][0]+(sc>1?'@2x':'')+'.png');toast('Downloaded '+DATA.icons[i][0]+'.png ('+c.width+' px)')}else toast('PNG export is blocked in this browser')},'image/png')}catch(e){toast('PNG export is blocked in this browser')}}
img.onerror=function(){toast('PNG export failed')}
img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(s)}
var tt;function toast(m){var t=$('toast');t.lastChild.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){t.classList.remove('on')},1600)}
// focus + selection (roving tabindex)
function setCur(i,focus){if(cur>=0&&tiles[cur]){tiles[cur].tabIndex=-1;tiles[cur].setAttribute('aria-selected','false')}cur=i
if(i<0)return;var t=tiles[i];t.tabIndex=0;t.setAttribute('aria-selected','true');draw(t);if(focus){t.focus({preventScroll:true});t.scrollIntoView({block:'nearest'})}}
function cols(){if(shown.length<2)return 1;var top=tiles[shown[0]].offsetTop,n=0;for(var k=0;k<shown.length&&tiles[shown[k]].offsetTop===top;k++)n++;return n||1}
// details
function show(i){open=i;setCur(i,false);var r=DATA.icons[i],c=r[1]>=0?CAT[r[1]][1]:''
$('pname').textContent=r[0];$('pdesc').textContent=r[5]||'';$('pfile').textContent='svg/'+r[0]+'.svg'
$('pstage').innerHTML=uniq(DATA.svg[i],'d')
$('pkv').innerHTML=(c?'<span>'+ESC(c)+'</span>':'')+(r[2]?r[2].split(' ').slice(0,10).map(function(a){return '<span>'+ESC(a)+'</span>'}).join(''):'')
$('pcode').textContent=out(i)
D.body.classList.add('det');var p=$('panel');p.classList.add('open');p.setAttribute('aria-hidden','false')}
function hide(){open=-1;D.body.classList.remove('det');var p=$('panel');p.classList.remove('open');p.setAttribute('aria-hidden','true');if(cur>=0)tiles[cur].focus({preventScroll:true})}
function refresh(){if(open>=0)$('pcode').textContent=out(open)}
$('pclose').addEventListener('click',hide)
$('pdl').addEventListener('click',function(){if(open>=0)dl(open)})
$('pcopy').addEventListener('click',function(){if(open>=0)copy(open)})
$('ppng').addEventListener('click',function(){if(open>=0)png(open)})
$('psize').addEventListener('change',refresh)
grid.addEventListener('click',function(e){var t=e.target.closest('.t');if(!t)return
if(e.target.closest('.q')){setCur(t._i,false);dl(t._i);return}
setCur(t._i,true);show(t._i)})
grid.addEventListener('dblclick',function(e){var t=e.target.closest('.t');if(t&&!e.target.closest('.q'))dl(t._i)})
grid.addEventListener('keydown',function(e){if(cur<0||e.ctrlKey||e.metaKey||e.altKey)return;var k=shown.indexOf(cur),n=null,c=cols()
switch(e.key){case 'ArrowRight':n=k+1;break;case 'ArrowLeft':n=k-1;break;case 'ArrowDown':n=k+c;break;case 'ArrowUp':if(k-c<0){e.preventDefault();$('q').focus();return}n=k-c;break
case 'Home':n=0;break;case 'End':n=shown.length-1;break;case 'PageDown':n=k+c*4;break;case 'PageUp':n=k-c*4;break
case 'Enter':case ' ':e.preventDefault();show(cur);return
case 'd':case 'D':e.preventDefault();dl(cur);return
case 'c':case 'C':e.preventDefault();copy(cur);return
default:return}
e.preventDefault();n=Math.max(0,Math.min(shown.length-1,n));setCur(shown[n],true);if(open>=0)show(cur)})
$('q').addEventListener('keydown',function(e){if(e.key==='ArrowDown'||e.key==='Enter'){clearTimeout(qt);filter();if(shown.length){e.preventDefault();setCur(shown[0],true);if(e.key==='Enter')show(shown[0])}}
else if(e.key==='Escape'&&this.value){e.preventDefault();this.value='';filter()}})
D.addEventListener('keydown',function(e){var tag=(e.target.tagName||'').toLowerCase(),typing=tag==='input'||tag==='select'||tag==='textarea'
if((e.key==='/'&&!typing)||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k')){e.preventDefault();$('q').focus();$('q').select();return}
if(e.key==='Escape'&&open>=0){e.preventDefault();hide()}})
// start
setTheme(th);var sv=+ls('with-dl-size');if(sv>=16&&sv<=128){$('size').value=sv;setSize(sv)}
var hq=decodeURIComponent((location.hash||'').slice(1));if(hq){$('q').value=hq}
filter()
})()
</script>
</body>
</html>
`
}

// ------------------------------------------------------------------ standalone
async function standalone() {
  const only = process.argv.slice(2).filter(a => !a.startsWith('--'))
  const { renderAll } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'render-pool.mjs')).href)
  const stylesMap = await loadStyles(only.length ? only : undefined)
  const styles = sortStyles(Object.values(stylesMap))
  if (!styles.length) { console.error(`no styles found${only.length ? ` for: ${only.join(', ')}` : ''}`); process.exit(1) }
  const listed = new Set((readManifest().icons || []).map(i => i.name))
  const names = listIcons().filter(n => !listed.size || listed.has(n))
  const pool = await renderAll(names, styles, { cache: !process.argv.includes('--no-cache') })
  const icons = names.map(name => {
    const render = {}
    for (const s of styles) { const nodes = pool.renders[name][s.name]; if (nodes) render[s.name] = { nodes, inner: nodesToMarkup(nodes), svg: toSvg(s, nodes) } }
    return { name, category: loadIcon(name).category, render }
  })
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  const ctx = {
    version: pkg.withiconsVersion || '0.1.0', root: ROOT, defaultStyle: 'line', icons,
    styles: styles.map(s => { const vars = styleVars(icons, s.name); return { name: s.name, title: s.title, kind: s.kind, description: s.description, root: s.root, palette: isPalette(s, vars), vars } }),
  }
  // UI glyphs come from the line style: render it too when it was not asked for
  if (!stylesMap.line) {
    const line = (await loadStyles(['line'])).line
    if (line) { const lp = await renderAll(['search', 'download', 'copy', 'check', 'close', 'sun', 'moon', 'image', 'folder-open'].filter(n => names.includes(n)), [line], {}); for (const i of icons) { const nodes = lp.renders[i.name] && lp.renders[i.name].line; if (nodes) i.render.line = { nodes, inner: nodesToMarkup(nodes), svg: toSvg(line, nodes) } } }
    // (the line renders added for UI glyphs are not a style of this run: ctx.styles decides what gets zipped)
  }
  console.log(build(ctx, { allZip: !only.length && !process.argv.includes('--no-all') }))
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await standalone()
