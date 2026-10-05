// PIXEL — hand-drawn sprites for Live icons (forge/DYNAMIC.md).
//
// A live generator draws its picture from geometry, and some of those pictures do not survive a 16x16 grid: a sun
// whose 1u rays become stray dots, a lightning bolt that breaks into steps, a compact cloud three pixels tall. For
// those, pixel draws the picture part from a sprite chosen by the params (the value text is still set by
// _pixel-text.mjs on top, so every value works). Sprites are in CANVAS cells (cell i spans 1.5i..1.5i+1.5u), drawn
// against the line render of the same skeleton so every part sits where line puts it.
//   '#' ink   '+' body tone   'o' a highlight (glint)   '.' paper
//
//   liveSprite(icon) -> rows (16 strings) | null

import * as G from './_pixel-core.mjs'
import { pixelText, fitPixelText } from './_pixel-text.mjs'

const pad = rows => { const out = rows.map(r => (r + '.'.repeat(16)).slice(0, 16)); while (out.length < 16) out.push('.'.repeat(16)); return out }

// weather: compact glyph in the top band (rows 0..8, the temperature sits on rows 10..14), or full size
const WEATHER_COMPACT = {
  // a sun peeking from behind the cloud's top-left lobe; three short rays
  partly: [
    '................',
    '................',
    '.....#..........',
    '...#.....###....',
    '.....#..#+++#...',
    '..#.#+.##+++##..',
    '....#+#++++++#..',
    '......#++++++#..',
    '...#...######...',
  ],
  rain: [
    '................',
    '......####......',
    '....##++++##....',
    '...#++++++++#...',
    '...#++++++++#...',
    '....########....',
    '.....#...#......',
    '....#...#.......',
    '...#...#........',
  ],
  // a two-lobed cloud and a lightning bolt out of it: down, a step to the side, down
  storm: [
    '................',
    '......##.###....',
    '....##++#+++#...',
    '...#+++++++++#..',
    '....#####++##...',
    '.........##.....',
    '........###.....',
    '.........#......',
    '........#.......',
  ],
  // a crescent with its sparkle and a star dot, as line draws them
  night: [
    '................',
    '....###.....#...',
    '...#+#.....###..',
    '..#+#.......#...',
    '..#+#...........',
    '..#++#......#...',
    '..#+++####......',
    '...#++++#.......',
    '....####........',
  ],
  snow: [
    '................',
    '......####......',
    '....##++++##....',
    '...#++++++++#...',
    '...#++++++++#...',
    '....########....',
    '................',
    '................',
    '....#..#..#.....',
  ],
}
const WEATHER_FULL = {
  partly: [
    '................',
    '......#.........',
    '................',
    '...#.....#......',
    '.....###........',
    '....#+++........',
    '..#.#++.####....',
    '......#++++#....',
    '....###++++###..',
    '...#++++++++++#.',
    '...#++++++++++#.',
    '...#++++++++++#.',
    '....#++++++++#..',
    '.....########...',
  ],
  storm: [
    '................',
    '.......####.....',
    '.....##++++##...',
    '....#++++++++#..',
    '..##++++++++++#.',
    '.#++++++++++++#.',
    '.#++++++++++++#.',
    '.#+++++++++++#..',
    '..#####..####...',
    '.......##.......',
    '......##........',
    '.....#####......',
    '.......##.......',
    '......##........',
    '......#.........',
  ],
  // a crescent (outer disc minus the bite) and a sparkle
  night: [
    '................',
    '................',
    '......#.....#...',
    '....##.....###..',
    '...#+#......#...',
    '..#++#..........',
    '..#++#..........',
    '.#++++#.........',
    '.#+++++#........',
    '.#++++++#####...',
    '..#+++++++++#...',
    '..#++++++++#....',
    '...#++++++##....',
    '....######......',
  ],
}

export function liveSprite(icon) {
  const p = icon && icon.params
  if (!p) return null
  if (icon.name === 'weather') {
    const set = p.showTemperature === false ? WEATHER_FULL : WEATHER_COMPACT
    const s = set[p.condition]
    return s ? pad(s) : null
  }
  return null
}

// ── calendars ───────────────────────────────────────────────────────────────────────────────────────────
// One pixel calendar for the family (line frame 2.5..21.5 x 3..21, rings at x 8 / 16): a 14x14 page on cells
// 1..14 with cut corners and two ring tabs. A calendar that names its month / weekday gets a solid header band
// (rows 1..6) with the name knocked out in 4-row capitals, and the day in 5-row digits on the page below; a range
// stacks its two days in 4-row digits beside a bracket; an event shows its day over its marker or label; a month view shows its day marks as pixels (the marked
// day a 2x2 block). The text comes from the skeleton's glyphs, so a calendar with no text keeps the same page.
const CAL = new Set(['calendar-date', 'calendar-weekday', 'calendar-month', 'calendar-range', 'calendar-event'])
const HEAD = new Set(['calendar-date', 'calendar-weekday', 'calendar-month'])

