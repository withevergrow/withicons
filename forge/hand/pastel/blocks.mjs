// forge/hand/pastel/blocks.mjs — the pastel building blocks: three chunky lit toy blocks stacked as a pyramid in three
// hues (sky, peach, butter), so the cluster reads as play blocks at 16px instead of three same-hue sky tiles.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { compose } from '../../styles/_pastel-compose.mjs'

export default function render(icon) {
  const { rr } = Prim
  return compose([
    ['sky@K', rr(2.25, 12.75, 11, 21.5, 2.5)],
    ['peach@K', rr(13, 12.75, 21.75, 21.5, 2.5)],
    ['butter@K', rr(7.625, 2, 16.375, 10.75, 2.5)],
  ], icon)
}
