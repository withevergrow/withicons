// forge/hand/glass/recycle.mjs — the glass recycling loop. The generated drawing traced the skeleton's thin chasing
// arrows, so the heads were soft nubs and the three arrows ran into one knot. Here each arrow is a bold glass band that
// wraps a rounded corner of the triangle and ends in a big round-cornered head, with a clear gap before the next arrow
// begins, so the loop and the three arrowheads both read at 16px. Violet back glow, frosted pane, lit rim, like its siblings.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'recycle'
const f2 = v => +v.toFixed(2)
const D = (s, t = 0.04) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
// soft halo: stamp the shape around a ring (an offset of the sharp arrow heads leaves slivers)
const grow = (s, r) => unionSets([s, ...Array.from({ length: 12 }, (_, k) => translateSet(s, r * Math.cos(k * Math.PI / 6), r * Math.sin(k * Math.PI / 6)))])
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
const mul = (a, k) => [a[0] * k, a[1] * k]
const unit = a => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l] }

// one arrow: starts on the side behind corner i, wraps the (rounded) corner, runs down the next side and ends in a head
function arrow(i, Vs, P) {
  const R = 1.7, T = R * Math.sqrt(3), W = 2.5, HEAD = 4.7, HW = 3.0
  const v = Vs[i], l = Vs[(i + 2) % 3], r = Vs[(i + 1) % 3]
  const uL = unit(sub(l, v)), uR = unit(sub(r, v))
  const c = add(v, mul(unit(sub(P, v)), 2 * R))
  const S = add(v, mul(uL, 6.7)), T1 = add(v, mul(uL, T)), T2 = add(v, mul(uR, T))
  const tip = add(v, mul(uR, 10)), B = add(v, mul(uR, 10 - HEAD))
  const a1 = Math.atan2(T1[1] - c[1], T1[0] - c[0])
  let a2 = Math.atan2(T2[1] - c[1], T2[0] - c[0]); while (a2 < a1) a2 += 2 * Math.PI; if (a2 - a1 > Math.PI) a2 -= 2 * Math.PI
  const line = [S, T1]
  for (let k = 1; k < 14; k++) { const a = a1 + (a2 - a1) * k / 14; line.push([c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]) }
  line.push(T2, add(B, mul(uR, 1.2)))
  const n = [-uR[1], uR[0]]
  const tri = setOf([[add(B, mul(n, HW)), tip, sub(B, mul(n, HW))]])
  const head = dilate(erode(tri, 0.55), 0.55)
  return unionSets([roundStrokeSet(line, W), head])
}

export default function render() {
  let n = 0
  const defs = [], gr = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${NAME}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => gr(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  const Rc = 11, P = [12, 13]
  const Vs = [0, 1, 2].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 3; return [P[0] + Rc * Math.cos(a), P[1] + Rc * Math.sin(a)] })
  const raw = [0, 1, 2].map(i => arrow(i, Vs, P))
  const [x0, y0, x1, y1] = box(unionSets(raw))
  const A = raw.map(s => translateSet(s, 12 - (x0 + x1) / 2, 12 - (y0 + y1) / 2))
  // each arrow is eroded / grown on its own: the three never touch, and a joint offset leaves slivers in the gaps
  const per = f => unionSets(A.map(s => f(s)))
  const pane = per(s => translateSet(erode(s, 0.1), -0.25, -0.25))
  const back = per(s => translateSet(erode(s, 0.1), 0.5, 0.5))
  const rim = differenceSets(erode(pane, 0.1), translateSet(erode(pane, 0.1), 0.3, 0.45))
  const [a, b, c, d] = box(back)
  const out = []
    out.push(['path', { d: D(per(s => grow(translateSet(erode(s, 0.1), 0.5, 1), 0.9)), 0.1), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(per(s => grow(translateSet(erode(s, 0.1), 0.5, 1), 0.35)), 0.08), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(back), fill: lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)]), 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(back), fill: gr(['radialGradient', { id: id(), cx: f2(a + (c - a) * 0.68), cy: f2(b + (d - b) * 0.72), r: 7, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]]), 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(pane), fill: lin(a, b, c, d, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rim, 0.05), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
