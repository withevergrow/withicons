// forge/hand/pixel/bell-plus.mjs - the pixel bell (round stepped dome, straight sides, flared lip, hanging clapper) matching the
// plain bell sprite, set left so a bold two-pixel plus badge (part S) floats clear at the upper right.
// Cell map: # ink outline, . tone body, s shade (right and bottom rim), w shine, a clapper (moving part), S plus badge.
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
const KEY = { '#': ['ink', ''], '.': ['tone', ''], s: ['shade', ''], w: ['shine', 'wm-shine'], a: ['ink', 'wm-a'], S: ['ink', 'wm-s'] }
const span = (g, y, x0, x1, c) => { for (let x = x0; x <= x1; x++) put(g, x, y, c) }

export default function render() {
  const g = grid()
  const DY = 1
  // dome: flat top, then 2-wide, 1-wide, 1-wide steps down to straight sides at x 3 and x 15
  const dome = [[4, 7, 11], [5, 5, 13], [6, 4, 14], [7, 3, 15]]
  for (const [y, l, r] of dome) {
    if (y === 4) span(g, y + DY, l, r, '#')
    else {
      span(g, y + DY, l, r, '.')
      if (y === 5) { span(g, y + DY, l, l + 1, '#'); span(g, y + DY, r - 1, r, '#') } else { put(g, l, y + DY, '#'); put(g, r, y + DY, '#') }
    }
  }
  for (let y = 8; y <= 15; y++) { put(g, 3, y + DY, '#'); put(g, 15, y + DY, '#'); span(g, y + DY, 4, 14, '.') }
  // shade: the right rim of the body (two cells on the straight sides, one on the dome)
  for (let y = 6; y <= 15; y++) {
    let r = 14
    while (g[y + DY][r] !== '.') r--
    if (y >= 7) put(g, r - 1, y + DY, 's')
    put(g, r, y + DY, 's')
  }
  // flare: lip row with corner steps
  put(g, 2, 16 + DY, '#'); put(g, 16, 16 + DY, '#'); span(g, 16 + DY, 3, 15, 's')
  span(g, 17 + DY, 1, 17, '#')
  // shine
  put(g, 8, 5 + DY, 'w'); put(g, 9, 5 + DY, 'w'); put(g, 6, 7 + DY, 'w'); put(g, 7, 6 + DY, 'w')
  // clapper
  span(g, 18 + DY, 7, 11, 'a'); span(g, 19 + DY, 8, 10, 'a')
  // plus badge, two pixels thick (arms six long), upper right
  for (let y = 1; y <= 6; y++) span(g, y, 19, 20, 'S')
  span(g, 3, 17, 22, 'S'); span(g, 4, 17, 22, 'S')
  return sprite(rows(g), KEY)
}
