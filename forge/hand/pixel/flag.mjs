// forge/hand/pixel/flag.mjs — a waving swallow-tail flag on a bold two-pixel pole with a finial
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['q', SHADE, 'wm-a'], ['a', {}, 'wm-a'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '....##..................', // 2
  '....##...aaaa...........', // 3
  '....##aaappppaaa........', // 4
  '....##ppppppppppaaaaa...', // 5
  '....##pooppppppppppqa...', // 6
  '....##poppppppppppqa....', // 7
  '....##pppppppppppqa.....', // 8
  '....##ppppppppppqa......', // 9
  '....##ppppppppppa.......', // 10
  '....##pppppppppppa......', // 11
  '....##pppqqqqpppppa.....', // 12
  '....##qqqaaaaqqqpppa....', // 13
  '....##aaa....aaaqqqqa...', // 14
  '....##..........aaaaa...', // 15
  '....##..................', // 16
  '....##..................', // 17
  '....##..................', // 18
  '....##..................', // 19
  '....##..................', // 20
  '....##..................', // 21
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
