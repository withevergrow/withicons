// Christmas: a tree strung with lights that chase down it in a zig-zag, like a garland switching on bulb by bulb,
// while the star on top swells and spins once on a spring, then rests. The bulbs sit in small windows in the tree, so filled styles show them too.
import { circle, dot, stroke, E } from './_kit.mjs'
import { pick } from './_festival.mjs'

// bulbs in garland order: top, then zig-zag down the tree
const BULBS = [[12, 11], [14, 14.2], [10, 14.2], [8.2, 16.5], [12, 16.6], [15.8, 16.5]]
const n = BULBS.length
const STAR = [12, 4.6]   // the centre of the icon's star
const bulbKeys = [[0, { s: 0.75, o: 0.45, e: E.expoOut }], [0.06, { s: 1.45, o: 1, e: E.ease }], [0.4, { s: 0.75, o: 0.45 }], [1, { s: 0.75, o: 0.45 }]]
const bulb = (plate, idx) => ({
  skel: stroke(dot(BULBS[0][0], BULBS[0][1]), plate),
  motion: { origin: BULBS[0], keys: bulbKeys, rep: 2 },
  copies: idx.map(i => ({ x: BULBS[i][0] - BULBS[0][0], y: BULBS[i][1] - BULBS[0][1], lag: i / n })),
})
export default {
  name: 'christmas-tree', title: 'Christmas tree', group: 'festival',
  description: 'A Christmas tree whose lights chase down it bulb by bulb while the star on top spins on a spring.',
  intent: 'cosy holiday cheer: the lights are coming on',
  aliases: ['xmas-tree-loader', 'christmas-lights-loader', 'tree-lights', 'holiday-tree-loader', 'twinkling-tree'],
  tags: ['loading', 'festival', 'christmas', 'holiday', 'lights'], synonyms: ['christmas', 'xmas', 'holiday', 'tree', 'fairy lights', 'twinkle'],
  duration: 3.6,
  morph: ['christmas-tree'],
  parts: [
    // the tree and trunk, with a small window where each bulb hangs
    { skel: pick('christmas-tree', [0, 1], { fills: [0, 2], cutouts: BULBS.map(([x, y]) => circle(x, y, 1.15)) }) },
    // the bulbs in two colours, chasing in garland order (twice per cycle)
    bulb('A', [0, 2, 4]),
    bulb('S', [1, 3, 5]),
    // the star: one springy turn, swelling as it spins, then a long rest
    {
      skel: pick('christmas-tree', [2], { fills: [1] }),
      motion: { origin: STAR, keys: [[0, { r: 0, s: 1 }], [0.6, { r: 0, s: 1, e: E.spring }], [0.84, { r: 360, s: 1.12, e: E.ease }], [0.94, { r: 360, s: 1 }], [1, { r: 360, s: 1 }]] },
    },
  ],
}
