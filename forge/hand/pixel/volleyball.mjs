// forge/hand/pixel/volleyball.mjs — a volleyball: heavy ink outline and three thick curved ink panel seams swirling out from the centre, shaded lower right with a highlight top left.
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'p' / 'q' / 'a' tone / shade / ink of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]

const N = 24, C = 12, R = 10
// three seams spiral out of the centre 120 degrees apart, each bending the same way (deterministic maths, no rng needed)
function seams() {
  const segs = []
  for (let k = 0; k < 3; k++) {
    const a0 = -Math.PI / 2 + k * 2 * Math.PI / 3 - 0.35
    let prev = null
    for (let s = 0; s <= 60; s++) {
      const t = s / 60
      const a = a0 + 1.05 * t
      const p = [C + R * 1.1 * t * Math.cos(a), C + R * 1.1 * t * Math.sin(a)]
      if (prev) segs.push([prev, p])
      prev = p
    }
  }
  return segs
}
function dist(px, py, [a, b]) {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (py - a[1]) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - (a[0] + t * dx), py - (a[1] + t * dy))
}

function buildMap() {
  const segs = seams()
  const rows = []
  for (let j = 0; j < N; j++) {
    let row = ''
    for (let i = 0; i < N; i++) {
      const x = i + 0.5, y = j + 0.5
      const r = Math.hypot(x - C, y - C)
      let ch = '.'
      if (r <= R) {
        ch = '+'
        if (r > R - 1.05) ch = '#'
        else if (segs.some(s => dist(x, y, s) < 0.95)) ch = '#'
        else if ((x - C) + (y - C) > 7.5 + (r > R - 2.2 ? -1.5 : 0)) ch = '='
        if (ch === '+' && x - C + y - C < -11 && r < R - 1.1) ch = 'o'
      }
      row += ch
    }
    rows.push(row)
  }
  return rows
}

export default function render() {
  G.useGrid(24)
  const MAP = buildMap()
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    MAP.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
