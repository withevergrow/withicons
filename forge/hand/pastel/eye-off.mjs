// forge/hand/pastel/eye-off.mjs — the pastel hidden eye, after the new skeleton: a lavender almond broken in two by a
// moated blush slash (S) so the lids open where it crosses, with the sky iris and ink pupil (A) split by the same gap.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { slashLayers } from '../../styles/_pastel-kit.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { lens, circle } = Prim
  return compose([
    ['lavender@K', lens(1.75, 12, 22.25, 12, 6.75)],
    ['cut', circle(12, 12, 5.35)],
    ['sky@A', circle(12, 12, 4.4)],
    ['ink@A', circle(12, 12, 2)],
    ...slashLayers('blush', [3.5, 3.5], [20.5, 20.5], 2.6),
  ], icon)
}
