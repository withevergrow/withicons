#!/usr/bin/env node
// Frame strips of loaders (forge/LOADERS.md): each row is one loader in one style, each column one moment of its
// cycle, so motion can be judged on a still PNG.
//   node forge/tools/preview-loaders.mjs --loaders spinner,orbit --styles line,glass --frames 8 --size 56 [--dark] [--out .preview/x.png]
//   --styles all   every style        --loaders all   every loader        --grid   one cell per loader x style at t = --t (0.3)
import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import { loadStyles } from '../lib/load.mjs'
import { STYLE_ORDER } from '../lib/emit-core.mjs'
import { listLoaders, loadLoaders, frameAt, resolveVars } from '../lib/loader-compile.mjs'

const args = process.argv.slice(2)
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : args[i + 1] }
const flag = k => args.includes('--' + k)
const dark = flag('dark'), grid = flag('grid')
const size = +opt('size', 56), frames = +opt('frames', 8), T0 = +opt('t', 0.3)
const styles = await loadStyles()
const styleNames = (opt('styles', 'line') === 'all' ? STYLE_ORDER : opt('styles', 'line').split(',')).filter(s => styles[s])
const names = opt('loaders', 'all') === 'all' ? listLoaders() : opt('loaders').split(',')
const specs = await loadLoaders(names)
const ink = dark ? '#e8ecf4' : '#1d2433', bg = dark ? '#12151c' : '#ffffff'
const pad = Math.round(size * 0.25), cell = size + pad, labelW = 150
let rows = []
if (grid) {
  // rows = loaders, cols = styles
  rows = specs.map(sp => ({ label: sp.name, cells: styleNames.map(s => frameAt(sp, styles[s], T0)) }))
} else {
  for (const sp of specs) for (const s of styleNames) rows.push({ label: `${sp.name} · ${s}`, cells: Array.from({ length: frames }, (_, i) => frameAt(sp, styles[s], i / frames)) })
}
const cols = Math.max(...rows.map(r => r.cells.length))
const W = labelW + cols * cell + pad, H = rows.length * cell + pad + (grid ? 24 : 0)
const head = grid ? styleNames.map((s, i) => `<text x="${labelW + i * cell + size / 2}" y="16" font-size="10" text-anchor="middle" fill="${ink}" font-family="sans-serif">${s}</text>`).join('') : ''
const y0 = grid ? 24 : 0
const body = rows.map((r, ri) => `<text x="8" y="${y0 + pad + ri * cell + size / 2 + 4}" font-size="11" fill="${ink}" font-family="sans-serif">${r.label}</text>` +
  r.cells.map((svg, ci) => `<g transform="translate(${labelW + ci * cell} ${y0 + pad + ri * cell})">${svg.replace(/<svg([^>]*?) width="24" height="24"/, `<svg$1 width="${size}" height="${size}"`)}</g>`).join('')).join('')
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="color:${ink}"><rect width="100%" height="100%" fill="${bg}"/>${head}${body}</svg>`
const png = new Resvg(resolveVars(sheet).replace(/currentColor/g, ink), { font: { loadSystemFonts: true } }).render().asPng()
const out = opt('out', `.preview/loaders-${grid ? 'grid' : 'frames'}${dark ? '-dark' : ''}.png`)
fs.mkdirSync(path.dirname(out), { recursive: true })
fs.writeFileSync(out, png)
console.log(`${out}  ${rows.length} rows x ${cols} cols`)
