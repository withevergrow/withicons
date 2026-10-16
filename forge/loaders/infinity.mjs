// A bright bead races round a faint infinity track, a comet tail of smaller, fainter beads behind it. It swoops fast
// through the crossing and eases round the far ends of the loops, like a skater on a figure of eight.
import { circle, solid, stroke } from './_kit.mjs'
import { smooth, keysOf, named } from './_creative-a.mjs'

const N = 'wl-infinity'   // own geometry: a neutral part name (styles draw the infinity icon from their own art)

const C = [12, 12], A = 8.2
// lemniscate of Bernoulli: parameter u in 0..2pi, (A, 0) at u = 0, crossing at u = pi/2 and 3pi/2
const lem = u => { const d = 1 + Math.sin(u) ** 2; return [C[0] + A * Math.cos(u) / d, C[1] + A * Math.sin(u) * Math.cos(u) / d] }
const TRACK = smooth(Array.from({ length: 32 }, (_, i) => lem(i / 32 * Math.PI * 2)))
const P0 = lem(0)
// time -> parameter: a gentle speed-up through the crossings, ease round the loop ends
const uOf = t => t * Math.PI * 2 - 0.18 * Math.sin(t * Math.PI * 4)
const path = keysOf(t => { const p = lem(uOf(t)); return { x: p[0] - P0[0], y: p[1] - P0[1] } }, 28)
const bead = (r, o, lag) => ({
  skel: named(solid(circle(P0[0], P0[1], r), 'S'), N),
  motion: { origin: P0, keys: path.map(([t, k]) => [t, { ...k, o }]), lag },
})
const TAIL = [[1.2, 0.55, 0.045], [0.9, 0.3, 0.09], [0.65, 0.14, 0.135]]
export default {
  name: 'infinity', title: 'Infinity', group: 'creative',
  description: 'A bright bead with a comet tail races round a faint infinity track, swooping through the crossing.',
  intent: 'endless, smooth progress: it keeps going until it is done',
  aliases: ['infinity-loader', 'figure-eight-loader', 'lemniscate-loader', 'endless-loop-loader', 'infinite-spinner'],
  tags: ['loading', 'infinity', 'loop', 'endless', 'smooth'],
  synonyms: ['loading', 'looping', 'endless', 'forever', 'syncing', 'processing'],
  duration: 2.2,
  parts: [
    { skel: named(stroke(TRACK, 'A'), N), motion: { keys: [[0, { o: 0.3 }], [1, { o: 0.3 }]] } },
    ...TAIL.slice().reverse().map(([r, o, lag]) => bead(r, o, lag)),
    bead(1.7, 1, 0),
  ],
}
