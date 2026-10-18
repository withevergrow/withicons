// forge/hand/glass/columns.mjs — the glass window split into a header and two columns: the generated drawing was one
// blank frosted card with a faint hairline. Here two deep colour windows are cut into the pane under a frosted header
// strip, so the colour body glows through as two clear columns divided by a frosted rule.
// Roles: back/shadow colour body, pane/frost glass, accent glow, shine rim. Motion: body wm-k (the spec nudges the divider).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { G } from '../../styles/_glass-core.mjs'

const FRAME = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`
// two tall windows under a header strip
const COLS = [rr(5.5, 8, 11.25, 18.5, 1), rr(12.75, 8, 18.5, 18.5, 1)]

export default function render(icon) {
  const subs = d => parsePath(d)
  const base = {
    ...icon,
    paths: icon.paths.filter(p => p.plate === 'K'),
    lines: icon.lines.filter(l => l.plate === 'K'),
    cutouts: COLS.map(d => ({ d, subs: subs(d) })),
  }
  const L = softLayers(base)
  if (!L) return null
  const { defs, out } = softPaint(L, icon.name)
  // the divider between the columns: a frost line in the pane's own frame (the part the spec nudges)
  const x = +(12 + (12 - 12) * G.SCALE - 0.5).toFixed(2), y0 = +(12 + (8.4 - 12) * G.SCALE - 0.5).toFixed(2), y1 = +(12 + (18.1 - 12) * G.SCALE - 0.5).toFixed(2)
  const div = ['path', { d: `M${x} ${y0}V${y1}`, fill: 'none', stroke: V.frost, 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  if (rim >= 0) out.splice(rim, 0, div); else out.push(div)
  return [['defs', {}, defs], ...out]
}
