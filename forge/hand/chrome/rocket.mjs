// forge/hand/chrome/rocket.mjs — a chrome rocket climbing on the diagonal: a fat polished bullet body with a pointed
// nose, a gunmetal porthole set in it, two swept gunmetal fins behind it and an enamel flame out of the tail. The
// generator fused body, fins and exhaust into one pale chrome mass with a white hole for a window, so the silhouette
// had weak edges on white and the parts ran together; here the body stands alone in bright chrome, the fins and
// porthole are the style's darker second metal and the flame is a glossy enamel jewel, so it reads at 16px.
// Same paint recipe and ramps as the generator (_chrome-core.mjs emit); only the geometry is drawn here.
import { circle, simplify, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { emit, col } from '../../styles/_chrome-core.mjs'

const M0 = 0.7
const cp = F.copy, minus = (A, B) => F.subtract(cp(A), B), ins = (A, e) => F.offset(cp(A), e)
const mv = (A, dx, dy) => F.shift(A, Math.round(dx / F.H), Math.round(dy / F.H), 1)
const r2 = v => Math.round(v * 100) / 100
const loopsOf = Fd => F.contour(cp(Fd)).map(l => simplify(l, 0.004, true))
const exact = (Fd, reach = 2.4) => F.redistance(Fd, loopsOf(Fd), reach)
// closing: fillets concave corners to r
function close(Fd, r) {
  const g = exact(Fd, r + 0.3)
  F.offset(g, -r)
  return F.offset(exact(g, r + 0.3), r)
}
function bounds(Fd) {
  let x0 = 99, y0 = 99, x1 = -99, y1 = -99
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) if (Fd[j * F.N + i] < 0) {
    const x = i * F.H, y = j * F.H
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y
  }
  return [x0, y0, x1, y1]
}
// the part of a field between two horizon curves (vertical distance)
function band(Fd, lo, hi) {
  const G = cp(Fd)
  for (let j = 0; j < F.N; j++) for (let i = 0; i < F.N; i++) {
    const q = j * F.N + i, x = i * F.H, y = j * F.H
    let v = G[q]
    if (lo) v = Math.max(v, lo(x) - y)
    if (hi) v = Math.max(v, y - hi(x))
    G[q] = v
  }
  return G
}
const smooth = r => r.length < 5 ? r : r.map((p, i) => { const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]; return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4] })
// the generator's paint, back to front: shadow, dark edge, bevel, then chrome/gunmetal (sky, ground under a horizon,
// ink horizon, sheen) or enamel (glossy jewel in a chrome bezel); one glint
function paint(pieces, sil) {
  const list = []
  const add = (Fd, fill, cls, op, q = 'body') => {
    const loops = F.contour(cp(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth)
    if (loops.length) list.push({ loops, fill, cls, op, q })
  }
  add(minus(ins(mv(sil, 0.2, 0.75), -0.05), sil), col('shadow'), 'wm-shadow', 0.2, 'soft')
  const all = bounds(sil)
  pieces.forEach((p, n) => {
    const cls = p.cls
    if (p.seam) add(p.seam, col('shadow'), 'wm-k')
    add(p.F, col('shadow'), cls)
    add(ins(p.F, 0.2), ['bevel', all], cls)
    if (p.kind === 'enamel') { const J = ins(p.F, 0.55); add(J, ['enamel', bounds(J)], cls); return }
    const metal = p.kind === 'metal'
    const C = ins(p.F, 0.5), b = bounds(C), h = b[3] - b[1]
    const hz = p.horizon || (() => b[1] + 0.5 * h), th = p.ink || Math.min(1.1, 0.095 * h)
    add(C, [metal ? 'metalSky' : 'sky', b], cls)
    add(band(C, hz, null), [metal ? 'metalGround' : 'ground', b], cls)
    add(band(C, x => hz(x) - 0.3 * th, x => hz(x) + 0.7 * th), col('ink'), cls)
    const Cs = p.solid ? ins(p.solid, 0.5) : C
    add(F.intersect(minus(Cs, mv(Cs, 0.3, 0.42)), C), col('shine'), 'wm-shine', 0.85, n ? 'sheen2' : 'sheen')
  })
  return { list, glint: null }
}
function glint(x, y, r = 1.7, w = 0.3) {
  const f = r2
  return ['path', { d: `M${f(x)} ${f(y - r)}Q${f(x + w)} ${f(y - w)} ${f(x + r)} ${f(y)}Q${f(x + w)} ${f(y + w)} ${f(x)} ${f(y + r)}Q${f(x - w)} ${f(y + w)} ${f(x - r)} ${f(y)}Q${f(x - w)} ${f(y - w)} ${f(x)} ${f(y - r)}Z`, fill: col('shine'), class: 'wm-shine' }]
}
// local frame along the rocket: s from the tail (0) to the nose, t across it; drawn about s 3 at the icon's centre
const U = [Math.SQRT1_2, -Math.SQRT1_2], V = [Math.SQRT1_2, Math.SQRT1_2], C = [11.75, 11.55], S = 1.3
const P = (s, t) => [C[0] + S * ((s - 3) * U[0] + t * V[0]), C[1] + S * ((s - 3) * U[1] + t * V[1])]
// a ring along the axis from a half-width profile w(s), s0..s1, bent sideways by c(s)
function spindle(s0, s1, w, c = () => 0, n = 48) {
  const a = [], b = []
  for (let k = 0; k <= n; k++) { const s = s0 + (s1 - s0) * k / n; a.push(P(s, c(s) - w(s))); b.push(P(s, c(s) + w(s))) }
  return [...a, ...b.reverse()]
}

export default function render(icon) {
  const name = (icon && icon.name) || 'rocket'
  // body: a flat-ish tail, a full waist, an ogive nose
  const Ln = 12.4
  const body0 = F.region([spindle(0, Ln, s => s < 4.4 ? 2.45 + 0.85 * Math.sin(Math.PI * s / 8.8) : 3.3 * Math.pow(1 - Math.pow((s - 4.4) / (Ln - 4.4), 2.2), 0.62))], M0)
  const body = exact(F.open(body0, 0.45))
  // fins: swept back from the body's sides, round-tipped
  const fins0 = F.region([[P(4.4, -2.6), P(-0.5, -5.9), P(-1.15, -5.15), P(0.1, -2.2)], [P(4.4, 2.6), P(-0.5, 5.9), P(-1.15, 5.15), P(0.1, 2.2)]], M0)
  const fins = exact(F.open(close(fins0, 0.5), 0.5))
  // porthole: a gunmetal disc in the body, parted by a dark seam
  const port = exact(F.region([circle(...P(7.3, 0), 1.75)], M0))
  const gap = ins(port, -0.42)
  const seam = F.intersect(minus(gap, port), body)
  const hull = minus(body, gap)
  // flame: a teardrop streaming out of the tail nozzle (its root hidden under the hull), clear of the fins
  const flame = F.open(F.region([spindle(-5.3, 0.8, s => { const x = Math.min(1, (s + 5.3) / 4.6); return 1.6 * Math.pow(x, 0.7) * (1 - 0.1 * x) })], M0), 0.3)
  const sil = cp(body); F.union(sil, fins); F.union(sil, flame)
  const Ls = paint([
    { F: flame, kind: 'enamel', cls: 'wm-a' },
    { F: fins, kind: 'metal', cls: 'wm-k' },
    { F: hull, kind: 'chrome', cls: 'wm-k', solid: body, horizon: () => 11.4 },
    { F: port, kind: 'metal', cls: 'wm-a', seam, ink: 0.5 },
  ], sil)
  const g = P(5.4, -1.2)
  Ls.glint = glint(g[0], g[1], 1.5)
  return emit(Ls, name, 0)
}
