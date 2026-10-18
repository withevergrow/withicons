// forge/hand/pixel/medal.mjs — a round medal with a visible ring hole hanging from a V ribbon of two clear diagonal bands (ribbon is the moving part wm-a).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'p' / 'q' / 'a' tone / shade / ink of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '....aaaaaa....aaaaaa....', // 2
  '....appppa....aqqqqa....', // 3
  '.....appppa..aqqqqa.....', // 4
  '.....appppa..aqqqqa.....', // 5
  '......appppaaqqqqa......', // 6
  '......apppppqqqqqa......', // 7
  '.......appppqqqqa.......', // 8
  '.......appppqqqqa.......', // 9
  '........apppqqqa........', // 10
  '........ap####qa........', // 11
  '.........#o+++#.........', // 12
  '........#+++++=#........', // 13
  '.......#o++##++=#.......', // 14
  '.......#++#..#+=#.......', // 15
  '.......#++#..#+=#.......', // 16
  '.......#+++##++=#.......', // 17
  '........#+++===#........', // 18
  '.........#====#.........', // 19
  '..........####..........', // 20
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
