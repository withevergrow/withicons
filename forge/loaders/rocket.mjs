// A rocket holding its hover: it bobs on a slow figure-of-eight with a faint engine tremble, exhaust puffs drop from
// the nozzle and billow out as they fade, and speed streaks pour past top to bottom so it reads as climbing.
import { circle, line, solid, stroke, icon, E } from './_kit.mjs'
import { named, placed } from './_creative-a.mjs'

const C = [12, 9.6]           // the rocket's centre after it is stood upright
const S = 0.56
// the library rocket points up-right: it is stood up (-45 deg), shrunk and lifted through its motion (placed), so the
// styles that draw the rocket from hand-tuned art stand theirs up too
const FX = 'wl-rocket'   // exhaust and streaks: own geometry, so a neutral part name (not the rocket icon's)
const NOZZLE = [12, 16.3]
// a little smoke cloud: three bumps over a soft base, centred on (cx, cy)
const cloud = (cx, cy, k = 1) => { const p = (x, y) => `${(cx + x * k).toFixed(3)} ${(cy + y * k).toFixed(3)}`; return `M${p(-1.6, 1.3)} A1.3 1.3 0 0 1 ${p(-1.75, -0.6)} A1.35 1.35 0 0 1 ${p(0, -1.6)} A1.35 1.35 0 0 1 ${p(1.75, -0.6)} A1.3 1.3 0 0 1 ${p(1.6, 1.3)} Z` }
// hover: a slow drift up and a little side to side, with a sub-pixel tremble riding on it (two loops a cycle)
const hover = [
  [0, { x: 0, y: 0, r: 0, e: E.ease }],
  [0.125, { x: 0.18, y: -0.35, r: 1.2, e: E.ease }],
  [0.25, { x: 0.3, y: -0.75, r: 0, e: E.ease }],
  [0.375, { x: 0.05, y: -0.5, r: -1.2, e: E.ease }],
  [0.5, { x: -0.25, y: -0.2, r: 0, e: E.ease }],
  [0.625, { x: -0.3, y: -0.55, r: 1, e: E.ease }],
  [0.75, { x: -0.05, y: -0.8, r: 0, e: E.ease }],
  [0.875, { x: 0.12, y: -0.4, r: -1, e: E.ease }],
  [1, { x: 0, y: 0, r: 0 }],
]
// one exhaust puff: pops out of the nozzle, drops and spreads sideways (dx), swells and fades
const puff = dx => [
  [0, { x: 0, y: -0.6, s: 0.35, o: 0, e: E.out }],
  [0.12, { x: dx * 0.2, y: 0.4, s: 0.7, o: 1, e: E.lift }],
  [0.85, { x: dx, y: 3.4, s: 1.15, o: 0.15, e: E.linear }],
  [1, { x: dx * 1.05, y: 3.6, s: 1.2, o: 0 }],
]
// a speed streak: fades in at the top, pours down, fades out
const streak = [
  [0, { y: 0, o: 0, e: E.linear }],
  [0.2, { y: 3.2, o: 0.9, e: E.linear }],
  [0.75, { y: 12, o: 0.6, e: E.linear }],
  [1, { y: 15, o: 0 }],
]
const streakFaint = [[0, { y: 0, o: 0, e: E.linear }], [0.25, { y: 2.5, o: 0.55, e: E.linear }], [1, { y: 10, o: 0 }]]
export default {
  name: 'rocket', title: 'Rocket', group: 'creative',
  description: 'A rocket hovers with a faint engine tremble while exhaust puffs drop and billow below and speed streaks pour past.',
  intent: 'launching: building, shipping, lift-off is close',
  aliases: ['rocket-loader', 'rocket-launch-loader', 'hovering-rocket', 'liftoff-loader', 'launch-spinner'],
  tags: ['loading', 'rocket', 'launch', 'space', 'startup'],
  synonyms: ['launching', 'deploying', 'shipping', 'lift off', 'boost', 'blast off'],
  duration: 1.6,
  morph: ['rocket'],
  parts: [
    { skel: named(stroke(line(3.25, 1.5, 3.25, 7.5), 'A'), FX), motion: { origin: [3.25, 4.5], keys: streak, rep: 2 },
      copies: [{ x: 0, lag: 0 }, { x: 17.5, lag: 0.45 }] },
    { skel: named(stroke(line(6.5, 2.5, 6.5, 5.5), 'A'), FX), motion: { origin: [6.5, 4], keys: streakFaint, rep: 2 },
      copies: [{ x: 0, lag: 0.7 }, { x: 11, lag: 0.2 }] },
    { skel: named(solid(cloud(...NOZZLE), 'S'), FX), motion: { origin: NOZZLE, keys: puff(-3.6), rep: 2 } },
    { skel: named(solid(cloud(...NOZZLE), 'S'), FX), motion: { origin: NOZZLE, keys: puff(3.6), rep: 2, lag: 0.5 } },
    { skel: named(solid(cloud(...NOZZLE, 0.7), 'S'), FX), motion: { origin: NOZZLE, keys: puff(0.3), rep: 2, lag: 0.27 } },
    { skel: icon('rocket'), motion: { origin: [12, 12], keys: placed(hover, { s: S, r: -45, x: C[0] - 12, y: C[1] - 12 }) } },
  ],
}
