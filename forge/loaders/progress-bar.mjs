// Indeterminate progress: a bar runs along a still track. It eases in from the left, stretches long while it is
// fastest, shortens as it brakes at the right and fades out; then the next run fades in at the left.
import { rr, line, stroke } from './_kit.mjs'
import { sampled, ease } from './_common-b.mjs'

const TRACK = rr(2.5, 9.25, 21.5, 14.75, 2.75)         // a long, thin capsule (inner run ~3.4..20.6)
const PILL = line(9.5, 12, 14.5, 12)                    // the bar: one round-capped stroke, 5 + caps long
const HALF = 2.5 + 1                                    // its half length with the cap (heaviest styles)
const LO = 0.6, HI = 1.65                               // stretch at the ends / at full speed
const FROM = -(12 - 3.6 - HALF * LO), TO = -FROM        // never past the track's inner edge
export default {
  name: 'progress-bar', title: 'Progress bar', group: 'common',
  description: 'Indeterminate progress: a bar eases along a still track, stretching long at speed and fading at the ends.',
  intent: 'working on it, no idea how long: keep going',
  aliases: ['indeterminate-progress', 'linear-progress', 'progress-track', 'loading-bar', 'progress-pill'],
  tags: ['loading', 'progress', 'bar', 'linear'], synonyms: ['loading', 'progress', 'working', 'processing', 'busy'],
  duration: 1.6,
  parts: [
    { skel: stroke(TRACK, 'A') },
    {
      skel: stroke(PILL),
      motion: {
        origin: [12, 12],
        keys: sampled(t => {
          const p = ease.inOut(t)
          // speed of the eased run, 0 at the ends and 3 (x the average) at the middle: the stretch follows it
          const v = t < 0.5 ? 12 * t * t : 12 * (1 - t) ** 2
          const sx = LO + (HI - LO) * v / 3
          // narrow at the ends so a short pill never pokes past the track; fade in and out over the first/last 15%
          const o = Math.min(1, t / 0.15, (1 - t) / 0.15)
          return { x: FROM + (TO - FROM) * p, sx, sy: 1, o }
        }, 20),
      },
    },
  ],
}
