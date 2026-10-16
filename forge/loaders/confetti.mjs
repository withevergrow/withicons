// Party: a popper kicks back and throws a burst of confetti (ribbons, squiggles, dots) up and out; the pieces slow
// in the air, flutter and tumble as they turn, and drift down under gravity before they fade. Each piece has its
// own launch, spin and flutter, a hair apart, so the burst never looks mechanical.
import { solid, stroke, circle, rr, E } from './_kit.mjs'
import { pick, fly } from './_festival.mjs'

const O = [11.4, 12.6]                     // the popper's mouth: every piece is drawn here, 1/0.6 size, shown at 0.6
const RIB = (w, h) => solid(rr(O[0] - w, O[1] - h, O[0] + w, O[1] + h, 0.3))
const WAVE = stroke(`M${O[0] - 1.6} ${O[1]} q0.8 -1.2 1.6 0 t1.6 0`)
const DOT = r => solid(circle(O[0], O[1], r))
const PIECES = [
  // shape, plate, heading (clock degrees), speed (units per cycle), drag, launch time, flight time, spin, flutter
  [RIB(0.8, 1.5), 'A', -24, 88, 5, 0.05, 0.8, 520, 3],
  [DOT(1.1), 'S', -2, 104, 5.5, 0.06, 0.82, 0, 0],
  [WAVE, 'A', 16, 98, 4.8, 0.07, 0.8, -380, 0],
  [RIB(0.75, 1.4), 'S', 32, 92, 5.2, 0.08, 0.78, -600, 4],
  [WAVE, 'S', 48, 80, 5.6, 0.1, 0.66, 420, 0],
  [DOT(1), 'A', 62, 70, 6, 0.11, 0.6, 0, 0],
]
export default {
  name: 'confetti', title: 'Confetti', group: 'festival',
  description: 'A party popper kicks back and throws confetti that flies up, flutters, tumbles and drifts down before it fades.',
  intent: 'celebration incoming: something worth a party is nearly ready',
  aliases: ['confetti-loader', 'party-loader', 'party-popper-loader', 'celebration-loader', 'confetti-burst'],
  tags: ['loading', 'festival', 'party', 'celebration', 'birthday'], synonyms: ['confetti', 'party', 'celebrate', 'birthday', 'congratulations', 'hooray', 'new year'],
  duration: 2.6,
  morph: ['party-popper'],
  parts: [
    ...PIECES.map(([skel0, plate, a, v, k, t0, T, spin, flip]) => ({
      skel: { ...skel0, paths: skel0.paths.map(p => ({ ...p, plate })) },
      motion: { origin: O, keys: fly({ t0, t1: t0 + T, v: [v * Math.sin(a * Math.PI / 180), -v * Math.cos(a * Math.PI / 180)], g: 200, k, spin, flip, fade: 0.25, n: 8, s: 0.6 }) },
    })),
    // the popper: kicks back on the pop and springs home
    {
      skel: pick('party-popper', [0, 1], { fills: [0], cutouts: [0] }),
      motion: { origin: [6, 17], keys: [[0, { x: 0, y: 0, r: 0, e: E.out }], [0.05, { x: -0.7, y: 0.7, r: -5, e: E.spring }], [0.2, { x: 0, y: 0, r: 0 }], [1, { x: 0, y: 0, r: 0 }]] },
    },
  ],
}
