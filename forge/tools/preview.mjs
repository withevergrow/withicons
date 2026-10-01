#!/usr/bin/env node
// Rasterise a contact sheet to PNG so you can LOOK at icons (Read the PNG).
//
//   node forge/tools/preview.mjs --styles line,gloss --icons home,lock,heart --out .preview/me.png
//   node forge/tools/preview.mjs --styles all --icons all --size 32 --out .preview/all.png
//   options: --size <px per icon, default 48>  --small (adds a 16px and 24px row per style)  --dark
import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import { loadIcon, listIcons, loadStyles, renderIcon, nodesToMarkup, attrs, ROOT } from '../lib/load.mjs'

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true]); return a
}, []))
const styles = await loadStyles(args.styles && args.styles !== 'all' ? String(args.styles).split(',') : undefined)
const styleNames = Object.keys(styles)
const iconNames = args.icons && args.icons !== 'all' ? String(args.icons).split(',') : listIcons()
const SIZE = Number(args.size || 48), PAD = Math.round(SIZE * 0.45), LABEL = 118
const cols = Math.min(iconNames.length, Number(args.cols || 12))
const dark = !!args.dark
const fg = dark ? '#f3f0e8' : '#15140f', bg = dark ? '#131210' : '#fbfaf7', mut = dark ? '#8a8578' : '#8a8578'

let y = 16, body = ''
const errors = []
for (const sn of styleNames) {
  const st = styles[sn]
  const rows = Math.ceil(iconNames.length / cols)
  body += `<text x="16" y="${y + 18}" font-family="Segoe UI, Arial" font-size="13" font-weight="700" fill="${fg}">${st.title || sn}</text>`
  body += `<text x="16" y="${y + 34}" font-family="Segoe UI, Arial" font-size="10" fill="${mut}">${st.kind || ''}</text>`
  iconNames.forEach((name, k) => {
    const cx = LABEL + (k % cols) * (SIZE + PAD), cy = y + Math.floor(k / cols) * (SIZE + PAD + 12)
    let inner = ''
    try { inner = nodesToMarkup(renderIcon(st, loadIcon(name))) }
    catch (e) { errors.push(`${sn}/${name}: ${e.message}`); inner = `<path d="M4 4L20 20M20 4L4 20" stroke="#e03" stroke-width="2"/>` }
    const root = { ...st.root }; delete root.width; delete root.height
    body += `<svg x="${cx}" y="${cy}" width="${SIZE}" height="${SIZE}" viewBox="0 0 24 24"${attrs(root)} color="${fg}" style="color:${fg}">${inner.replaceAll('currentColor', fg)}</svg>`
    if (!args.nolabels) body += `<text x="${cx + SIZE / 2}" y="${cy + SIZE + 10}" text-anchor="middle" font-family="Segoe UI, Arial" font-size="8" fill="${mut}">${name}</text>`
  })
  y += rows * (SIZE + PAD + 12) + 18
  if (args.small) {
    body += `<text x="16" y="${y + 12}" font-family="Segoe UI, Arial" font-size="9" fill="${mut}">24px / 16px</text>`
    iconNames.slice(0, 40).forEach((name, k) => {
      let inner = ''
      try { inner = nodesToMarkup(renderIcon(st, loadIcon(name))).replaceAll('currentColor', fg) } catch {}
      const root = { ...st.root }; delete root.width; delete root.height
      body += `<svg x="${LABEL + k * 30}" y="${y}" width="24" height="24" viewBox="0 0 24 24"${attrs(root)}>${inner}</svg>`
      body += `<svg x="${LABEL + k * 30 + 4}" y="${y + 30}" width="16" height="16" viewBox="0 0 24 24"${attrs(root)}>${inner}</svg>`
    })
    y += 58
  }
  body += `<line x1="16" x2="${LABEL + cols * (SIZE + PAD)}" y1="${y - 6}" y2="${y - 6}" stroke="${mut}" stroke-opacity=".3"/>`
  y += 6
}
const W = LABEL + cols * (SIZE + PAD) + 8, H = y + 8
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${bg}"/>${body.replaceAll('currentColor', fg)}</svg>`
const out = path.resolve(ROOT, String(args.out || '.preview/preview.png'))
fs.mkdirSync(path.dirname(out), { recursive: true })
const png = new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' }, background: bg }).render().asPng()
fs.writeFileSync(out, png)
console.log(`wrote ${path.relative(ROOT, out)}  (${styleNames.length} styles x ${iconNames.length} icons, ${W}x${H})`)
if (errors.length) { console.log(`\n${errors.length} RENDER ERRORS:`); errors.slice(0, 30).forEach(e => console.log('  ' + e)) }
