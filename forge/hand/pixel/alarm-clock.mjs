// forge/hand/pixel/alarm-clock.mjs — round clock body with a shaded rim and lighter face, crisp 2px hands at 12 and 3, two separate bells and small feet (replaces the generated muddy blob with fused bells).
import * as G from '../../styles/_pixel-core.mjs'

// '#' ink  '+' tone  '=' shade  'o' shine  |  'a' / 'p' ink / tone of the moving part (wm-a)  |  's' badge ink (wm-s)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['p', TONE, 'wm-a'], ['a', {}, 'wm-a'], ['s', {}, 'wm-s'],
  ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]
const MAP = [
  '........................', // 0
  '........................', // 1
  '....aaaa........aaaa....', // 2
  '...aopppa......appppa...', // 3
  '..appppa........appppa..', // 4
  '..apppa..######..apppa..', // 5
  '..appa.###====###.appa..', // 6
  '..apa.##==++++==##.apa..', // 7
  '...a.##=o++aa+++=##.a...', // 8
  '.....#=++++aa++++=#.....', // 9
  '....##=++++aa++++=##....', // 10
  '....#=+++++aa+++++=#....', // 11
  '....#=+++++aaaaa++=#....', // 12
  '....#=+++++aaaaa++=#....', // 13
  '....#=++++++++++++=#....', // 14
  '....##=++++++++++=##....', // 15
  '.....#=++++++++++=#.....', // 16
  '.....##=++++++++=##.....', // 17
  '......##==++++==##......', // 18
  '.......###====###.......', // 19
  '......aa.######.aa......', // 20
  '.....aa..........aa.....', // 21
  '....aa............aa....', // 22
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
