// forge/hand/pixel/microphone.mjs — a clear rounded capsule with a grille and shine, a separate U-shaped holder arc (2px) beneath it, then a stem and a flat base; arc, stem and base are the moving stand (wm-a).
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

// capsule: rows 2-13
const cap = { 2: [10, 13], 13: [10, 13] }
for (let y = 3; y <= 12; y++) cap[y] = [9, 14]
blob(cap, (x, y) => x === 13 || y === 12)
H(7, 11, 12, '#'); H(9, 11, 12, '#')
P(10, 4, 'o'); P(11, 4, 'o'); P(10, 5, 'o')
// holder arc (2px brush), stem, base
for (let y = 9; y <= 14; y++) { H(y, 5, 6, 'a'); H(y, 17, 18, 'a') }
H(15, 6, 7, 'a'); H(15, 16, 17, 'a')
H(16, 7, 16, 'a')
H(17, 9, 14, 'a')
R(11, 18, 12, 19, 'a')
R(8, 20, 15, 21, 'a')
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
