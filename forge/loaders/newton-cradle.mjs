// Newton's cradle: five balls hang from a bar. The left ball falls (gravity), strikes, and the right ball flies out
// (slowing as it climbs), hangs, falls back and sends the left one out again. The three middle balls only shiver at
// each strike: the momentum passes straight through them.
import { circle, line, solid, stroke, merge, E } from './_kit.mjs'

const N = 5, R = 1.35, GAP = 3, TOP = 7.5, BALL_Y = 15.5, SWING = 19
const xs = Array.from({ length: N }, (_, i) => 12 + (i - (N - 1) / 2) * GAP)
// strings are their own (faint) parts so the balls read; a string and its ball share one swing
const string = x => stroke(line(x, TOP, x, BALL_Y - R), 'A')
const ball = x => solid(circle(x, BALL_Y, R))
const faint = keys => keys.map(([t, k]) => [t, { ...k, o: 0.45 }])
// t = 0 left ball out; 0.25 strike; 0.5 right ball out; 0.75 strike; 1 left ball out
const left = [
  [0, { r: SWING, e: E.gravity }], [0.25, { r: 0 }], [0.75, { r: 0, e: E.lift }], [1, { r: SWING }],
]
const right = [
  [0, { r: 0 }], [0.25, { r: 0, e: E.lift }], [0.5, { r: -SWING, e: E.gravity }], [0.75, { r: 0 }], [1, { r: 0 }],
]
// the middle three: a tiny push along the strike at each impact, then settle
const nudge = [
  [0, { x: 0 }], [0.245, { x: 0, e: E.out }], [0.29, { x: 0.18, e: E.ease }], [0.4, { x: 0 }],
  [0.745, { x: 0, e: E.out }], [0.79, { x: -0.18, e: E.ease }], [0.9, { x: 0 }], [1, { x: 0 }],
]
export default {
  name: 'newton-cradle', title: "Newton's cradle", group: 'creative',
  description: "Newton's cradle: the end balls fall, strike and fly out in turn, while the middle balls barely shiver at each impact.",
  intent: 'steady back-and-forth work, momentum carrying through',
  aliases: ['newtons-cradle', 'pendulum-balls', 'cradle-loader', 'momentum-loader', 'swinging-balls'],
  tags: ['loading', 'physics', 'pendulum', 'desk toy', 'office'],
  synonyms: ['working', 'processing', 'momentum', 'physics', 'pendulum', 'thinking'],
  duration: 1.6,
  parts: [
    { skel: stroke(line(4.5, TOP, 19.5, TOP)) },
    { skel: merge(...xs.slice(1, -1).map(string)), motion: { origin: [12, TOP], keys: faint(nudge) } },
    { skel: string(xs[0]), motion: { origin: [xs[0], TOP], keys: faint(left) } },
    { skel: string(xs[N - 1]), motion: { origin: [xs[N - 1], TOP], keys: faint(right) } },
    { skel: merge(...xs.slice(1, -1).map(ball)), motion: { origin: [12, TOP], keys: nudge } },
    { skel: ball(xs[0]), motion: { origin: [xs[0], TOP], keys: left } },
    { skel: ball(xs[N - 1]), motion: { origin: [xs[N - 1], TOP], keys: right } },
  ],
}
