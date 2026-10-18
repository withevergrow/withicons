// forge/hand/pixel/podcast.mjs — two clean mirrored stepped arcs around a mic capsule on a straight 2px stem (replaces the generated jagged, muddled arcs).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)  |  's' badge ink (wm-s)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['a', {}, 'wm-a'], ['s', {}, 'wm-s'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........aaaaaaaa........', // 1
  '......aaaaaaaaaaaa......', // 2
  '.....aaa........aaa.....', // 3
  '....aa............aa....', // 4
  '...aa....aaaaaa....aa...', // 5
  '..aaa..aaaaaaaaaa..aaa..', // 6
  '..aa..aaa......aaa..aa..', // 7
  '..aa..aa...##...aa..aa..', // 8
  '..aa..aa..#o+#..aa..aa..', // 9
  '..aa..aa..#++#..aa..aa..', // 10
  '..aa..aa..#+=#..aa..aa..', // 11
  '..aa..aaa..##..aaa..aa..', // 12
  '..aaa..aa..##..aa..aaa..', // 13
  '...aa......##......aa...', // 14
  '....aa.....##.....aa....', // 15
  '...........##...........', // 16
  '...........##...........', // 17
  '...........##...........', // 18
  '...........##...........', // 19
  '...........##...........', // 20
  '...........##...........', // 21
  '........................', // 22
  '........................', // 23
]


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
