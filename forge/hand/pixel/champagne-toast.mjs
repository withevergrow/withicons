// forge/hand/pixel/champagne-toast.mjs — two tilted champagne flutes (V bowl half full, stem, slanted foot) clinking
// at the rims under three spark dashes; replaces the generated sprite that collapsed into a spiky H.
import { useGrid, grid, ix } from '../../styles/_pixel-core.mjs'
import { fromMap, nodes } from '../../styles/_pixel-render.mjs'

// the left flute (cols 0-11); the right one is its mirror. # ink, + tone (champagne), = shade, o shine, . paper
const HALF = [
  '............',
  '...........#',
  '......##...#',
  '.......##..#',
  '............',
  '............',
  '......##....',
  '.....#o+##..',
  '.....#++++##',
  '....#++++++#',
  '....#=====#.',
  '....#====#..',
  '....#===#...',
  '....#==#....',
  '.....##.....',
  '....#.......',
  '....#.......',
  '...#........',
  '...#........',
  '.###........',
  '...###......',
  '............',
  '............',
  '............',
]
const MAP = HALF.map(r => r + [...r].reverse().join('').replace(/o/g, '+'))

export default function render() {
  useGrid(24)
  const L = fromMap(MAP)
  // the sparks above the clink (rows 2-4) are the S part that twinkles
  const k = grid(), a = grid(), s = grid()
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) (j <= 5 ? s : k)[ix(i, j)] = 1
  L.plates = { k, a, s }
  return nodes(L)
}
