// forge/hand/pixel/hand-coins.mjs — an open palm-up hand (raised thumb, three banded fingers, no separate cuff) under a three-coin stack with a ringed top face and curved edge lines (wm-a); replaces the flat block
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'p' / 'q' / 'a' tone / shade / ink of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '...........aaaaa........', // 0
  '.........aapppppaa......', // 1
  '........appoqqqpppa.....', // 2
  '.......appqooqqqqpa.....', // 3
  '.......appqqqqqqpppa....', // 4
  '.......apppppppppppa....', // 5
  '.......aaaapppppaaaa....', // 6
  '.......apppaaaaapqqa....', // 7
  '.......apppppppppqqa....', // 8
  '.......aaaapppppaaaa....', // 9
  '.......apppaaaaapqqa....', // 10
  '....###apppppppppqqa....', // 11
  '...#+o+#appppppppaa.....', // 12
  '...#+++#.aaapppaa.......', // 13
  '..#+++++############....', // 14
  '.#++++++++++++++++++#...', // 15
  '.#+++++++++++++++++++#..', // 16
  '.#+++++++++++++########.', // 17
  '.#++++++++++++++++++++#.', // 18
  '.#++++++++++++++#######.', // 19
  '.#=++++++++++++++++++#..', // 20
  '.#==================#...', // 21
  '..##################....', // 22
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
