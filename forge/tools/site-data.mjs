#!/usr/bin/env node
// Emits site/data/*.js for the zero-build website. Loaded with plain <script> tags
// (not fetch) so the site also works when opened straight from disk.
//   site/data/meta.js           window.WITH = { styles, categories, icons }
//   site/data/style-<name>.js   window.WITH_SVG[<name>] = { <icon>: '<inner svg markup>' }
import fs from 'fs'
import path from 'path'
import { ROOT, listIcons, loadIcon, loadStyles, renderIcon, nodesToMarkup, readManifest } from '../lib/load.mjs'

const outDir = path.join(ROOT, 'site', 'data')
fs.mkdirSync(outDir, { recursive: true })
const manifest = readManifest()
const styles = await loadStyles()
const names = listIcons()
const icons = names.map(n => {
  const raw = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'icons', `${n}.json`), 'utf8'))
  return { name: n, category: raw.category, description: raw.description || '', aliases: raw.aliases || [], tags: raw.tags || [] }
})
const ORDER = ['line', 'solid', 'duo', 'gloss', 'engrave', 'blueprint', 'sketch']
const styleList = Object.values(styles).sort((a, b) => (ORDER.indexOf(a.name) + 99) % 99 - (ORDER.indexOf(b.name) + 99) % 99)
const meta = {
  version: JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version || '0.1.0',
  total: manifest.count,
  categories: manifest.categories,
  styles: styleList.map(s => ({ name: s.name, title: s.title, kind: s.kind, description: s.description, strokeWidth: s.strokeWidth || false, root: s.root })),
  icons,
}
fs.writeFileSync(path.join(outDir, 'meta.js'), `window.WITH=${JSON.stringify(meta)};\n`)
let report = []
for (const s of styleList) {
  const map = {}; let fails = 0
  for (const n of names) {
    try { map[n] = nodesToMarkup(renderIcon(s, loadIcon(n))) } catch { fails++ }
  }
  const js = `(window.WITH_SVG=window.WITH_SVG||{})[${JSON.stringify(s.name)}]=${JSON.stringify(map)};\n`
  fs.writeFileSync(path.join(outDir, `style-${s.name}.js`), js)
  report.push(`${s.name}: ${Object.keys(map).length} icons, ${(js.length / 1024).toFixed(0)} KB${fails ? `, ${fails} FAILED` : ''}`)
}
console.log(`site data: ${icons.length} icons x ${styleList.length} styles\n  ` + report.join('\n  '))
