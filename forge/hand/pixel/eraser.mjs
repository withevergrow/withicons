// forge/hand/pixel/eraser.mjs — slanted block eraser, light rubber end and darker sleeve, resting on its baseline
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '........................', // 2
  '........................', // 3
  '............aaa.........', // 4
  '...........aqqqa........', // 5
  '..........aqqqqqa.......', // 6
  '.........aaqqqqqqa......', // 7
  '........appaqqqqqqa.....', // 8
  '.......appppaqqqqa......', // 9
  '......appppppaqqqa......', // 10
  '.....aopppppppaqa.......', // 11
  '....aoppppppppqa........', // 12
  '....appppppppqa.........', // 13
  '...appppppppqa..........', // 14
  '....appppppqa...........', // 15
  '.....appppqa............', // 16
  '......appqa.............', // 17
  '.......aaa..............', // 18
  '........................', // 19
  '........#############...', // 20
  '........................', // 21
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
