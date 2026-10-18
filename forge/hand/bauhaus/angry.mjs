// forge/hand/bauhaus/angry.mjs — the redesigned angry face: a red disc with thick 2.5u brows slanting down to the
// nose (the strongest cue, readable at 16px), round eyes set low under them and a frown arc on the skeleton's r4
// circle, so it matches the new skeleton instead of the old bespoke drawing.
import { circle, seg2, arc } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  return compose([
    ['c1', circle(12, 12, 9.75)],
    ['ink',
      seg2(7.25, 7.25, 10.25, 9.25, 2.5), seg2(16.75, 7.25, 13.75, 9.25, 2.5),
      circle(9, 13, 1.5), circle(15, 13, 1.5),
      arc(12, 20.75, 4, 222, 318, 2.25)],
  ], icon)
}
