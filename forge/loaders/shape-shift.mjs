// One shape that keeps becoming the next: circle, rounded square, triangle, star, heart. Each pops out of a dot
// with a little spin and springs to size, holds, then folds back into the dot.
import { circle, rr, poly, star, heart, solid, show, E } from './_kit.mjs'

const SHAPES = [
  solid(circle(12, 12, 7)),
  solid(rr(5, 5, 19, 19, 3.5)),
  solid('M12 4.5 L19.75 18.25 Q20 19 19.25 19 L4.75 19 Q4 19 4.25 18.25 Z'),
  solid(star(12, 12.75, 8.5, 0.47)),
  solid(heart(12, 12.5, 0.85)),
]
const n = SHAPES.length
export default {
  name: 'shape-shift', title: 'Shape shift', group: 'creative',
  description: 'A single shape keeps transforming: circle, square, triangle, star and heart bloom out of a dot in turn.',
  intent: 'playful waiting that never looks the same twice',
  aliases: ['morphing-shapes', 'shape-morph', 'shapes-loader', 'transforming-shape'],
  tags: ['loading', 'morph', 'shapes', 'playful'], synonyms: ['loading', 'morph', 'transform', 'shapes'],
  duration: 4,
  parts: SHAPES.map((skel, i) => ({ skel, motion: { origin: [12, 12], keys: show(i, n, { fade: 0.3, enter: { s: 0.15, r: -90, o: 0 }, exit: { s: 0.15, r: 90, o: 0 } }) } })),
}
