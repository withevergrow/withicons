// forge/hand/liquid/file-text.mjs: the document page as one clear glass sheet with a clipped top-right corner, a solid
// violet-glass fold flap in that corner and three solid violet pill bars (short, long, long) left-aligned below it.
// The generated bars were hollow tubes with grooves around them and the page outline wobbled around the moats, so it
// read as a lumpy blob; here the bars are plain inlays (no grooves), evenly spaced, on a clean page.
// Same glass recipe as the generator (_liquid-core build); only the geometry is drawn here.
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
const BARS = ['M8.7 10.9 H11', 'M8.7 14.9 H15.3', 'M8.7 18.9 H15.3']

export default function render(icon) {
  const name = (icon && icon.name) || 'file-text'
  const nodes = build(prep(name, [[PAGE, 'K'], [FOLD, 'A'], ...BARS.map(d => [d, 'A'])], [PAGE]))
  for (const n of nodes) if (n[0] !== 'defs' && n[1].stroke === 'currentColor') { n[1]['stroke-opacity'] = 0.42 }
  return nodes
}
