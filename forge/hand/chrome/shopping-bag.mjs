// forge/hand/chrome/shopping-bag.mjs: an upright chrome tote, a broad rectangular body with a wide gunmetal handle arching
// over the top and two eyelet holes punched where the handle's legs go in. The earlier draws were a narrow flared trapezoid
// with a small loop that read as a padlock or a kettlebell; a wide, tall arch on a squarer body reads as a bag. The handle
// is plate A (the swinging part, wm-a) and sits behind the body. Chrome model and paint from _chrome-core.mjs.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const BODY = 'M6.4 7.8 H17.6 A1.3 1.3 0 0 1 18.9 9 L20 19.8 A2 2 0 0 1 18 22 H6 A2 2 0 0 1 4 19.8 L5.1 9 A1.3 1.3 0 0 1 6.4 7.8 Z'
const HANDLE = 'M8.2 9.6 V6.2 A3.8 4 0 0 1 15.8 6.2 V9.6'
const hole = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'shopping-bag'
  const Ls = layers(model(skeleton(name, [
    { d: HANDLE, plate: 'A' },
    { d: BODY, plate: 'K', fill: true },
  ], [hole(8.2, 10.5, 0.9), hole(15.8, 10.5, 0.9)])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
