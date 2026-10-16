// A radar scope: a sweep arm turns at a steady rate with a fading afterglow, and each blip lights up exactly as the
// arm passes over it (its lag is its angle), then dims away before the next pass.
import { circle, line, polar, solid, stroke, merge, E } from './_kit.mjs'

// parts draw under their own name: "radar" is also a library icon, and some styles hand-draw that icon by name
const NAME = 'loader-radar'
const C = [12, 12], R = 9.25
const arm = stroke(line(12, 12, 12, 12 - R + 0.9), 'A')
const sweep = (from, o) => [[0, { r: from, o, e: E.linear }], [1, { r: from + 360, o }]]
// blips: [clock angle, distance]; the arm passes angle a at t = a / 360 of the cycle
const BLIPS = [[62, 6.2], [168, 3.9], [284, 6.6]]
const b0 = polar(12, 12, BLIPS[0][1], BLIPS[0][0])
const blip = [
  [0, { s: 0.3, o: 0, e: E.out }], [0.025, { s: 1.4, o: 1, e: E.ease }], [0.1, { s: 1, o: 1, e: E.ease }],
  [0.7, { s: 0.8, o: 0 }], [1, { s: 0.3, o: 0 }],
]
export default {
  name: 'radar', title: 'Radar', group: 'creative',
  description: 'A radar sweep turns steadily with a fading afterglow; blips light up the instant the arm passes them.',
  intent: 'scanning, searching, looking for something nearby',
  aliases: ['radar-sweep', 'radar-scan', 'sonar-loader', 'scanning-radar'],
  tags: ['loading', 'search', 'scan', 'radar', 'location'],
  synonyms: ['scanning', 'searching', 'detecting', 'looking', 'finding nearby', 'sonar'],
  duration: 2.4,
  parts: [
    { name: NAME, skel: merge(stroke(circle(12, 12, R)), stroke(circle(12, 12, 5), 'A'), solid(circle(12, 12, 1.2))) },
    // the afterglow: two fainter arms trailing the sweep
    { name: NAME, skel: arm, motion: { origin: C, keys: sweep(-30, 0.2) } },
    { name: NAME, skel: arm, motion: { origin: C, keys: sweep(-15, 0.45) } },
    { name: NAME, skel: arm, motion: { origin: C, keys: sweep(0, 1) } },
    {
      name: NAME, skel: solid(circle(b0[0], b0[1], 1.15), 'S'), motion: { origin: b0, keys: blip },
      copies: BLIPS.map(([a, d]) => { const p = polar(12, 12, d, a); return { x: p[0] - b0[0], y: p[1] - b0[1], lag: a / 360 - 0.008 } }),
    },
  ],
}
