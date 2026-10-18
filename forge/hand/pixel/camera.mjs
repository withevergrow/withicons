// forge/hand/pixel/camera.mjs — a camera body with a viewfinder bump and shutter button on top, and a big concentric lens: dark ring, lighter glass centre and a highlight (lens is the moving part, wm-a).
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const WHITE = { fill: 'var(--with-pixel-shine, #FFFFFF)', class: 'wm-k' }

const C = Array.from({ length: 24 }, () => Array(24).fill('.'))
const P = (x, y, c) => { C[y][x] = c }
const H = (y, x0, x1, c) => { for (let x = x0; x <= x1; x++) P(x, y, c) }
const R = (x0, y0, x1, y1, c) => { for (let y = y0; y <= y1; y++) H(y, x0, x1, c) }
// a blob given as row spans {y: [x0, x1]}: ink outline (4-neighbour outside), tone inside, shade where shade(x, y)
function blob(spans, shade, ink = '#', tone = '+', sh = '=') {
  const inn = (x, y) => spans[y] && x >= spans[y][0] && x <= spans[y][1]
  for (const k in spans) for (let x = spans[k][0]; x <= spans[k][1]; x++) {
    const y = +k
    const edge = !inn(x - 1, y) || !inn(x + 1, y) || !inn(x, y - 1) || !inn(x, y + 1)
    P(x, y, edge ? ink : (shade && shade(x, y) ? sh : tone))
  }
}

// body rows 7-20 plus viewfinder bump
const body = { 7: [2, 21], 20: [2, 21] }
for (let y = 8; y <= 19; y++) body[y] = [1, 22]
blob(body, (x, y) => x === 21 || y === 19)
// bump over the left of the lens axis (cols 8-15), rows 4-6
H(4, 9, 14, '#')
for (const y of [5, 6]) { P(8, y, '#'); H(y, 9, 14, '+'); P(15, y, '#') }
H(7, 9, 14, '+'); P(8, 7, '#'); P(15, 7, '#')
// shutter button
H(5, 17, 19, '#'); P(17, 6, '#'); P(18, 6, '+'); P(19, 6, '#')
// lens: ink ring (2px), glass inside
const lens = { 9: [10, 13], 10: [8, 15], 11: [8, 15], 12: [7, 16], 13: [7, 16], 14: [7, 16], 15: [7, 16], 16: [8, 15], 17: [8, 15], 18: [10, 13] }
for (const y in lens) H(+y, lens[y][0], lens[y][1], 'a')
const glass = { 11: [11, 12], 12: [10, 13], 13: [9, 14], 14: [9, 14], 15: [10, 13], 16: [11, 12] }
for (const y in glass) H(+y, glass[y][0], glass[y][1], 'p')
P(10, 12, 'o'); P(10, 13, 'o')
// body highlight
P(3, 9, 'o'); P(2, 10, 'o'); P(3, 8, 'o')
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['w', WHITE], ['p', TONE, 'wm-a'], ['e', SHADE, 'wm-a'], ['a', {}, 'wm-a'], ['o', SHINE, 'wm-shine']]
// one merged h/v path per character: row runs, identical stacked runs joined
function cells(ch) {
  const runs = []
  C.forEach((row, y) => {
    for (let x = 0; x < 24;) {
      if (row[x] !== ch) { x++; continue }
      let e = x
      while (e < 24 && row[e] === ch) e++
      runs.push([x, y, e - x]); x = e
    }
  })
  const done = new Set(), out = []
  runs.forEach((r, i) => {
    if (done.has(i)) return
    let h = 1, j
    while ((j = runs.findIndex((q, k) => !done.has(k) && k !== i && q[0] === r[0] && q[2] === r[2] && q[1] === r[1] + h)) >= 0) { done.add(j); h++ }
    out.push('M' + r[0] + ' ' + r[1] + 'h' + r[2] + 'v' + h + 'h-' + r[2] + 'z')
  })
  return out.join('')
}
export default function render() {
  return LAYERS.map(([ch, attrs, cls]) => ({ d: cells(ch), attrs, cls })).filter(l => l.d)
    .map(l => ['path', { d: l.d, ...l.attrs, ...(l.cls ? { class: l.cls } : {}) }])
}
