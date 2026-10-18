// forge/hand/coquette/circle.mjs — a blush ring with a clear open hole, scalloped lace peeking round its outer edge
// and one small satin bow at the upper right.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([[
    k.lace(k.circlePts(12, 12, 9.1, 0, 360, 60), 0.85, { closed: true, eyelets: false }),
    k.body(k.cut(k.disc(12, 12, 9.1), k.disc(12, 12, 6.1)), { ow: 0.7 }),
    k.bow(18.3, 5.6, 0.62, 42),
  ]].flat(Infinity).filter(Boolean))
}
