#!/usr/bin/env node
// Contact sheet for Live icons (forge/DYNAMIC.md): a generator's examples (or your params) x styles -> PNG.
// Read the PNG and LOOK.
//
//   node forge/tools/preview-dynamic.mjs calendar-date --styles line,solid,kawaii --size 64 --small --out .preview/me-cal.png
//   node forge/tools/preview-dynamic.mjs calendar-date --params '{"day":9}'            # one params object (or a JSON array)
//   node forge/tools/preview-dynamic.mjs calendar-date,battery-level --sizes 128,56,24,16 --dark
//   node forge/tools/preview-dynamic.mjs calendar-date --stress                        # edge/extreme params instead of examples
//   node forge/tools/preview-dynamic.mjs --font [--text "17,99+,MON"] [--out ...]      # stroke-font specimen
//   options: --styles a,b|all (default all)  --size <px, default 56>  --sizes a,b,c  --small (= adds 24,16)
//            --dark  --cols <n>  --out <png>
import fs from 'fs'
import path from 'path'
import { Resvg } from '@resvg/resvg-js'
import { loadStyles, nodesToMarkup, attrs, ROOT, resolveVars } from '../lib/load.mjs'
import { loadGenerator, listGenerators, resolveParams, renderLive, paramLabel, stressParams } from './lib-dynamic.mjs'
import { text, CHARSET, LARGE, SMALL } from '../dynamic/_font.mjs'

const argv = process.argv.slice(2)
const args = {}, pos = []
for (let i = 0; i < argv.length; i++) {
  const v = argv[i]
  if (v.startsWith('--')) { const n = argv[i + 1]; if (n !== undefined && !n.startsWith('--')) { args[v.slice(2)] = n; i++ } else args[v.slice(2)] = true }
  else pos.push(v)
}
const dark = !!args.dark
const fg = dark ? '#f3f0e8' : '#15140f', bg = dark ? '#131210' : '#fbfaf7', mut = '#8a8578'
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
const label = (x, y, s, size = 9, weight = 400, fill = mut, anchor = 'start') =>
  `<text x="${x}" y="${y}" font-family="Segoe UI, Arial" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(s)}</text>`

function write(svgBody, W, H, out) {
  const svg = resolveVars(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="${bg}"/>${svgBody.replaceAll('currentColor', fg)}</svg>`)
  const file = path.resolve(ROOT, String(out))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, new Resvg(svg, { font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' }, background: bg }).render().asPng())
  console.log(`wrote ${path.relative(ROOT, file)}  (${W}x${H})`)
}

// ── font specimen ───────────────────────────────────────────────────────────────────────────────────────
if (args.font) {
  const SW = [1.75, 2.5]
  const glyphs = [...CHARSET].filter(c => c !== ' ')
  const samples = args.text ? String(args.text).split(',') : ['17', '31', '99+', '72°', '100', '-4°', '12:30', 'MON', 'TUE', 'WED', 'SAT', 'PDF', 'NEW', 'SALE', '-50%', '100%', 'JPG', 'ZIP', 'OK!', '$9', '€5', '£20', '₹99', '#1', 'A&B', '4/5', '2.5', 'Q&A', 'WIFI', 'GO?', "'24", '*']
  let body = '', y = 14
  const BIG = Number(args.scale || 9) // px per u for the big specimen
  for (const [sname, M] of [['LARGE  cap 7', LARGE], ['SMALL  cap 5', SMALL]]) {
    for (const sw of SW) {
      body += label(16, y + 12, `${sname}  stroke ${sw}`, 12, 700, fg)
      y += 22
      // big glyph row (in a 24-unit cell per glyph)
      const cell = 10, per = 24
      let x = 16
      for (const ch of glyphs) {
        const t = text(ch, { x: cell / 2, y: 6, size: M.name })
        if (x + cell * BIG > 1900) { x = 16; y += 11 * BIG }
        body += `<g transform="translate(${x} ${y}) scale(${BIG})"><rect x="0" y="0" width="${cell}" height="12" fill="${dark ? '#1d1b18' : '#f0ede6'}"/>` +
          `<path d="M0 ${6 - M.cap / 2}H${cell}M0 ${6 + M.cap / 2}H${cell}" stroke="#e05" stroke-opacity=".35" stroke-width="${0.06}"/>` +
          `<path d="${t.paths.join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>` +
          `<path d="${t.paths.join(' ')}" fill="none" stroke="#0af" stroke-width="0.08"/></g>`
        x += cell * BIG + 6
      }
      y += 12 * BIG + 12
      // real-size rows: every glyph in a 24px icon at 24px and 16px, and samples
      for (const px of [24, 16]) {
        body += label(16, y + px * 0.7, `${px}px`)
        let xx = 60
        for (const ch of glyphs) {
          const t = text(ch, { size: M.name })
          body += `<svg x="${xx}" y="${y}" width="${px}" height="${px}" viewBox="0 0 24 24"><path d="${t.paths.join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          xx += px + 6
        }
        y += px + 8
      }
      for (const px of [24, 16]) {
        body += label(16, y + px * 0.7, `${px}px`)
        let xx = 60
        for (const s of samples) {
          const t = text(s, { size: M.name })
          const fits = t.box.x0 >= 2 && t.box.x1 <= 22
          body += `<svg x="${xx}" y="${y}" width="${px}" height="${px}" viewBox="0 0 24 24" overflow="visible">${fits ? '' : `<rect x="0" y="0" width="24" height="24" fill="#e05" fill-opacity=".12"/>`}<path d="${t.paths.join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></svg>`
          xx += px * 1.6 + 8
        }
        y += px + 8
      }
      // samples big
      let xx = 16
      const S2 = 3.5
      for (const s of samples) {
        const t = text(s, { size: M.name })
        if (xx + 24 * S2 > 1900) { xx = 16; y += 24 * S2 / 2 + 8 }
        body += `<g transform="translate(${xx} ${y}) scale(${S2})"><rect width="24" height="12" y="0" fill="${dark ? '#1d1b18' : '#f0ede6'}"/><path transform="translate(0 -6)" d="${t.paths.join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/></g>`
        xx += 24 * S2 + 8
      }
      y += 12 * S2 + 22
    }
  }
  write(body, 1920, y + 10, args.out || '.preview/font-specimen.png')
  process.exit(0)
}

