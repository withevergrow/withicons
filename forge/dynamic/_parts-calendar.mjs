// with icons — shared parts for the Live calendar family (forge/DYNAMIC.md):
// calendar-date, calendar-weekday, calendar-month, calendar-event, calendar-range, calendar-tear.
//
// THE TILE. Every live calendar is the static calendar (forge/PARTS.md) taken up to the top of the keyline:
// a rounded tile x 2.5..21.5 × y 3..21 (r 2) with the binder rings (x 8 / 16, as in PARTS.md) rising above the
// top wall as short stubs. A header band with text inside it cannot fit at 24px with a 2u stroke (band walls +
// whites + cap leave < 3u), so the "band" is the text line itself, like a desk-calendar tile: a small line
// (month, weekday) on top and a big number under it. The interior is 0.5u wider than the static body each side
// so 3-letter words (MAR, MAY, WED) keep a 3.75 cap.
//
// Measurements (centrelines; ink = +1 each side at the 2u stroke):
//   wall centre -> text centreline = 3 (1 wall ink + 1 white + 1 text ink); between two text lines = 3.
//   tile interior for text: x 5.5..18.5, y 6..18.
//
// Pure helpers, deterministic, every coordinate on the 0.25 grid.
import { fitText, asCutouts, text, measure, snap, markText } from './_font.mjs'
import { rr, circle } from './_layout.mjs'
import { parsePath } from '../kernel/geom.mjs'

export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
export const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
export { snap, rr, circle }

// ── skeleton assembly ───────────────────────────────────────────────────────────────────────────────────
// part = { paths: [{d, plate}], fills: [d], cutouts: [d] }; merge keeps order (frame first)
export function merge(...parts) {
  const out = { paths: [], fills: [], cutouts: [] }
  for (const p of parts) {
    if (!p) continue
    out.paths.push(...(p.paths || []))
    out.fills.push(...(p.fills || []))
    out.cutouts.push(...(p.cutouts || []))
  }
  return out
}
// glyph subpaths that end where they start (D, the bowls of B) read as closed areas to some renderers (luxe
// fills them as gems, skeuo as pockets): reopen every such loop into two open halves, like the font's 0 O 8
export function openLoops(paths) {
  const out = []
  for (const d of paths) {
    for (const sub of String(d).split(/(?=M)/).map(x => x.trim()).filter(Boolean)) {
      // the kernel marks a subpath closed when its ends meet, Z or not
      const loop = !/[Zz]s*$/.test(sub) && parsePath(sub).some(p => p.closed)
      out.push(...(loop ? asCutouts(sub + ' Z') : [sub]))
    }
  }
  return out
}
// a laid-out text block -> part: glyphs on `plate`, knocked out of the tile's mass as open lines
export function ink(t, plate = 'A') {
  if (!t || !t.paths.length) return null
  // one path per glyph (its reopened subpaths joined), tagged as text for the style renderers
  const glyphs = t.paths.map((d, i) => markText(asCutouts(openLoops([d])).join(' '), t.glyphs ? t.glyphs[i] : '?', t.cap))
  return { paths: glyphs.map(d => ({ d, plate })), cutouts: asCutouts(openLoops(t.paths)) }
}
// one stroke on a plate that also knocks out of the mass (`cut` defaults to the same d; a closed d knocks out an area)
export const mark = (d, plate = 'A', cut = d) => ({ paths: [{ d, plate }], cutouts: cut ? [].concat(cut) : [] })

// ── the tile ────────────────────────────────────────────────────────────────────────────────────────────
export const TILE = rr(2.5, 3, 21.5, 21, 2)
export const RINGS = ['M8 2 V3', 'M16 2 V3']
export const INNER = { x0: 5.5, y0: 6, x1: 18.5, y1: 18 }

export function tile({ rings = true } = {}) {
  return {
    paths: [{ d: TILE, plate: 'K' }, ...(rings ? RINGS.map(d => ({ d, plate: 'A' })) : [])],
    fills: [TILE],
    cutouts: [],
  }
}
// split the tile interior into a small line (cap height `cap`) and a big area, small on top or at the bottom
export function split({ cap = 3.75, smallOnTop = true, box = INNER } = {}) {
  const wide = { x0: box.x0 - 0.25, x1: box.x1 + 0.25 }
  return smallOnTop
    ? { small: { ...box, ...wide, y1: box.y0 + cap }, big: { ...box, y0: box.y0 + cap + 3 } }
    : { small: { ...box, ...wide, y0: box.y1 - cap }, big: { ...box, y1: box.y1 - cap - 3 } }
}

// ── text ────────────────────────────────────────────────────────────────────────────────────────────────
// small line: one cap height for every word (JAN and MAY look alike), centred in the box. Wide words take a
// hair of negative tracking first, then step down 0.25 at a time to minCap; null when nothing fits.
export function smallText(str, box, { cap = 3.75, minCap = 3.25, align = 'center' } = {}) {
  const w = box.x1 - box.x0, y = snap((box.y0 + box.y1) / 2)
  const x = align === 'left' ? box.x0 : align === 'right' ? box.x1 : (box.x0 + box.x1) / 2
  for (let c = cap; c >= minCap - 1e-9; c -= 0.25) {
    for (const tracking of [0, -0.25]) {
      if (measure(str, { size: c, tracking }).width <= w + 1e-9) return text(str, { x, y, size: c, tracking, align })
    }
  }
  return null
}
// big number: the large drawings when they fit, never below cap 4
export const bigText = (str, box, opts = {}) => fitText(str, box, { prefer: 'large', minCap: 4, ...opts })

// ── small marks ─────────────────────────────────────────────────────────────────────────────────────────
// a dot is a 0.25u stub the stroke rounds into a 2u disc
export const dot = (x, y) => `M${snap(x)} ${snap(y)} H${snap(x + 0.25)}`
// a bigger dot: a closed circle (stroked ring + filled centre reads as one disc). Its cutout should be a closed
// circle of r + 0.5 so the filled styles knock out a matching bigger hole: mark(disc(x, y), 'A', disc(x, y, 1.25))
export const disc = (x, y, r = 0.75) => circle(x, y, r)
