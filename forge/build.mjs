#!/usr/bin/env node
// Build orchestrator. Renders every icon through every style ONCE, then hands the
// result to every emitter in forge/lib/emit-*.mjs (each owns some packages/*).
//
// Emitter contract:  export default async function emit(ctx) { ... }   (return a one-line summary)
//   ctx.version            package version for every @withicons/* package
//   ctx.root               repo root
//   ctx.defaultStyle       'line'
//   ctx.styles[]           { name, title, kind, description, strokeWidth, root }
//   ctx.icons[]            { name, category, description, aliases, tags,
//                            pascal ('ArrowRight'), camel ('arrowRight'),
//                            render: { [style]: { nodes: [[tag, attrs]], svg: '<svg ...>...</svg>', inner: '<path/>...' } } }
//   ctx.aliasIndex         { alias -> [canonical names] }  (ambiguous aliases map to >1 name)
//   ctx.write(rel, text)   write a file relative to repo root (mkdir -p)
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, toSvg, nodesToMarkup } from './lib/load.mjs'

const t0 = Date.now()
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const version = pkg.withiconsVersion || '0.1.0'
const ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch']
const stylesMap = await loadStyles()
const styles = Object.values(stylesMap).sort((a, b) => ((ORDER.indexOf(a.name) + 99) % 99) - ((ORDER.indexOf(b.name) + 99) % 99))
const pascal = n => n.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join('')

const failures = []
const icons = listIcons().map(name => {
  const icon = loadIcon(name)
  const render = {}
  for (const s of styles) {
    try {
      const nodes = renderIcon(s, icon)
      render[s.name] = { nodes, inner: nodesToMarkup(nodes), svg: toSvg(s, nodes) }
    } catch (e) { failures.push(`${s.name}/${name}: ${e.message.split('\n')[0]}`) }
  }
  const p = pascal(name)
  return { name, category: icon.category, description: icon.description || '', aliases: icon.aliases || [], tags: icon.tags || [],
    pascal: p, camel: p[0].toLowerCase() + p.slice(1), render }
})

const aliasIndex = {}
const canon = new Set(icons.map(i => i.name))
for (const i of icons) for (const a of i.aliases) if (!canon.has(a)) (aliasIndex[a] ||= []).push(i.name)

const ctx = {
  version, root: ROOT, defaultStyle: 'line',
  styles: styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root })),
  icons, aliasIndex,
  write(rel, text) { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) },
}
console.log(`rendered ${icons.length} icons x ${styles.length} styles in ${Date.now() - t0} ms${failures.length ? ` — ${failures.length} FAILURES` : ''}`)
failures.slice(0, 20).forEach(f => console.log('  FAIL ' + f))

const only = process.argv.slice(2)
const emitterFiles = fs.readdirSync(path.join(ROOT, 'forge', 'lib')).filter(f => /^emit-.*\.mjs$/.test(f)).sort()
// load all, then order: an emitter may declare `export const after = ['web']` to run after those emitters
const mods = []
for (const f of emitterFiles) {
  const name = f.slice(5, -4)
  if (only.length && !only.includes(name)) continue
  try { mods.push({ name, mod: await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', f)).href) }) }
  catch (e) { console.log(`  emit-${name}: FAILED TO LOAD — ${e.message}`); process.exitCode = 1 }
}
const ordered = [], seen = new Set()
const visit = m => { if (seen.has(m.name)) return; seen.add(m.name); for (const a of [].concat(m.mod.after || [])) { const d = mods.find(x => x.name === a); if (d) visit(d) } ordered.push(m) }
mods.forEach(visit)
for (const { name, mod } of ordered) {
  const t = Date.now()
  try {
    const res = await mod.default(ctx)
    console.log(`  emit-${name}: ${res || 'ok'} (${Date.now() - t} ms)`)
  } catch (e) { console.log(`  emit-${name}: FAILED — ${String(e.stack).split(/\r?\n/).slice(0, 3).join(' | ')}`); process.exitCode = 1 }
}
// site data is always regenerated last
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-data.mjs')).href)
// AI coding-tool integrations data (site/data/integrations.js) — read by the home page and ai.html
// (that script only self-runs when launched directly, so call its exported build() here)
console.log((await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-integrations.mjs')).href)).build())
// content pages (guides, developers, ai, about, license, faq) — before site-seo, which links to and sitemaps them
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-pages.mjs')).href)
// alternatives + 'free icons for…' landers (SEO/GEO) — before site-seo, which sitemaps them and lists them in llms.txt
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-alternatives.mjs')).href)
// per-icon SEO/GEO pages, hubs, sitemap, robots, llms*.txt, icons.json, OG images (content-hash cached)
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-seo.mjs')).href)
console.log(`build done in ${Date.now() - t0} ms`)