function calendar(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), text = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const T = pixelText(icon)
  const lines = T ? T.lines : [], rest = T ? T.icon : icon
  const head = HEAD.has(icon.name)
  const rings = (rest.lines || []).some(l => l.pts.length && l.pts.every(p => p[1] < 3.6))
  const top = head ? 1 : 2
  // page: outline + body
  for (let i = 2; i <= 13; i++) { put(ink, i, top); put(ink, i, 14) }
  for (let j = top + 1; j <= 13; j++) { put(ink, 1, j); put(ink, 14, j); for (let i = 2; i <= 13; i++) put(tone, i, j) }
  if (head) for (let j = 2; j <= 6; j++) for (let i = 2; i <= 13; i++) { put(ink, i, j); put(tone, i, j, 0) }
  if (rings) for (const i of [5, 10]) for (let j = 0; j < top; j++) put(ink, i, j)
  const cellX = x => x / G.P, cellY = y => y / G.P
  const stamp = (t, i0, j0, knock) => {
    for (const [a, b] of t.cells) { const i = i0 + a, j = j0 + b; put(ink, i, j, knock ? 0 : 1); put(tone, i, j, 0); put(text, i, j) }
  }
  const place = (t, cx, lo, hi) => Math.max(lo, Math.min(hi - t.w + 1, Math.round(cellX(cx) - t.w / 2)))
  if (head) {
    const name = lines.filter(l => (l.y0 + l.y1) / 2 < 11.5).sort((a, b) => a.cy - b.cy)[0]
    const day = lines.find(l => l !== name && (l.y0 + l.y1) / 2 >= 11.5)
    if (name) { const t = fitPixelText(name.chars, 12, 4); if (t) stamp(t, place(t, (name.x0 + name.x1) / 2, 2, 13), 2, true) }
    if (day) { const t = fitPixelText(day.chars, 10, 5) || fitPixelText(day.chars, 10, 4); if (t) stamp(t, place(t, (day.x0 + day.x1) / 2, 3, 12), 8, false) }
    // a month view's day marks
    for (const l of rest.lines || []) {
      if (!l.pts.length || l.pts.some(p => p[1] < 11)) continue
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      if (l.closed && x1 - x0 > 0.75) { const i = Math.floor(cellX(cx) - 0.5), j = Math.floor(cellY(cy) - 0.5); for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { put(ink, i + a, j + b); put(tone, i + a, j + b, 0) } }
      else if (x1 - x0 < 1 && y1 - y0 < 1) { const i = Math.floor(cellX(cx)), j = Math.floor(cellY(cy)); put(ink, i, j); put(tone, i, j, 0) }
    }
  } else if (icon.name === 'calendar-event') {
    // an event: the day (5-row digits, or 4-row when a label shares the page) and its marker or label below
    const ls = lines.slice().sort((a, b) => a.cy - b.cy)
    const day = ls[0], label = ls[1]
    if (day) { const t = fitPixelText(day.chars, 10, label ? 4 : 5) || fitPixelText(day.chars, 10, 4); if (t) stamp(t, place(t, (day.x0 + day.x1) / 2, 3, 12), 4, false) }
    if (label) { const t = fitPixelText(label.chars, 12, 4); if (t) stamp(t, place(t, (label.x0 + label.x1) / 2, 2, 13), 9, false) }
    for (const l of rest.lines || []) {
      if (l.plate !== 'A' || !l.pts.length || l.pts.some(p => p[1] < 14)) continue
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
      const cells = l.closed ? [[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => [Math.floor(cellX(cx) - 0.5) + a, Math.floor(cellY(cy) - 0.5) + b])
        : x1 - x0 < 1 ? [[Math.floor(cellX(cx)), Math.floor(cellY(cy))]]
          : Array.from({ length: Math.floor(cellX(x1)) - Math.floor(cellX(x0)) + 1 }, (_, k) => [Math.floor(cellX(x0)) + k, Math.floor(cellY(cy))])
      for (const [i, j] of cells) { put(ink, i, j); put(tone, i, j, 0) }
    }
  } else {
    // a range: the two days stacked beside a bracket
    const ls = lines.slice().sort((a, b) => a.cy - b.cy)
    const bracket = (rest.lines || []).some(l => l.pts.length && l.pts.every(p => p[0] < 7.75 && p[1] > 4))
    if (bracket) for (let j = 5; j <= 10; j++) put(ink, 4, j), put(tone, 4, j, 0)
    const lo = bracket ? 6 : 3
    ls.slice(0, 2).forEach((l, k) => {
      const t = fitPixelText(l.chars, 13 - lo, 4)
      if (t) stamp(t, place(t, (l.x0 + l.x1) / 2, lo, 12), k === 0 && ls.length > 1 ? 4 : ls.length > 1 ? 9 : 6, false)
    })
  }
  return { ink, tone, glint, text }
}

