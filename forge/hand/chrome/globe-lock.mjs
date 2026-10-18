// forge/hand/chrome/globe-lock.mjs — one whole polished chrome sphere (its dark horizon doubles as the equator) with a
// meridian ellipse and axis engraved as slim dark lines, and a big enamel padlock with a gunmetal shackle set at its
// lower right in a clear moat. The generated drawing cut the globe into separate pieces with wide grooves that read as a
// dark letter on the sphere and kept the lock small, so at 24 and 16px the globe broke up and the lock was a pink speck.
// Painted with the style's own layer recipe (_chrome-core).
import { parsePath, area } from '../../kernel/geom.mjs'
import { setOf, differenceSets } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const GLOBE = 'M10.75 1.75A9 9 0 1 1 10.75 19.75A9 9 0 1 1 10.75 1.75Z'
// the grid: a meridian ellipse and the central meridian, engraved as dark lines on the one chrome sphere (its own dark
// horizon is the equator), so the globe holds together as a single ball
const MERIDIAN = 'M10.75 1.75A4.1 9 0 0 1 10.75 19.75A4.1 9 0 0 1 10.75 1.75Z'
const AXIS = 'M10.75 1.75V19.75'
const CASE = 'M14.75 15.5H20.75A1.5 1.5 0 0 1 22.25 17V20.75A1.5 1.5 0 0 1 20.75 22.25H14.75A1.5 1.5 0 0 1 13.25 20.75V17A1.5 1.5 0 0 1 14.75 15.5Z'
const SHACKLE = 'M15.5 15.75V13.75A2.25 2.25 0 0 1 20 13.75V15.75'
const LINE = 0.75
const KEYHOLE = 'M17.75 18.1V19.6'

export default function render(icon) {
  const name = (icon && icon.name) || 'globe-lock'
  const Kf = F.region(rings(GLOBE), M0)
  // the lock: an enamel case with a keyhole cut in, a gunmetal shackle behind it
  const Sf = F.region(rings(CASE), 1.15)
  const Sj = minus(Sf, F.strokes(lines(KEYHOLE), 1.0, M0))
  const Ab = F.strokes(lines(SHACKLE), 2.1, M0)
  // a clear moat round the whole lock (traced on a field with reach enough for the offset)
  const lock = F.region(rings(CASE), 1.6); F.strokes(lines(SHACKLE), 2.1, 1.6, lock)
  const moat = F.offset(F.copy(lock), -0.75)
  const sil = minus(Kf, moat); F.union(sil, lock)
  // the sphere is shaded whole (so its horizon runs clean), then the moat is cut out of every one of its layers
  const G = layers({ T: {}, K: F.open(F.copy(Kf), 0.32), Af: null, Ab: null, S: null, sil, txt: null, seam: null })
  const cut = setOf(F.contour(F.copy(moat)).filter(l => l.length > 2))
  const sphere = G.list.map(L => L.cls === 'wm-shadow' ? L : { ...L, cls: L.cls || 'wm-k', loops: differenceSets(setOf(L.loops), cut) })
    .filter(L => L.loops.length)
  // and the cut gets the dark steel edge every piece has
  const rim = minus(F.intersect(F.offset(F.copy(moat), -0.22), F.copy(Kf)), moat)
  const rimLoops = F.contour(rim).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04)
  if (rimLoops.length) sphere.push({ loops: rimLoops, fill: col('shadow'), cls: 'wm-k', q: 'body' })
  const lockLs = layers({ T: {}, K: null, Af: null, Ab: F.open(Ab, 0.3), S: Sj, sil, txt: null, seam: null }).list.filter(L => L.cls !== 'wm-shadow')
  // the shackle moves with the case (motion part S)
  for (const L of lockLs) if (L.cls === 'wm-a') L.cls = 'wm-s'
  // the engraved grid, on the sphere inside its rim and clear of the moat
  const K = F.open(minus(Kf, moat), 0.32)
  const grid = F.intersect(F.strokes([...lines(MERIDIAN), ...lines(AXIS)], LINE, M0), F.offset(F.copy(K), 0.45))
  const loops = F.contour(grid).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04)
  const Ls = { list: [...sphere, ...(loops.length ? [{ loops, fill: col('shadow'), cls: 'wm-k', op: 0.85, q: 'body' }] : []), ...lockLs], glint: G.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
