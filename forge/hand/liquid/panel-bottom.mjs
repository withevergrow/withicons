// forge/hand/liquid/panel-bottom.mjs — a clear glass window frame whose bottom sheet is a solid violet glass pane inlaid
// across its foot. The generator filled the bottom pane in the same clear glass as the frame, parted only by a 2u
// divider, so at 16px it read as a screen with a chin; a coloured pane makes "the bottom panel" the one idea. Same model
// and paint as the generator (_liquid-core.mjs); only the geometry is drawn here. The pane is the A part (wm-a).
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
// the open window above the pane (cut through the glass)
const WINDOW = 'M5.3 4.3 H18.7 A1 1 0 0 1 19.7 5.3 V13.6 H4.3 V5.3 A1 1 0 0 1 5.3 4.3 Z'
const PANE = 'M6.4 14.6 H17.6 A0.6 0.6 0 0 1 18.2 15.2 V17.6 A0.6 0.6 0 0 1 17.6 18.2 H6.4 A0.6 0.6 0 0 1 5.8 17.6 V15.2 A0.6 0.6 0 0 1 6.4 14.6 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'panel-bottom'
  return build(skeleton(name, [
    { d: FRAME, plate: 'K', fill: true },
    { d: PANE, plate: 'A', fill: true },
  ], [WINDOW]))
}
