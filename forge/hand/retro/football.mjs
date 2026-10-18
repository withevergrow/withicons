// forge/hand/retro/football.mjs — a soccer ball in flat colour: mustard leather with an orange shaded rim, a solid ink
// centre pentagon with five slim seams running out to five teal rim patches; no horizontal sunset stripes, so the
// classic ball pattern reads at 16-24px. Replaces the generated and earlier striped drawings.
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

// regular pentagons on the ball: the solid centre one and five rim patches, each with a vertex pointing at the centre
const pent = (cx, cy, r, a0) => 'M' + [0, 1, 2, 3, 4].map(k => {
  const a = (a0 + k * 72) * Math.PI / 180
  return (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2)
}).join(' L') + ' Z'
const DIRS = [-90, -18, 54, 126, 198]
const PENT = pent(12, 12, 3.3, -90)
const PATCHES = DIRS.map(t => pent(12 + 9.6 * Math.cos(t * Math.PI / 180), 12 + 9.6 * Math.sin(t * Math.PI / 180), 3.4, t + 180))
const SEAMS = DIRS.map(t => {
  const c = Math.cos(t * Math.PI / 180), n = Math.sin(t * Math.PI / 180)
  return 'M' + (12 + 3.3 * c).toFixed(2) + ' ' + (12 + 3.3 * n).toFixed(2) + ' L' + (12 + 6.2 * c).toFixed(2) + ' ' + (12 + 6.2 * n).toFixed(2)
}).join(' ')

export default function render() {
  F.setClip(null)
  const ball = shape(circ(12, 12, 9.5))
  const ink = outline([ball])
  F.strokes(lines(SEAMS), 1.5, 1.2, ink)
  F.strokes(lines(PENT), 1.2, 1.2, ink)
  F.region(rings(PENT), 1.2, ink)
  const under = F.offset(F.copy(ink), K.TUCK)
  const face = F.subtract(F.copy(ball), under)
  const rim = F.subtract(F.copy(ball), F.shift(ball, -14, -14, 1.6))
  const shade = F.subtract(F.intersect(rim, F.copy(face)), under)
  const patches = F.subtract(F.intersect(PATCHES.map(shape).reduce((x, y) => F.union(x, y)), F.copy(face)), under)
  return [
    node(castShadow(ink, [ball]), paint('shadow'), 'wm-shadow'),
    node(face, paint(1)),
    node(shade, paint(2)),
    node(patches, paint(4)),
    node(ink, null, null, true),
  ].filter(Boolean)
}
