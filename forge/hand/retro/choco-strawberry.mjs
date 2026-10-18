// forge/hand/retro/choco-strawberry.mjs — a strawberry dipped in chocolate: red berry, a dark-chocolate upper half
// with a wavy drip edge (ink line across the berry), a cream gloss mark, a teal three-point leaf crown; replaces the generated drawing whose stripes and dark gaps read as a face with sunglasses.
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

const BODY = 'M12 22 C7.2 20 3.8 15.4 4 11.2 C4.2 8.4 7.4 7.2 12 7.2 C16.6 7.2 19.8 8.4 20 11.2 C20.2 15.4 16.8 20 12 22 Z'
const WAVE = 'M3 18.2 C5.5 17.8 7 19.8 8.8 19.8 C10.4 19.8 10.6 18.4 12 18.4 C13.4 18.4 13.8 20.2 15.4 20.2 C17.2 20.2 18 17.8 21 18.2'
const DIP = WAVE + ' L21 24 L3 24 Z'
const CROWN = 'M3.6 8.2 L6.4 4.6 L9.4 6.6 L12 3.2 L14.6 6.6 L17.6 4.6 L20.4 8.2 C17 10.2 7 10.2 3.6 8.2 Z'

export default function render() {
  F.setClip(null)
  const body = shape(BODY), crown = shape(CROWN)
  const fs = [body, crown]
  const ink = outline(fs)
  // the drip edge, kept inside the berry and behind the crown
  const wave = F.intersect(F.strokes(lines(WAVE), 1.5, 1.2), F.offset(F.copy(body), 0.3))
  F.union(ink, F.subtract(wave, crown))
  const under = F.offset(F.copy(ink), K.TUCK)
  const [berry, leaf] = faces(fs, under)
  const choc = F.intersect(F.copy(berry), F.subtract(F.region(rings(DIP), 1.2), under))
  const shine = F.intersect(F.strokes(lines('M6.6 11.6 C6.7 12.4 6.9 13 7.2 13.4'), 1.1, 1.2), F.offset(F.copy(berry), 0.1))
  const seeds = [[7,12.6],[10.6,13.2],[14.2,12.6],[17,13.4],[8.8,15.6],[12.4,16.2],[15.6,16]].map(([x,y]) => F.region(rings(circ(x,y,0.55)),1.2))
  const seed = seeds.reduce((a,b)=>F.union(a,b))
  const seedFace = F.subtract(F.intersect(seed, F.subtract(F.copy(berry), F.offset(F.copy(choc), 0.4))), F.offset(F.copy(ink), 0.2))
  return [
    node(castShadow(ink, [body, crown]), paint('shadow'), 'wm-shadow'),
    node(berry, paint(3)),
    node(choc, paint('shadow')),
    node(seedFace, paint('cream'), 'wm-deco'),
    node(leaf, paint(4)),
    node(ink, null, null, true),
    node(F.subtract(shine, F.offset(F.copy(ink), -0.2)), paint('cream'), 'wm-shine'),
  ].filter(Boolean)
}
