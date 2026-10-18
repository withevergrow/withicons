// forge/hand/glass/fast-forward.mjs — two chunky rounded glass arrowheads, each its own frosted pane over its own
// colour body, with a clear gap between them. The generated drawing fused the two triangles into one pale pane with a
// notch (the tip of the first ran into the base of the second) and frosted the colour almost to white, so at 24/16px it
// read as one washed-out wedge. Layers the Glass way: soft shadow, colour bodies down-right with an accent orb, frosted
// panes up-left with a currentColor hairline, a lit rim on each top-left edge.
// Motion: the trailing (left) arrow is plate A (wm-a, chases); the leading one is wm-k.
import { V } from '../../styles/_glass-soft.mjs'

const f = v => +v.toFixed(2)
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const unit = v => { const l = Math.hypot(v[0], v[1]); return [v[0] / l, v[1] / l] }

// fillet points of a convex polygon listed clockwise on screen: for vertex i, S = start of its corner arc, E = end
function fillets(pts, rs) {
  return pts.map((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length]
    const u1 = unit(sub(a, p)), u2 = unit(sub(b, p))
    const half = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2
    const r = rs[i], t = r / Math.tan(half)
    return { r, S: [p[0] + u1[0] * t, p[1] + u1[1] * t], E: [p[0] + u2[0] * t, p[1] + u2[1] * t] }
  })
}
const q = p => `${f(p[0])} ${f(p[1])}`
function rounded(pts, rs) {
  const F = fillets(pts, rs)
  return F.map((c, i) => `${i ? 'L' : 'M'}${q(c.S)}A${f(c.r)} ${f(c.r)} 0 0 1 ${q(c.E)}`).join('') + 'Z'
}
// a clockwise triangle [top-left, tip, bottom-left] pulled in by d (along each corner's bisector) and moved by dx, dy
function inset(pts, d, dx = 0, dy = 0) {
  return pts.map((p, i) => {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length]
    const u1 = unit(sub(a, p)), u2 = unit(sub(b, p))
    const half = Math.acos(u1[0] * u2[0] + u1[1] * u2[1]) / 2, bis = unit([u1[0] + u2[0], u1[1] + u2[1]])
    const k = d / Math.sin(half)
    return [p[0] + bis[0] * k + dx, p[1] + bis[1] * k + dy]
  })
}
// the lit rim: up the left edge, round the top-left corner and along the upper edge toward the tip
function rim(pts, rs) {
  const F = fillets(pts, rs), [tl, tip, bl] = F
  const at = (p, r, t) => [p[0] + (r[0] - p[0]) * t, p[1] + (r[1] - p[1]) * t]
  const a = at(tl.S, bl.E, 0.62), b = at(tl.E, tip.S, 0.5)
  return `M${q(a)}L${q(tl.S)}A${f(tl.r)} ${f(tl.r)} 0 0 1 ${q(tl.E)}L${q(b)}`
}

export default function render(icon) {
  const name = icon.name || 'fast-forward'
  let n = 0
  const id = () => `wg-glass-${name}-${n++}`
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }
  const T1 = [[1.9, 3.6], [11.3, 11.5], [1.9, 19.4]]
  const T2 = [[12.3, 3.6], [21.7, 11.5], [12.3, 19.4]]
  const RS = [1.15, 1, 1.15], RB = [0.9, 0.8, 0.9]
  const B1 = inset(T1, 0.4, 1, 1), B2 = inset(T2, 0.4, 1, 1)
  const front1 = rounded(T1, RS), front2 = rounded(T2, RS)
  const back1 = rounded(B1, RB), back2 = rounded(B2, RB)
  // soft diffuse shadow under both colour bodies
  const H1 = inset(B1, -0.45, 0, 0.5), H2 = inset(B2, -0.45, 0, 0.5)
  const G1 = inset(B1, -1, 0, 0.5), G2 = inset(B2, -1, 0, 0.5)
  out.push(['path', { d: rounded(G1, [1.8, 1.6, 1.8]) + rounded(G2, [1.8, 1.6, 1.8]), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: rounded(H1, [1.4, 1.3, 1.4]) + rounded(H2, [1.4, 1.3, 1.4]), fill: V.shadow, 'fill-opacity': 0.09, class: 'wm-shadow' }])
  // colour bodies behind, down-right, one accent orb glowing through the leading arrow
  const back = add(lin(id(), 3, 5, 23, 21, [stop(0, V.c1), stop(1, V.shadow)]))
  const orb = add(rad(id(), 17.4, 15.6, 7.5, [stop(0, V.accent, 0.62), stop(0.5, V.accent, 0.24), stop(1, V.accent, 0)]))
  out.push(['path', { d: back1, fill: back, class: 'wm-a' }], ['path', { d: back1, fill: orb, class: 'wm-a' }])
  out.push(['path', { d: back2, fill: back, class: 'wm-k' }], ['path', { d: back2, fill: orb, class: 'wm-k' }])
  // frosted panes, a little clearer than the default so the colour reads
  const pane = add(lin(id(), 2, 3.6, 21, 19.4, [stop(0, V.frost, 0.55), stop(0.4, V.tint, 0.46), stop(1, V.tint, 0.32)]))
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
  out.push(['path', { d: front1, fill: pane, ...edge, class: 'wm-a' }])
  out.push(['path', { d: front2, fill: pane, ...edge, class: 'wm-k' }])
  // lit rims along each top-left edge
  const shine = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const R1 = inset(T1, 0.5), R2 = inset(T2, 0.5), RR = [0.75, 0.6, 0.75]
  out.push(['path', { d: rim(R1, RR), ...shine, class: 'wm-a' }])
  out.push(['path', { d: rim(R2, RR), ...shine, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
