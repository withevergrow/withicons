// forge/hand/coquette/git-pull-request.mjs: the common pull-request diagram in blush satin: a left rail joining a top and a bottom
// node, a right node, and a ribbon-red arrow that curves up out of the right node and points left into the top node; it
// replaces a drawing with a downward arrow ending in a heart and no bottom-left node.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

const node = (x, y) => [
  k.body(k.disc(x, y, 3), { ow: 0.55 }),
  k.cream(k.disc(x, y, 1.15), { ow: 0.4, noShadow: true }),
]

export default function render() {
  return paint([
    k.rose(k.tube('M5 8 V16', 2.1), { plate: 'K', ow: 0.5 }),
    k.satin(k.union(k.tube('M12.5 6 H17 A2 2 0 0 1 19 8 V16', 2.1), k.tube('M14.8 3.4 L12 6 L14.8 8.6', 2.1)), { plate: 'A', ow: 0.5 }),
    node(5, 6), node(5, 18), node(19, 18),
    k.sparkle(20.6, 3.6, 1.7),
  ].flat(Infinity))
}
