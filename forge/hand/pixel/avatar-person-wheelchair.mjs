// forge/hand/pixel/avatar-person-wheelchair.mjs — a seated person (round head, torso, thigh and shin on the footrest)
// beside one big 2px wheel with a hub and a small caster, replacing the generated sprite whose wheel broke apart.
import { useGrid, grid, ix } from '../../styles/_pixel-core.mjs'
import { fromMap, nodes } from '../../styles/_pixel-render.mjs'

// X body (outline + tone), # ink detail (wheel, arm, footrest, caster)
const MAP = [
  '........................',
  '...........XXX..........',
  '..........XXXXX.........',
  '..........XXXXX.........',
  '..........XXXXX.........',
  '...........XXX..........',
  '........................',
  '...........XXX..........',
  '........##XXXXX.........',
  '.......##.XXXXX.........',
  '.......##.XXXXXXXX......',
  '.......##.XXXXXXXXX.....',
  '.......##.XXXXXXXXX.....',
  '......####......XXX.....',
  '....########....XXX.....',
  '...###....###....XXX....',
  '...##......##....XXX....',
  '...##..##..##....XXX....',
  '...##..##..##....XXXX...',
  '...##......########.##..',
  '...###....#############.',
  '....########.......####.',
  '......####..........##..',
  '........................',
]

export default function render() {
  useGrid(24)
  const L = fromMap(MAP)
  // the head is the K plate, the chair and the body are A (as in the skeleton)
  const k = grid(), a = grid(), s = grid()
  for (let j = 0; j < 24; j++) for (let i = 0; i < 24; i++) (j <= 5 ? k : a)[ix(i, j)] = 1
  L.plates = { k, a, s }
  return nodes(L)
}
