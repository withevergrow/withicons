// forge/hand/pastel/search.mjs — the pastel magnifier with a readable lens: a thick lavender rim, a paper bezel
// that separates it from the sky glass (the camera-lens build), an explicit glint and a peach handle (A).
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { seg2, ring, circle, arc } = Prim
  return compose([
    ['peach@A', seg2(15.75, 15.75, 20.25, 20.25, 3.75)],
    ['lavender', ring(10.5, 10.5, 8.5, 5.5)],
    ['paper.flat', circle(10.5, 10.5, 5.5)],
    ['sky.well', circle(10.5, 10.5, 4.25)],
    ['shine', arc(10.5, 10.5, 2.75, 200, 255, 1.1)],
  ], icon)
}
