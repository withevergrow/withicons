// forge/hand/pixel/lasso.mjs - a rounder pixel loop (a two-pixel ink ring, ellipse tested at cell centres) with a rope tail that
// runs down-right from the loop, and a bold solid pointer arrow (tip up-left, notch, short tail) set clear of the rope with a
// one-pixel gap. The pointer is the moving part (wm-a),.
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
const CX = 11.5, CY = 6.2

export default function render() {
  const g = grid()
  const ell = (x, y, rx, ry) => ((x + 0.5 - CX) / rx) ** 2 + ((y + 0.5 - CY) / ry) ** 2 <= 1
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (ell(x, y, 10, 5.4) && !ell(x, y, 7.6, 3.3)) g[y][x] = '#'
  }
  // rope tail: from the lower-left of the loop, two pixels thick, down-right towards the pointer
  for (const [x, y] of [[5, 10], [6, 11], [7, 12], [8, 13], [9, 14]]) { put(g, x, y, '#'); put(g, x + 1, y, '#') }
  // pointer arrow (tip at 13,14): solid kite, notch under the right corner, tail slanting down-right
  const ptr = [[14, 13, 13], [15, 13, 14], [16, 13, 15], [17, 13, 16], [18, 13, 17], [19, 13, 18], [20, 13, 16], [21, 15, 17], [22, 16, 17]]
  for (const [y, x0, x1] of ptr) for (let x = x0; x <= x1; x++) put(g, x, y, 'a')
  return sprite(rows(g), KEY)
}