// ── generator contact sheet ─────────────────────────────────────────────────────────────────────────────
const names = (pos.length ? pos.join(',').split(',') : listGenerators()).filter(Boolean)
if (!names.length) { console.log('no generators (pass a name, e.g. _example-calendar)'); process.exit(1) }
const styles = await loadStyles(args.styles && args.styles !== 'all' ? String(args.styles).split(',') : undefined)
const order = 'line solid duo gloss engrave blueprint sketch glass kawaii sticker pixel retro luxe bauhaus skeuo'.split(' ')
const styleNames = Object.keys(styles).sort((a, b) => (order.indexOf(a) + 1 || 99) - (order.indexOf(b) + 1 || 99))
let sizes = args.sizes ? String(args.sizes).split(',').map(Number) : [Number(args.size || 56)]
if (args.small) sizes = [...sizes, 24, 16]
const big = Math.max(...sizes), PAD = Math.max(14, Math.round(big * 0.3)), LABEL = 118

// columns: [generator, params]
const cols = []
for (const n of names) {
  const gen = await loadGenerator(n)
  let sets
  if (args.params) { const j = JSON.parse(args.params); sets = Array.isArray(j) ? j : [j] }
  else if (args.stress) sets = stressParams(gen)
  else sets = gen.examples?.length ? gen.examples : [{}]
  for (const s of sets) cols.push({ n, gen, p: resolveParams(gen, s) })
}
const maxCols = Number(args.cols || 12)
let y = 16, body = '', errors = []
const rowsOfCols = []
for (let i = 0; i < cols.length; i += maxCols) rowsOfCols.push(cols.slice(i, i + maxCols))
for (const sn of styleNames) {
  const st = styles[sn]
  const root = { ...st.root }; delete root.width; delete root.height
  body += label(16, y + 16, st.title || sn, 13, 700, fg)
  for (const row of rowsOfCols) {
    for (const px of sizes) {
      row.forEach((c, k) => {
        const cx = LABEL + k * (big + PAD) + (big - px) / 2
        let inner = ''
        try { inner = nodesToMarkup(renderLive(st, c.gen, c.p)) }
        catch (e) { errors.push(`${sn}/${c.n} ${JSON.stringify(c.p)}: ${e.message}`); inner = '<path d="M4 4L20 20M20 4L4 20" stroke="#e03" stroke-width="2"/>' }
        body += `<svg x="${cx}" y="${y}" width="${px}" height="${px}" viewBox="0 0 24 24"${attrs(root)} color="${fg}" style="color:${fg}">${inner.replaceAll('currentColor', fg)}</svg>`
      })
      y += px + 6
    }
    row.forEach((c, k) => { body += label(LABEL + k * (big + PAD) + big / 2, y + 4, (names.length > 1 ? c.n.replace(/^_example-/, '') + ' ' : '') + paramLabel(c.p), 8, 400, mut, 'middle') })
    y += 16
  }
  body += `<line x1="16" x2="${LABEL + Math.min(cols.length, maxCols) * (big + PAD)}" y1="${y - 4}" y2="${y - 4}" stroke="${mut}" stroke-opacity=".3"/>`
  y += 8
}
const W = LABEL + Math.min(cols.length, maxCols) * (big + PAD) + 8
write(body, W, y + 8, args.out || '.preview/dynamic.png')
if (errors.length) { console.log(`\n${errors.length} RENDER ERRORS:`); errors.slice(0, 30).forEach(e => console.log('  ' + e)); process.exitCode = 1 }
