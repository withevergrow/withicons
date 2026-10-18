// forge/hand/retro/laddoo.mjs — the common three-ball pyramid of laddoo (two below, one on top) in a teal dish: each
// ball one flat sunset colour (mustard on top, orange below) with a cream catch-light, the front balls overlapping the
// top one; replaces the generated drawing that stacked two discs side by side.
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

const DISH = 'M2.4 17.8 H21.6 C21 20.4 19.2 22 17 22 H7 C4.8 22 3 20.4 2.4 17.8 Z'

export default function render() {
  F.setClip(null)
  const fs = [shape(circ(12, 7.8, 4.4)), shape(circ(16.6, 13.7, 4.6)), shape(circ(7.4, 13.7, 4.6)), shape(DISH)]
  const ink = outline(fs)
  const under = F.offset(F.copy(ink), K.TUCK)
  const [top, right, left, dish] = faces(fs, under)
  const shine = F.strokes([...lines('M10 5.6 C10.4 5 10.9 4.7 11.5 4.6'), ...lines('M5.2 11.6 C5.5 10.9 6 10.4 6.7 10.2'), ...lines('M14.4 11.6 C14.7 10.9 15.2 10.4 15.9 10.2')], 0.9, 1.2)
  return [
    node(castShadow(ink, fs), paint('shadow'), 'wm-shadow'),
    node(top, paint(1)),
    node(F.union(right, left), paint(2)),
    node(dish, paint(4)),
    node(ink, null, null, true),
    node(F.subtract(shine, F.offset(F.copy(ink), -0.2)), paint('cream'), 'wm-shine'),
  ].filter(Boolean)
}
