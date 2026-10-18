// forge/hand/pastel/battery.mjs — the pastel battery: the family's lavender shell and terminal nub around a paper well,
// with two chunky deep-mint charge cells (A) of three slots so the level holds on white, where the thin pale bar faded.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['lavender@K', rr(1.75, 6, 19.25, 18, 3.25)],
    ['lavender.flat@K', rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
    ['paper.well@K', rr(3.9, 8.15, 17.1, 15.85, 1.6)],
    ['mint.deep@A', rr(5.25, 9.5, 8.75, 14.5, 1.1), rr(9.75, 9.5, 13.25, 14.5, 1.1)],
  ], icon)
}
