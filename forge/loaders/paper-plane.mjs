// A paper plane glides in, pulls up into a loop-the-loop and glides out, nose always along its flight path. It slows
// as it climbs over the top and speeds up diving out of the loop, and a dotted trail follows it round.
import { solid, poly, circle } from './_kit.mjs'
import { keysOf, unwrap, timeByEnergy } from './_creative-a.mjs'

const CX = 12, CY = 12.2, LA = 0.55, LB = 4.8, RUN = 5
// the flight: a straight run in, a loop (a prolate trochoid: x = a.phi - b.sin(phi), y = -b.cos(phi)), a run out
const flight = (() => {
  const pts = []
  const loop = ph => [CX + LA * ph - LB * Math.sin(ph), CY - LB * Math.cos(ph)]
  const [x0, y0] = loop(-Math.PI), [x1, y1] = loop(Math.PI)
  for (let i = 0; i < 8; i++) pts.push([x0 - RUN + RUN * i / 8, y0])
  for (let i = 0; i <= 40; i++) pts.push(loop(-Math.PI + 2 * Math.PI * i / 40))
  for (let i = 1; i <= 8; i++) pts.push([x1 + RUN * i / 8, y1])
  return pts
})()
const times = timeByEnergy(flight, { v0: 2.4, g: 1 })
const heads = unwrap(flight.map((p, i) => {
  const a = flight[Math.max(0, i - 1)], b = flight[Math.min(flight.length - 1, i + 1)]
  return Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI
}))
// position (and heading) at cycle time u: piecewise linear over the flight samples
const at = u => {
  let i = 0
  while (i < times.length - 2 && u > times[i + 1]) i++
  const w = (u - times[i]) / (times[i + 1] - times[i] || 1)
  const L = (a, b) => a + (b - a) * Math.max(0, Math.min(1, w))
  return [L(flight[i][0], flight[i + 1][0]), L(flight[i][1], flight[i + 1][1]), L(heads[i], heads[i + 1])]
}
const P0 = flight[0]
const fade = (t, o, out) => o * Math.max(0, Math.min(1, t / 0.08, (1 - t) / out))
const fly = (o, rot, out = 0.08) => keysOf(t => {
  const [x, y, r] = at(t)
  return { x: x - P0[0], y: y - P0[1], ...(rot ? { r } : {}), o: fade(t, o, out) }
}, 44)
// the plane, nose right, centred on the flight point: a folded paper dart (wing K, fold line A)
const S = 0.85, Q = (x, y) => [P0[0] + x * S, P0[1] + y * S]
const DART = poly([Q(4.4, 0), Q(-4, -3.4), Q(-1.3, 0.45), Q(-2.5, 3.2)])
const PLANE = { paths: [{ d: DART, plate: 'K' }, { d: poly([Q(-1.3, 0.45), Q(4.4, 0)], false), plate: 'A' }], fills: [DART], cutouts: [poly([Q(-1.3, 0.45), Q(3, 0.1)], false)] }
const DOT = solid(circle(P0[0], P0[1], 0.7), 'A')
export default {
  name: 'paper-plane', title: 'Paper plane', group: 'creative',
  description: 'A paper plane glides in, pulls a loop-the-loop with its nose along the path, and glides out on a dotted trail.',
  intent: 'sending: your message is on its way',
  aliases: ['paper-plane-loader', 'sending-loader', 'loop-the-loop', 'message-sending', 'plane-loop-loader'],
  tags: ['loading', 'send', 'message', 'paper plane', 'mail'],
  synonyms: ['sending', 'delivering', 'submitting', 'on its way', 'message', 'email'],
  duration: 3,
  parts: [
    { skel: DOT, motion: { origin: P0, keys: fly(0.5, false, 0.22) }, copies: [{ lag: 0.075 }, { lag: 0.125 }, { lag: 0.175 }] },
    { skel: PLANE, motion: { origin: P0, keys: fly(1, true) } },
  ],
}
