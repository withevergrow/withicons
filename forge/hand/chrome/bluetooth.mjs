// forge/hand/chrome/bluetooth.mjs: the Bluetooth rune as one open chrome tube at the same weight as the generated line
// icons (bell, at-sign): spine, two arms crossing it and two barbs, tall and open so the crossings read at 16px. The old
// draw was a fat filled body with triangular cutouts that clogged. Chrome model and paint from _chrome-core.mjs.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const RUNE = 'M4.5 6.5L18.5 17L12 22V2L18.5 7L4.5 17.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'bluetooth'
  const Ls = layers(model(skeleton(name, [{ d: RUNE, plate: 'K' }])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
