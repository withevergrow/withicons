// PIXEL: hand-composed Live icons whose generic raster breaks on a 16x16 grid (forge/DYNAMIC.md):
//   folder-label            the back with its tab (rows 1-4) and the FRONT as a solid ink panel (rows 5-14) with the
//                           label knocked out in 5-row capitals (4-row, then narrow, when it must), like the vector
//   battery-charging-level  a 10 x 8 cell on rows 4-11, the charge in whole and half cells, and a pixel bolt beside it
// Built in canvas cells ('#' ink, '+' body tone); the value comes from the skeleton (its glyphs, or its params).
import * as G from './_pixel-core.mjs'
import { fitPixelText } from './_pixel-text.mjs'
import { textInfo } from './_live-text.mjs'

const BOLT = [
  '...##',
  '..##.',
  '.##..',
  '####.',
  '..##.',
  '.##..',
  '.#...',
]
const chars = icon => (icon.paths || []).map(p => ({ p, t: textInfo(p) })).filter(o => o.t)
  .sort((a, b) => Math.min(...a.p.subs.flatMap(s => s.pts.map(q => q[0]))) - Math.min(...b.p.subs.flatMap(s => s.pts.map(q => q[0]))))
  .map(o => o.t.ch).join('')

export function labelCompose(icon) {
  if (!icon?.params) return null
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), text = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  if (icon.name === 'folder-label') {
    // back: tab on the left, the back's top edge, tone inside
    for (let i = 2; i <= 5; i++) put(ink, i, 1)
    put(ink, 1, 2); put(ink, 6, 2)
    for (let i = 7; i <= 13; i++) put(ink, i, 2)
    for (let j = 2; j <= 3; j++) { put(ink, 1, j + 1); put(ink, 14, j + 1) }
    put(ink, 14, 3)
    for (let j = 2; j <= 3; j++) for (let i = 2; i <= 13; i++) if (!G.get(ink, i, j)) put(tone, i, j)
    // front panel: rows 5..14, cols 0..15, corners cut
    for (let j = 5; j <= 14; j++) for (let i = 0; i <= 15; i++) if (!((i === 0 || i === 15) && (j === 5 || j === 14))) put(ink, i, j)
    const s = chars(icon)
    const t = s && (fitPixelText(s, 14, 5) || fitPixelText(s, 14, 4) || fitPixelText(s, 14, 4, true) || fitPixelText(s, 16, 4, true))
    if (t) {
      const i0 = Math.round(8 - t.w / 2), j0 = t.h === 5 ? 7 : 8
      for (const [a, b] of t.cells) { put(ink, i0 + a, j0 + b, 0); put(text, i0 + a, j0 + b) }
    }
    return { ink, tone, glint, text }
  }
  if (icon.name === 'file-type') {
    // page: cols 3..12, the fold top-right (cols 9..12, rows 1..4), tone inside; the label: rows 6..12 across the
    // whole canvas, solid ink, the type knocked out; the page's foot shows below it (rows 14..15)
    for (let i = 4; i <= 8; i++) put(ink, i, 1)
    put(ink, 3, 2); for (let j = 2; j <= 4; j++) put(ink, 3, j)
    for (let k = 0; k <= 3; k++) put(ink, 9 + k, 1 + k)
    for (let j = 1; j <= 4; j++) put(ink, 9, j)
    for (let i = 9; i <= 12; i++) put(ink, i, 4)
    for (let j = 2; j <= 4; j++) for (let i = 4; i <= 8; i++) put(tone, i, j)
    for (let j = 6; j <= 12; j++) for (let i = 0; i <= 15; i++) if (!((i === 0 || i === 15) && (j === 6 || j === 12))) put(ink, i, j)
    put(ink, 3, 14); put(ink, 12, 14); for (let i = 4; i <= 11; i++) put(ink, i, 15)
    const s = chars(icon)
    const t = s && (fitPixelText(s, 14, 5) || fitPixelText(s, 14, 5, true) || fitPixelText(s, 14, 4, true))
    if (t) {
      const i0 = Math.round(8 - t.w / 2), j0 = t.h === 5 ? 7 : 7.5 | 0
      for (const [a, b] of t.cells) { put(ink, i0 + a, j0 + b, 0); put(text, i0 + a, j0 + b) }
    }
    return { ink, tone, glint, text }
  }
  if (icon.name === 'battery-charging-level') {
    const lv = Math.max(0, Math.min(1, Number(icon.params.level) || 0))
    // cell: cols 0..10, rows 4..11, corners cut
    for (let i = 1; i <= 9; i++) { put(ink, i, 4); put(ink, i, 11) }
    // the cell is empty paper (as in the vector), so the charge alone reads as the level
    for (let j = 5; j <= 10; j++) { put(ink, 0, j); put(ink, 10, j) }
    // charge: cols 2..8 (7 cells, in half cells), rows 6..9
    const half = lv > 0 ? Math.max(2, Math.round(lv * 14)) : 0, full = Math.floor(half / 2) // any charge shows at least a whole column
    for (let q = 0; q < full; q++) for (let j = 6; j <= 9; j++) { put(ink, 2 + q, j); put(tone, 2 + q, j, 0) }
    const halfCol = half % 2 ? 2 + full : -1
    // bolt: cols 11..15, rows 4..10
    BOLT.forEach((r, j) => [...r].forEach((c, i) => { if (c === '#') put(ink, 11 + i, 4 + j) }))
    const L = { ink, tone, glint, text }
    if (halfCol >= 0) { L.shade = G.grid(); for (let j = 6; j <= 9; j++) L.shade[G.ix(halfCol, j)] = 1 }
    return L
  }
  return null
}
