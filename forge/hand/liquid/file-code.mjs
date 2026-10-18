// forge/hand/liquid/file-code.mjs: the source-code page as one clear glass sheet with a clipped top-right corner, a
// solid violet fold flap there, and two separate violet-glass chevrons ( < and > ) centred on the page.
// The generated brackets were hollow tubes with grooves that overlapped into a muddle; here they are two plain
// inlays with clear glass between them. Same glass recipe as the generator (_liquid-core build); only the geometry
// is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function prep(name, paths, fills = []) {
  const lines = paths.flatMap(([d, plate]) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate })))
  return {
    name, lines, paths: [], cutouts: [],
    fills: fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }),
  }
}
const PAGE = 'M14 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V7.5 Z'
const FOLD = 'M14.6 3.6 V6 A1.4 1.4 0 0 0 16 7.4 H18.4 Z'
const LEFT = 'M9.6 11.6 L7.3 15.2 L9.6 18.8'
const RIGHT = 'M14.4 11.6 L16.7 15.2 L14.4 18.8'

export default function render(icon) {
  const name = (icon && icon.name) || 'file-code'
  const nodes = build(prep(name, [[PAGE, 'K'], [FOLD, 'A'], [LEFT, 'A'], [RIGHT, 'A']], [PAGE]))
  for (const n of nodes) if (n[0] !== 'defs' && n[1].stroke === 'currentColor') { n[1]['stroke-opacity'] = 0.42 }
  return nodes
}
