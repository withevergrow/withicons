// forge/hand/pixel/wheat.mjs — an ear of wheat: a tip grain and two pairs of large angled grey-filled grains on a two-pixel stem (fewer, bigger grains so it holds at 16px).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]

// left grain, 5 cols x 6 rows at cols 6..10 (its base touches the stem at col 11; the right one is its mirror about the stem)
const GRAIN = [
  '##...',
  '#o#..',
  '#++#.',
  '#++=#',
  '.#+=#',
  '..###',
]
const MAP = Array.from({ length: 24 }, () => Array(24).fill('.'))
const put = (x, y, c) => { MAP[y][x] = c }
// tip grain
put(11, 1, '#'); put(12, 1, '#')
;[[2, 'o+'], [3, '++'], [4, '+='], [5, '+=']].forEach(([y, s]) => { put(10, y, '#'); put(11, y, s[0]); put(12, y, s[1]); put(13, y, '#') })
put(11, 6, '#'); put(12, 6, '#')
// stem
for (let y = 7; y <= 22; y++) { put(11, y, '#'); put(12, y, '#') }
// two pairs of large angled grains
for (const y0 of [7, 13]) {
  GRAIN.forEach((row, j) => {
    for (let i = 0; i < 5; i++) {
      const c = row[i]
      if (c === '.') continue
      put(6 + i, y0 + j, c)
      put(23 - (6 + i), y0 + j, c === 'o' ? '+' : c)
    }
  })
}

export default function render() {
  G.useGrid(24)
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    MAP.forEach((row, j) => { for (let i = 0; i < 24; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
