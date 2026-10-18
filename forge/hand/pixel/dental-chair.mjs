// forge/hand/pixel/dental-chair.mjs — a reclined dentist's chair (headrest, backrest, seat, leg rest) on a pedestal
// and base, with the overhead lamp as a clean stem, shade and bulb; replaces the generated, scattered sprite.
import { useGrid, grid, ix } from '../../styles/_pixel-core.mjs'
import { fromMap, nodes } from '../../styles/_pixel-render.mjs'

const MAP = [
  '........................',
  '...............##.......',
  '...XXX.........##.......',
  '...XXXX.......XXXX......',
  '...XXXXX.....XXXXXX.....',
  '....XXXXX...XXXXXXXX....',
  '....XXXXX...XXXXXXXX....',
  '.....XXXXX..............',
  '.....XXXXX..............',
  '......XXXXXXXXXX........',
  '......XXXXXXXXXXX.......',
  '.......XXXXXXXXXXX......',
  '........XXXXXXXXXXX.....',
  '...........##...XXXX....',
  '...........##....XXXX...',
  '...........##.....XXXX..',
  '...........##......XX...',
  '...........##...........',
  '...........##...........',
  '.......XXXXXXXXXX.......',
  '.......XXXXXXXXXX.......',
  '.......XXXXXXXXXX.......',
  '........................',
  '........................',
]

export default function render() {
  useGrid(24)
  const L = fromMap(MAP)
  // the lamp (stem, shade, bulb: rows 1-7, right of the backrest) is the A part that sways
  const k = grid(), a = grid(), s = grid()
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) (j <= 7 && i >= 11 ? a : k)[ix(i, j)] = 1
  L.plates = { k, a, s }
  return nodes(L)
}
