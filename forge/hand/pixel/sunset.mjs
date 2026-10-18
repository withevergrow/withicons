// forge/hand/pixel/sunset.mjs — a half-sun dome on a 2px horizon with two diagonal rays and a clean down arrow above it
// Legend: + body tone, = shade, # outline, - ~ * the moving part (tone, shade, ink), @ the badge, o the shine pixels.
import * as G from '../../styles/_pixel-core.mjs'

const MAP = [
  '........................',
  '...........@@...........',
  '...........@@...........',
  '...........@@...........',
  '.......@@..@@..@@.......',
  '........@@.@@.@@........',
  '.........@@@@@@.........',
  '..........@@@@..........',
  '...........@@...........',
  '........................',
  '....**............**....',
  '.....**..######..**.....',
  '........#oo++++#........',
  '.......#+o+++++=#.......',
  '.......#+++++++=#.......',
  '.......#+++=====#.......',
  '.######################.',
  '.######################.',
  '........................',
  '........................',
  '........########........',
  '........########........',
  '........................',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['-', TONE, 'wm-a'], ['~', SHADE, 'wm-a'], ['*', {}, 'wm-a'],
  ['@', {}, 'wm-s'], ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]

export default function render() {
  const prev = G.N
  G.useGrid(24)
  const out = []
  for (const [ch, attrs, cls] of LAYERS) {
    const g = G.grid()
    MAP.forEach((row, j) => { for (let i = 0; i < row.length; i++) if (row[i] === ch) g[G.ix(i, j)] = 1 })
    const d = G.gridD(g)
    if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }])
  }
  G.useGrid(prev)
  return out
}