// ── thermometer ─────────────────────────────────────────────────────────────────────────────────────────
// A slim pixel thermometer (3-cell tube: two walls and a glass cell; a 5-cell bulb) on the left, the mercury in the
// shade tone (the empty glass above it clear), so a reading as wide as "104" or
// "-99" still fits beside it in 5-row digits; the mercury column rises a cell at a time. Without a reading the
// thermometer stands in the middle with its three scale ticks (the nearest one long), as line draws it.
function thermometer(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), mercury = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const T = pixelText(icon)
  const rest = T ? T.icon : icon
  let x0 = Infinity, x1 = -Infinity
  for (const r of rest.fillSet || []) for (const [x] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x) }
  const c = Number.isFinite(x0) ? (x0 + x1) / 2 : 6.5
  const tc = c < 8 ? 3 : 6
  // tube (round top) and bulb, drawn when the skeleton has them
  if ((rest.lines || []).some(l => l.plate === 'K' && l.closed)) {
    put(ink, tc, 1)
    for (let j = 2; j <= 10; j++) { put(ink, tc - 1, j); put(ink, tc + 1, j) }
    put(ink, tc - 2, 10); put(ink, tc + 2, 10)
    for (let j = 11; j <= 13; j++) { put(ink, tc - 2, j); put(ink, tc + 2, j); for (let i = tc - 1; i <= tc + 1; i++) put(tone, i, j) }
    for (let i = tc - 1; i <= tc + 1; i++) put(ink, i, 14)
  }
  if ((rest.lines || []).some(l => l.plate === 'A' && l.closed)) put(mercury, tc, 12) // the bulb's own drop (line's inner dot)
  // mercury: the A-plate column (x = the tube centre) rises to its top
  let top = null
  for (const l of rest.lines || []) {
    if (l.plate !== 'A' || l.closed || l.pts.length !== 2) continue
    const [[ax, ay], [bx, by]] = l.pts
    if (Math.abs(ax - bx) < 0.01 && Math.abs(ax - c) < 0.6 && Math.abs(ay - by) > 0.01) top = Math.min(ay, by)
  }
  if (top !== null) {
    for (let j = Math.max(2, Math.round(top / G.P)); j <= 10; j++) put(mercury, tc, j)
    for (let j = 11; j <= 13; j++) for (let i = tc - 1; i <= tc + 1; i++) put(mercury, i, j)
  }
  // scale ticks (no reading): short horizontal A lines right of the tube
  for (const l of rest.lines || []) {
    if (l.plate !== 'A' || l.pts.length !== 2) continue
    const [[ax, ay], [bx, by]] = l.pts
    if (Math.abs(ay - by) > 0.01 || Math.min(ax, bx) < c + 4) continue
    const j = Math.floor(ay / G.P)
    for (let i = Math.floor(Math.min(ax, bx) / G.P); i <= Math.ceil(Math.max(ax, bx) / G.P) - 1; i++) put(ink, i, j)
  }
  return { ink, tone, glint, text: null, T, rest, shade: mercury }
}

// ── dice ────────────────────────────────────────────────────────────────────────────────────────────────
// A square die (cells 2..13, cut corners) with 2x2 pips on a 3x3 grid, each pip where the skeleton puts one
// (a tilted die stays square: a 12deg turn has no clean pixel form; its pips still land on the nearest slots)
function dice(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  if ((icon.lines || []).some(l => l.plate === 'K' && l.closed)) {
    for (let i = 3; i <= 12; i++) { put(ink, i, 2); put(ink, i, 13) }
    for (let j = 3; j <= 12; j++) { put(ink, 2, j); put(ink, 13, j); for (let i = 3; i <= 12; i++) put(tone, i, j) }
  }
  const slot = v => v < 9.6 ? 4 : v < 14.4 ? 7 : 10
  // the frame's turn (its long straight edges), undone around its centre
  const fr = (icon.lines || []).find(l => l.plate === 'K' && l.closed)
  let th = 0, cx = 12, cy = 12
  if (fr) {
    let n = 0, sx = 0, sy = 0, best = 0
    for (const [x, y] of fr.pts) { sx += x; sy += y; n++ }
    cx = sx / n; cy = sy / n
    fr.pts.forEach((p, k) => {
      const q = fr.pts[(k + 1) % fr.pts.length], L = Math.hypot(q[0] - p[0], q[1] - p[1])
      if (L <= best) return
      best = L
      let a = Math.atan2(q[1] - p[1], q[0] - p[0])
      while (a > Math.PI / 4) a -= Math.PI / 2
      while (a < -Math.PI / 4) a += Math.PI / 2
      th = a
    })
  }
  for (const l of icon.lines || []) {
    if (l.plate !== 'A' || !l.pts.length) continue
    let x = 0, y = 0
    for (const [a, b] of l.pts) { x += a; y += b }
    x /= l.pts.length; y /= l.pts.length
    const dx = x - cx, dy = y - cy, co = Math.cos(-th), si = Math.sin(-th)
    x = 12 + dx * co - dy * si; y = 12 + dx * si + dy * co
    const i = slot(x), j = slot(y)
    for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { put(ink, i + a, j + b); put(tone, i + a, j + b, 0) }
  }
  return { ink, tone, glint, text: null }
}

