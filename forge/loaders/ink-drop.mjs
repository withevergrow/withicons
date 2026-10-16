// A drop of ink swells at the top, lets go, stretches as it falls and splats into a pond: ripples run out
// across the surface, and a tiny rebound droplet jumps up out of the impact and falls back with a ripple of its own.
import { circle, drop, solid, stroke, E } from './_kit.mjs'
import { ellipse } from './_creative-b.mjs'

const SURF = 17.6                                        // the pool surface (impact point y)
const D = [12, 6.7]                                      // the drop's round body at rest at the top
const DS = 0.72                                          // drop scale: ~5.8u tall
const FALL = SURF - (D[1] + 3.5 * DS)                    // distance until the drop's bottom touches the surface
const dropKeys = [
  [0, { s: 0.2, y: 0, o: 0, e: E.spring }],
  [0.12, { s: 1, o: 1, e: E.ease }],                      // swells out of nothing
  [0.2, { sx: 0.92, sy: 1.08, y: -0.3, e: E.gravity }],   // gathers, lets go
  [0.36, { sx: 0.88, sy: 1.16, y: FALL, e: E.out }],      // stretched by the fall
  [0.4, { sx: 1.7, sy: 0.3, y: FALL + 0.3, o: 0 }],       // splat into the pool
  [1, { s: 0.2, y: 0, o: 0 }],
]
// ripples: flat ellipses on the surface that grow out of the impact and fade; a later copy is the rebound's ripple
const ring = stroke(ellipse(12, SURF, 9, 3.2), 'A')
const ripple = [
  [0, { s: 0.15, o: 0 }], [0.39, { s: 0.15, o: 0, e: E.out }], [0.43, { s: 0.35, o: 1, e: E.out }],
  [0.62, { s: 0.63, o: 0.9, e: E.ease }], [0.8, { s: 0.8, o: 0 }], [1, { s: 0.15, o: 0 }],
]
// the rebound droplet: shot straight up out of the impact, hangs, falls back in
const hop = [
  [0, { y: 0, s: 0.4, o: 0 }], [0.405, { y: 0, s: 0.4, o: 0, e: E.lift }],
  [0.42, { y: -1.5, s: 1, o: 1, e: E.lift }], [0.56, { y: -6.2, s: 1, e: E.gravity }],
  [0.7, { y: -0.4, s: 0.85, o: 1 }], [0.72, { y: 0, s: 0.4, o: 0 }], [1, { y: 0, s: 0.4, o: 0 }],
]
export default {
  name: 'ink-drop', title: 'Ink drop', group: 'creative',
  description: 'An ink drop swells, falls stretched and splats into a pond: ripples run out and a droplet rebounds.',
  intent: 'a moment of patience: something is being absorbed and settling in',
  aliases: ['water-drop-ripple', 'droplet-splash', 'ink-drop-ripple', 'drip-loader', 'falling-drop'],
  tags: ['loading', 'water', 'ink', 'drop', 'ripple', 'calm'],
  synonyms: ['dripping', 'absorbing', 'settling', 'splash', 'ripple', 'liquid'],
  duration: 2.6,
  parts: [
    { skel: stroke(ellipse(12, SURF, 9, 3.2)) },
    { skel: ring, motion: { origin: [12, SURF], keys: ripple }, copies: [{ x: 0, y: 0, lag: 0 }, { x: 0, y: 0, lag: 0.13 }, { x: 0, y: 0, lag: 0.33 }] },
    { skel: solid(circle(12, SURF - 1.4, 0.95), 'S'), motion: { origin: [12, SURF - 1.4], keys: hop } },
    { skel: solid(drop(D[0], D[1], DS)), motion: { origin: [12, D[1] + 3.5 * DS], keys: dropKeys } },
  ],
}
