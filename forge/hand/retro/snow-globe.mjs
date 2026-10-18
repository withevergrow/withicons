// forge/hand/retro/snow-globe.mjs — a glass dome with sunset bands, a solid ink pine on a cream snowdrift, three cream
// flakes and a teal base; replaces the generated globe whose outlined, banded tree chopped into a face-like knot.
import * as F from '../../styles/_retro-field.mjs'
import { loopsD, K } from '../../styles/_retro-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const HEX = { 1: '#F4B53F', 2: '#EF7D2D', 3: '#DE4B3A', 4: '#178A86', cream: '#FFF3D9', shadow: '#6B3323' }
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
const dot = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`

const DOME = 'M20 10 A8 8 0 1 1 4 10 A8 8 0 1 1 20 10 Z'
const BASE = 'M7.5 17 H16.5 L17.9 20.1 A1 1 0 0 1 17 21.5 H7 A1 1 0 0 1 6.1 20.1 Z'
const DRIFT = 'M5.6 14.9 A14 14 0 0 1 18.4 14.9'
const SNOW = 'M5.6 14.9 A14 14 0 0 1 18.4 14.9 L18.4 18 H5.6 Z'
const TREE = 'M12 4.6 L14.85 8.1 H13.55 L15.6 11.2 H8.4 L10.45 8.1 H9.15 Z'

export default function render() {
  F.setClip(null)
  const ink = F.strokes(lines(DOME), K.W, 1.2)
  F.strokes(lines(BASE), K.W, 1.2, ink)
  F.strokes(lines(DRIFT), 1.6, 1.2, ink)
  F.strokes(lines(TREE), 0.9, 1.2, ink)
  F.region(rings(TREE), 1.2, ink)
  F.strokes(lines('M12 11 V13.9'), 1.7, 1.2, ink)
  const sil = F.union(F.union(F.region(rings(DOME)), F.region(rings(BASE))), F.copy(ink))
  const under = F.offset(F.copy(ink), K.TUCK)
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  const snow = F.intersect(F.region(rings(SNOW), 1.2), F.region(rings(DOME), 1.2))
  const glass = F.subtract(F.region(rings(DOME), 1.2), F.copy(snow))
  // sunset bands in the glass above the drift (final, shifted coordinates)
  for (const [y0, y1, c] of [[0, 6.3, 1], [6.85, 10.0, 2], [10.6, 24, 3]]) {
    const f = F.clipBand(F.copy(glass), y0, y1)
    out.push(node(F.subtract(f, under), paint(c)))
  }
  out.push(node(F.subtract(snow, under), paint('cream')))
  out.push(node(F.subtract(F.region(rings(BASE), 1.2), under), paint(4)))
  // three falling flakes, cream on the bands, clear of the pine and the rim
  const flakes = F.region(rings(dot(7.2, 9.4, 0.62)), 1.2)
  F.region(rings(dot(16.9, 8.6, 0.62)), 1.2, flakes)
  F.region(rings(dot(8.9, 5.9, 0.55)), 1.2, flakes)
  out.push(node(flakes, paint('cream'), 'wm-deco'))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