// ── UV index ────────────────────────────────────────────────────────────────────────────────────────────
// A solid 10-cell sun disc with the index knocked out of it (two digits fit, one sits centred) and eight
// one-pixel rays where line puts them
function uvIndex(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), text = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const T = pixelText(icon), rest = T ? T.icon : icon
  if ((rest.lines || []).some(l => l.plate === 'K' && l.closed)) {
    const span = [[5, 10], [4, 11], [3, 12], [3, 12], [3, 12], [3, 12], [3, 12], [3, 12], [4, 11], [5, 10]]
    span.forEach(([a, b], k) => { for (let i = a; i <= b; i++) put(ink, i, 3 + k) })
  }
  for (const l of rest.lines || []) {
    if (l.plate !== 'A' || l.closed || l.pts.length !== 2) continue
    const [x, y] = l.pts[1]
    put(ink, Math.max(1, Math.min(14, Math.floor(x / G.P))), Math.max(1, Math.min(14, Math.floor(y / G.P))))
  }
  const ln = T && T.lines[0]
  if (ln) {
    const t = fitPixelText(ln.chars, 8, 5) || fitPixelText(ln.chars, 8, 4)
    if (t) {
      const i0 = Math.max(4, Math.min(12 - t.w, Math.round((ln.x0 + ln.x1) / 2 / G.P - t.w / 2))), j0 = t.h === 5 ? 6 : 6
      for (const [a, b] of t.cells) { put(ink, i0 + a, j0 + b, 0); put(text, i0 + a, j0 + b) }
    }
  }
  return { ink, tone, glint, text }
}

// ── bar values ──────────────────────────────────────────────────────────────────────────────────────────
// 2-cell bars on a shared bottom, each at the slot its own x maps to (3, 4 or 5 bars land evenly across cells 1..14) (and the baseline under them); each bar's top is set to the half
// cell: a top that covers half a cell is drawn in the shade tone, so a 5% step always shows
function barValues(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), half = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const bars = [], base = []
  for (const l of icon.lines || []) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    if (l.plate === 'K' && l.closed) bars.push({ x: (x0 + x1) / 2, top: y0, bot: y1 })
    else if (y1 - y0 < 0.01) base.push({ x0, x1, y: y0 })
  }
  bars.sort((a, b) => a.x - b.x)
  const n = bars.length
  if (!n) return null
  const i0 = 1, span = 14
  bars.forEach(b => {
    const c = Math.max(1, Math.min(13, 1 + Math.round((b.x - 4) * 0.75))), bot = Math.floor(b.bot / G.P - 0.01), t = (b.top - 0.875) / G.P
    for (let j = 0; j <= bot; j++) {
      const cov = Math.max(0, Math.min(1, j + 1 - t))
      if (cov >= 0.75) { put(ink, c, j); put(ink, c + 1, j) } else if (cov >= 0.25) { put(half, c, j); put(half, c + 1, j) }
    }
  })
  for (const b of base) { const j = Math.floor(b.y / G.P); for (let i = i0; i < i0 + span; i++) put(ink, i, j) }
  return { ink, tone, glint, text: null, shade: half }
}

// ── tag label ───────────────────────────────────────────────────────────────────────────────────────────
// A pixel tag (cut top corners, a 2x2 eyelet) with the word on its body; a word wider than the body runs out
// through the sides, which open around it as line's do
function tagLabel(icon) {
  const ink = G.grid(), tone = G.grid(), glint = G.grid(), text = G.grid()
  const put = (g, i, j, v = 1) => { if (G.inb(i, j)) g[G.ix(i, j)] = v }
  const T = pixelText(icon), rest = T ? T.icon : icon
  const ln = T && T.lines[0]
  // on the body with a clear cell to the sides, else touching them, else on a tag widened to line's full frame
  // (walls on cells 1 and 14) with the word on its body, else the narrowest setting through the opened sides
  let t = ln ? (fitPixelText(ln.chars, 8, 5) || fitPixelText(ln.chars, 10, 5)) : null
  let wideTag = false
  if (ln && !t) { t = fitPixelText(ln.chars, 12, 5) || fitPixelText(ln.chars, 12, 4); wideTag = !!t }
  if (ln && !t) t = fitPixelText(ln.chars, 15, 5, true) || fitPixelText(ln.chars, 16, 4, true)
  const xl = wideTag ? 1 : 2, xr = wideTag ? 14 : 13
  const i0 = t ? Math.max(0, Math.min(16 - t.w, Math.round(7.5 - (t.w - 1) / 2))) : 0, j0 = t && t.h === 4 ? 9 : 8
  const wide = t && (i0 <= xl || i0 + t.w - 1 >= xr)
  const open = j => wide && j >= j0 - 1 && j <= j0 + t.h
  for (let i = 5; i <= 10; i++) put(ink, i, 2)
  put(ink, 4, 3); put(ink, 11, 3); put(ink, 3, 4); put(ink, 12, 4)
  if (wideTag) { put(ink, 2, 5); put(ink, 13, 5) }
  for (let j = wideTag ? 6 : 5; j <= 13; j++) if (!open(j)) { put(ink, xl, j); put(ink, xr, j) }
  for (let i = xl + 1; i <= xr - 1; i++) put(ink, i, 14)
  for (let j = 3; j <= 13; j++) for (let i = xl + 1; i <= xr - 1; i++) if ((j > 3 || (i > 4 && i < 11)) && (j > 4 || (i > 3 && i < 12)) && (j > 5 || !wideTag || (i > 2 && i < 13))) put(tone, i, j)
  if ((rest.lines || []).some(l => l.closed && l.plate === 'A')) for (const [a, b] of [[7, 4], [8, 4], [7, 5], [8, 5]]) { put(ink, a, b); put(tone, a, b, 0) }
  if (t) for (const [a, b] of t.cells) { put(ink, i0 + a, j0 + b); put(tone, i0 + a, j0 + b, 0); put(text, i0 + a, j0 + b) }
  return { ink, tone, glint, text }
}

