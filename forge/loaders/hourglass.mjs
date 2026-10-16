// An hourglass: the top sand drains through the neck in a thin falling stream while a pile grows below, then the
// glass is lifted, flipped over with a spring and set down, and the same sand runs again. Two drains and two flips per
// cycle (a full turn), so the loop closes on itself.
//
// The sand is two parts that trade roles. A drains as the top cone in the first half and grows as the bottom pile in
// the second (after the flip it is upside down); B does the opposite. B is A turned half a turn, so after each flip
// the full sand looks exactly like the top cone it replaces. A cone drains by shrinking toward the neck and a pile
// grows from its base, so each scales about a different point at different times: that pivot is emulated with a
// translate, exact because the translate is linear in the scale and both ease together. Volume falls linearly, so the
// scale goes as a cube root: slow at first, quick at the end, like real sand. The glass dips in scale while it turns
// (lifted off the table), which also keeps its corners inside the live area mid-turn.
// Every part is drawn centred on the hub and moved into place by its keys, so styles that centre what they draw
// (soft3d) still put the sand in the right bulb.
import { line, stroke, solid, merge, xform, E } from './_kit.mjs'
import { bezier } from './_common-a.mjs'

const O = [12, 12]
// the library has an hourglass icon, and styles that hand-draw it by name would draw that whole icon for every part:
// the parts carry their own name
const PART = 'hourglass-run'
const glass = merge(
  stroke('M7.5 3 V6 C7.5 9 11.1 10.5 11.1 12 C11.1 13.5 7.5 15 7.5 18 V21'),
  stroke('M16.5 3 V6 C16.5 9 12.9 10.5 12.9 12 C12.9 13.5 16.5 15 16.5 18 V21'),
  stroke(line(6, 3, 18, 3)),
  stroke(line(6, 21, 18, 21)),
)
// the top sand, small enough that a line stroke round it closes into one solid grain; its box centre is 3.875 above O
const CONE = 'M10.4 6 H13.6 C13.6 7.75 12.55 9 12.2 10.25 L11.8 10.25 C11.45 9 10.4 7.75 10.4 6 Z'
const CY = -3.875, APEX = [12, 10.25], BASE = [12, 6]
const turn = P => [2 * O[0] - P[0], 2 * O[1] - P[1]]  // a point turned half a turn about O

const DRAIN = 0.33, FLIP0 = 0.36, HALF = 0.5          // fractions of the cycle: drain, flip start, half
const r4 = v => Math.round(v * 10000) / 10000
// the part's translate when its drawing (shifted by c from where it belongs) is scaled by s about local point P and
// turned r degrees about O: T = R((1 - s)(P - O) + s c)
const place = (r, s, c, P = O) => {
  const a = r * Math.PI / 180, vx = (1 - s) * (P[0] - O[0]) + s * c[0], vy = (1 - s) * (P[1] - O[1]) + s * c[1]
  return { r: r4(r), s: r4(s), x: r4(vx * Math.cos(a) - vy * Math.sin(a)), y: r4(vx * Math.sin(a) + vy * Math.cos(a)) }
}
// sample times (fraction of the drain) packed where the cube root bends hardest
const US = [0, 0.3, 0.55, 0.74, 0.87, 0.95, 1]
const drain = (t0, P, r, c) => US.map(u => [r4(t0 + u * DRAIN), { ...place(r, Math.cbrt(1 - u), c, P), e: E.linear }])
const grow = (t0, P, r, c) => US.map(v => 1 - v).reverse().map(u => [r4(t0 + u * DRAIN), { ...place(r, Math.cbrt(u), c, P), e: E.linear }])
// the flip: lifted (scale dips), swung over (gathering speed, overshooting a little, settling), set down; sampled so the curves stay independent
const spring = bezier('cubic-bezier(.55,0,.3,1.42)'), smooth = p => p * p * (3 - 2 * p)
const DIP = 0.18, FN = 11, LIFT = 0.16
const lift = p => p < LIFT ? smooth(p / LIFT) : p > 0.84 ? smooth((1 - p) / 0.16) : 1
const turned = p => spring(Math.max(0, (p - LIFT * 0.6) / (1 - LIFT * 0.6)))
const flip = (t0, r0, c, visible) => Array.from({ length: FN + 1 }, (_, i) => {
  const p = i / FN
  return [r4(t0 + p * (HALF - FLIP0)), { ...place(r0 + 180 * turned(p), visible ? 1 - DIP * lift(p) : 0, c), e: E.linear }]
})

// A: drains on top (half 1), hidden through flip 1, grows at the bottom from its (now lower) base (half 2), flips home
const cA = [0, CY]
const sandA = [...drain(0, APEX, 0, cA), ...flip(FLIP0, 0, cA, false).slice(0, -1), ...grow(HALF, BASE, 180, cA), ...flip(HALF + FLIP0, 180, cA, true)]
// B: grows at the bottom (half 1), flips to the top, drains toward its apex (half 2), hidden through flip 2
const cB = [0, -CY]
const sandB = [...grow(0, turn(BASE), 0, cB), ...flip(FLIP0, 0, cB, true).slice(0, -1), ...drain(HALF, turn(APEX), 180, cB),
  ...flip(HALF + FLIP0, 180, cB, false).slice(0, -1), [1, { ...place(360, 0, cB, turn(BASE)) }]]
const glassKeys = [[0, { r: 0, s: 1 }], ...flip(FLIP0, 0, [0, 0], true), [HALF + FLIP0, { r: 180, s: 1 }], ...flip(HALF + FLIP0, 180, [0, 0], true).slice(1)]
// the falling stream (screen space, the same in both halves: rep 2), drawn centred, pivot at its foot: it pours from
// the neck (grows with its top held), runs, then its tail drops into the pile
const S0 = 12.75, S1 = 17.5, L = S1 - S0, SY = (S0 + S1) / 2 - 12, D = DRAIN / HALF
const streamKeys = [
  [0, { sx: 0.55, sy: 0, y: SY - L, o: 0, e: E.in }],
  [0.06, { sy: 1, y: SY, o: 1, e: E.linear }],
  [D - 0.07, { sy: 1, y: SY, o: 1, e: E.in }],
  [D, { sy: 0, y: SY, o: 0, e: E.linear }],
  [1, { sy: 0, y: SY - L, o: 0 }],
]

export default {
  name: 'hourglass', title: 'Hourglass', group: 'common',
  description: 'Sand drains through the neck of an hourglass into a growing pile, then the glass flips over with a spring and runs again.',
  intent: 'this takes a little time: waiting, a timer, patience',
  aliases: ['sand-timer-loader', 'hourglass-loader', 'egg-timer-loader', 'sand-glass-flip', 'flipping-hourglass'],
  tags: ['loading', 'time', 'wait', 'timer', 'sand'], synonyms: ['waiting', 'time', 'patience', 'timer', 'please wait'],
  duration: 4.8,
  parts: [   // the glass first: styles that frost or fill it then show the sand inside, not behind it
    { name: PART, skel: glass, motion: { origin: O, keys: glassKeys } },
    { name: PART, skel: stroke(line(12, 12 - L / 2, 12, 12 + L / 2), 'A'), motion: { origin: [12, 12 + L / 2], keys: streamKeys, rep: 2 } },
    { name: PART, skel: solid(xform(CONE, { y: -CY }), 'A'), motion: { origin: O, keys: sandA } },
    { name: PART, skel: solid(xform(xform(CONE, { y: -CY }), { r: 180 }), 'A'), motion: { origin: O, keys: sandB } },
  ],
}
