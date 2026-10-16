// Fireworks: three shells, one after another. Each rocket climbs on a short trail and bursts with a flash; long rays
// shoot out from the heart and are gone in a blink, leaving a ring of glitter that hangs, droops and fades.
// The rays and glitter are drawn large and shown scaled down (at most 0.6), so they open from the centre on fine
// strokes. Few parts on purpose: every part is a drawing, and copies place one drawing three times.
import { stroke, solid, dot, polar, E } from './_kit.mjs'
import { rays, twinkle } from './_festival.mjs'

const C = [12, 10.5]                                 // the drawn shell; copies move it
const N = 8
const glitter = Array.from({ length: N }, (_, i) => { const [x, y] = polar(C[0], C[1], 8.4, i * 45); return dot(x, y) }).join(' ')
// three shells at different spots and times (every part of a shell shares its offset and lag)
const SHELLS = [{ x: -3.5, y: -2, lag: 0 }, { x: 3.5, y: -0.5, lag: 0.34 }, { x: 0, y: 2, lag: 0.67 }]
const T0 = 0.18                                      // the moment a shell bursts (of its own cycle)
export default {
  name: 'fireworks', title: 'Fireworks', group: 'festival',
  description: 'Three fireworks in turn: a rocket climbs and bursts, long rays shoot out and vanish, glitter hangs, droops and fades.',
  intent: 'celebration on its way: something good is about to happen',
  aliases: ['fireworks-loader', 'firework-burst', 'new-year-fireworks', 'diwali-fireworks', 'celebration-burst'],
  tags: ['loading', 'festival', 'celebration', 'new year', 'diwali'], synonyms: ['fireworks', 'firework', 'burst', 'celebrate', 'new year', 'diwali', 'fourth of july'],
  duration: 3,
  parts: [
    // the rocket trail: a short streak that climbs and goes out where the shell bursts
    {
      skel: stroke(`M${C[0]} ${C[1] + 0.8} L${C[0]} ${C[1] + 2.8}`, 'K'),
      motion: { origin: C, keys: [[0, { y: 7, o: 0, sy: 0.6, e: E.out }], [0.03, { y: 6, o: 1, sy: 1, e: E.lift }], [T0 - 0.01, { y: 0, o: 0.8, sy: 0.6, e: E.in }], [T0 + 0.02, { y: -0.6, o: 0, sy: 0.3 }], [1, { y: 7, o: 0, sy: 0.6 }]] },
      copies: SHELLS,
    },
    // the rays: shoot out fast from the heart and go out
    {
      skel: stroke(rays(C[0], C[1], 2.2, 10, N, 22.5), 'A'),
      motion: { origin: C, keys: [[0, { s: 0.1, o: 0 }], [T0 - 0.005, { s: 0.1, o: 0, e: E.expoOut }], [T0 + 0.1, { s: 0.52, o: 1, e: E.out }], [T0 + 0.2, { s: 0.62, o: 0 }], [1, { s: 0.1, o: 0 }]] },
      copies: SHELLS,
    },
    // the flash at the heart of the burst
    {
      skel: solid(twinkle(C[0], C[1], 2.8, 0.2), 'S'),
      motion: { origin: C, keys: [[0, { s: 0.1, o: 0, r: 0 }], [T0 - 0.01, { s: 0.1, o: 0, r: 0, e: E.expoOut }], [T0 + 0.05, { s: 1, o: 1, r: 25, e: E.in }], [T0 + 0.15, { s: 0.2, o: 0, r: 45 }], [1, { s: 0.1, o: 0, r: 0 }]] },
      copies: SHELLS,
    },
    // the glitter: sparks between the rays, flung out a beat later; they hang, droop under gravity and wink out
    {
      skel: stroke(glitter, 'S'),
      motion: { origin: C, keys: [[0, { s: 0.25, o: 0, y: 0 }], [T0 + 0.02, { s: 0.25, o: 0, y: 0, e: E.expoOut }], [T0 + 0.15, { s: 0.6, o: 1, y: 0.2, e: E.ease }], [T0 + 0.3, { s: 0.66, o: 0.9, y: 0.9, e: E.gravity }], [T0 + 0.5, { s: 0.7, o: 0, y: 2.6 }], [1, { s: 0.25, o: 0, y: 0 }]] },
      copies: SHELLS,
    },
  ],
}