// a composed live icon: { ink, tone, glint, text } before lighting (text: the cells of stamped glyphs; or
// T + rest when the caller still has to stamp the text), or null
export function liveCompose(icon) {
  if (!icon || !icon.params) return null
  if (CAL.has(icon.name)) return calendar(icon)
  if (icon.name === 'thermometer-level') return thermometer(icon)
  if (icon.name === 'dice') return dice(icon)
  if (icon.name === 'uv-index') return uvIndex(icon)
  if (icon.name === 'bar-values') return barValues(icon)
  if (icon.name === 'tag-label') return tagLabel(icon)
  return null
}

// ── clock hands ─────────────────────────────────────────────────────────────────────────────────────────
// A clock's hands are its value: a 1u-long hour hand rasterises to a single pixel that hides in the face. Live
// clocks take their hands (A-plate segments that start or pass at the face centre) out of the generic raster and
// draw them from the centre cell, each hand at least two cells long, so every time reads at 16-24px.
const CLOCKS = new Set(['alarm-clock-time', 'clock-time', 'watch-time'])
export function liveHands(icon) {
  if (!icon || !icon.params || !CLOCKS.has(icon.name)) return null
  const face = (icon.lines || []).find(l => l.plate === 'K' && l.closed)
  if (!face) return null
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of face.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  const c = [(x0 + x1) / 2, (y0 + y1) / 2], R = Math.min(x1 - x0, y1 - y0) / 2
  const segDist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy, t = L ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L)) : 0; return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy) }
  const hands = [], keep = []
  for (const l of icon.lines || []) {
    const isHand = l.plate === 'A' && !l.closed && l.pts.length === 2 && segDist(c, l.pts[0], l.pts[1]) < 1.25 && Math.hypot(l.pts[1][0] - l.pts[0][0], l.pts[1][1] - l.pts[0][1]) < 2 * R
    if (!isHand) { keep.push(l); continue }
    for (const p of l.pts) if (Math.hypot(p[0] - c[0], p[1] - c[1]) > 0.75) hands.push(p)
  }
  if (!hands.length) return null
  return { icon: { ...icon, lines: keep }, c, hands, face: face.pts }
}
// Pixel hands are clean pixel rays on a flat paper dial (no body tone, shade or highlight inside the face ring:
// the ink hands never sit on a busy surface). A hand is a straight ray of cells from a single hub cell in one of 24
// directions (15deg steps; one cell per step along the main axis, the cross axis rounded from the true angle), so
// it leaves the hub at once in its own direction and two hands part right at the hub. The minute hand is one cell
// thin and runs to one cell short of the rim; the hour hand is a step shorter and two cells thick, doubled on the
// side turned away from the minute hand and never touching it. Both angles are floored (an analogue clock reads
// "past"), so 23:59 shows 11 and 59 minutes, never 12:00. Four tick pixels (12 / 3 / 6 / 9) sit inside the rim
// where the face has room.
const rot = ([x, y], q) => { for (let k = 0; k < q; k++) [x, y] = [-y, x]; return [x, y] }
const ray = deg => {
  const a = (Math.round(deg / 15) * 15) * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), out = []
  const xm = Math.abs(dx) >= Math.abs(dy)
  for (let k = 1; k <= 7; k++) out.push(xm ? [Math.sign(dx) * k, Math.round(k * dy / Math.abs(dx))] : [Math.round(k * dx / Math.abs(dy)), Math.sign(dy) * k])
  return out
}
// The dial is flat paper: the body tone (and so its shade and highlight) is cleared inside the face ring, flooding
// from the centre cell and the cells well inside the ring; only the case outside the ring (bells, crown, lugs, strap) keeps its tone.
export function clearDial(L, face, sh, ci, cj) {
  const cov = G.coverage([face], sh), dial = G.grid(), st = []
  const go = (i, j) => { if (!G.inb(i, j)) return; const k = G.ix(i, j); if (dial[k] || L.ink[k] || cov[k] < 4) return; dial[k] = 1; st.push([i, j]) }
  go(ci, cj)
  for (let k = 0; k < cov.length; k++) if (cov[k] >= 14) go(k % G.N, (k - k % G.N) / G.N)
  while (st.length) { const [i, j] = st.pop(); for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) go(i + a, j + b) }
  for (let k = 0; k < dial.length; k++) if (dial[k]) { L.tone[k] = 0; if (L.glint) L.glint[k] = 0 }
}
// a stopwatch's dial: its largest closed K-plate ring
export function stopwatchDial(L, icon, sh) {
  let best = null, area = 0
  for (const l of icon.lines || []) {
    if (l.plate !== 'K' || !l.closed || !l.pts || l.pts.length < 6) continue
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of l.pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    if ((x1 - x0) * (y1 - y0) > area) { area = (x1 - x0) * (y1 - y0); best = { pts: l.pts, c: [(x0 + x1) / 2, (y0 + y1) / 2] } }
  }
  if (!best) return
  const cc = G.toCell(best.c, sh)
  clearDial(L, best.pts, sh, Math.floor(cc[0]), Math.floor(cc[1]))
}
const HOUR_STEPS = n => Math.max(2, n - 1)
export function drawHands(L, H, sh, params = {}) {
  const cc = G.toCell(H.c, sh), ci = Math.floor(cc[0]), cj = Math.floor(cc[1])
  const face = G.copy(L.ink)
  if (H.face) clearDial(L, H.face, sh, ci, cj)
  const put = (i, j) => { if (G.inb(i, j)) { const k = G.ix(i, j); L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0 } }
  const m = String(params.time || '10:10').match(/^(\d{1,2}):(\d{2})$/) || [0, 10, 10]
  const hh = (+m[1]) % 12, mm = Math.min(59, +m[2])
  const minDeg = Math.floor(mm / 2.5) * 15, hourDeg = (hh * 30 + Math.floor(mm / 30) * 15) % 360
  // the room in a direction: distance from the centre cell to the face's ink along the true ray
  const room = deg => {
    const a = deg * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a)
    for (let t = 0.5; t < 12; t += 0.25) { const i = Math.floor(ci + 0.5 + dx * t), j = Math.floor(cj + 0.5 + dy * t); if (!G.inb(i, j) || face[G.ix(i, j)]) return t }
    return 12
  }
  // a hand runs while its cells keep clear of the rim (no rim ink on their eight sides): the minute hand ends one
  // cell short of the rim, with a cell of paper between its tip and the rim
  const near = (g, i, j) => { for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(g, i + a, j + b)) return true; return false }
  const clear = (i, j) => G.inb(i, j) && !face[G.ix(i, j)] && !near(face, i, j)
  const clear4 = (i, j) => G.inb(i, j) && !face[G.ix(i, j)] && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([a, b]) => !G.get(face, i + a, j + b))
  const run = (deg, n, ok = clear) => { const out = []; for (const [a, b] of ray(deg)) { if (out.length >= n || !ok(ci + a, cj + b)) break; out.push([a, b]) } return out }
  const min = run(minDeg, 5, clear4)
  // the hour hand is a step shorter than the minute hand, and its tip a cell nearer the hub
  const mtip = min.length ? Math.hypot(...min.at(-1)) : 1
  // hands 30deg apart or less cannot keep paper between them in a 16-cell grid: the hour hand is then drawn on the
  // minute hand's line, as its thick base, doubled on the side the true hour hand lies (6:30 is one hand down,
  // heavy at the hub end; 11:59 and 12:00 one hand up)
  const gap = ((hourDeg - minDeg) % 360 + 360) % 360, over = gap <= 30 || gap >= 330
  const hourAt = over ? minDeg : hourDeg
  const hour = run(hourAt, HOUR_STEPS(min.length), clear4).filter(([a, b], k) => !k || Math.hypot(a, b) <= mtip - 1)
  // the hub is one ink cell; the minute hand is one cell thin
  put(ci, cj)
  const M = G.grid()
  for (const [a, b] of min) { put(ci + a, cj + b); if (G.inb(ci + a, cj + b)) M[G.ix(ci + a, cj + b)] = 1 }
  for (const [a, b] of hour) put(ci + a, cj + b)
  // the hour hand is two cells thick past the hub's ring of cells (a one-step hour hand right beside it), doubled on the side turned away from the minute
  // hand; a doubling cell that would touch the minute hand is left out, so paper always parts the two hands
  const hd = ((hourAt % 360) + 360) % 360
  const side = over ? (gap >= 330 ? -1 : 1) : ((minDeg - hourDeg + 360) % 360) < 180 ? -1 : 1
  const ha = hd * Math.PI / 180, cx = Math.cos(ha) * side, cy = Math.sin(ha) * side
  const off = Math.abs(Math.sin(ha)) >= Math.abs(Math.cos(ha)) ? [0, Math.sign(cy) || 1] : [Math.sign(cx) || 1, 0]
  for (const [a, b] of hour) {
    const i = ci + a + off[0], j = cj + b + off[1]
    if (!G.inb(i, j) || !clear(i, j) || (!over && near(M, i, j))) continue
    if (i === ci && j === cj) continue
    if (!over && hour.length > 1 && Math.abs(i - ci) <= 1 && Math.abs(j - cj) <= 1) continue
    put(i, j)
  }
  // four tick pixels (12 / 3 / 6 / 9) inside the rim where the face has room; a tick the minute hand points at is
  // left out (the hand would run into it)
  const rim = Math.min(room(0), room(90), room(180), room(270))
  if (rim >= 5.5) for (const d of [0, 90, 180, 270]) {
    const [a, b] = rot([0, -1], d / 90), r = Math.floor(room(d) - 0.01), i = ci + a * r, j = cj + b * r
    if (!near(M, i, j)) put(i, j)
  }
}

