// forge/hand/pixel/taxi.mjs — a taxi in profile: stepped trapezoid cabin with open glass and a centre pillar, a lit roof sign, a checker stripe on the body and two big wheels.
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
  '.........#o+++#.........', // 3
  '.........######.........', // 4
  '.......##########.......', // 5
  '......#....##....#......', // 6
  '.....#.....##.....#.....', // 7
  '.....#.....##.....#.....', // 8
  '....#......##......#....', // 9
  '...##################...', // 10
  '..#oo++++++++++++++++#..', // 11
  '..#+#+#+#+#+#+#+#+#+##..', // 12
  '..#++++++++++++++++++#..', // 13
  '..#==================#..', // 14
  '...##################...', // 15
  '....######....######....', // 16
  '....##++##....##++##....', // 17
  '....##++##....##++##....', // 18
  '.....####......####.....', // 19
  '........................', // 20
  '........................', // 21
  '........................', // 22
  '........................', // 23
]

export default function render() {
  G.useGrid(24)
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    MAP.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
