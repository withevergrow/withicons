// PIXEL — Live-icon text (forge/DYNAMIC.md, forge/styles/_live-text.mjs).
//
// A stroke-font glyph cannot survive being rasterised into 1.5u cells (a cap-5 "MAR" is three pixels tall), so
// pixel draws text the pixel way: every line of text is re-set in a hand-drawn BITMAP font (5 rows; narrow M W N;
// condensed two-pixel C E F L and a one-pixel I; a 4-row set of digits, signs and capitals) and stamped at the
// line's place, inside the frame (the smallest fill) that holds it:
//   on    ink glyphs on the body or the paper, one clear pixel all round
//   band  the frame's rows behind the line turn solid ink and the glyphs are cut out (a calendar's month header,
//         a footer label), for a line that has no room for the clear pixel
//   fill  a count / label in a badge (S plate): the badge turns solid ink and the glyphs are cut out of it
//   pill  a badge too small for its count ("42", "99+") grows into a pill around the glyphs, with a moat
// All lines of an icon are placed together (best total; the biggest line counts double), so a calendar gets a
// "MAR" header band AND its "17". A line that cannot be set legibly is left out; its frame keeps a clean outline.
//
//   pixelText(icon)          -> { icon (without text paths, lines and text cutouts), lines } | null
//   stampText(L, lines, icon, sh) mutates L.ink / L.tone / L.glint
import * as G from './_pixel-core.mjs'
import { textInfo } from './_live-text.mjs'
import { pointInRing } from '../kernel/geom.mjs'

const { N } = G

