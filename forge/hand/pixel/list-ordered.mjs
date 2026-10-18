// forge/hand/pixel/list-ordered.mjs — clean 1 and 2 numerals aligned to the 2px bars of an ordered list.
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)  |  's' badge ink (wm-s)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['a', {}, 'wm-a'], ['s', {}, 'wm-s'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '.....##.................', // 3
  '....###.................', // 4
  '...#.##.................', // 5
  '.....##....###########..', // 6
  '.....##....###########..', // 7
  '.....##.................', // 8
  '.....##.................', // 9
  '...######...............', // 10
  '........................', // 11
  '...........###########..', // 12
  '...........###########..', // 13
  '........................', // 14
  '....####................', // 15
  '...##..##...............', // 16
  '.......##...............', // 17
  '......##...###########..', // 18
  '.....##....###########..', // 19
  '....##..................', // 20
  '...##...................', // 21
  '...######...............', // 22
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
