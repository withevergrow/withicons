// forge/hand/coquette/cloud-off.mjs — the new cloud-off skeleton: a blush satin cloud (small left puff, tall crown,
// right puff on a flat base) split cleanly by a ribbon-red slash with a moat on both sides; the generated drawing kept
// the old cloud and let the slash sit on top of it.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const slash = k.seg(3.2, 3.2, 20.8, 20.8, 2)
  const cloud = k.union(
    k.disc(7.2, 14.6, 4.3),
    k.disc(12.2, 11.9, 6),
    k.disc(17.2, 14.8, 4.1),
    k.rr(7.2, 14, 17.2, 18.9, 0),
  )
  return paint([
    k.body(k.moat(cloud, slash, 0.8)),
    k.satin(slash, { plate: 'S' }),
  ])
}
