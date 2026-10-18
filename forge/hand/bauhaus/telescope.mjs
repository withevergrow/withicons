// forge/hand/bauhaus/telescope.mjs — a large blue tube with a red objective, on a solid ink A-frame tripod plate.
import { rr, pill, poly, circle, cut, rot } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const A = -26.57, PX = 12, PY = 9

export default function render(icon) {
  const legs = cut(poly([[12, 11.5], [4.5, 22.5], [19.5, 22.5]], [0.8, 0.8, 0.8]), poly([[12, 17], [9.25, 22.5], [14.75, 22.5]], [0.5, 0.5, 0.5]))
  return compose([
    ['ink', legs],
    ['c2', circle(12, 12.5, 2.5)],
    ['c3', rot(pill(2, 5.25, 16, 12.25), A, PX, PY)],
    ['c1', rot(rr(15, 3.75, 21.5, 13.75, 1.5), A, PX, PY)],
  ], icon)
}
