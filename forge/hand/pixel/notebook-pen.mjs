// forge/hand/pixel/notebook-pen.mjs — notebook with spiral rings and a pen laid diagonally across its top right
// Legend: + body tone, = shade, # outline, t s A moving-part tone/shade/ink, - ~ * deco tone/shade/ink, p q @ badge tone/shade/ink, o the shine pixels.
import * as G from '../../styles/_pixel-core.mjs'

const MAP = [
  '..................@.....',
  '.................@q@....',
  '.....###########@@qq@...',
  '....#++++++++++@pp@qq@..',
  '....#++oo+++++@ppqq@@...',
  '....#++o+++++@ppqqq@....',
  '.######+++++@ppqqq@.....',
  '.######++++@ppqqq@......',
  '....#++++++@pqqq@.......',
  '....#++++++@@qq@#.......',
  '....#++++++@@@@+#.......',
  '.######+++++++++#.......',
  '.######+++++++++#.......',
  '....#+++++++++++#.......',
  '....#+++++++++++#.......',
  '....#+++++++++++#.......',
  '.######+++++++++#.......',
  '.######+++++++++#.......',
  '....#+++++++++++#.......',
  '....#+++++++++++#.......',
  '....#===========#.......',
  '.....###########........',
  '........................',
  '........................',
]

const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['t', TONE, 'wm-a'], ['s', SHADE, 'wm-a'], ['A', {}, 'wm-a'],
  ['-', TONE, 'wm-deco'], ['~', SHADE, 'wm-deco'], ['*', {}, 'wm-deco'],
  ['p', TONE, 'wm-s'], ['q', SHADE, 'wm-s'], ['@', {}, 'wm-s'], ['o', { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine']]

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
