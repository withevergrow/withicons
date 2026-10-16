// A jar of fireflies on a summer night: four drift on lazy figure-of-eights inside the glass and two that got out
// wander above it, each glowing up (with a glint) and dimming on its own slow rhythm, never all at once.
import { circle, rr, line, polar, solid, stroke, merge, E } from './_kit.mjs'

const JAR = 'M9.25 7.75 C7.5 8.75 6.5 9.75 6.5 11.5 V19 A2 2 0 0 0 8.5 21 H15.5 A2 2 0 0 0 17.5 19 V11.5 C17.5 9.75 16.5 8.75 14.75 7.75'
const LID = rr(8.25, 4.75, 15.75, 7.75, 1)
const N = 16
// one flight: a lazy figure-of-eight (half-size ax, ay) with one soft glow per cycle; keys relative to the start point
function flight(home, ax, ay, dir) {
  const P = u => { const a = 2 * Math.PI * dir * u; return [home[0] + ax * Math.sin(a), home[1] + ay * Math.sin(2 * a + 0.8)] }
  const p0 = P(0), keys = []
  for (let i = 0; i <= N; i++) {
    const u = i / N, [x, y] = P(u)
    const g = Math.pow(0.5 + 0.5 * Math.cos(2 * Math.PI * (u - 0.25)), 2.4)
    keys.push([u, { x: x - p0[0], y: y - p0[1], o: 0.2 + 0.8 * g, s: 0.68 + 0.47 * g, e: E.linear }])
  }
  return { p0, keys }
}
// inside the jar: one firefly placed four times, each copy at its own point of the loop (lag) so they never sync
const IN = flight([9.9, 16.9], 1.2, 1, 1)
const INSIDE = [[9.9, 16.9, 0], [14.2, 16.4, 0.27], [13.7, 12.4, 0.54], [10.2, 12, 0.79]]
// the escapees: a wider loop the other way round, and a glint of four rays that shows as they glow
const OUT = flight([5.1, 5.4], 0.6, 0.9, -1)
const OUTSIDE = [[5.1, 5.4, 0.12], [18.9, 9.2, 0.62]]
const glint = c => stroke([0, 90, 180, 270].map(a => { const p = polar(c[0], c[1], 1.6, a), q = polar(c[0], c[1], 2, a); return line(p[0], p[1], q[0], q[1]) }).join(' '), 'A')
export default {
  name: 'fireflies', title: 'Fireflies', group: 'creative',
  description: 'Fireflies drift on lazy loops in a glass jar, two escapees wander above, each glowing on its own slow rhythm.',
  intent: 'quiet, gentle waiting on a warm summer night',
  aliases: ['firefly-jar', 'glowing-fireflies', 'lightning-bugs', 'firefly-loader', 'jar-of-lights'],
  tags: ['loading', 'nature', 'night', 'calm', 'glow', 'summer'],
  synonyms: ['glow', 'calm', 'night', 'twinkle', 'lightning bugs', 'summer night'],
  duration: 4,
  parts: [
    { skel: merge(stroke(JAR), solid(LID, 'A')) },
    {
      skel: solid(circle(IN.p0[0], IN.p0[1], 1.05), 'S'), motion: { origin: IN.p0, keys: IN.keys },
      copies: INSIDE.map(([x, y, lag]) => ({ x: x - 9.9, y: y - 16.9, lag })),
    },
    {
      skel: merge(solid(circle(OUT.p0[0], OUT.p0[1], 1.05), 'S'), glint(OUT.p0)), motion: { origin: OUT.p0, keys: OUT.keys },
      copies: OUTSIDE.map(([x, y, lag]) => ({ x: x - 5.1, y: y - 5.4, lag })),
    },
  ],
}
