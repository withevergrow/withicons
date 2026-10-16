// Sonar: a centre dot gives a small beat and sends out a ring; three rings are in the water at once, each slowing as
// it reaches the edge and fading to nothing at the edge. Rings are drawn at full size and scaled up from the dot, so a ring is
// thin while it is small and dense, and only reaches full weight as it fades. The ring is an open full-turn stroke,
// so styles draw it as a line, never as a filled disc.
import { arc, circle, solid, stroke, E } from './_kit.mjs'
import { sampled } from './_common-a.mjs'

const RING = 9.25, S0 = 0.24, S1 = 0.97, N = 3
const glide = t => 1 - (1 - t) ** 1.4   // nearly constant speed (real ripples), easing a touch at the edge
const ringKeys = sampled(16, t => ({ s: S0 + (S1 - S0) * glide(t), o: Math.min(1, t / 0.08) * 0.95 * (1 - t) ** 1.7 }))
export default {
  name: 'ripple', title: 'Ripple', group: 'common',
  description: 'A centre dot beats and sends out rings that spread, slow down and fade, three in the water at once, like sonar.',
  intent: 'live, listening, broadcasting or searching nearby',
  aliases: ['sonar', 'pulse-rings', 'radar-pulse', 'live-pulse', 'ripple-loader', 'broadcast-pulse'],
  tags: ['loading', 'pulse', 'live', 'sonar', 'rings'], synonyms: ['live', 'listening', 'searching', 'broadcasting', 'ping'],
  duration: 2.4,
  parts: [
    { skel: stroke(arc(12, 12, RING, 0, 360), 'A'), motion: { origin: [12, 12], keys: ringKeys }, copies: Array.from({ length: N }, (_, i) => ({ x: 0, y: 0, lag: i / N })) },
    { skel: solid(circle(12, 12, 1)), motion: { origin: [12, 12], rep: N, keys: [[0, { s: 1, e: E.out }], [0.12, { s: 1.35, e: E.ease }], [0.62, { s: 1 }], [1, { s: 1 }]] } },
  ],
}
