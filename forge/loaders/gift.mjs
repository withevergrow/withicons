// A present that can't wait: the box wiggles side to side, crouches, and hops; the lid pops off on a spring with a
// tilt while sparkles burst out of the box; the box lands with a squash, the lid drops back on, bounces and settles.
import { solid, E } from './_kit.mjs'
import { pick, twinkle } from './_festival.mjs'

const T = { s: 0.74, y: 2.2 }                      // the gift on stage: a little smaller, low, room for the lid to fly
const at = (x, y) => [12 + (x - 12) * T.s, 12 + (y - 12) * T.s + T.y]
const B = at(12, 21)                              // the bottom centre: the box wiggles, squashes and lands on it
const C = at(12, 10)                              // the lid's middle: it tilts about it
const box = [
  [0, { x: 0, y: 0, r: 0, sx: 1, sy: 1, e: E.ease }], [0.12, { r: 0, e: E.ease }],
  [0.17, { r: -7, e: E.ease }], [0.22, { r: 6, e: E.ease }], [0.27, { r: -4, e: E.ease }], [0.31, { r: 2, e: E.ease }],
  [0.35, { r: 0, sx: 1, sy: 1, e: E.ease }],
  [0.42, { sx: 1.1, sy: 0.85, e: E.out }],                    // crouch
  [0.5, { y: -1.2, sx: 0.95, sy: 1.06, e: E.gravity }],         // hop, stretched
  [0.58, { y: 0, sx: 1, sy: 1, e: E.out }],                   // land
  [0.62, { sx: 1.09, sy: 0.9, e: E.ease }],                   // squash
  [0.7, { sx: 1, sy: 1 }],
  [1, {}],
]
// the box's keys (about B) as keys for the lid (about C): the same placement for every point
const full = k => ({ x: 0, y: 0, r: 0, sx: 1, sy: 1, ...k })
const r3 = v => Math.round(v * 1000) / 1000
const asLid = k0 => {
  const k = full(k0), a = k.r * Math.PI / 180, dx = (C[0] - B[0]) * k.sx, dy = (C[1] - B[1]) * k.sy
  return { ...k, x: r3(B[0] + k.x + dx * Math.cos(a) - dy * Math.sin(a) - C[0]), y: r3(B[1] + k.y + dx * Math.sin(a) + dy * Math.cos(a) - C[1]) }
}
let last = {}
const boxFull = box.map(([t, k]) => { last = { ...last, ...k }; return [t, { ...last, e: k.e }] })
const lidY = asLid(box[6][1]).y                   // where the lid sits when the box is at rest (0)
const lid = [
  ...boxFull.filter(([t]) => t <= 0.42).map(([t, k]) => [t, { ...asLid(k), e: k.e }]),
  [0.5, { x: 0.4, y: lidY - 5.9, r: -14, sx: 1, sy: 1, e: E.ease }],   // popped off, tilted, hanging
  [0.56, { x: 0.2, y: lidY - 5.5, r: -9, e: E.gravity }],
  [0.65, { x: 0, y: lidY, r: 0, e: E.out }],                          // drops back on
  [0.69, { y: lidY - 0.8, r: 3, e: E.ease }],                          // bounce
  [0.74, { y: lidY, r: 0, e: E.ease }],
  [1, { x: 0, y: lidY, r: 0, sx: 1, sy: 1 }],
]
// sparkles fanned over the box's mouth; they burst out (scale from the mouth) as the lid flies
const M = at(12, 12)
const FAN = [[-84, 8.4, 1.4], [-52, 8, 1.9], [-14, 7.6, 1.3], [50, 8.2, 1.8], [82, 8.4, 1.3]]
const sparkles = FAN.map(([a, r, s]) => { const q = (a - 90) * Math.PI / 180; return twinkle(M[0] + r * Math.cos(q), M[1] + r * Math.sin(q), s, 0.2) }).join(' ')
export default {
  name: 'gift', title: 'Gift', group: 'festival',
  description: 'A gift box wiggles, crouches and hops; the lid pops off as sparkles burst out, then drops back on and settles.',
  intent: 'a surprise is coming: excitement you can feel',
  aliases: ['gift-loader', 'present-loader', 'gift-box-open', 'surprise-loader', 'unboxing-loader'],
  tags: ['loading', 'festival', 'gift', 'birthday', 'christmas'], synonyms: ['gift', 'present', 'surprise', 'birthday', 'christmas', 'reward', 'unbox'],
  duration: 3.2,
  morph: ['gift'],
  parts: [
    // the lid with its ribbon band and bow (behind the box: it only meets the box at its rim)
    { skel: pick('gift', [0, 3], { fills: [0, 2, 3], cutouts: ['M12 8 V12', 2, 3], t: T, extra: { paths: [{ d: 'M12 8 V12', plate: 'A' }] } }), motion: { origin: C, keys: lid } },
    // the box (open at the top) and the lower ribbon
    { skel: pick('gift', [1], { fills: [1], cutouts: ['M12 12 V21'], t: T, extra: { paths: [{ d: 'M12 12 V21', plate: 'A' }] } }), motion: { origin: B, keys: box } },
    // sparkles, between box and lid: out of the mouth, on the pop, gone as the lid lands
    {
      skel: solid(sparkles, 'S'),
      motion: { origin: M, keys: [[0, { s: 0.2, o: 0, r: 0 }], [0.44, { s: 0.2, o: 0, r: 0, e: E.expoOut }], [0.54, { s: 1, o: 1, r: 15, y: -1, e: E.ease }], [0.68, { s: 1.06, o: 0, r: 25, y: -1.8 }], [1, { s: 0.2, o: 0, r: 0 }]] },
    },
  ],
}