// ── bitmap fonts (original drawings; '#' = pixel) ───────────────────────────────────────────────────────
const F5 = {
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#', '##', '.#', '.#', '.#'], 2: ['###', '..#', '###', '#..', '###'],
  3: ['###', '..#', '.##', '..#', '###'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '..#', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
  A: ['.#.', '#.#', '###', '#.#', '#.#'], B: ['##.', '#.#', '##.', '#.#', '##.'], C: ['.##', '#..', '#..', '#..', '.##'],
  D: ['##.', '#.#', '#.#', '#.#', '##.'], E: ['###', '#..', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..', '#..'],
  G: ['.##', '#..', '#.#', '#.#', '.##'], H: ['#.#', '#.#', '###', '#.#', '#.#'], I: ['#', '#', '#', '#', '#'],
  J: ['..#', '..#', '..#', '#.#', '.#.'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'], N: ['#..#', '##.#', '#.##', '#..#', '#..#'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'], P: ['##.', '#.#', '##.', '#..', '#..'], Q: ['.#.', '#.#', '#.#', '##.', '.##'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], S: ['.##', '#..', '.#.', '..#', '##.'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
  U: ['#.#', '#.#', '#.#', '#.#', '###'], V: ['#.#', '#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], X: ['#.#', '#.#', '.#.', '#.#', '#.#'], Y: ['#.#', '#.#', '.#.', '.#.', '.#.'],
  Z: ['###', '..#', '.#.', '#..', '###'],
  '%': ['..#', '#.#', '.#.', '#.#', '#..'], '°': ['###', '#.#', '###', '...', '...'], ':': ['.', '#', '.', '#', '.'],
  '-': ['..', '..', '##', '..', '..'], '+': ['...', '.#.', '###', '.#.', '...'], '/': ['..#', '..#', '.#.', '#..', '#..'],
  '.': ['.', '.', '.', '.', '#'], ',': ['.', '.', '.', '#', '#'], '!': ['#', '#', '#', '.', '#'], '?': ['##.', '..#', '.#.', '...', '.#.'],
  $: ['.##', '##.', '.#.', '.##', '##.'], '€': ['.##', '#..', '###', '#..', '.##'], '£': ['.##', '.#.', '###', '.#.', '###'],
  '₹': ['###', '..#', '###', '.#.', '..#'], '#': ['.#.#.', '#####', '.#.#.', '#####', '.#.#.'], '&': ['.#.', '#.#', '.#.', '#.#', '.##'],
  '*': ['#.#', '.#.', '#.#', '...', '...'], "'": ['#', '#', '.', '.', '.'],
}
const F4 = {
  0: ['###', '#.#', '#.#', '###'], 1: ['.#', '##', '.#', '.#'], 2: ['##.', '..#', '.#.', '###'], 3: ['###', '.##', '..#', '###'],
  4: ['#.#', '###', '..#', '..#'], 5: ['###', '##.', '..#', '##.'], 6: ['#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.'],
  8: ['###', '###', '#.#', '###'], 9: ['###', '#.#', '###', '..#'],
  '+': ['...', '.#.', '###', '.#.'], '-': ['..', '..', '##', '..'], '%': ['#.#', '.#.', '.#.', '#.#'], '°': ['###', '#.#', '###', '...'],
  ':': ['.', '#', '.', '#'], '.': ['.', '.', '.', '#'], '!': ['#', '#', '.', '#'], '/': ['..#', '.#.', '.#.', '#..'],
  // 4-row capitals: a calendar header or a label that has no room for five rows
  A: ['.#.', '#.#', '###', '#.#'], B: ['##.', '##.', '#.#', '###'], C: ['.##', '#..', '#..', '.##'], D: ['##.', '#.#', '#.#', '##.'],
  E: ['###', '##.', '#..', '###'], F: ['###', '#..', '##.', '#..'], G: ['.##', '#..', '#.#', '.##'], H: ['#.#', '###', '#.#', '#.#'],
  I: ['#', '#', '#', '#'], J: ['..#', '..#', '#.#', '.#.'], K: ['#.#', '##.', '#.#', '#.#'], L: ['#..', '#..', '#..', '###'],
  M: ['#...#', '##.##', '#.#.#', '#...#'], N: ['#..#', '##.#', '#.##', '#..#'], O: ['.#.', '#.#', '#.#', '.#.'],
  P: ['##.', '#.#', '##.', '#..'], Q: ['.#.', '#.#', '#.#', '.##'], R: ['##.', '#.#', '##.', '#.#'], S: ['.##', '##.', '..#', '##.'],
  T: ['###', '.#.', '.#.', '.#.'], U: ['#.#', '#.#', '#.#', '###'], V: ['#.#', '#.#', '#.#', '.#.'],
  W: ['#...#', '#.#.#', '#.#.#', '.#.#.'], X: ['#.#', '.#.', '#.#', '#.#'], Y: ['#.#', '#.#', '.#.', '.#.'], Z: ['###', '..#', '#..', '###'],
}
// narrow M W N for words that do not fit with the wide ones ("NEW", "MAR" in a 16x16 tile)
const F5N = { ...F5, M: ['#.#', '###', '###', '#.#', '#.#'], W: ['#.#', '#.#', '###', '###', '#.#'], N: ['##.', '#.#', '#.#', '#.#', '#.#'] }
const F4N = { ...F4, M: ['#.#', '###', '###', '#.#'], W: ['#.#', '###', '###', '#.#'], N: ['##.', '#.#', '#.#', '#.#'] }
// condensed: the letters that stay legible two pixels wide (and a one-pixel I), for a word one pixel too long
const F5C = { ...F5N, '°': ['##', '##', '..', '..', '..'], '/': ['.#', '.#', '.#', '#.', '#.'], '#': ['#.#', '###', '#.#', '###', '#.#'], C: ['##', '#.', '#.', '#.', '##'], E: ['##', '#.', '##', '#.', '##'], F: ['##', '#.', '##', '#.', '#.'], I: ['#', '#', '#', '#', '#'], L: ['#.', '#.', '#.', '#.', '##'] }
const F4C = { ...F4N, '/': ['.#', '.#', '#.', '#.'], C: ['##', '#.', '#.', '##'], E: ['##', '##', '#.', '##'], F: ['##', '#.', '##', '#.'], I: ['#', '#', '#', '#'], L: ['#.', '#.', '#.', '##'] }
for (const [f, h] of [[F5, 5], [F5N, 5], [F5C, 5], [F4, 4], [F4N, 4], [F4C, 4]]) Object.defineProperty(f, 'h', { value: h })
const FONTS = [F5, F5N, F5C, F4, F4N, F4C]

// a string of characters in a font -> { w, h, cells: [[i, j]] } or null when a character is missing. With xs (a
// cell offset per glyph, from where the stroke font puts it), each glyph starts no earlier than its offset: the
// pixel word keeps the drawing's own letter spacing (one clear column at least)
function setLine(chars, font, xs = null) {
  const cells = []
  let x = 0, n = 0
  for (const ch of chars) {
    if (ch === ' ') { x += 2; continue }
    const g = font[ch]
    if (!g) return null
    if (x) x += 1
    if (xs) x = Math.max(x, xs[n] ?? 0)
    n++
    g.forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') cells.push([x + i, j]) }))
    x += g[0].length
  }
  return { w: x, h: font.h, cells }
}

const dist2 = (p, a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy
  const t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0
  return (p[0] - a[0] - t * dx) ** 2 + (p[1] - a[1] - t * dy) ** 2
}
const nearLines = (p, lines, tol) => lines.some(l => {
  if (l.pts.length === 1) return dist2(p, l.pts[0], l.pts[0]) <= tol * tol
  for (let k = 0; k + 1 < l.pts.length; k++) if (dist2(p, l.pts[k], l.pts[k + 1]) <= tol * tol) return true
  return false
})

// the first (most legible; or with narrowest, the narrowest) setting of a string in rows-tall pixel letters that is
// at most maxW cells wide, or null
export function fitPixelText(chars, maxW, rows = 5, narrowest = false) {
  for (const f of narrowest ? FONTS.slice().reverse() : FONTS) {
    if (f.h !== rows) continue
    const t = setLine(chars, f)
    if (t && t.w <= maxW) return t
  }
  return null
}

export function pixelText(icon) {
  const glyphs = []
  for (const p of icon.paths || []) {
    const t = textInfo(p)
    if (!t) continue
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const s of p.subs || []) for (const [x, y] of s.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    if (!Number.isFinite(x0)) continue
    glyphs.push({ id: p.id, ch: t.ch, cap: t.cap, plate: p.plate, x0, y0, x1, y1, n: Number(p.id.split(':').pop()) })
  }
  if (!glyphs.length) return null
  // lines: same plate + cap, overlapping vertically; left to right
  const lines = []
  for (const g of glyphs.sort((a, b) => a.n - b.n)) {
    const cy = (g.y0 + g.y1) / 2
    // a sign set smaller than its number ("99+", "72°") stays on the number's line
    const sign = '+°%'.includes(g.ch)
    const ln = lines.find(l => l.plate === g.plate && (Math.abs(l.cap - g.cap) < 0.3 || (sign && g.y0 < l.y1 && g.y1 > l.y0 && g.x0 - l.x1 < l.cap)) && Math.abs(l.cy - cy) < Math.max(l.cap, g.cap) * 0.5)
    if (ln) { ln.glyphs.push(g); ln.x1 = Math.max(ln.x1, g.x1) }
    else lines.push({ plate: g.plate, cap: g.cap, cy, glyphs: [g], x1: g.x1, y0: g.y0, y1: g.y1 })
  }
  for (const l of lines) {
    l.glyphs.sort((a, b) => a.x0 - b.x0)
    l.x0 = Math.min(...l.glyphs.map(g => g.x0)); l.x1 = Math.max(...l.glyphs.map(g => g.x1))
    l.y0 = Math.min(...l.glyphs.map(g => g.y0)); l.y1 = Math.max(...l.glyphs.map(g => g.y1))
    // a word space where the vector glyphs leave a wide gap ("18 30" never happens, "5 M/S" might)
    let s = ''
    l.glyphs.forEach((g, k) => { if (k && g.x0 - l.glyphs[k - 1].x1 > l.cap * 0.9) s += ' '; s += g.ch })
    l.chars = s
    // (two-letter words only: there a narrow I or 1 packed tight pulls its letter away from where it is drawn)
    l.xs = l.glyphs.length === 2 ? l.glyphs.map(g => Math.round((g.x0 - l.x0) / G.P)) : null
  }
  const ids = new Set(glyphs.map(g => g.id))
  const textLines = (icon.lines || []).filter(l => ids.has(l.pathId))
  const cutouts = (icon.cutouts || []).filter(c => {
    const pts = (c.subs || []).flatMap(s => s.pts)
    return !(pts.length && pts.every(p => nearLines(p, textLines, 0.3)))
  })
  return {
    icon: {
      ...icon,
      paths: icon.paths.filter(p => !ids.has(p.id)),
      lines: (icon.lines || []).filter(l => !ids.has(l.pathId)),
      cutouts,
    },
    lines: lines.sort((a, b) => b.cap - a.cap || a.cy - b.cy),
  }
}

// live icons that letter a value on their face: the face is matte (no highlight pixel), so nothing on it moves
// or vanishes when the value changes (a highlight beside a glyph reads as an apostrophe; on a die, as a pip)
export const LABEL_FACE = new Set(['avatar-initials', 'badge-text', 'battery-percent', 'calendar-date', 'calendar-event', 'calendar-month',
  'calendar-range', 'calendar-tear', 'calendar-weekday', 'cellular-tech', 'digital-clock', 'file-type', 'folder-label',
  'humidity', 'keycap', 'map-pin-number', 'percent-badge', 'price-tag', 'progress-ring', 'ribbon-label', 'sale-sticker',
  'speech-bubble-text', 'step-number', 'tag-label', 'ticket-number', 'timer-ring', 'uv-index', 'dice'])

const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]]
const FONT_COST = new Map([[F5, 0], [F5N, 6], [F5C, 9], [F4, 12], [F4N, 16], [F4C, 19]])

// the smallest fill that holds a point (even-odd): the frame a line of text sits in
function containerOf(icon, c) {
  let best = null
  for (const f of icon.fills || []) {
    const rings = (f.subs || []).filter(s => s.closed && s.pts.length > 2)
    if (!rings.length || rings.filter(s => pointInRing(c, s.pts)).length % 2 !== 1) continue
    let area = 0
    for (const s of rings) for (let k = 0; k < s.pts.length; k++) { const a = s.pts[k], b = s.pts[(k + 1) % s.pts.length]; area += a[0] * b[1] - b[0] * a[1] }
    area = Math.abs(area / 2)
    if (!best || area < best.area) best = { rings, area }
  }
  return best
}

// the frame's cells: its covered area plus the outline pixels that hug it
function regionOf(L, rings, sh) {
  const cov = G.coverage(rings.map(s => s.pts), sh)
  const R = G.grid()
  for (let k = 0; k < cov.length; k++) if (cov[k] >= 6) R[k] = 1
  for (let pass = 0; pass < 2; pass++) for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = G.ix(i, j)
    if (L.ink[k] && !R[k] && cov[k] >= 1 && N4.some(([a, b]) => G.get(R, i + a, j + b))) R[k] = 1
  }
  return R
}

const dilate = cells => { const g = G.grid(); for (const [i, j] of cells) for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.inb(i + a, j + b)) g[G.ix(i + a, j + b)] = 1; return g }

