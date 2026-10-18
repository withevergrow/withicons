// forge/hand/chrome/fish.mjs — a polished chrome fish in profile: a plump lens body with the head to the right, a
// deep forked gunmetal tail tucked behind it with a clear V notch, one shallow dark gill seam, and a solid dark
// gunmetal eye with a single catchlight. The generated drawing fused a stubby tail into the body and punched the eye
// as a pale hole, so it read as a bean or a bulb at 24 and 16px. Painted with the style's own layer recipe
// (_chrome-core layers/emit); the eye and gill are dark seam-role inlays laid over the chrome, with no rim of their own.
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'
import { ringsD } from '../../styles/_chrome-path.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const r2 = v => Math.round(v * 100) / 100
const discD = (cx, cy, r) => `M${r2(cx + r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx - r)} ${r2(cy)}A${r2(r)} ${r2(r)} 0 1 1 ${r2(cx + r)} ${r2(cy)}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

// body: a lens, blunt round head on the right, tapering to the tail joint on the left
const BODY = 'M6.75 12C8.75 7.75 11.75 5.5 15 5.5C18.75 5.5 22 8.25 22 12C22 15.75 18.75 18.5 15 18.5C11.75 18.5 8.75 16.25 6.75 12Z'
// tail: a forked fin whose root hides behind the body, two swept lobes round a deep notch
const TAIL = 'M9.5 10.25L4 6.1C2.9 5.35 1.75 5.9 2 7.25L3.6 12L2 16.75C1.75 18.1 2.9 18.65 4 17.9L9.5 13.75Z'
// gill: one shallow arc, well clear of the eye
const GILL = 'M12.5 9.5C13.25 11 13.25 13 12.5 14.5'
const EYE = tf([17.5, 10.75]), ER = 1.4

export default function render(icon) {
  const name = (icon && icon.name) || 'fish'
  const body = reg(BODY)
  const tail = minus(reg(TAIL), grow(body, 0.35))
  // the gill seam: a narrow groove inside the body, filled dark (never a see-through slot)
  const groove = F.intersect(F.strokes(lines(GILL), 0.7, M0), grow(body, -0.6))
  const K = F.open(body, 0.32)
  const sil = F.copy(body); F.union(sil, F.open(tail, 0.32))
  const Ls = layers({ T: {}, K, Af: null, Ab: F.open(tail, 0.32), S: null, sil, txt: null, seam: null })
  // the whole fish sways as one: every drawn layer is the body
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' ? L.cls : 'wm-k'
  const gd = ringsD(F.contour(F.copy(groove)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04), 0.04, 2)
  const inlay = [
    ['path', { d: gd, fill: col('shadow'), class: 'wm-k' }],
    ['path', { d: discD(EYE[0], EYE[1], ER), fill: col('shadow'), class: 'wm-k' }],
    ['path', { d: discD(EYE[0] - 0.5, EYE[1] - 0.5, 0.4), fill: col('shine'), class: 'wm-shine' }],
  ]
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return [...out, ...inlay]
}