// a kitchen timer's pointer (timer-ring without its number): one thin minute-hand ray from the face centre, a cell
// short of the ring
export function liveTimerHand(icon) {
  if (!icon || !icon.params || icon.name !== 'timer-ring' || icon.params.number !== false) return null
  const keep = []
  let P = null
  for (const l of icon.lines || []) {
    const p = l.pts || []
    if (!P && l.plate === 'A' && !l.closed && p.length === 2 && Math.hypot(p[0][0] - 12, p[0][1] - 13.5) < 0.3 && Math.hypot(p[1][0] - p[0][0], p[1][1] - p[0][1]) > 2) {
      P = { c: p[0], deg: ((Math.atan2(p[1][0] - p[0][0], p[0][1] - p[1][1]) * 180 / Math.PI) + 360) % 360 }
      continue
    }
    keep.push(l)
  }
  return P ? { icon: { ...icon, lines: keep }, ...P } : null
}
export function drawPointer(L, P, sh) {
  const cc = G.toCell(P.c, sh), ci = Math.floor(cc[0]), cj = Math.floor(cc[1])
  const put = (i, j) => { if (G.inb(i, j)) { const k = G.ix(i, j); L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0 } }
  const ink = G.copy(L.ink)
  const clear = (i, j) => { for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) if (G.get(ink, i + a, j + b)) return false; return G.inb(i, j) }
  put(ci, cj)
  let n = 0
  for (const [a, b] of ray(P.deg)) { if (n >= 4 || !clear(ci + a, cj + b)) break; put(ci + a, cj + b); n++ }
}

