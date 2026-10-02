// Live icon: a stopwatch with the elapsed seconds swept out as a pie wedge (forge/DYNAMIC.md).
// Frame = the static `timer` face + crown, plus a second pusher; the wedge is the sweep hand + its trail.
import { STOPWATCH, wedge, circle, hand } from './_parts-time.mjs'
import { live } from './_font.mjs'

const SWEEP = 4.5 // wedge radius: 1.5u of white inside the face ink

export default live({
  name: 'stopwatch', title: 'Stopwatch with elapsed time', category: 'time',
  description: 'A stopwatch whose sweep hand has swept out the seconds you choose, from 0 to a full minute.',
  aliases: ['elapsed-time', 'lap-timer', 'chronograph', 'stop-watch', 'split-timer', 'race-timer', 'elapsed-seconds'],
  tags: ['time', 'stopwatch', 'elapsed', 'sport', 'progress'],
  synonyms: ['lap', 'split time', 'sprint', 'race', 'workout', 'interval', 'how long', 'time taken', 'duration',
    'seconds', 'measure time', 'chrono', 'speed', 'benchmark', 'reaction time'],
  params: {
    seconds: { type: 'int', min: 0, max: 60, default: 15, label: 'Elapsed seconds (of a minute)' },
  },
  examples: [{ seconds: 0 }, { seconds: 5 }, { seconds: 15 }, { seconds: 40 }, { seconds: 60 }],
  build({ seconds }) {
    const [cx, cy] = STOPWATCH.c
    const deg = Math.max(0, Math.min(60, seconds)) * 6
    const full = deg >= 360
    // 0 s: the bare sweep hand at 12; a full minute: the whole swept disc (no hand: a ring with a radius reads as 'power')
    const sweep = deg <= 0 ? hand(cx, cy, SWEEP, 0) : full ? circle(cx, cy, SWEEP) : wedge(cx, cy, SWEEP, deg)
    const paths = [
      { d: STOPWATCH.face, plate: 'K' },
      { d: STOPWATCH.crown, plate: 'A' },
      ...STOPWATCH.pushers.map(d => ({ d, plate: 'A' })),
      { d: sweep, plate: 'A' },
    ]
    return {
      paths,
      fills: [STOPWATCH.face],
      // the swept area is knocked out of filled faces as an area; the bare hand at 0 s as a line
      cutouts: [sweep],
    }
  },
})
