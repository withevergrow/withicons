// forge/hand/bauhaus/cloud-sun.mjs — the redesigned cloud-sun: a yellow sun disc upper-left with five evenly spaced
// red bar rays (as in bauhaus sun), tucked behind a blue cloud lower-right that a 1.25u moat lifts off the sun,
// matching the new skeleton instead of the old arc-crowned drawing.
import { circle, pill, seg2, unite, cut, join } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const S = [9, 9]
const ray = a => {
  const r = Math.PI / 180 * a
  return seg2(S[0] + 6 * Math.cos(r), S[1] + 6 * Math.sin(r), S[0] + 7.75 * Math.cos(r), S[1] + 7.75 * Math.sin(r), 2.5)
}

export default function render(icon) {
  const cloud = unite(circle(9.75, 17, 3.75), circle(15.25, 13.75, 5), circle(18.75, 17.25, 3.5), pill(6, 15.5, 22.25, 20.75))
  const moat = unite(circle(9.75, 17, 5), circle(15.25, 13.75, 6.25), circle(18.75, 17.25, 4.75), pill(4.75, 14.25, 23.5, 22))
  return compose([
    ['c1', cut(join(ray(180), ray(225), ray(270), ray(315), ray(135)), moat)],
    ['c2', cut(circle(...S, 4.25), moat)],
    ['c3', cloud],
  ], icon)
}
