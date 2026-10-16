// Bubbles of different sizes come up from the bottom in turn: each one swells out of nothing, rises faster and
// faster as it wobbles side to side (squishing as it goes), and at the top pops: a quick swell, gone, and a little
// ring of spray flicks out where it was.
import { circle, arc, line, solid, stroke, merge, polar, E } from './_kit.mjs'

const BOTTOM = 20.8
// x, radius, the height it pops at, its stagger, its wobble
const B = [
  { x: 7.4, r: 3, top: 8, lag: 0, amp: 0.9 },
  { x: 16.4, r: 2.1, top: 6.2, lag: 0.26, amp: 0.75 },
  { x: 11.8, r: 1.45, top: 4.4, lag: 0.51, amp: 0.6 },
  { x: 14.2, r: 2.5, top: 7.2, lag: 0.76, amp: 0.8 },
]
const T_IN = 0.08, T_POP = 0.8
// a bubble: a ring and, on the bigger ones, a small highlight arc at the upper left
const bubble = ({ x, r }) => {
  const y = BOTTOM - r
  const ring = stroke(circle(x, y, r))
  return r >= 2 ? merge(ring, stroke(arc(x, y, r * 0.55, 285, 335), 'A')) : ring
}
const keysFor = ({ r, top, amp }) => {
  const y0 = BOTTOM - r, dy = top - y0
  const ks = [
    [0, { x: 0, y: 0, s: 0.3, o: 0, e: E.spring }],
    [T_IN, { s: 1, o: 1, e: E.linear }],
  ]
  const N = 12
  for (let i = 1; i <= N; i++) {
    const u = i / N, t = T_IN + (T_POP - T_IN) * u
    const sq = 0.06 * Math.sin(u * Math.PI * 6)
    ks.push([t, { x: amp * Math.sin(u * Math.PI * 3), y: dy * (0.6 * u + 0.4 * u * u), sx: 1 + sq, sy: 1 - sq, e: i === N ? E.out : E.linear }])
  }
  ks.push([T_POP + 0.05, { s: 1.32, o: 0 }], [1, { s: 1.32, o: 0 }])
  return ks.map(([t, k]) => [Math.round(t * 10000) / 10000, k])
}
// spray: five short dashes flicking out round the pop
const spray = ({ x, r, top }) => {
  const d = []
  for (let k = 0; k < 5; k++) { const a = k * 72, p0 = polar(x, top, r * 0.9 + 0.6, a), p1 = polar(x, top, r * 0.9 + 1.8, a); d.push(line(...p0, ...p1)) }
  return stroke(d.join(' '), 'A')
}
const sprayKeys = [
  [0, { s: 0.7, o: 0 }], [T_POP + 0.01, { s: 0.7, o: 0, e: E.out }], [T_POP + 0.035, { s: 0.85, o: 1, e: E.out }],
  [T_POP + 0.12, { s: 1.15, o: 0 }], [1, { s: 1.15, o: 0 }],
]
export default {
  name: 'bubbles', title: 'Bubbles', group: 'creative',
  description: 'Bubbles of different sizes rise in turn, wobbling and squishing as they speed up, and pop at the top in a little spray.',
  intent: 'fizzing along: light, playful, something is bubbling up',
  aliases: ['bubbles-loader', 'rising-bubbles', 'fizz-loader', 'soap-bubbles-loader', 'bubble-pop-loader'],
  tags: ['loading', 'bubbles', 'water', 'playful', 'fizz'],
  synonyms: ['loading', 'fizzing', 'brewing', 'bubbling', 'soap', 'underwater'],
  duration: 3.6,
  parts: [
    // one spray, drawn once and placed at every bubble's pop (copies), each with its bubble's lag
    { skel: spray({ x: B[0].x, top: B[0].top, r: 2.2 }), motion: { origin: [B[0].x, B[0].top], keys: sprayKeys },
      copies: B.map(b => ({ x: b.x - B[0].x, y: b.top - B[0].top, lag: b.lag })) },
    ...B.map(b => ({ skel: bubble(b), motion: { origin: [b.x, BOTTOM - b.r], keys: keysFor(b), lag: b.lag } })),
  ],
}
