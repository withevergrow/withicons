// forge/hand/pixel/sleigh.mjs — sleigh in profile: tall back at left, bench body sweeping up to a front scroll ball at right, posts and an up-curled runner
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
  const m = maskOf()
  rect(m, 3, 6, 8, 17)
  for (let y = 12; y <= 17; y++) span(m, y, 3, 21)
  m[17][3] = m[17][21] = false
  ;[[8, 18, 21], [9, 17, 22], [10, 17, 22], [11, 17, 22], [12, 17, 22], [13, 18, 21]].forEach(([y, a, b]) => span(m, y, a, b))
  paint(map, m)
  shadeRim(map, '+', '#', '=')
  hl(map, 15, 10, 19, '#')
  put(map, [[19, 10], [20, 11]], '#')
  hl(map, 18, 6, 7, '#'); hl(map, 19, 6, 7, '#'); hl(map, 18, 16, 17, '#'); hl(map, 19, 16, 17, '#')
  hl(map, 20, 2, 20, '#'); hl(map, 19, 21, 22, '#'); put(map, [[22, 18]], '#')
  put(map, [[4, 8], [4, 9], [10, 13], [18, 9]], 'o')
  return emit(map)
}
