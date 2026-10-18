// forge/hand/chrome/peacock-feather.mjs: a chrome peacock feather: a long tapered plume leaning up to the right, a gunmetal
// ocellus (eye ring) near the tip holding a large hot pink enamel pupil, a centre rachis and two pairs of barbs cut into
// the vane, and a long gunmetal quill curving away to the lower left. The old round-headed leaf on a straight stick read
// as a lollipop; the long taper, the barbs and the curved quill make it a feather, and the bigger pink eye survives 16px.
// The quill is the part that sways (wm-a), the eye the jewel (wm-s). Painted with the style's own recipe.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7, MS = 0.55 + 0.6, MOAT = 0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)
const r2 = v => Math.round(v * 100) / 100

// local frame: tip up, rachis along x = 0; turned DEG about the origin and set at CXY (skeleton coordinates)
const DEG = 38, CXY = [14.6, 9.4]
const turn = (x, y) => { const a = DEG * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return `${r2(CXY[0] + x * c - y * s)} ${r2(CXY[1] + x * s + y * c)}` }
const local = d => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => turn(+x, +y))
const rings = d => parsePath(local(d)).map(s => s.pts.map(tf))
const lines = d => parsePath(local(d)).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const K4 = 0.5523
const ell = (x, y, rx, ry) => `M${x + rx} ${y} C${x + rx} ${y + K4 * ry} ${x + K4 * rx} ${y + ry} ${x} ${y + ry} C${x - K4 * rx} ${y + ry} ${x - rx} ${y + K4 * ry} ${x - rx} ${y} C${x - rx} ${y - K4 * ry} ${x - K4 * rx} ${y - ry} ${x} ${y - ry} C${x + K4 * rx} ${y - ry} ${x + rx} ${y - K4 * ry} ${x + rx} ${y} Z`

// the vane: a full lanceolate plume, widest above the middle, a soft point at the tip and a narrow foot
const VANE = 'M0 -13 C3 -10.6 4.9 -6.6 4.9 -2 C4.9 2.6 2.6 5.8 0 7.2 C-2.6 5.8 -4.9 2.6 -4.9 -2 C-4.9 -6.6 -3 -10.6 0 -13 Z'
const EYE = ell(0, -5.6, 2.9, 3.8)
const PUPIL = ell(0, -5.4, 1.45, 2.05)
// the quill: long, curving out of the foot to the lower left
const QUILL = 'M0 6 C0.4 9.4 -1.2 12.2 -4.6 14.6'
// barbs: short grooves from the rachis out and up, two pairs below the eye
const RACHIS = 'M0 -0.9 V6.6'
const BARBS = 'M-6 0.4 L-2.6 1.6 M6 0.4 L2.6 1.6 M-6 3.4 L-2.2 4.4 M6 3.4 L2.2 4.4'

export default function render(icon) {
  const name = (icon && icon.name) || 'peacock-feather'
  const vane = F.region(rings(VANE), M0)
  const eye = F.region(rings(EYE), M0)
  const fS = F.region(rings(PUPIL), MS)
  const moat = F.offset(F.copy(fS), -MOAT)
  const ring = minus(eye, moat)
  const gap = F.offset(F.copy(eye), -0.42)
  const seam = F.intersect(F.copy(gap), vane)
  const grooves = F.strokes([...lines(RACHIS), ...lines(BARBS)], 0.75, M0)
  const quill = F.strokes(lines(QUILL), 1.9, M0)
  const Kf = F.open(F.copy(minus(minus(minus(vane, gap), grooves), moat)), 0.3)
  const sil = F.union(F.union(F.copy(vane), eye), quill)
  const Ls = layers({ T: {}, K: Kf, Af: F.open(F.copy(ring), 0.2), Ab: F.open(F.copy(quill), 0.3), S: fS, sil, txt: null, seam })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 9000; t++) out = emit(Ls, name, t)
  return out
}
