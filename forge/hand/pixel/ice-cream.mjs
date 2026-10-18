// forge/hand/pixel/ice-cream.mjs — a round scoop with a wavy three-lobe drip edge sitting on a clearly separated, pointed waffle cone (cone is the moving part wm-a).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'p' / 'q' / 'a' tone / shade / ink of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '.........######.........', // 2
  '.......##++++++##.......', // 3
  '......#o++++++++=#......', // 4
  '.....#o+++++++++==#.....', // 5
  '.....#o+++++++++==#.....', // 6
  '.....#++++++++++==#.....', // 7
  '.....#++++++++++==#.....', // 8
  '.....#++++++++++==#.....', // 9
  '.....#+++#++++#++=#.....', // 10
  '.....#===#====#===#.....', // 11
  '......###.####.###......', // 12
  '.......apppppppa........', // 13
  '.......apppppppa........', // 14
  '........appppppa........', // 15
  '........appppppa........', // 16
  '.........apppppa........', // 17
  '.........apppppa........', // 18
  '..........appa..........', // 19
  '..........appa..........', // 20
  '...........aa...........', // 21
  '........................', // 22
  '........................', // 23
]

// waffle lattice + shade edge on the cone (rows 13..21): 'p' cells on the diagonals become 'q'
const rows = MAP.map(r => r.split(''))
for (let j = 13; j <= 21; j++) for (let i = 0; i < 24; i++) {
  if (rows[j][i] !== 'p') continue
  if (((i - j) % 4 + 4) % 4 === 0 || ((i + j) % 4 + 4) % 4 === 0) rows[j][i] = 'q'
}
const GRID = rows.map(r => r.join(''))

export default function render() {
  G.useGrid(24)
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    GRID.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
