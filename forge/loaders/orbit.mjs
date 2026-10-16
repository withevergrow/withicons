// A planet with a ring, and a moon swinging round it on a tilted orbit: in front it is large and passes over the
// planet, behind it is smaller and slips behind the planet, so the orbit reads in depth.
import { circle, solid, stroke, E } from './_kit.mjs'

const STEPS = 24
// the moon is drawn twice, behind and in front of the planet; each copy is visible on its half of the orbit and
// they swap at the far left and right, where the moon is clear of the planet
const keysFor = front => {
  const ks = []
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS, a = t * Math.PI * 2, depth = Math.sin(a)   // > 0: lower half of the ellipse = in front
    const vis = front ? depth >= -0.001 : depth <= 0.001
    ks.push([t, { x: Math.cos(a) * 8.5, y: Math.sin(a) * 3.2, s: 0.82 + 0.28 * depth, o: vis ? 1 : 0, e: E.linear }])
  }
  return ks
}
export default {
  name: 'orbit', title: 'Orbit', group: 'common',
  description: 'A moon circles a ringed planet on a tilted orbit, passing in front large and slipping behind small.',
  intent: 'something is in progress, round and round, calmly',
  aliases: ['planet-orbit', 'satellite-loader', 'moon-orbit', 'orbit-spinner'],
  tags: ['loading', 'space', 'orbit'], synonyms: ['loading', 'syncing', 'processing', 'space'],
  duration: 2,
  parts: [
    { skel: stroke('M3.5 12 A8.5 3.2 0 0 1 20.5 12', 'A') },
    { skel: solid(circle(12, 12, 1.6), 'S'), motion: { origin: [12, 12], keys: keysFor(false) } },
    { skel: solid(circle(12, 12, 4.5)) },
    { skel: stroke('M3.5 12 A8.5 3.2 0 0 0 20.5 12', 'A') },
    { skel: solid(circle(12, 12, 1.6), 'S'), motion: { origin: [12, 12], keys: keysFor(true) } },
  ],
}
