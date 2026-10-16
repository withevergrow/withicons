// The default loader: a long arc sweeping round a faint track. One stroke (so every style draws it as one clean
// piece), turning once per cycle with a pulse in its speed: it surges, eases, surges again, never stopping, the way
// a hand-wound mechanism keeps time. Speed is 1 + a cos(4 pi t), so the angle ends the cycle exactly one turn on.
import { arc, ring, stroke } from './_kit.mjs'
import { sampled } from './_common-a.mjs'

const R = 8, SPAN = 250, a = 0.6
const angle = t => 360 * t + 360 * a * Math.sin(4 * Math.PI * t) / (4 * Math.PI)
export default {
  name: 'spinner', title: 'Spinner', group: 'common',
  description: 'A long arc sweeps round a faint track, surging and easing twice a turn so it feels driven rather than mechanical.',
  intent: 'the default: something is working, steadily and with purpose',
  aliases: ['loading-spinner', 'arc-spinner', 'circular-progress', 'indeterminate-spinner', 'busy-indicator'],
  tags: ['loading', 'spinner', 'progress', 'busy', 'wait'], synonyms: ['loading', 'please wait', 'busy', 'working', 'in progress'],
  duration: 1.3,
  parts: [
    { skel: ring(12, 12, R, 'A'), motion: { keys: [[0, { o: 0.22 }], [1, { o: 0.22 }]] } },
    { skel: stroke(arc(12, 12, R, -SPAN / 2, SPAN / 2)), motion: { origin: [12, 12], keys: sampled(24, t => ({ r: angle(t) })) } },
  ],
}
