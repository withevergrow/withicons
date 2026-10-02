#!/usr/bin/env node
// Emits site/data/*.js for the zero-build website. Loaded with plain <script> tags
// (not fetch) so the site also works when opened straight from disk.
//   site/data/meta.js           window.WITH = { version, total, categories, styles, icons }
//   site/data/style-<name>.js   window.WITH_SVG[<name>] = { <icon>: '<inner svg markup>' }
//
// forge/build.mjs calls build(ctx) with the renders it already has. Run directly
// (`node forge/tools/site-data.mjs`) it renders everything itself.
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, nodesToMarkup, readManifest } from '../lib/load.mjs'
import { sortStyles, styleVars, isPalette } from '../lib/emit-core.mjs'

const outDir = path.join(ROOT, 'site', 'data')

// standalone: render every icon in every style (what forge/build.mjs already did when it calls build(ctx))
async function renderAll() {
  const styles = sortStyles(Object.values(await loadStyles()))
  const icons = listIcons().map(name => {
    const icon = loadIcon(name)
    const render = {}
    for (const s of styles) { try { render[s.name] = { inner: nodesToMarkup(renderIcon(s, icon)) } } catch { /* reported as FAILED below */ } }
    return { name, render }
  })
  return {
    icons,
    styles: styles.map(s => {
      const vars = styleVars(icons, s.name)
      return { name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: isPalette(s, vars), vars }
    }),
  }
}

export function build(ctx) {
  fs.mkdirSync(outDir, { recursive: true })
  const manifest = readManifest()
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  // search fields come from the skeletons themselves (ctx.icons has no synonyms)
  const icons = ctx.icons.map(({ name }) => {
    const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'icons', `${name}.json`), 'utf8'))
    return { name, category: raw.category, description: raw.description || '', aliases: raw.aliases || [], tags: raw.tags || [] }
  })
  // manifest order first, then any category only new skeletons use
  const categories = [...(manifest.categories || [])]
  for (const i of icons) if (i.category && !categories.includes(i.category)) categories.push(i.category)
  const meta = {
    version: pkg.withiconsVersion || pkg.version || '0.1.0',
    total: icons.length,
    categories,
    styles: ctx.styles.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root, palette: !!s.palette, vars: s.vars || {} })),
    icons,
  }
  fs.writeFileSync(path.join(outDir, 'meta.js'), `window.WITH=${JSON.stringify(meta)};\n`)
  const report = []
  for (const s of ctx.styles) {
    const map = {}
    let fails = 0
    for (const i of ctx.icons) { const r = i.render[s.name]; if (r) map[i.name] = r.inner; else fails++ }
    const js = `(window.WITH_SVG=window.WITH_SVG||{})[${JSON.stringify(s.name)}]=${JSON.stringify(map)};\n`
    const f = path.join(outDir, `style-${s.name}.js`)
    if (!fs.existsSync(f) || fs.readFileSync(f, 'utf8') !== js) fs.writeFileSync(f, js)
    report.push(`${s.name}: ${Object.keys(map).length} icons, ${(js.length / 1024).toFixed(0)} KB${fails ? `, ${fails} FAILED` : ''}`)
  }
  return `site data: ${icons.length} icons x ${ctx.styles.length} styles\n  ` + report.join('\n  ')
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  console.log(build(await renderAll()))
}
