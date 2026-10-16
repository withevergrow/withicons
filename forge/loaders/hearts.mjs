// Valentine's: a heart beats like a real one, a strong thump and a softer echo (lub-dub), then rests; with every
// beat a small heart lifts off one shoulder (left, then right) and floats up and outwards, swaying, and fades.
import { icon, solid, heart, E } from './_kit.mjs'
import { sampled } from './_festival.mjs'

const S = 0.66, P = [12, 12.25], DY = 2.2    // the big heart: size on stage, its middle, how far below centre
const k = (s, e) => ({ y: DY, s: S * s, e })
const beat = [[0, k(1, E.out)], [0.09, k(1.17, E.ease)], [0.2, k(1.01, E.out)], [0.28, k(1.1, E.ease)], [0.48, k(1, E.ease)], [1, k(1)]]
// a small heart, drawn at 1/0.55 and shown at 0.55 or less, so its outline stays fine
const rise = (side, at) => {
  const ks = sampled(u => ({
    x: side * (2.2 * u + 0.9 * Math.sin(u * Math.PI * 2)), y: -6.4 * (1 - Math.pow(1 - u, 1.6)),
    r: side * 16 * Math.sin(u * Math.PI * 2 + 0.3), s: 0.55 * (u < 0.15 ? 0.4 + 0.6 * u / 0.15 : 1 - 0.3 * (u - 0.15)),
    o: u < 0.12 ? u / 0.12 : u > 0.65 ? Math.max(0, (1 - u) / 0.35) : 1,
  }), 12).map(([u, v]) => [Math.round((at + u * 0.8) * 1000) / 1000, v])
  if (at > 0) ks.unshift([0, { ...ks[0][1], o: 0 }])
  ks.push([1, { ...ks[ks.length - 1][1], o: 0 }])
  return ks
}
const L = [7.4, 9.6], R = [16.6, 9.6]          // the shoulders the small hearts lift off (on stage)
export default {
  name: 'hearts', title: 'Hearts', group: 'festival',
  description: 'A heart beats lub-dub like a real one, and with every beat a small heart floats up from it, swaying, and fades.',
  intent: 'made with love: warm, alive and patient',
  aliases: ['heartbeat-loader', 'valentine-loader', 'love-loader', 'beating-heart', 'floating-hearts'],
  tags: ['loading', 'festival', 'valentine', 'love', 'heart'], synonyms: ['valentine', 'love', 'heart', 'heartbeat', 'romance', 'like'],
  duration: 2.4,
  morph: ['heart'],
  parts: [
    // small hearts, behind the big one: the left one on the first beat, the right one on the second
    { skel: solid(heart(L[0], L[1], 0.42), 'S'), motion: { origin: L, keys: rise(-1, 0.03) } },
    { skel: solid(heart(R[0], R[1], 0.42), 'S'), motion: { origin: R, keys: rise(1, 0.03), lag: 0.5 } },
    // the heart: thump, echo, rest (twice per cycle)
    { skel: icon('heart'), motion: { origin: P, keys: beat, rep: 2 } },
  ],
}
