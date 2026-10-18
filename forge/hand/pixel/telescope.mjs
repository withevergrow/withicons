// forge/hand/pixel/telescope.mjs — a refractor telescope: chunky angled tube with a lens ring and a dark lens, on a pivot hub with two clear straight tripod legs (the stand is the moving part wm-a).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'p' / 'q' / 'a' tone / shade / ink of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '.................###....', // 2
  '...............##+o#....', // 3
  '.............##o++=#....', // 4
  '.............#o+++=#....', // 5
  '...........###++++=#....', // 6
  '.........##++#+++==#....', // 7
  '.......##++++#+==###....', // 8
  '.....##++++==#=##.......', // 9
  '...##oo++==####.........', // 10
  '...#+++==aaaa...........', // 11
  '...#+==aa..aa...........', // 12
  '...#=aa...aaaa..........', // 13
  '...##....aa..aa.........', // 14
  '.........aa..aa.........', // 15
  '........aa....aa........', // 16
  '........aa....aa........', // 17
  '.......aa......aa.......', // 18
  '.......aa......aa.......', // 19
  '......aa........aa......', // 20
  '......aa........aa......', // 21
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
