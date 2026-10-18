// forge/hand/pixel/camera-off.mjs — camera body with its top bump; the round lens sits right of the stepped diagonal slash (never under it), held clear by a one-pixel moat so body, lens and slash read apart at 16-24px.
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
  '.ss.....................', // 3
  '..ss..........#####.....', // 4
  '...ss........#+++++#....', // 5
  '....ss.......#+++++#....', // 6
  '..##.ss.######+++++###..', // 7
  '.##++.ss.++++++aaa+++##.', // 8
  '.#+oo+.ss.++++aaaaa++=#.', // 9
  '.#+o+++.ss.++aaoppaa+=#.', // 10
  '.#++++++.ss.+aapppaa+=#.', // 11
  '.#+++++++.ss.aapppaa+=#.', // 12
  '.#++++++++.ss.aaaaa++=#.', // 13
  '.#+++++++++.ss.aaa+++=#.', // 14
  '.#++++++++++.ss.+++++=#.', // 15
  '.#+++++++++++.ss.++++=#.', // 16
  '.#++++++++++++.ss.+++=#.', // 17
  '.#+++++++++++++.ss.++=#.', // 18
  '.##=============.ss.=##.', // 19
  '..###############.ss.#..', // 20
  '...................ss...', // 21
  '....................ss..', // 22
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
