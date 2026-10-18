// forge/hand/liquid/circle-stop.mjs — a clear glass disc with a solid violet glass stop square inlaid at its centre.
// The generator cut the square as a hole ringed by a coloured tube, a square donut that read as a frame or a target at
// 16px; one solid coloured square is the universal stop mark. Same model and paint as the generator (_liquid-core.mjs);
// only the geometry is drawn here. The square is the A part (wm-a) so it still breathes on its own.
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

const DISC = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
const SQUARE = 'M10 9.25 H14 A0.75 0.75 0 0 1 14.75 10 V14 A0.75 0.75 0 0 1 14 14.75 H10 A0.75 0.75 0 0 1 9.25 14 V10 A0.75 0.75 0 0 1 10 9.25 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'circle-stop'
  return build(skeleton(name, [
    { d: DISC, plate: 'K', fill: true },
    { d: SQUARE, plate: 'A', fill: true },
  ]))
}
