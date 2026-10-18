// forge/hand/retro/boxes.mjs — three crisp isometric crates in a pyramid, every face one flat sunset colour (lit
// mustard/orange on the top crate, coral/teal on the two below) with lighter inner seams; replaces the generated stack
// whose full-weight seams and stripe gaps cut each face into chips, so the cluster muddied at 16-24px.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', shadow: '#6B3323' }
const paint = k => `var(--with-retro-${k}, ${HEX[k]})`
const mv = pts => pts.map(([x, y]) => [x + K.SHIFT, y + K.SHIFT])
const lines = d => parsePath(d).map(s => ({ pts: mv(s.pts), closed: s.closed }))
const rings = d => parsePath(d).map(s => mv(s.pts))
const node = (Fd, fill, cls, ink = false) => {
  const d = loopsD(F.trace(Fd, ink ? K.TOL : K.TOL_C, ink ? 0.15 : 0.3), ink ? 2 : 1)
  if (!d) return null
  const a = { d, 'fill-rule': 'evenodd' }
  if (fill) a.fill = fill
  if (cls) a.class = cls
  return ['path', a]
}
const SEAM = 1.9 // inner seams a touch lighter than the outline so the small faces keep their colour

// one crate centred at (cx, cy), vertex radius 5 (the skeleton's 4.33 x 2.5 isometric steps)
function crate(cx, cy) {
  const x0 = cx - 4.33, x1 = cx + 4.33, t = cy - 5, b = cy + 5
  const p = (x, y) => `${+x.toFixed(2)} ${+y.toFixed(2)}`
  return {
    hex: `M${p(cx, t)} L${p(x1, cy - 2.5)} L${p(x1, cy + 2.5)} L${p(cx, b)} L${p(x0, cy + 2.5)} L${p(x0, cy - 2.5)} Z`,
    seam: `M${p(x0, cy - 2.5)} L${p(cx, cy)} L${p(x1, cy - 2.5)} M${p(cx, cy)} L${p(cx, b)}`,
    top: `M${p(cx, t)} L${p(x1, cy - 2.5)} L${p(cx, cy)} L${p(x0, cy - 2.5)} Z`,
    sides: `M${p(x0, cy - 2.5)} L${p(cx, cy)} L${p(x1, cy - 2.5)} L${p(x1, cy + 2.5)} L${p(cx, b)} L${p(x0, cy + 2.5)} Z`,
  }
}

export default function render() {
  F.setClip(null)
  const top = crate(12, 8.25), left = crate(7.67, 15.75), right = crate(16.33, 15.75)
  const inkOf = c => F.strokes(lines(c.seam), SEAM, 1.2, F.strokes(lines(c.hex), K.W, 1.2))
  const inkTop = inkOf(top)
  const inkLow = F.union(inkOf(left), inkOf(right))
  const ink = F.union(F.copy(inkLow), inkTop)
  const sil = F.copy(ink)
  for (const c of [top, left, right]) F.union(sil, F.region(rings(c.hex), 1.2))
  const under = F.offset(F.copy(ink), K.TUCK)
  const face = d => F.subtract(F.region(rings(d), 1.2), under)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  return [
    node(shadow, paint('shadow'), 'wm-shadow'),
    node(F.union(face(left.top), face(right.top)), paint(3)),
    node(F.union(face(left.sides), face(right.sides)), paint(4)),
    node(inkLow, null, null, true),
    // the top crate is the A part: it hops on the stack (forge/motion/boxes.json)
    node(face(top.top), paint(1), 'wm-a'),
    node(face(top.sides), paint(2), 'wm-a'),
    node(inkOf(top), null, 'wm-a', true),
  ].filter(Boolean)
}
