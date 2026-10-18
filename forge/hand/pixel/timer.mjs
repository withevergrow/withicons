// forge/hand/pixel/timer.mjs — a round stopwatch: ink-outlined tone ring with a lighter face, a clear crown button on a stem and a side button at the upper right, and a bold 2px hand from the centre pivot to the upper right (crown, side button and hand are wm-a).
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

// body: 16-wide disc, rows 5-20
const W = [6, 10, 12, 14, 14, 16, 16, 16, 16, 16, 16, 14, 14, 12, 10, 6]
const body = {}, face = {}
W.forEach((w, i) => { body[5 + i] = [12 - w / 2, 11 + w / 2] })
// face: the disc eroded by two (outline + one tone ring pixel)
const inB = (x, y) => body[y] && x >= body[y][0] && x <= body[y][1]
const inF = (x, y) => inB(x, y) && inB(x - 2, y) && inB(x + 2, y) && inB(x, y - 2) && inB(x, y + 2) && inB(x - 1, y - 1) && inB(x + 1, y - 1) && inB(x - 1, y + 1) && inB(x + 1, y + 1)
blob(body, (x, y) => x + y >= 25 && (!inB(x + 1, y) || !inB(x, y + 1) || !inB(x + 1, y + 1)))
for (let y = 5; y <= 20; y++) for (let x = 4; x <= 19; x++) if (inB(x, y) && inF(x, y)) P(x, y, '.')
// tick marks inside the face at 12, 3, 6 and 9 o'clock
P(11, 8, '#'); P(12, 8, '#'); P(11, 17, '#'); P(12, 17, '#')
P(7, 12, '#'); P(7, 13, '#'); P(16, 12, '#'); P(16, 13, '#')
// crown + stem, side button
R(9, 1, 14, 2, 'a'); R(11, 3, 12, 4, 'a')
R(17, 5, 19, 6, 'a'); P(20, 5, 'a'); P(20, 6, 'a')
// hand from the pivot to the upper right
R(11, 12, 12, 13, 'a')
P(12, 11, 'a'); P(13, 11, 'a'); P(13, 10, 'a'); P(14, 10, 'a'); P(14, 9, 'a'); P(15, 9, 'a')
// shine on the ring top-left
P(7, 8, 'o'); P(6, 9, 'o')
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
