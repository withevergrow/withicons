// forge/hand/bauhaus/captions.mjs — the redesigned captions: a blue screen carrying the skeleton's CC mark as two cream
// round-capped C bands (wm-a, so the "fill" motion switches them on), replacing the old text-bar card that read as a
// keyboard or a credit card.
import { rr, stroke } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c3', rr(2, 4, 22, 20, 3)],
    ['tint', stroke('M10 8.5 H8.75 A2.75 2.75 0 0 0 6 11.25 V12.75 A2.75 2.75 0 0 0 8.75 15.5 H10', 2.25),
      stroke('M18 8.5 H16.75 A2.75 2.75 0 0 0 14 11.25 V12.75 A2.75 2.75 0 0 0 16.75 15.5 H18', 2.25)],
  ], icon)
}
