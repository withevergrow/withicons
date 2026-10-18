// forge/hand/retro/cookie.mjs — a plain round cookie with its top-right bite and four ink chocolate chips: one flat
// mustard face, a flat orange crescent along the lower-right rim and the hard print shadow; replaces the generated
// drawing whose horizontal sunset stripes hid the cookie.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323', cream: '#FFF3D9' }
const paint = k => `var(--with-retro-${k}, ${HEX[k]})`
const mv = pts => pts.map(([x, y]) => [x + K.SHIFT, y + K.SHIFT])
const lines = d => parsePath(d).map(s => ({ pts: mv(s.pts), closed: s.closed }))
const rings = d => parsePath(d).map(s => mv(s.pts))
const dot = (x, y) => ({ pts: mv([[x, y]]), closed: false })
const node = (Fd, fill, cls, ink = false) => {
  const d = loopsD(F.trace(Fd, ink ? K.TOL : K.TOL_C, ink ? 0.15 : 0.3), ink ? 2 : 1)
  if (!d) return null
  const a = { d, 'fill-rule': 'evenodd' }
  if (fill) a.fill = fill
  if (cls) a.class = cls
  return ['path', a]
}
// a filled shape: union of path strings (each one even-odd)
const shape = ds => [].concat(ds).map(d => F.region(rings(d), 1.6)).reduce((a, b) => F.union(a, b))
// ink outlines of shapes stacked back to front: a shape hides the outlines of the ones behind it
function outline(fs, w = K.W) {
  const ink = F.field(1.2)
  fs.forEach((f, i) => {
    const b = f.map(v => Math.abs(v) - w / 2)
    for (let j = i + 1; j < fs.length; j++) F.subtract(b, fs[j])
    F.union(ink, b)
  })
  return ink
}
// what shows of each shape: itself, minus the shapes in front of it and minus the ink (tucked under it)
function faces(fs, under) {
  return fs.map((f, i) => {
    const v = F.copy(f)
    for (let j = i + 1; j < fs.length; j++) F.subtract(v, fs[j])
    return F.subtract(v, under)
  })
}
// the print shadow of everything: the silhouette pushed down-right, minus itself
function castShadow(ink, fs) {
  const sil = F.copy(ink)
  for (const f of fs) F.union(sil, f)
  return F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
}
const circ = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`

// round cookie, centre (12,12) r 9.5, bitten twice at the top right
const BODY = 'M15 3 A9.5 9.5 0 1 0 21 9 A2.25 2.25 0 0 1 18 6 A2.25 2.25 0 0 1 15 3 Z'
const CHIPS = [[8.4, 9.6], [13.6, 11.6], [9.2, 15.8], [15.2, 16.6]]

export default function render() {
  F.setClip(null)
  const body = shape(BODY)
  const ink = outline([body])
  const chips = F.strokes(CHIPS.map(([x, y]) => dot(x, y)), 2.7, 1.2)
  F.union(ink, chips)
  const under = F.offset(F.copy(ink), K.TUCK)
  const face = F.subtract(F.copy(body), under)
  // a crescent of the round cookie, offset up-left, leaves a lit lower-right rim
  const disc = shape(circ(12, 12, 9.5))
  const rim = F.subtract(F.copy(disc), F.shift(disc, -16, -16, 1.6))
  const shade = F.intersect(F.subtract(rim, under), F.copy(face))
  return [
    node(castShadow(ink, [body]), paint('shadow'), 'wm-shadow'),
    node(face, paint(1)),
    node(shade, paint(2)),
    node(ink, null, null, true),
  ].filter(Boolean)
}
