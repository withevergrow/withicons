// forge/hand/pixel/maximize-2.mjs - two matching pixel arrows pointing out to the NW and SE corners: a two-pixel stepped
// diagonal shaft and an L-shaped chevron head (two-pixel arms, six long) on each; the SE arrow is the NW one turned 180 degrees,
// so both carry exactly the same weight. Arrows are free line work (ink, no body); the NW head is the moving part (wm-a), the SE head too.
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

export default function render() {
  const g = grid()
  const nw = []
  for (let k = 0; k < 7; k++) nw.push([3 + k, 3], [3 + k, 4], [3, 3 + k], [4, 3 + k])   // chevron head: two-pixel arms
  for (let i = 5; i <= 10; i++) nw.push([i, i], [i + 1, i], [i + 2, i])                            // stepped shaft, three cells per row (about two pixels thick)
  for (const [x, y] of nw) { put(g, x, y, '#'); put(g, 23 - x, 23 - y, '#') }
  // tag the heads (the L corners) as the moving part
  for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) {
    const nwHead = g[y][x] === '#' && ((y <= 4 && x <= 9) || (x <= 4 && y <= 9))
    const seHead = g[y][x] === '#' && ((y >= 19 && x >= 14) || (x >= 19 && y >= 14))
    if (nwHead || seHead) g[y][x] = 'a'
  }
  return sprite(rows(g), KEY)
}
