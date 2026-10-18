// forge/hand/pixel/mail-plus.mjs — a clean pixel envelope with a 2:1 V flap and its bottom-right corner notched around a 2px plus badge
import * as G from '../../styles/_pixel-core.mjs'

// map chars: # ink, + body tone, = shade, o shine; A/a/b part A (ink/tone/shade, wm-a); S part S (ink, wm-s)
const TONE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.28 }
const SHADE = { fill: 'var(--with-pixel-fill, currentColor)', 'fill-opacity': 0.55 }
const SHINE = { fill: 'var(--with-pixel-shine, #FFFFFF)' }
const LAYERS = [['+', TONE], ['=', SHADE], ['#', {}], ['a', TONE, 'wm-a'], ['b', SHADE, 'wm-a'], ['A', {}, 'wm-a'],
  ['S', {}, 'wm-s'], ['o', SHINE, 'wm-shine']]

const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '..###################...',
  '.###oo+++++++++++++###..',
  '.#++##+++++++++++##++#..',
  '.#++++##+++++++##+++=#..',
  '.#++++++##+++##+++++=#..',
  '.#++++++++###+++++++=#..',
  '.#++++++++++++++++++=#..',
  '.#+++++++++++========#..',
  '.#++++++++++##########..',
  '.#+++++++++=#...........',
  '.#+++++++++=#....SS.....',
  '.#+++++++++=#....SS.....',
  '.#+++++++++=#....SS.....',
  '.#==========#.SSSSSSSS..',
  '..###########.SSSSSSSS..',
  '.................SS.....',
  '.................SS.....',
  '.................SS.....',
  '........................',
  '........................',
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
