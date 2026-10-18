// forge/hand/pixel/map-pin-check.mjs - a classic teardrop map pin as a solid sprite: tone body, 1px ink outline, shade rim on the
// lower right, a shine on the upper left, and a bold two-pixel ink check (wm-a, the moving part) set straight on the body.
// Cell-aligned: the body is a disc (r 8.4) joined to a pointed tip, tested at cell centres; check cells are placed by hand.
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
const KEY = { '#': ['ink', ''], '.': ['tone', ''], s: ['shade', ''], w: ['shine', 'wm-shine'], a: ['ink', 'wm-a'] }
const CX = 12, CY = 9.5, R = 8.2, TIP = 22.2

const inside = (x, y) => {
  const px = x + 0.5, py = y + 0.5
  if ((px - CX) ** 2 + (py - CY) ** 2 <= R * R) return true
  if (py > 13.5 && py <= TIP) return Math.abs(px - CX) <= 6.6 * (TIP - py) / (TIP - 13.5) + 0.2
  return false
}

export default function render() {
  const g = grid()
  const S = (x, y) => inside(x, y)
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    if (!S(x, y)) continue
    const edge = !S(x - 1, y) || !S(x + 1, y) || !S(x, y - 1) || !S(x, y + 1)
    if (edge) { g[y][x] = '#'; continue }
    const rim = (!S(x + 2, y) && x > CX) || (!S(x, y + 2) && y > CY && x >= CX - 1) || (!S(x + 1, y + 1) && x > CX)
    g[y][x] = rim ? 's' : '.'
  }
  // shine: top-left of the head
  for (const [x, y] of [[7, 5], [8, 4], [8, 5], [7, 6]]) if (g[y][x] === '.') g[y][x] = 'w'
  // bold check, 2x2 cell brush: short leg down-right, long leg up-right
  const pts = [[7, 8], [8, 9], [9, 10], [10, 11], [11, 10], [12, 9], [13, 8], [14, 7], [15, 6]]
  for (const [x, y] of pts) for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) put(g, x + dx, y + dy, 'a')
  return sprite(rows(g), KEY)
}
