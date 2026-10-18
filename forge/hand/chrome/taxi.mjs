// forge/hand/chrome/taxi.mjs — a polished chrome taxi in side view, built like the chrome car (low hood, cabin, two
// windows cut through either side of a pillar, solid gunmetal wheels on dark seams) with a cab roof light: a narrow,
// tall rounded-top enamel jewel standing on a short chrome foot, and a gunmetal checker belt along the door line. The
// generated sign was a small chrome cap fused onto the roof, so it read as a plain car at 16px; a wide flat bar read as
// a police light bar. The roof light and checker say taxi in any palette, and slimmer wheels leave chrome between them.
// Painted with the style's own layer recipe (_chrome-core layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K as KC } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const BODY = 'M2.5 16V13.5A2 2 0 0 1 4.5 11.5H5.5L8 7.5H14L17.5 11.5H19.5A2 2 0 0 1 21.5 13.5V16A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16Z'
const WINDOWS = 'M8.75 8.75H10.6V11.25H7.25Z M12 8.75H13.5L15.6 11.25H12Z'
const WHEELS = [[6.5, 17.5], [17.5, 17.5]]
const R = 2.1, HUB = 0.75
// the roof light: a narrow tapered box with a rounded top, on a short foot that rises from the roof
const SIGN = 'M8.6 4.75L9.1 2.55Q9.3 1.75 10.1 1.75H11.9Q12.7 1.75 12.9 2.55L13.4 4.75Z'
const FOOT = rr(10, 4.25, 12, 7.5, 0.4)
// the checker belt: five 1u gunmetal squares along the door line, between the wheel arches
const CHECK = [8, 10, 12, 14, 16].map(x => rr(x - 0.5, 12.75, x + 0.5, 13.75, 0.15)).join(' ')

export default function render(icon) {
  const name = (icon && icon.name) || 'taxi'
  // body: the outline inflated into the style's chrome tube, fused with its fill
  const fK = F.strokes(lines(BODY), KC.WK, M0)
  F.region(rings(BODY), M0, fK)
  // wheels: solid gunmetal discs with a slimmer rim tube
  const wd = WHEELS.map(([x, y]) => disc(x, y, R)).join('')
  const fA = F.strokes(lines(wd), 2, M0)
  F.region(rings(wd), M0, fA)
  // windows and hub holes, cut clean through
  const rec = reg(WINDOWS)
  F.region(WHEELS.flatMap(([x, y]) => rings(disc(x, y, HUB))), M0, rec)
  // the parting gap round the wheels is a dark seam in the body, not a hole
  const gap = grow(fA, KC.GAP)
  const body = minus(minus(minus(fK, rec), gap), grow(reg(CHECK), 0))
  const check = F.intersect(reg(CHECK), grow(fK, -0.5))
  const seam = minus(F.intersect(F.copy(gap), fK), rec)
  F.union(seam, check)
  const wheels = minus(fA, rec)
  // the sign: an enamel jewel, cleared from the roof by the style's moat
  const sign = reg(SIGN)
  // the foot rises from the roof straight into the jewel's bezel, so the light stands on the cab
  const foot = minus(reg(FOOT), sign)
  const K = F.open(F.union(minus(body, grow(sign, KC.MOAT)), foot), KC.ROUND)
  const sil = F.copy(fK); F.union(sil, fA); F.union(sil, sign); F.union(sil, foot); F.subtract(sil, minus(rec, fA))
  const Ls = layers({ T: {}, K, Af: F.open(wheels, KC.ROUND), Ab: null, S: sign, sil, txt: null, seam })
  // the taxi idles and drives off as one; the sign keeps the badge class so a glow can find it
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' || L.cls === 'wm-s' ? L.cls : 'wm-k'
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
