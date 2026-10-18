// forge/hand/chrome/car.mjs — a polished chrome car body in side view (low hood, cabin roof, two windows cut clean
// through on either side of a pillar) riding on two solid gunmetal wheels with hub holes, set in front of the body on
// a dark seam and standing proud below its sill. The generator stroked every wheel ring and arch as a fat tube and cut
// the cabin loose as a separate hat, so the car read as a knot of rings and blobs at 24 and 16px.
// Same layer recipe as the generator (_chrome-core.mjs layers/emit); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`

const BODY = 'M2.5 15V12.5A2 2 0 0 1 4.5 10.5H5.5L8 5.75H13.75L17.5 10.5H19.5A2 2 0 0 1 21.5 12.5V15A1.5 1.5 0 0 1 20 16.5H4A1.5 1.5 0 0 1 2.5 15Z'
const WINDOWS = 'M8.6 7H10.6V10.25H7Z M12 7H13.4L15.8 10.25H12Z'
const WHEELS = [[6.75, 16.5], [17.25, 16.5]]
const R = 2.35, HUB = 0.85

export default function render(icon) {
  const name = (icon && icon.name) || 'car'
  // body: the outline inflated into the style's chrome tube, fused with its fill
  const fK = F.strokes(lines(BODY), K.WK, M0)
  F.region(rings(BODY), M0, fK)
  // wheels: solid gunmetal discs with a slimmer rim tube
  const wd = WHEELS.map(([x, y]) => disc(x, y, R)).join('')
  const fA = F.strokes(lines(wd), 2, M0)
  F.region(rings(wd), M0, fA)
  // windows and hub holes, cut clean through
  const rec = F.field(M0)
  F.region([...rings(WINDOWS), ...WHEELS.flatMap(([x, y]) => rings(disc(x, y, HUB)))], M0, rec)
  // the parting gap round the wheels is a dark seam in the body, not a hole
  const gap = grow(fA, K.GAP)
  const body = minus(minus(fK, rec), gap)
  const seam = minus(F.intersect(F.copy(gap), fK), rec)
  const wheels = minus(fA, rec)
  const sil = F.copy(fK); F.union(sil, fA); F.subtract(sil, minus(rec, fA))
  const round = Fd => F.open(Fd, K.ROUND)
  const Ls = layers({ T: {}, K: round(body), Af: round(wheels), Ab: null, S: null, sil, txt: null, seam })
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' ? L.cls : 'wm-k'
  return emit(Ls, name, 0)
}
