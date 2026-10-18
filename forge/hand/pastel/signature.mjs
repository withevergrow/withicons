// forge/hand/pastel/signature.mjs — the pastel signature: the generated butter scrawl was pale and thin on white, so the
// scrawl is a heavier lavender soft bar with an open loop (crossing once, like a real signature) above a peach line.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { stroke, seg2 } = Prim
  const D = 'M3 15.75 C6.5 13.75 10.75 10.25 10.75 6 C10.75 2.75 5.25 2.75 5.25 6 C5.25 10 6.5 16 9 16 C10.75 16 11.25 12.5 12.75 12.5 C14.25 12.5 14.25 16 15.75 16 C17.25 16 18.25 13.5 21 13.5'
  return compose([
    ['lavender@K', stroke(D, 2.6)],
    ['peach@A', seg2(3.25, 20.5, 20.75, 20.5, 2.5)],
  ], icon)
}
