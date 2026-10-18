// forge/hand/pixel/truck.mjs — a plain rectangular cargo box and a cab with a slanted windscreen and dark window, on two big dark wheels with light hubs that overlap the bottom edge (wheels are the moving part, wm-a).
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

// cargo box (cols 1-13, rows 4-16)
const box = { 4: [2, 12] }
for (let y = 5; y <= 15; y++) box[y] = [1, 13]
blob(box, (x, y) => x === 12 || y === 15)
H(16, 2, 13, '#')
// cab: top, slanted windscreen with a pale window, belt line, front, floor
H(8, 13, 18, '#')
for (let y = 9; y <= 11; y++) { P(13, y, '#'); H(y, 14, 17 + (y - 9), '.') }
P(19, 9, '#'); P(18, 9, '#'); P(19, 10, '#'); P(20, 11, '#')
H(12, 13, 20, '#'); P(21, 12, '#'); P(22, 12, '#')
for (let y = 13; y <= 16; y++) P(13, y, '#')
for (let y = 13; y <= 15; y++) { H(y, 14, 20, '+'); P(21, y, '='); P(22, y, '#') }
H(15, 14, 21, '=')
H(16, 13, 22, '#')
P(14, 13, 'o')
// wheels
for (const x0 of [3, 15]) {
  H(15, x0 + 1, x0 + 4, 'a'); H(16, x0, x0 + 5, 'a')
  for (let y = 17; y <= 18; y++) { H(y, x0, x0 + 1, 'a'); H(y, x0 + 2, x0 + 3, 'p'); H(y, x0 + 4, x0 + 5, 'a') }
  H(19, x0, x0 + 5, 'a'); H(20, x0 + 1, x0 + 4, 'a')
}
P(2, 5, 'o'); P(3, 5, 'o'); P(2, 6, 'o')
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
