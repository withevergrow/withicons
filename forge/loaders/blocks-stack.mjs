// Three toy blocks drop in one at a time and stack: each one falls with gravity, lands with a squash, and the stack
// under it gives a little. The tower holds proudly, then tips over to the right and fades, and the stacking starts again.
import { rr, circle, poly, star, E } from './_kit.mjs'

const G = 20.5                                            // the floor
// [x0, y0, x1, y1] bottom up, and the mark knocked out of each block
const BOX = [[6.5, 15.25, 17.5, G], [7.75, 10, 16.25, 15.25], [9, 4.3, 15, 10]]
const MARKS = [circle(12, 18.2, 1.3), poly([[12, 11.5], [13.55, 14.3], [10.45, 14.3]]), star(12, 7.6, 1.6, 0.48)]
const block = (b, mark) => {
  const d = rr(b[0], b[1] + 0.7, b[2], b[3], 1.4)          // a seam above each block keeps them apart in solid styles
  return { paths: [{ d, plate: 'K' }, { d: mark, plate: 'A' }], fills: [d], cutouts: [mark] }
}
const LAND = [0.15, 0.31, 0.46]                          // when each block lands
const SPAWN_TOP = 1.8                                    // every block appears with its top here, then falls
const C = 0.93                                           // how much the stack below gives when a block lands
const PIVOT = [17.5, G], TIP = 24                        // the tower tips over its bottom-right corner
const rot = (dx, dy, a) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return [dx * c - dy * s, dx * s + dy * c] }

function blockKeys(i) {
  const [, top, , bot] = BOX[i], o = [12, bot], h = top - SPAWN_TOP
  const fall = 0.032 * Math.sqrt(h)                      // fall time grows with the square root of the height
  const L = LAND[i]
  const k = [[0, { x: 0, y: -h, sx: 1, sy: 1, r: 0, o: 0 }]]
  if (h > 0.01) k.push([L - fall, { y: -h, o: 0, e: E.gravity }])
  else k.push([L - 0.03, { y: -0.01, o: 0, e: E.gravity }])
  k.push([L, { y: 0, o: 1, e: E.out }])
  // its own landing: squash on what is below, rebound, settle
  const give = (G - bot) * (1 - C)                       // the stack below compresses about the floor
  k.push([L + 0.03, { sx: 1.14, sy: 0.8, y: give, e: E.ease }], [L + 0.075, { sx: 0.97, sy: 1.05, y: 0, e: E.ease }], [L + 0.12, { sx: 1, sy: 1, y: 0, e: E.ease }])
  // the blocks above landing on it: it gives with the stack
  for (let j = i + 1; j < BOX.length; j++) {
    const Lj = LAND[j], down = (G - bot) * (1 - C)
    k.push([Lj, { sx: 1, sy: 1, y: 0, e: E.out }], [Lj + 0.03, { sx: 1.02, sy: C, y: down, e: E.ease }], [Lj + 0.08, { sx: 1, sy: 1, y: 0, e: E.ease }])
  }
  // the topple: the whole tower turns about the corner (ease in), fading as it goes
  const T0 = 0.7, T1 = 0.86, N = 5
  for (let n = 0; n <= N; n++) {
    const u = n / N, a = TIP * u * u
    const [rx, ry] = rot(o[0] - PIVOT[0], o[1] - PIVOT[1], a)
    k.push([T0 + (T1 - T0) * u, { x: PIVOT[0] + rx - o[0], y: PIVOT[1] + ry - o[1], r: a, sx: 1, sy: 1, o: u < 0.4 ? 1 : 1 - (u - 0.4) / 0.6, e: E.linear }])
  }
  k.push([1, { x: 0, y: -h, sx: 1, sy: 1, r: 0, o: 0 }])
  return k.sort((a, b) => a[0] - b[0])
}
export default {
  name: 'blocks-stack', title: 'Stacking blocks', group: 'creative',
  description: 'Three toy blocks drop in and stack with squashy landings, the tower holds, tips over and fades, then again.',
  intent: 'building something up, piece by piece',
  aliases: ['stacking-blocks', 'toy-blocks-loader', 'tower-building', 'block-tower', 'falling-blocks'],
  tags: ['loading', 'building', 'blocks', 'playful', 'kids'],
  synonyms: ['building', 'assembling', 'stacking', 'constructing', 'putting it together'],
  duration: 3.4,
  morph: [],
  parts: BOX.map((b, i) => ({ skel: block(b, MARKS[i]), motion: { origin: [12, b[3]], keys: blockKeys(i) } })),
}