// every legible way to set one line; each candidate = { score, mode, glyph: [[i, j]], solid: [[i, j]] (turned ink),
// clear: [[i, j]] (turned paper) }. Modes:
//   on    ink glyphs on the body / paper, one clear pixel all round (free text, or inside its frame)
//   band  the frame's rows behind the line turn solid ink and the glyphs are cut out (a calendar's month header)
//   fill  a badge (S plate) turns solid ink and the glyphs are cut out of it
//   pill  a badge too small for its count grows into a pill around the glyphs, with a one-pixel moat
function candidates(L, ln, icon, sh) {
  const centre = G.toCell([(ln.x0 + ln.x1) / 2, (ln.y0 + ln.y1) / 2], sh)
  const box = containerOf(icon, [(ln.x0 + ln.x1) / 2, (ln.y0 + ln.y1) / 2])
  const R = box ? regionOf(L, box.rings, sh) : null
  const inR = (i, j) => !R || G.get(R, i, j)
  const inner = (i, j) => G.get(R, i, j) && N4.every(([a, b]) => G.get(R, i + a, j + b))
  // ink inside the frame that is not its outline (dots, hands, markers): a band may not swallow it
  const detail = (i, j) => G.get(L.ink, i, j) && R && G.get(R, i, j) && [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]].every(([a, b]) => G.get(R, i + a, j + b))
  const badge = ln.plate === 'S' && R
  const out = []
  for (const font of FONTS) for (const spread of [false, true]) {
    const packed = setLine(ln.chars, font)
    const s = spread ? (ln.xs ? setLine(ln.chars, font, ln.xs) : null) : packed
    if (!s || (spread && packed && s.w === packed.w)) continue
    // cut out of solid ink (band / fill / pill), an 8 is drawn round: its two counters then touch the solid at their
    // corners instead of floating as single-pixel islands inside a knockout that runs into the frame's outline
    const ko = font.h === 5 && ln.chars.includes('8') ? (() => { const f = { ...font, 8: ['.#.', '#.#', '.#.', '#.#', '.#.'] }; return spread ? (ln.xs ? setLine(ln.chars, f, ln.xs) : s) : setLine(ln.chars, f) })() : s
    // the drawing's spacing scores a little better than the tight pack (letters sit where line puts them)
    const fc = FONT_COST.get(font) - (spread ? 3 : 0)
    const i0 = Math.round(centre[0] - s.w / 2), j0 = Math.round(centre[1] - s.h / 2)
    for (let dy = -3; dy <= 3; dy++) for (let dx = -2; dx <= 2; dx++) {
      const glyph = s.cells.map(([i, j]) => [i0 + dx + i, j0 + dy + j])
      if (!glyph.every(([i, j]) => G.inb(i, j))) continue
      // glyphs on the canvas edge read as cut off (and a live icon may not lean on the edge): a narrower font wins
      const off = 5 * Math.abs(dx) + 4 * Math.abs(dy) + (glyph.some(([i, j]) => i === 0 || j === 0 || i === N - 1 || j === N - 1) ? 30 : 0)
      if (badge) {
        if (glyph.every(([i, j]) => inner(i, j))) {
          const solid = []
          for (let k = 0; k < N * N; k++) if (R[k]) solid.push([k % N, (k - k % N) / N])
          out.push({ score: 100 - fc - off, mode: 'fill', glyph: ko.cells.map(([i, j]) => [i0 + dx + i, j0 + dy + j]), solid, clear: [] })
        }
        continue
      }
      if (glyph.every(([i, j]) => inR(i, j) && !G.get(L.ink, i, j) && !N4.some(([a, b]) => G.get(L.ink, i + a, j + b))))
        out.push({ score: 100 - fc - off, mode: 'on', glyph, solid: [], clear: [] })
      // last resort inside a frame: glyphs may touch its outline (never a detail inside it)
      else if (R && glyph.every(([i, j]) => G.get(R, i, j) && !G.get(L.ink, i, j) && !N4.some(([a, b]) => detail(i + a, j + b))))
        out.push({ score: 35 - fc - off, mode: 'on', glyph, solid: [], clear: [] })
      // a word wider than its frame: the live skeleton opens the frame's sides for it (forge/DYNAMIC.md), so the
      // glyphs may run out through the opening, as long as they keep a clear pixel from every line
      else if (R && glyph.every(([i, j]) => !G.get(L.ink, i, j) && !N4.some(([a, b]) => G.get(L.ink, i + a, j + b))))
        out.push({ score: 58 - fc - off, mode: 'on', glyph, solid: [], clear: [] })
      if (R && glyph.every(([i, j]) => inner(i, j))) {
        const t = j0 + dy - 1, b = j0 + dy + s.h, solid = []
        for (let j = t; j <= b; j++) for (let i = 0; i < N; i++) if (G.get(R, i, j)) solid.push([i, j])
        const halo = dilate(solid)
        let ok = true
        for (let k = 0; k < N * N && ok; k++) if (halo[k] && detail(k % N, (k - k % N) / N)) ok = false
        if (ok) out.push({ score: 72 - fc - off, mode: 'band', glyph: ko.cells.map(([i, j]) => [i0 + dx + i, j0 + dy + j]), solid, clear: [] })
      }
    }
    // a pill sized to the glyphs, centred on the badge and kept on the grid; a pill wider than its badge may slide a
    // cell along the row, toward where it cuts less of the drawing around it (its moat clears that ink)
    if (badge) {
      const w = s.w + 2, h = s.h + 2
      if (w > N || h > N) continue
      const pc = Math.max(0, Math.min(N - w, Math.round(centre[0] - w / 2))), pj = Math.max(0, Math.min(N - h, Math.round(centre[1] - h / 2)))
      for (const pi of [pc, pc + 1, pc - 1]) {
        if (pi < 0 || pi > N - w) continue
        const solid = []
        for (let j = pj; j < pj + h; j++) for (let i = pi; i < pi + w; i++) {
          if ((i === pi || i === pi + w - 1) && (j === pj || j === pj + h - 1)) continue
          solid.push([i, j])
        }
        const glyph = ko.cells.map(([i, j]) => [pi + 1 + i, pj + 1 + j])
        const pill = G.grid(); for (const [i, j] of solid) pill[G.ix(i, j)] = 1
        const moat = dilate(solid), clear = []
        let cut = 0
        for (let k = 0; k < N * N; k++) if ((moat[k] || R[k]) && !pill[k]) { clear.push([k % N, (k - k % N) / N]); if (L.ink[k] && !R[k]) cut++ }
        for (let k = 0; k < N * N; k++) if (pill[k] && L.ink[k] && !R[k]) cut++
        // a slid pill may not lean on the canvas edge more than the drawing already does (a corner cell or two)
        if (pi !== pc) {
          let edge = 0
          const cl = G.grid(); for (const [i, j] of clear) cl[G.ix(i, j)] = 1
          for (let k = 0; k < N * N; k++) { const i = k % N, j = (k - i) / N; if ((i === 0 || j === 0 || i === N - 1 || j === N - 1) && (pill[k] || (L.ink[k] && !cl[k]))) edge++ }
          if (edge > 6) continue
        }
        const off = Math.abs(pi + w / 2 - centre[0]) + Math.abs(pj + h / 2 - centre[1])
        out.push({ score: 60 - solid.length / 2 - 2 * off - (pi === pc ? 0 : 1) - (w > 10 ? 1.5 * cut : 0), mode: 'pill', glyph, solid, clear })
      }
    }
  }
  // the same cells from two fonts (no M, W or N in the line): keep the better one
  const seen = new Map()
  for (const c of out) {
    c.cells = [...c.glyph, ...c.solid]
    const key = c.mode + ':' + c.cells.map(([i, j]) => G.ix(i, j)).sort((a, b) => a - b).join(',')
    if (!seen.has(key) || seen.get(key).score < c.score) seen.set(key, c)
  }
  return [...seen.values()].sort((a, b) => b.score - a.score).slice(0, 40).map(c => {
    c.occ = G.grid(); for (const [i, j] of [...c.cells, ...c.clear]) c.occ[G.ix(i, j)] = 1
    c.halo = dilate([...c.glyph, ...c.solid])
    return c
  })
}

