// forge/hand/chrome/cloud-lightning.mjs: a polished chrome cloud with a big solid enamel bolt (the accent colour, a
// glossy top over it) set in a chrome bezel across the cloud's lower edge, cleared from the cloud by a clean moat.
// The generated bolt was a thin gunmetal outline inside the cloud and vanished at 16-24px; here the bolt is the jewel.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const CLOUD = 'M7.5 14.5 A4.05 4.05 0 0 1 6.78 6.49 A5.58 5.58 0 0 1 17.49 6.94 A3.83 3.83 0 0 1 16.73 14.5 Z'
// a fat zigzag bolt, top right to a tip bottom left, crossing the cloud's bottom edge
const BOLT = 'M15 8.2 L8 16.1 L11.9 16.1 L10.4 22.4 L17.4 13.9 L13.4 13.9 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'cloud-lightning'
  const Ls = layers(model(skeleton(name, [{ d: CLOUD, fill: true }, { d: BOLT, plate: 'S', fill: true }])))
  const out = emit(Ls, name, 0)
  // the bolt is the moving part (motion spec: A); a yellow enamel unless a palette sets the accent
  for (const n of out) {
    if (n[0] === 'defs') for (const g of n[2]) for (const s of g[2]) s[1]['stop-color'] = s[1]['stop-color'].replace('#FF3E9E', '#FFC419')
    else if (n[1].class === 'wm-s') n[1].class = 'wm-a'
    else if (!n[1].class) n[1].class = 'wm-k'
  }
  return out
}
