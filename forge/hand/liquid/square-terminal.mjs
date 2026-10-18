// forge/hand/liquid/square-terminal.mjs: a clear glass tile with the prompt inlaid in c2 glass: a bold chevron and an underscore
// (the shapes of line, no looped glyph). The prompt is the moving part (wm-a), the tile the body.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function synth(name, paths, fills) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => ({ d, subs: parsePath(d) })), cutouts: [],
  }
}

// the generator's contour smoothing lifts the sharp notch inside a chevron, so the notch gets a small round fillet
const r2 = v => Math.round(v * 100) / 100
const HW = 1.15 / 0.88, NX = 11.5 - HW * Math.SQRT2, RHO = 0.9, CX = NX - RHO * Math.SQRT2
function fillet() {
  const arc = []
  for (let i = 0; i <= 8; i++) { const t = (-45 + 90 * (i / 8)) * Math.PI / 180; arc.push([CX + RHO * Math.cos(t), 12 + RHO * Math.sin(t)]) }
  return 'M' + arc.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + `L${r2(NX + 0.3)} 12Z`
}

const TILE = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'square-terminal'
  return build(synth(name, [
    [TILE, 'K'],
    ['M7.5 8 L11.5 12 L7.5 16', 'A'],
    ['M13.5 16 H17', 'A'],
  ], [TILE, fillet()]))
}
