// forge/hand/pixel/paper-fan.mjs — folded paper fan: a wedge of radiating ribs under a round top arc, with a pivot dot at the base
// Built from silhouette masks (1px outline, tone body, bottom-right shade, shine pixels); a legend of chars is mapped to tones at the end.
import * as G from '../../styles/_pixel-core.mjs'

// tiny sprite kit: a char grid, silhouette masks -> 1px outline + tone + bottom-right shade
const W = 24
const grid = () => Array.from({ length: W }, () => Array(W).fill('.'))
const maskOf = () => Array.from({ length: W }, () => Array(W).fill(false))
const span = (m, y, a, b) => { for (let x = a; x <= b; x++) m[y][x] = true }
const rect = (m, x0, y0, x1, y1, cut = true) => {
  for (let y = y0; y <= y1; y++) span(m, y, x0, x1)
  if (cut) { m[y0][x0] = m[y0][x1] = m[y1][x0] = m[y1][x1] = false }
}
const inM = (m, x, y) => x >= 0 && y >= 0 && x < W && y < W && m[y][x]
// paint a mask onto the map: 1px outline + interior tone
function paint(map, m, ink = '#', tone = '+') {
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (!m[y][x]) continue
    const edge = !inM(m, x - 1, y) || !inM(m, x + 1, y) || !inM(m, x, y - 1) || !inM(m, x, y + 1)
    map[y][x] = edge ? ink : tone
  }
}
// interior pixel whose right or lower neighbour is an outline pixel becomes shade
function shadeRim(map, tone, ink, shade) {
  const out = map.map(r => r.slice())
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (map[y][x] !== tone) continue
    const r = map[y][x + 1], d = y + 1 < W ? map[y + 1][x] : '.'
    if (r === ink || d === ink) out[y][x] = shade
  }
  for (let y = 0; y < W; y++) map[y] = out[y]
}
const put = (map, pts, ch) => { for (const [x, y] of pts) map[y][x] = ch }
const hl = (map, y, a, b, ch) => { for (let x = a; x <= b; x++) map[y][x] = ch }
const line = (x0, y0, x1, y1) => {
  const pts = []; let dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, e = dx + dy
  for (;;) { pts.push([x0, y0]); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx } if (e2 <= dx) { e += dx; y0 += sy } }
  return pts
}

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['-', TONE, 'wm-a'], ['~', SHADE, 'wm-a'], ['*', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
function emit(map) {
  const prev = G.N
  G.useGrid(24)
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) if (map[y][x] === ch) g[G.ix(x, y)] = 1
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  G.useGrid(prev)
  return out
}

export default function render() {
  const map = grid()
  const A = [12, 19.5], R = 14.5, HALF = 50 * Math.PI / 180
  const m = maskOf()
  for (let y = 0; y < 20; y++) for (let x = 0; x < W; x++) {
    const dx = x + 0.5 - A[0], dy = A[1] - (y + 0.5)
    const d = Math.hypot(dx, dy)
    if (d <= R && dy > 0 && Math.abs(Math.atan2(dx, dy)) <= HALF) m[y][x] = true
  }
  paint(map, m)
  shadeRim(map, '+', '#', '=')
  for (const deg of [-25.5, -8.5, 8.5, 25.5]) {
    const t = deg * Math.PI / 180
    for (let d = 6; d <= R - 1.5; d += 0.25) {
      const x = Math.floor(A[0] + d * Math.sin(t)), y = Math.floor(A[1] - d * Math.cos(t))
      if (map[y][x] !== '#') map[y][x] = '#'
    }
  }
  const p = maskOf()
  rect(p, 10, 18, 13, 21)
  paint(map, p, '#', '=')
  put(map, [[8, 11], [7, 12], [7, 13], [9, 8]], 'o')
  return emit(map)
}
