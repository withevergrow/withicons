// forge/hand/chrome/paintbrush.mjs: a round artist's brush on the diagonal: a fat chrome teardrop of bristles with a clear
// point at the lower left, a gunmetal ferrule and a tapered chrome handle running to the upper right. The earlier draw was
// a thin pen with a pink scrap at its foot; the bristles are the heavy, readable part here and the ferrule a distinct second
// metal that parts bristles from handle. The geometry is drawn in brush space (x along the brush from its tip, y across)
// and turned onto the diagonal. Chrome model and paint from _chrome-core.mjs.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const C = Math.SQRT1_2, TIP = [2.6, 21.4]
const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(TIP[0] + (x + y) * C)} ${r2(TIP[1] + (-x + y) * C)}`
const M = (x, y) => 'M' + P(x, y)
const L = (x, y) => 'L' + P(x, y)
const Cb = (a, b, c, d, e, f) => 'C' + P(a, b) + ' ' + P(c, d) + ' ' + P(e, f)

// bristles: a plump teardrop, a point at x = 0, the belly near x = 6, running up under the ferrule
const BRISTLE = M(0, 0) + Cb(1.4, -0.9, 2.6, -3.0, 5.6, -3.0) + L(8.6, -2.6) + L(8.6, 2.6) + L(5.6, 3.0) + Cb(2.6, 3.0, 1.4, 0.9, 0, 0) + 'Z'
// the ferrule: a short, slightly tapering collar
const FERRULE = M(9.0, -2.3) + L(12.8, -2.0) + L(12.8, 2.0) + L(9.0, 2.3) + 'Z'
// the handle: swells just past the ferrule, then tapers to a rounded end
const HANDLE = M(13.2, -1.5) + Cb(16.5, -1.7, 21, -1.4, 25.6, -1.0) + L(25.6, 1.0) + Cb(21, 1.4, 16.5, 1.7, 13.2, 1.5) + 'Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'paintbrush'
  const Ls = layers(model(skeleton(name, [
    { d: HANDLE, plate: 'K', fill: true },
    { d: BRISTLE, plate: 'K', fill: true },
    { d: FERRULE, plate: 'A' },
    { d: FERRULE, plate: 'A', fill: true },
  ])))
  for (const L of Ls.list) {
    if (!L.cls) L.cls = 'wm-k'
    // the ferrule is gunmetal all through: dark steel, a mid-steel rim, so it parts bristles from handle at a glance
    if (L.cls === 'wm-a' && Array.isArray(L.fill)) {
      const k = L.fill[0]
      if (k === 'bevel') L.fill = col('c1')
      else if (k === 'metalSky') L.fill = col('c2')
      else if (k === 'metalGround') L.fill = col('c3')
    }
  }
  return emit(Ls, name, 0)
}