// ── gauge needle ────────────────────────────────────────────────────────────────────────────────────────
// A gauge's needle is drawn by distance (cells within half a cell of the true needle are ink, plus a clean chain
// from end to end) on a flat paper dial, crisp ink with no anti-alias shade; its tip is cut back so no needle cell
// shares an edge with the dial's arc (the needle never fuses into the rim). The reading carries the exact value.
export function liveNeedle(icon) {
  if (!icon || !icon.params || icon.name !== 'gauge-value') return null
  const hub = (icon.lines || []).find(l => l.plate === 'A' && l.closed)
  if (!hub) return null
  let hx = 0, hy = 0
  for (const [x, y] of hub.pts) { hx += x; hy += y }
  hx /= hub.pts.length; hy /= hub.pts.length
  let seg = null
  const keep = (icon.lines || []).filter(l => {
    const p = l.pts || []
    if (!seg && l.plate === 'A' && !l.closed && p.length === 2 && Math.hypot(p[0][0] - hx, p[0][1] - hy) < 2.5) { seg = p; return false }
    return true
  })
  return seg ? { icon: { ...icon, lines: keep }, seg, hub: [hx, hy] } : null
}
export function drawNeedle(L, ND, sh) {
  const [a, b] = ND.seg, dx = b[0] - a[0], dy = b[1] - a[1], LL = dx * dx + dy * dy
  const at = (i, j) => [(i + 0.5) * G.P + G.SHIFT - sh[0], (j + 0.5) * G.P + G.SHIFT - sh[1]]
  // the rim: ink already drawn away from the hub (the arc), which the needle keeps a cell of paper from
  const rim = G.grid()
  for (let k = 0; k < rim.length; k++) if (L.ink[k]) { const [x, y] = at(k % G.N, (k - k % G.N) / G.N); if (Math.hypot(x - ND.hub[0], y - ND.hub[1]) > 4) rim[k] = 1 }
  const nd = G.grid()
  for (let j = 0; j < G.N; j++) for (let i = 0; i < G.N; i++) {
    const [x, y] = at(i, j)
    const t = ((x - a[0]) * dx + (y - a[1]) * dy) / LL
    if (t < -0.15 || t > 1.1) continue
    const tc = Math.max(0, Math.min(1, t)), d = Math.hypot(x - a[0] - tc * dx, y - a[1] - tc * dy)
    if (d < 0.75) nd[G.ix(i, j)] = 1
  }
  for (const [i, j] of G.chainOf([G.toCell(a, sh), G.toCell(b, sh)], false)) if (G.inb(i, j)) nd[G.ix(i, j)] = 1
  const nearRim = (i, j) => [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]].some(([u, v]) => G.get(rim, i + u, j + v))
  for (let k = 0; k < nd.length; k++) if (nd[k] && !nearRim(k % G.N, (k - k % G.N) / G.N)) { L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0 }
}

