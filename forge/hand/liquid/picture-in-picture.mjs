// forge/hand/liquid/picture-in-picture.mjs — a clear glass screen slab with a large violet mini-player inlaid in its
// bottom-right corner. The generator cut the screen open and drew the inset as a small tube ringing a second hole, a
// cramped double outline that vanished at 16px; one big solid inset parked in the corner reads as picture in picture.
// Same model and paint as the generator (_liquid-core.mjs); only the geometry is drawn here. The inset is the A part
// (wm-a), centred on the motion origin, so it still floats.
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

const SCREEN = 'M4 4 H20 A2 2 0 0 1 22 6 V18 A2 2 0 0 1 20 20 H4 A2 2 0 0 1 2 18 V6 A2 2 0 0 1 4 4 Z'
const INSET = 'M12.75 11.5 H18.25 A0.5 0.5 0 0 1 18.75 12 V16.25 A0.5 0.5 0 0 1 18.25 16.75 H12.75 A0.5 0.5 0 0 1 12.25 16.25 V12 A0.5 0.5 0 0 1 12.75 11.5 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'picture-in-picture'
  return build(skeleton(name, [
    { d: SCREEN, plate: 'K', fill: true },
    { d: INSET, plate: 'A', fill: true },
  ]))
}
