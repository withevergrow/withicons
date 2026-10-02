#!/usr/bin/env node
// Build orchestrator. Renders every icon through every style ONCE, then hands the
// result to every emitter in forge/lib/emit-*.mjs (each owns some packages/*).
//
// Emitter contract:  export default async function emit(ctx) { ... }   (return a one-line summary)
//   ctx.version            package version for every @withicons/* package
//   ctx.root               repo root
//   ctx.defaultStyle       'line'
//   ctx.styles[]           { name, title, kind, description, strokeWidth, root,
//                            palette: true for multi-colour palette styles, vars: { '--with-x': default } the style reads }
//                          in STYLE_ORDER (forge/lib/emit-core.mjs): line solid duo gloss engrave blueprint sketch glass kawaii sticker pixel retro
//   ctx.icons[]            { name, category, description, aliases, tags,
//                            pascal ('ArrowRight'), camel ('arrowRight'),
//                            render: { [style]: { nodes: [[tag, attrs]], svg: '<svg ...>...</svg>', inner: '<path/>...' } } }
//   ctx.aliasIndex         { alias -> [canonical names] }  (ambiguous aliases map to >1 name)
//   ctx.write(rel, text)   write a file relative to repo root (mkdir -p)
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { spawnSync } from 'child_process'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, toSvg, nodesToMarkup } from './lib/load.mjs'
import { STYLE_ORDER, sortStyles, styleVars, isPalette } from './lib/emit-core.mjs'

const t0 = Date.now()
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const version = pkg.withiconsVersion || '0.1.0'
const stylesMap = await loadStyles()
const styles = sortStyles(Object.values(stylesMap))
const unknownStyles = styles.map(s => s.name).filter(n => !STYLE_ORDER.includes(n))
if (unknownStyles.length) console.log(`  note: styles missing from STYLE_ORDER (forge/lib/emit-core.mjs), sorted last: ${unknownStyles.join(', ')}`)
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
  styles: styles.map(s => {
    const vars = styleVars(icons, s.name)
    return { name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: isPalette(s, vars), vars }
  }),
  icons, aliasIndex,
  write(rel, text) { const f = path.join(ROOT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, text) },
}
console.log(`rendered ${icons.length} icons x ${styles.length} styles in ${Date.now() - t0} ms${failures.length ? ` — ${failures.length} FAILURES` : ''}`)
failures.slice(0, 20).forEach(f => console.log('  FAIL ' + f))

// `--no-site` skips the website generators (site data, pages, SEO) — for package-only rebuilds
const NO_SITE = process.argv.includes('--no-site')
const only = process.argv.slice(2).filter(a => !a.startsWith('--'))
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
// agent skill: counts, palette variables (from this build's core styles.json) and animated icons; when it changed,
// re-bundle the CLI so `withicons init` / `withicons skill` ship the same text
{
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'skill-sync.mjs')], { cwd: ROOT, encoding: 'utf8' })
  const out = (r.stdout || '').trim()
  console.log(`  skill-sync: ${out.replace(/\r?\n/g, '; ') || (r.stderr || '').split('\n')[0]}`)
  if (/wrote skills/.test(out) && (!only.length || only.includes('mcp'))) {
    const { bundle } = await import(pathToFileURL(path.join(ROOT, 'forge', 'lib', 'emit-mcp.mjs')).href)
    console.log(`  emit-mcp (skill changed, re-bundled): ${await bundle({ root: ROOT, version })}`)
  }
}
if (NO_SITE) { console.log(`build done (packages only) in ${Date.now() - t0} ms`); process.exit(process.exitCode || 0) }
// site data is always regenerated last (reuses this build's renders instead of rendering everything again)
console.log((await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-data.mjs')).href)).build(ctx))
// AI coding-tool integrations data (site/data/integrations.js) — read by the home page and ai.html
// (that script only self-runs when launched directly, so call its exported build() here)
console.log((await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-integrations.mjs')).href)).build())
// content pages (guides, developers, ai, about, license, faq) — before site-seo, which links to and sitemaps them
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-pages.mjs')).href)
// alternatives + 'free icons for…' landers (SEO/GEO) — before site-seo, which sitemaps them and lists them in llms.txt
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-alternatives.mjs')).href)
// live (editable) icons pages — before site-seo, which sitemaps them (forge/DYNAMIC.md)
if (fs.existsSync(path.join(ROOT, 'forge', 'tools', 'site-dynamic.mjs'))) await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-dynamic.mjs')).href)
// per-icon SEO/GEO pages, hubs, sitemap, robots, llms*.txt, icons.json, OG images (content-hash cached)
await import(pathToFileURL(path.join(ROOT, 'forge', 'tools', 'site-seo.mjs')).href)
console.log(`build done in ${Date.now() - t0} ms`)
