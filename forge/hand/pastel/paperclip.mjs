// forge/hand/pastel/paperclip.mjs — the pastel paperclip as one lavender wire (the deepest pastel hue, so it holds on
// white) bent into the classic two-loop spiral with open 2u gaps between the legs, drawn upright and turned 45°.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { stroke, rot, scale } = Prim
  const wire = stroke('M12 14 V5.25 A2.25 2.25 0 0 1 16.5 5.25 V16.5 A4.5 4.5 0 0 1 7.5 16.5 V6.75', 2.6)
  return compose([
    ['lavender', scale(rot(wire, 45, 12, 12), 1.08, 12, 12)],
  ], icon)
}
