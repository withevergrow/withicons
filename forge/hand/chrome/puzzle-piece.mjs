// forge/hand/chrome/puzzle-piece.mjs — a polished chrome jigsaw piece whose two tabs are round knobs on real necks.
// The generator inflated the skeleton's outline into one fat tube, which filled the shallow waist under each knob, so
// the tabs melted into lobes and the piece read as a cloud; here the silhouette is drawn in output space (no tube
// inflation): a rounded block with a round knob on a narrow neck on top and on the right, the waists filleted, not
// filled, and one calm horizon across the block that the knobs do not bend.
// Same paint recipe and ramps as the generator (_chrome-core.mjs emit); only geometry and horizon are drawn here.
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
const rrect = (x0, y0, x1, y1, r) => {
  const out = [], q = (cx, cy, a0) => { for (let k = 0; k <= 8; k++) { const a = a0 + k * Math.PI / 16; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]) } }
  q(x1 - r, y0 + r, -Math.PI / 2); q(x1 - r, y1 - r, 0); q(x0 + r, y1 - r, Math.PI / 2); q(x0 + r, y0 + r, Math.PI)
  return out
}

export default function render(icon) {
  const name = (icon && icon.name) || 'puzzle-piece'
  const K = F.field(M0)
  // the block
  F.region([rrect(2.7, 7.7, 16.3, 21, 2.4)], M0, K)
  // top knob: a neck and a ball
  F.region([rrect(8.15, 4.5, 10.85, 8.7, 0.01)], M0, K)
  F.region([circle(9.5, 4.85, 2.6)], M0, K)
  // right knob: a neck and a ball
  F.region([rrect(15.3, 12.95, 18.5, 15.65, 0.01)], M0, K)
  F.region([circle(18.7, 14.3, 2.6)], M0, K)
  const body = exact(F.open(close(K, 0.6), 0.32))
  // one horizon across the block, smiling a little with the curve of the face
  const hz = x => 13.9 + 0.006 * (x - 9.5) * (x - 9.5)
  const Ls = paint([{ F: body, kind: 'chrome', cls: 'wm-k', horizon: hz, ink: 0.85 }], body)
  Ls.glint = glint(4.9, 9.9)
  return emit(Ls, name, 0)
}
