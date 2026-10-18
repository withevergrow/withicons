// forge/hand/pastel/video-camera.mjs — the pastel camcorder with a real lens: the sky body now carries a paper bezel
// and a lavender glass well (the camera exemplar's lens build) so it reads as a camera, not a plain box with a dot,
// plus the lavender viewfinder horn (A) and a small blush record light.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr, poly, circle, arc } = Prim
  return compose([
    ['sky', rr(1.75, 5.25, 16, 18.75, 3.25)],
    ['lavender@A', poly([[15, 10], [22.25, 6.25], [22.25, 17.75], [15, 14]], [1, 1.5, 1.5, 1])],
    ['paper@K', circle(8.5, 12, 4.6)],
    ['lavender.well@K', circle(8.5, 12, 3)],
    ['shine', arc(8.5, 12, 1.85, 200, 260, 1)],
    ['blush.flat@K', circle(13.6, 7.9, 1)],
  ], icon)
}
