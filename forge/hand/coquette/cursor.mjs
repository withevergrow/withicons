// forge/hand/coquette/cursor.mjs — the pointer redrawn plumper (a fuller arrowhead, a thicker tail and a firmer
// wine line) so the blush satin holds its contrast on a light page; the gold twinkle stays by the tip.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  const head = k.poly([[4.6, 2.4], [19.6, 12.8], [12, 13.9], [7.4, 20.6]], 1.1)
  const tail = k.seg(11.9, 13.8, 15.7, 20.8, 3.4)
  return paint([
    k.body(k.union(head, tail), { ow: 0.8 }),
    k.sparkle(18.4, 4.4, 2),
  ])
}
