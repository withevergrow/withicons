// forge/hand/retro/cloud-drizzle.mjs — a plain teal cloud (no stripe band, a light print shadow) over two neat rows of
// chunky ink drops, as in the line design; replaces the generated drawing whose sunset bands and heavy shadow smeared
// the drops into one cluster.
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

const CLOUD = 'M7.5 14 A4.05 4.05 0 0 1 6.78 5.99 A5.58 5.58 0 0 1 17.49 6.44 A3.83 3.83 0 0 1 16.73 14 Z'
const DROPS = 'M8 17.6 V18.6 M12 17.6 V18.6 M16 17.6 V18.6 M10 20.8 V21.8 M14 20.8 V21.8'

export default function render() {
  F.setClip(null)
  const cloudInk = F.strokes(lines(CLOUD), K.W, 1.2)
  const sil = F.union(F.region(rings(CLOUD), 1.2), F.copy(cloudInk))
  const shadow = F.subtract(F.shift(sil, K.OFF, K.OFF, 1.2), F.offset(F.copy(sil), 0.25))
  const under = F.offset(F.copy(cloudInk), K.TUCK)
  const ink = F.strokes(lines(DROPS), 1.9, 1.2, cloudInk)
  const out = [node(shadow, paint('shadow'), 'wm-shadow')]
  out.push(node(F.subtract(F.region(rings(CLOUD), 1.2), under), paint(4)))
  out.push(node(ink, null, null, true))
  return out.filter(Boolean)
}
