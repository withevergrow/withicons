// monitor-smartphone: a closed monitor on a stand with a small phone (wm-s) beside it, screen and home bar visible.
// Hand-drawn 24-grid sprite: # ink, + tone, = shade, o shine; @ - ~ are the wm-s part's ink, tone and shade.
import { useGrid, grid, ix, gridD } from '../../styles/_pixel-core.mjs'

const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '..###########...........',
  '.#o+++++++++=#..........',
  '.#o+++++++++=#..........',
  '.#++++++++++=#..@@@@@...',
  '.#++++++++++=#.@o----@..',
  '.#++++++++++=#.@-----@..',
  '.#++++++++++=#.@-----@..',
  '.#++++++++++=#.@-----@..',
  '.#++++++++++=#.@-----@..',
  '.#+==========#.@-----@..',
  '..###########..@----~@..',
  '......###......@-~~~~@..',
  '......###......@@@@@@@..',
  '....#######....@-@@@-@..',
  '....#######....@-----@..',
  '................@@@@@...',
  '........................',
  '........................',
  '........................',
]

export default function render() {
  useGrid(24)
  const L = { ink: grid(), tone: grid(), shade: grid(), pInk: grid(), pTone: grid(), pShade: grid(), shine: grid() }
  const KEY = { '#': 'ink', '+': 'tone', '=': 'shade', '@': 'pInk', '-': 'pTone', '~': 'pShade', o: 'shine' }
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) { const k = KEY[MAP[j][i]]; if (k) L[k][ix(i, j)] = 1 }
  const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
  const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
  const out = []
  const push = (g, attrs, cls) => { const d = gridD(g); if (d) out.push(['path', cls ? { d, ...attrs, class: cls } : { d, ...attrs }]) }
  push(L.tone, TONE); push(L.shade, SHADE); push(L.ink, {})
  push(L.pTone, TONE, 'wm-s'); push(L.pShade, SHADE, 'wm-s'); push(L.pInk, {}, 'wm-s')
  push(L.shine, { fill: 'var(--with-pixel-shine, #FFFFFF)' }, 'wm-shine')
  return out
}
