#!/usr/bin/env node
// Contact sheet of an icon's palette suggestions: one row per palette, one column per multi-colour style.
//   node forge/tools/preview-palettes.mjs pizza [--size 48] [--dark] [--out .preview/x.png]
// Reads forge/palettes/<name>.json. Row label = palette id. See forge/PALETTES.md.
import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import { loadIcon, loadStyles, renderIcon, nodesToMarkup, attrs, ROOT, resolveVars } from '../lib/load.mjs'
import { bakePalette } from '../lib/palette-map.mjs'

const argv = process.argv.slice(2)
const opt = (k, d) => { const i = argv.indexOf(k); if (i < 0) return d; const v = argv[i + 1]; argv.splice(i, 2); return v }
const flag = k => { const i = argv.indexOf(k); if (i < 0) return false; argv.splice(i, 1); return true }
const SIZE = Number(opt('--size', 48)); const dark = flag('--dark'); const out = opt('--out', null)
const name = argv[0]
if (!name) { console.log('usage: preview-palettes.mjs <icon> [--size 48] [--dark] [--out file.png]'); process.exit(1) }
const pal = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'palettes', `${name}.json`), 'utf8'))
const COLS = ['duo', 'glass', 'kawaii', 'sticker', 'pixel', 'retro']
const styles = await loadStyles(COLS)
const cols = COLS.filter(c => styles[c])
const icon = loadIcon(name)
const inner = Object.fromEntries(cols.map(c => [c, nodesToMarkup(renderIcon(styles[c], icon))]))
const bg = dark ? '#0B0B12' : '#FFFFFF', fg = dark ? '#F4F4F8' : '#14141F'
const PAD = 14, LABEL = 170, GAP = 10
const W = LABEL + cols.length * (SIZE + GAP) + PAD, H = PAD * 2 + 18 + pal.palettes.length * (SIZE + GAP)
let body = cols.map((c, i) => `<text x="${LABEL + i * (SIZE + GAP)}" y="${PAD + 10}" font-size="11" fill="${fg}" opacity=".6">${c}</text>`).join('')
pal.palettes.forEach((p, r) => {
  const y = PAD + 18 + r * (SIZE + GAP)
  body += `<text x="${PAD}" y="${y + SIZE / 2 + 4}" font-size="12" fill="${fg}">${String(p.id).slice(0, 24)}</text>`
  const sw = ['ink', 'c1', 'c2', 'c3', 'c4', 'tint', 'accent', 'shadow'].filter(k => p.colors[k])
  sw.forEach((k, j) => { body += `<rect x="${PAD + j * 9}" y="${y + SIZE / 2 + 9}" width="8" height="8" rx="2" fill="${p.colors[k]}"/>` })
  cols.forEach((c, i) => {
    const x = LABEL + i * (SIZE + GAP), ink = p.colors.ink || fg
    const root = { ...styles[c].root }
    body += `<svg x="${x}" y="${y}" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24"${attrs(root)} color="${ink}">${bakePalette(inner[c], p.colors).replaceAll('currentColor', ink)}</svg>`
  })
})
const svg = resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${bg}"/>${body}</svg>`)
const file = path.resolve(ROOT, out || `.preview/palettes-${name}${dark ? '-dark' : ''}.png`)
fs.mkdirSync(path.dirname(file), { recursive: true })
fs.writeFileSync(file, new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' }, background: bg }).render().asPng())
console.log(`wrote ${path.relative(ROOT, file)} (${pal.palettes.length} palettes x ${cols.length} styles)`)