// ── stopwatch sweep ─────────────────────────────────────────────────────────────────────────────────────
// The swept seconds are a pie wedge (line: its outline, knocked out of filled faces). In pixels an outlined wedge
// leaves a hole that reads as a letter ("2", "D"); pixel fills the wedge solid, a pie that grows with the seconds.
export function drawSweep(L, icon, sh) {
  let any = false
  for (const l of icon.lines || []) {
    if (l.plate !== 'A' || !l.closed || !l.pts || l.pts.length < 3) continue
    let x0 = Infinity, x1 = -Infinity
    for (const [x] of l.pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x) }
    if (x1 - x0 < 2) continue
    const cov = G.coverage([l.pts], sh)
    for (let k = 0; k < cov.length; k++) if (cov[k] >= 7) { L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0; any = true }
  }
  return any || (icon.lines || []).some(l => l.plate === 'A' && !l.closed)
}

// ── level slabs ─────────────────────────────────────────────────────────────────────────────────────────
// A battery's charge is drawn in line as one meandering stroke that fills a rectangle (H/V zigzag). Rasterised as a
// line it leaves holes (a battery that reads "a"); pixel fills the rectangle instead: cells it covers at least half
// way on both axes are ink, and on the edge that moves with the level (the top of an upright battery, the right end
// of the others) a cell it covers a fifth to a half of takes the shade tone, so every step of the level shows.
export function liveSlabs(icon) {
  if (!icon || !icon.params) return null
  const slabs = [], keep = []
  for (const l of icon.lines || []) {
    const p = l.pts || []
    const axis = p.length >= 5 && !l.closed && l.plate === 'A' && p.every((q, k) => !k || Math.abs(q[0] - p[k - 1][0]) < 1e-6 || Math.abs(q[1] - p[k - 1][1]) < 1e-6)
    if (!axis) { keep.push(l); continue }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of p) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
    if (x1 - x0 < 0.5 || y1 - y0 < 0.5) { keep.push(l); continue }
    slabs.push({ x0: x0 - 0.875, y0: y0 - 0.875, x1: x1 + 0.875, y1: y1 + 0.875 })
  }
  return slabs.length ? { icon: { ...icon, lines: keep }, slabs, axis: icon.name === 'battery-vertical' ? 1 : 0 } : null
}
export function drawSlabs(L, SL, sh, level) {
  const half = G.grid(), slabs = SL.slabs
  const ink = k => { L.ink[k] = 1; L.tone[k] = 0; if (L.glint) L.glint[k] = 0 }
  for (const s of slabs) {
    const [a0, b0] = G.toCell([s.x0, s.y0], sh), [a1, b1] = G.toCell([s.x1, s.y1], sh)
    // a known level: the charge is counted in half cells of the full slab (a half cell = the shade tone), rounded,
    // so a 5% step moves the edge wherever a half cell boundary falls between the two values
    const Lv = Number(level)
    if (Lv >= 0.15 && Lv <= 1) {
      const span = SL.axis ? b1 - b0 : a1 - a0, full = (span - 1.75 / G.P) / Lv + 1.75 / G.P
      const lo = SL.axis ? b1 - full : a0, hi = SL.axis ? b1 : a0 + full
      const c0 = Math.ceil(lo - 0.5), c1 = Math.floor(hi - 0.5), n = c1 - c0 + 1
      const h = Math.max(1, Math.min(2 * n, Math.round(Lv * 2 * n)))
      const across = SL.axis ? [Math.ceil(a0 - 0.5), Math.floor(a1 - 0.5)] : [Math.ceil(b0 - 0.5), Math.floor(b1 - 0.5)]
      for (let q = 0; q < Math.ceil(h / 2); q++) {
        const along = SL.axis ? c1 - q : c0 + q, shade = h % 2 && q === Math.ceil(h / 2) - 1
        for (let r = across[0]; r <= across[1]; r++) {
          const [i, j] = SL.axis ? [r, along] : [along, r]
          if (!G.inb(i, j)) continue
          const k = G.ix(i, j)
          if (shade) { if (!L.ink[k]) half[k] = 1 } else ink(k)
        }
      }
      continue
    }
    for (let j = Math.floor(b0); j <= Math.floor(b1); j++) for (let i = Math.floor(a0); i <= Math.floor(a1); i++) {
      if (!G.inb(i, j)) continue
      const cx = Math.max(0, Math.min(i + 1, a1) - Math.max(i, a0)), cy = Math.max(0, Math.min(j + 1, b1) - Math.max(j, b0))
      const [along, across] = SL.axis ? [cy, cx] : [cx, cy]
      const k = G.ix(i, j)
      if (cx >= 0.5 && cy >= 0.5) ink(k)
      else if (across >= 0.5 && along >= 0.2 && !L.ink[k]) half[k] = 1
    }
  }
  return half
}
