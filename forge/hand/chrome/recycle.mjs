// forge/hand/chrome/recycle.mjs — three polished chrome arrows chasing round a rounded triangle: each one a broad
// ribbon with a square-cut tail, a tight corner bend, a straight run along the side and a big sharp arrowhead behind a
// slim dark seam, with a narrow gap before the next arrow's tail so the triangle reads as one loop. The generated drawing
// was three thin tubes with small hooked heads that tangled and faded on a light background at 24 and 16px; heads now
// dominate so the direction reads small. Painted with the style's own layer recipe (_chrome-core).
import { area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const M0 = 0.7
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// the triangle the arrows run round (skeleton units). Its centre maps through tf onto the spin origin (12, 13.25).
const CX = 12.23, CY = 14.05, R = 10.75
const W = 3.2                          // ribbon width
const TAIL = 0.27, BODY = 0.37, TIP = 0.64, HEAD = 4.3   // fractions along each side from its corner; head half-width
const FIL = 1.6                       // corner bend radius (ribbon centreline)
const SEAM = 0.55                      // the dark seam where the head meets its ribbon

const V = k => { const a = (-90 + 120 * k) * Math.PI / 180; return [CX + R * Math.cos(a), CY + R * Math.sin(a)] }
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }

// the centreline a -> corner -> b with the corner bent round an arc of radius r
function bend(a, c, b, r) {
  const u1 = unit(c, a), u2 = unit(c, b)
  const half = Math.acos(Math.max(-1, Math.min(1, u1[0] * u2[0] + u1[1] * u2[1]))) / 2
  const t = r / Math.tan(half)
  const p1 = [c[0] + u1[0] * t, c[1] + u1[1] * t], p2 = [c[0] + u2[0] * t, c[1] + u2[1] * t]
  const bis = unit([0, 0], [u1[0] + u2[0], u1[1] + u2[1]]), dc = r / Math.sin(half)
  const o = [c[0] + bis[0] * dc, c[1] + bis[1] * dc]
  const a1 = Math.atan2(p1[1] - o[1], p1[0] - o[0])
  let da = Math.atan2(p2[1] - o[1], p2[0] - o[0]) - a1
  while (da > Math.PI) da -= 2 * Math.PI
  while (da < -Math.PI) da += 2 * Math.PI
  const pts = [a]
  for (let i = 0; i <= 10; i++) { const q = a1 + da * i / 10; pts.push([o[0] + r * Math.cos(q), o[1] + r * Math.sin(q)]) }
  pts.push(b)
  return pts
}
// a square-ended ribbon of width w along a centreline
function ribbon(pts, w) {
  const h = w / 2, L = [], Rt = []
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]
    const u = unit(a, b), n = [-u[1], u[0]]
    L.push([p[0] + n[0] * h, p[1] + n[1] * h]); Rt.push([p[0] - n[0] * h, p[1] - n[1] * h])
  })
  return [...L, ...Rt.reverse()]
}

export default function render(icon) {
  const name = (icon && icon.name) || 'recycle'
  const Rf = F.field(M0), Hf = F.field(M0), seams = []
  for (let k = 0; k < 3; k++) {
    const P = V(k - 1), C = V(k), N = V(k + 1)
    const tail = lerp(C, P, TAIL), end = lerp(C, N, BODY + 0.02), tip = lerp(C, N, TIP)
    F.region([ribbon(bend(tail, C, end, FIL), W).map(tf)], M0, Rf)
    const u = unit(C, N), n = [-u[1], u[0]], base = lerp(C, N, BODY)
    F.region([[[base[0] + n[0] * HEAD, base[1] + n[1] * HEAD], tip, [base[0] - n[0] * HEAD, base[1] - n[1] * HEAD]].map(tf)], M0, Hf)
    const h = W / 2 - 0.35, sb = [base[0] + u[0] * 0.15, base[1] + u[1] * 0.15]
    seams.push({ pts: [[sb[0] + n[0] * h, sb[1] + n[1] * h], [sb[0] - n[0] * h, sb[1] - n[1] * h]].map(tf), closed: false })
  }
  // only the ribbons are softened: the heads keep their sharp points
  const Kf = F.union(F.copy(Rf), Hf)
  // chrome ribbons in front, the heads in darker gunmetal so the direction reads at 24 and 16px
  const Ls = layers({ T: {}, K: F.open(Rf, 0.32), Af: null, Ab: Hf, S: null, sil: F.copy(Kf), txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls || L.cls === 'wm-a') L.cls = 'wm-k'
  const sf = F.strokes(seams, SEAM, M0)
  const loops = F.contour(sf).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04)
  if (loops.length) Ls.list.push({ loops, fill: col('shadow'), cls: 'wm-k', op: 0.9, q: 'body' })
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