const clash = (a, b) => { for (let k = 0; k < N * N; k++) if ((a.occ[k] && b.halo[k]) || (b.occ[k] && a.halo[k])) return true; return false }

// stamp the lines onto the layered grids (before finish()). All lines are placed together: the best total, where
// the biggest line (the day of a calendar) counts double and a line that cannot be set legibly is left out.
export function stampText(L, lines, icon, sh = [0, 0]) {
  L.text = G.grid() // the glyph pixels (finish() keeps highlight pixels away from them)
  const cands = lines.map(ln => candidates(L, ln, icon, sh))
  const weight = lines.map((_, k) => k === 0 ? 2 : 1)
  const maxRest = cands.map((_, k) => cands.slice(k).reduce((s, c, m) => s + (c[0] ? c[0].score * weight[k + m] : 0), 0))
  let best = { score: -1, pick: [] }
  const pick = []
  const walk = (k, score) => {
    if (score + (maxRest[k] || 0) <= best.score) return
    if (k === cands.length) { best = { score, pick: pick.slice() }; return }
    for (const c of cands[k]) {
      if (pick.some(p => p && clash(p, c))) continue
      pick.push(c); walk(k + 1, score + c.score * weight[k]); pick.pop()
    }
    pick.push(null); walk(k + 1, score); pick.pop()
  }
  walk(0, 0)
  const set = (i, j, ink) => { const k = G.ix(i, j); L.ink[k] = ink; L.tone[k] = 0; if (L.glint) L.glint[k] = 0 }
  // a frame whose text was left out may be open where the text was meant to bridge it (a file type's label
  // sticks out of the page): its body gets an outline instead of bleeding into the paper
  lines.forEach((ln, k) => {
    if (best.pick[k]) return
    const box = containerOf(icon, [(ln.x0 + ln.x1) / 2, (ln.y0 + ln.y1) / 2])
    if (!box) return
    const R = regionOf(L, box.rings, sh), edge = [], body = []
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const k = G.ix(i, j)
      if (!R[k] || L.ink[k]) continue
      if (N4.some(([a, b]) => !G.get(R, i + a, j + b))) edge.push([i, j])
      else if (!L.tone[k]) body.push(k)
    }
    for (const [i, j] of edge) set(i, j, 1)
    for (const k of body) L.tone[k] = 1
  })
  for (const c of best.pick) if (c) for (const [i, j] of c.clear) set(i, j, 0)
  for (const c of best.pick) {
    if (!c) continue
    for (const [i, j] of c.solid) set(i, j, 1)
    for (const [i, j] of c.glyph) { set(i, j, c.mode === 'on' ? 1 : 0); L.text[G.ix(i, j)] = 1 }
  }
}


// a highlight pixel next to a glyph reads as an apostrophe: it goes back to body tone
export function clearShine(S, text) {
  if (!text) return S
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const k = G.ix(i, j)
    if (!S.shine[k]) continue
    let near = false
    for (let b = -2; b <= 2 && !near; b++) for (let a = -2; a <= 2; a++) if (G.get(text, i + a, j + b)) { near = true; break }
    if (near) { S.shine[k] = 0; S.tone[k] = 1 }
  }
  return S
}
