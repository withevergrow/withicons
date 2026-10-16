// Two concentric rings, each a pair of opposite arcs, turning against each other: the outer one clockwise, the inner
// one faster the other way. Their speeds swell in counter-phase (one surges while the other eases), so the pair
// breathes like meshed gears instead of spinning flat. Each ring is symmetric under a half turn, so it loops clean
// after any whole number of half turns, and its drawing stays centred on the hub whatever its angle.
import { arc, merge, stroke } from './_kit.mjs'
import { sampled } from './_common-a.mjs'

const RO = 8.5, RI = 4.5, SO = 116, SI = 92   // radii, arc spans (deg)
const pair = (r, span, plate) => merge(stroke(arc(12, 12, r, -span / 2, span / 2), plate), stroke(arc(12, 12, r, 180 - span / 2, 180 + span / 2), plate))
const w = 4 * Math.PI, a = 0.5
const outer = t => 360 * t + 360 * a * Math.sin(w * t) / w
const inner = t => -(720 * t - 720 * a * Math.sin(w * t) / w)
export default {
  name: 'ring-dual', title: 'Dual ring', group: 'common',
  description: 'Two concentric rings of arcs turn against each other, the inner one faster, their speeds swelling in counter-phase.',
  intent: 'two things working together: syncing, handshaking, processing',
  aliases: ['dual-ring', 'double-ring-spinner', 'counter-rotating-rings', 'concentric-spinner', 'gyro-spinner'],
  tags: ['loading', 'spinner', 'sync', 'rings'], synonyms: ['loading', 'syncing', 'processing', 'connecting', 'working'],
  duration: 1.8,
  parts: [
    { skel: pair(RO, SO, 'K'), motion: { origin: [12, 12], keys: sampled(24, t => ({ r: outer(t) })) } },
    { skel: pair(RI, SI, 'A'), motion: { origin: [12, 12], keys: sampled(24, t => ({ r: inner(t) })) } },
  ],
}
