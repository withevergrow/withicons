#!/usr/bin/env node
// Review renders of the existing teddy-bear icon in the Liquid and Chrome styles. Not part of the library:
// it only READS forge/icons/teddy-bear.json, forge/palettes/teddy-bear.json and the style renderers, and writes
// into this folder. Nothing under forge/, packages/ or site/ changes.
//
//   node previews/teddy-bear/render.mjs
//
// Outputs: teddy-bear-liquid.svg, teddy-bear-chrome.svg (standalone, palette baked in) and teddy-bear-liquid-chrome.png
// (a sheet: each style at 300 px and at 96 / 48 / 24 / 16 px).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { loadIcon, loadStyles, renderIcon, nodesToMarkup, attrs, toSvg, resolveVars, ROOT } from '../../forge/lib/load.mjs'
import { bakePalette } from '../../forge/lib/palette-map.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const NAME = 'teddy-bear'
const STYLES = ['liquid', 'chrome']
// the first palette in forge/palettes/teddy-bear.json is the default colourway (honey-teddy)
const palette = JSON.parse(fs.readFileSync(path.join(ROOT, 'forge', 'palettes', `${NAME}.json`), 'utf8')).palettes[0]
const icon = loadIcon(NAME)
const styles = await loadStyles(STYLES)

const rasterise = (svg, width, bg) => new Resvg(svg, {
  fitTo: { mode: 'width', value: width }, background: bg,
  font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
}).render().asPng()

// standalone files: same markup as the library's SVG output, with the palette baked in and no CSS variables left
for (const s of STYLES) {
  const st = styles[s]
  const svg = resolveVars(bakePalette(toSvg(st, renderIcon(st, icon), { width: 512, height: 512 }), palette))
  fs.writeFileSync(path.join(HERE, `${NAME}-${s}.svg`), svg)
}

// review sheet
const bg = '#fbfaf7', fg = '#15140f', mut = '#8a8578'
const W = 900, ROW = 360
let body = ''
STYLES.forEach((s, r) => {
  const st = styles[s], y = 24 + r * ROW
  const root = { ...st.root }
  delete root.width; delete root.height
  const inner = bakePalette(nodesToMarkup(renderIcon(st, icon)), palette)
  body += `<text x="24" y="${y + 18}" font-family="Segoe UI, Arial" font-size="18" font-weight="700" fill="${fg}">${st.title} · teddy bear</text>`
  body += `<svg x="24" y="${y + 36}" width="300" height="300" viewBox="0 0 24 24"${attrs(root)}>${inner}</svg>`
  let x = 360
  for (const px of [96, 48, 24, 16]) {
    body += `<svg x="${x}" y="${y + 36}" width="${px}" height="${px}" viewBox="0 0 24 24"${attrs(root)}>${inner}</svg>`
    body += `<text x="${x + px / 2}" y="${y + 36 + px + 16}" text-anchor="middle" font-family="Segoe UI, Arial" font-size="11" fill="${mut}">${px}px</text>`
    x += px + 28
  }
})
const sheet = resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${2 * ROW + 24}" viewBox="0 0 ${W} ${2 * ROW + 24}"><rect width="100%" height="100%" fill="${bg}"/>${body}</svg>`)
fs.writeFileSync(path.join(HERE, `${NAME}-liquid-chrome.png`), rasterise(sheet, 1800, bg))
console.log(`wrote previews/${NAME}/: ${STYLES.map(s => `${NAME}-${s}.svg`).join(', ')}, ${NAME}-liquid-chrome.png`)
