// forge/hand/pixel/recycle.mjs - three chasing arrows on the 24 grid, ink only (free line work): a two-pixel-thick body for each
// arrow and a solid six-wide triangular head (the moving part, wm-a). Top arrow: an arch whose head drops at the right;
// right arrow: down the right side and along the bottom, head pointing left; left arrow: along the bottom and up the left
// side, head pointing up. The left body is the right body mirrored, so the two sides weigh the same.
const FILL = 'var(--with-pixel-fill, currentColor)'
const PAINT = {
  tone: { fill: FILL, 'fill-opacity': '0.28' },
  shade: { fill: FILL, 'fill-opacity': '0.55' },
  ink: {},
  shine: { fill: 'var(--with-pixel-shine, #FFFFFF)' },
}
// one merged h/v path per tone+class (row runs, the generated pixel style's construction)
function sprite(rows, key) {
  const runs = new Map()
  rows.forEach((row, y) => {
    let i = 0
    while (i < row.length) {
      const c = row[i]
      if (!key[c]) { i++; continue }
      let n = 1
      while (row[i + n] === c) n++
      const id = key[c].join('|')
      if (!runs.has(id)) runs.set(id, [])
      runs.get(id).push(`M${i} ${y}h${n}v1h-${n}z`)
      i += n
    }
  })
  const order = ['tone', 'shade', 'ink', 'shine']
  return [...runs.entries()]
    .sort((a, b) => order.indexOf(a[0].split('|')[0]) - order.indexOf(b[0].split('|')[0]))
    .map(([id, ds]) => {
      const [paint, cls] = id.split('|')
      const attrs = { d: ds.join(''), ...PAINT[paint] }
      if (cls) attrs.class = cls
      return ['path', attrs]
    })
}
// grid canvas helpers (24x24)
const W = 24
const grid = () => Array.from({ length: W }, () => Array(W).fill(' '))
const put = (g, x, y, c) => { if (x >= 0 && x < W && y >= 0 && y < W) g[y][x] = c }
const rows = g => g.map(r => r.join(''))
const KEY = { '#': ['ink', ''], a: ['ink', 'wm-a'] }
const span = (g, y, x0, x1, c = '#') => { for (let x = x0; x <= x1; x++) put(g, x, y, c) }

export default function render() {
  const g = grid()
  // top arch (left leg ends plain) + head pointing down at the right
  span(g, 2, 9, 14); span(g, 3, 7, 16)
  for (let y = 4; y <= 6; y++) span(g, y, 6, 7)
  span(g, 4, 16, 17)
  span(g, 5, 13, 20, 'a'); span(g, 6, 14, 19, 'a'); span(g, 7, 15, 18, 'a'); span(g, 8, 16, 17, 'a')
  // right arrow body; the left arrow is the same body mirrored (rows 13-19), so both sides weigh the same
  const right = [[12, 17, 18], [13, 18, 19], [14, 18, 19], [15, 18, 19], [16, 18, 19], [17, 17, 19], [18, 16, 18], [19, 16, 17]]
  for (const [y, x0, x1] of right) {
    span(g, y, x0, x1)
    if (y >= 13) span(g, y, 23 - x1, 23 - x0)
  }
  span(g, 18, 5, 10); span(g, 19, 6, 10)             // left bar runs on towards the middle
  // right head: points left (base on the right)
  for (let y = 15; y <= 22; y++) put(g, 15, y, 'a')
  for (let y = 16; y <= 21; y++) put(g, 14, y, 'a')
  for (let y = 17; y <= 20; y++) put(g, 13, y, 'a')
  put(g, 12, 18, 'a'); put(g, 12, 19, 'a')
  // left head: points up (base at the bottom)
  span(g, 9, 4, 5, 'a'); span(g, 10, 3, 6, 'a'); span(g, 11, 2, 7, 'a'); span(g, 12, 1, 8, 'a')
  return sprite(rows(g), KEY)
}
