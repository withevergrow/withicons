// A growth story on one patch of soil: a seed wiggles awake, a sprout pushes up, it becomes a leafy plant, the plant
// becomes a rose, and the rose folds back down into the seed. Every stage blooms up out of the soil line and sinks
// back into it, so the loop closes on the same seed it opened with.
import { icon, merge, solid, stroke, xform, E } from './_kit.mjs'
import { ellipse, leafShape } from './_creative-b.mjs'

const SOIL = [12, 21]                                   // every stage grows from (and sinks into) this point
// the seed: a tilted almond sitting on the soil, with a seam
const SEED = xform(ellipse(12, 18.7, 2.6, 1.65), { r: -18, about: [12, 18.7] })
const seed = merge(solid(SEED), stroke('M10.6 18.9 Q12 18.1 13.4 18.2', 'A'))
// the library sprout without its own soil line (the loader draws one soil line for every stage)
const sprout = icon('sprout')
sprout.paths = sprout.paths.filter(p => !/^M7 21 H17$/.test(p.d))
// a leafy plant: a tall stem with alternating leaves and a folded top leaf
const LEAF = [[12, 17.8, 5, 14.6, 2.3, -0.3], [12, 14.4, 19, 11, 2.3, 0.3], [12, 10.8, 6.4, 7.2, 1.95, -0.3], [12, 7, 15.4, 3.2, 1.5, 0.3]]
const plant = merge(stroke('M12 21 V7'), ...LEAF.map(([x0, y0, x1, y1, w, b]) => solid(leafShape(x0, y0, x1, y1, w, b))))
// the rose, lifted so its stem stands on the soil line
const rose = icon('rose', { y: -0.5 })

// a stage on stage: grows out of the soil at a, sways while it holds, sinks back at b
const GONE = { sx: 0.5, sy: 0.04, o: 0, r: 0 }
function stage(a, b, { grow = 0.085, sink = 0.045, sway = 3 } = {}) {
  const h = b - sink - (a + grow)
  return [
    [0, { ...GONE }],
    [a, { ...GONE, e: E.spring }],
    [a + grow, { sx: 1, sy: 1, o: 1, r: 0, e: E.ease }],
    [a + grow + h * 0.33, { r: sway, e: E.ease }],
    [a + grow + h * 0.72, { r: -sway * 0.6, e: E.ease }],
    [b - sink, { r: 0, sx: 1, sy: 1, o: 1, e: E.in }],
    [b, { ...GONE }],
    [1, { ...GONE }],
  ]
}
// the seed is on stage at both ends of the cycle: it wiggles awake, ducks into the soil, and pops back at the end
const SEED_O = [12, 20.3]
const seedKeys = [
  [0, { sx: 1, sy: 1, o: 1, r: 0, e: E.ease }],
  [0.045, { r: -14, e: E.ease }],
  [0.085, { r: 12, e: E.ease }],
  [0.12, { r: -6, e: E.ease }],
  [0.14, { r: 0, sx: 1.12, sy: 0.85, e: E.in }],
  [0.175, { ...GONE, sx: 0.6 }],
  [0.935, { ...GONE, sx: 0.6, e: E.spring }],
  [1, { sx: 1, sy: 1, o: 1, r: 0 }],
]
export default {
  name: 'plant-grow', title: 'Plant grow', group: 'creative',
  description: 'A seed wiggles awake, sprouts, grows leaves, blooms into a rose, then folds back down into the seed.',
  intent: 'something is growing: patient progress that ends in a bloom',
  aliases: ['seed-to-flower', 'growing-plant', 'sprouting-seed', 'blooming-loader', 'growth-story'],
  tags: ['loading', 'nature', 'growth', 'morph', 'plant', 'story'],
  synonyms: ['growing', 'progress', 'nurturing', 'blooming', 'sprout', 'garden'],
  duration: 6,
  morph: ['sprout', 'rose'],
  parts: [
    { skel: stroke('M5.5 21 H18.5', 'A') },
    { skel: seed, motion: { origin: SEED_O, keys: seedKeys } },
    { skel: sprout, motion: { origin: SOIL, keys: stage(0.165, 0.4) } },
    { skel: plant, motion: { origin: SOIL, keys: stage(0.395, 0.635, { sway: 2.5 }) } },
    { skel: rose, motion: { origin: SOIL, keys: stage(0.63, 0.945, { grow: 0.1, sway: 2 }) } },
  ],
}
