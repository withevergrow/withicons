// Eight dots on a ring; a bright head runs clockwise and the tail fades and shrinks behind it (the classic
// activity indicator, made rounder and calmer).
import { circle, solid, polar, E } from './_kit.mjs'

const N = 8, R = 7.5
const base = polar(12, 12, R, 0)   // the top dot; copies move it around the ring
export default {
  name: 'spinner-dots', title: 'Dot spinner', group: 'common',
  description: 'Eight dots on a ring: a bright head runs clockwise while the tail fades and shrinks behind it.',
  intent: 'the everyday activity indicator, softer and rounder',
  aliases: ['activity-indicator', 'dots-spinner', 'ios-spinner', 'ring-dots', 'loading-dots-circle'],
  tags: ['loading', 'spinner', 'busy', 'wait'], synonyms: ['loading', 'please wait', 'busy', 'working'],
  duration: 1,
  parts: [{
    skel: solid(circle(base[0], base[1], 1.6)),
    motion: { origin: base, keys: [[0, { s: 1.15, o: 1, e: E.out }], [0.85, { s: 0.45, o: 0.18 }], [1, { s: 1.15, o: 1 }]] },
    copies: Array.from({ length: N }, (_, i) => { const p = polar(12, 12, R, i * 360 / N); return { x: p[0] - base[0], y: p[1] - base[1], lag: i / N } }),
  }],
}
