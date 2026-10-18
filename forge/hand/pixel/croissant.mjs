// forge/hand/pixel/croissant.mjs — a crescent croissant with five bulging rolls (a tall centre, two sides, two
// hooked horns) split by dark seams that fan out from the inner curve; replaces the generated arch.
import { useGrid } from '../../styles/_pixel-core.mjs'
import { fromMap, nodes } from '../../styles/_pixel-render.mjs'

const MAP = [
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '..........XXXX..........',
  '.........XXXXXX.........',
  '......XX#XXXXXX#XX......',
  '.....XXX#XXXXXX#XXX.....',
  '.....XXX#XXXXXX#XXX.....',
  '...XX#XXX#XXXX#XXX#XX...',
  '..XXX#XXX#XXXX#XXX#XXX..',
  '..XXXX#XX#XXXX#XX#XXXX..',
  '..XXXX#XX#XXXX#XX#XXXX..',
  '..XXXXXXXXXXXXXXXXXXXX..',
  '..XXXXX..........XXXXX..',
  '..XXXX............XXXX..',
  '...XX..............XX...',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',
  '........................',

]

export default function render() {
  useGrid(24)
  return nodes(fromMap(MAP))
}
