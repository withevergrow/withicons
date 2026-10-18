// forge/hand/liquid/panel-right.mjs: a clear-glass window with a narrow violet glass sidebar inlaid on the right and a
// clear divider before it, the mirror of sidebar. The generated drawing tinted the right pane like the frame, so it read
// as an empty box; coloured glass makes the right side the one idea.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton in the shape model() expects: lines, fills (subs), cutouts (subs)
function skeleton(name, parts, cuts = []) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line !== false) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate || 'K' })
    if (p.fill) fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: cuts.map(d => ({ subs: parsePath(d) })) }
}

const FRAME = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
const PANEL = 'M15.25 4.75 H19.25 V19.25 H15.25 Z'
const DIV = 'M14 3 V21'

export default function render(icon) {
  const name = (icon && icon.name) || 'panel-right'
  return build(skeleton(name, [
    { d: FRAME, plate: 'K', fill: true },
    { d: DIV, plate: 'K' },
    { d: PANEL, plate: 'A', fill: true },
  ])) || []
}
