// forge/hand/coquette/pause.mjs — two plump blush satin bars with nothing tied on them (the bow competed with the
// glyph); the only ornament is a small gold twinkle in the free top-right corner, off the bars.
import { KIT as k } from '../../styles/_coquette-render.mjs'
import { paint } from '../../styles/_coquette-paint.mjs'

export default function render() {
  return paint([
    k.body(k.union(k.pill(5, 4.2, 10, 19.8), k.pill(14, 4.2, 19, 19.8))),
    k.sparkle(21.2, 3, 1.7),
  ])
}
