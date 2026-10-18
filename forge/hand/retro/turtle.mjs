// forge/hand/retro/turtle.mjs — a side-view turtle: teal domed shell with a mustard hexagon scute, orange head raised
// on a curved neck with an ink eye, two stout legs and a tail, all on lighter flat colours so the shell structure and
// legs stand out of the ink; replaces the generated drawing whose plates and legs sank into a near-black body.
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

const SHELL = 'M5 15 C5 9.4 7.8 5.9 11.1 5.9 C14.4 5.9 17.2 9.4 17.2 15 Z'
const HEXAGON = 'M9.1 8.6 H13.1 L14.9 10.4 L13.1 12.2 H9.1 L7.3 10.4 Z'
const TAIL = 'M2.4 13.2 L5.4 11.6 L5.6 15 Z'
const LEG_A = 'M5.6 14 H9.4 V17.8 A1.9 1.9 0 0 1 5.6 17.8 Z'
const LEG_B = 'M12.9 14 H16.7 V17.8 A1.9 1.9 0 0 1 12.9 17.8 Z'
const NECK = 'M15.4 15 L15.4 11.2 L16.8 9.2 L21.6 10.2 C21.2 13 18.8 15 15.4 15 Z'

export default function render() {
  F.setClip(null)
  const skin = [shape(TAIL), shape(LEG_A), shape(LEG_B), shape([NECK, circ(19.2, 9.2, 2.6)])]
  const shell = shape(SHELL)
  const fs = [...skin, shell]
  const ink = outline(fs)
  F.union(ink, F.strokes([dot(19.9, 8.9)], 1.4, 1.2))
  const under = F.offset(F.copy(ink), K.TUCK)
  const parts = faces(fs, under)
  const hex = F.subtract(F.intersect(shape(HEXAGON), F.copy(parts[4])), F.offset(F.copy(ink), -0.0))
  const skinFace = parts.slice(0, 4).reduce((a, b) => F.union(a, b))
  return [
    node(castShadow(ink, fs), paint('shadow'), 'wm-shadow'),
    node(skinFace, paint(2)),
    node(parts[4], paint(4)),
    node(hex, paint(1)),
    node(ink, null, null, true),
  ].filter(Boolean)
}
