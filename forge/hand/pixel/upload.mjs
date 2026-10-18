// forge/hand/pixel/upload.mjs — bold block arrow rising out of a U-shaped tray
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '...........aa...........', // 2
  '..........appa..........', // 3
  '.........appppa.........', // 4
  '........appopppa........', // 5
  '.......apoppppppa.......', // 6
  '......appppppppppa......', // 7
  '......aaaappppaaaa......', // 8
  '..........appa..........', // 9
  '..........appa..........', // 10
  '..........appa..........', // 11
  '...#......appa......#...', // 12
  '...#......aaaa......#...', // 13
  '...#................#...', // 14
  '...#................#...', // 15
  '...#++++++++++++++++#...', // 16
  '...#================#...', // 17
  '....################....', // 18
  '........................', // 19
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
    MAP.forEach((row, j) => { for (let i = 0; i < 24; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  return out
}
