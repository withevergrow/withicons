// forge/hand/liquid/split.mjs: a stem that forks into two distinct arms, each ending in a corner arrowhead (as in line).
// The arms are separate open strokes. The generator's contour smoothing lifts a sharp notch between two long straight
// edges (the V reads as a filled wedge), so the notch gets a small round fillet that keeps the V open and clean.
// The heads are coloured c2 glass (wm-a, for the nudge).
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
function synth(name, paths, fills) {
  const ps = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name, paths: ps,
    lines: ps.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fills: fills.map(d => ({ d, subs: parsePath(d) })), cutouts: [],
  }
}

// fillet in the V: arms are 45 degrees through (12,12), half width 1.3/0.88 in skeleton units
const HW = 1.3 / 0.88, NY = 12 - HW * Math.SQRT2, RHO = 1.25, CY = NY - RHO * Math.SQRT2
function fillet() {
  // arc points: angle measured from straight down, from -45deg to +45deg
  const arc = []
  for (let i = 0; i <= 8; i++) { const t = (-45 + 90 * (i / 8)) * Math.PI / 180; arc.push([12 + RHO * Math.sin(t), CY + RHO * Math.cos(t)]) }
  return 'M' + arc.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + `L12 ${r2(NY + 0.3)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'split'
  return build(synth(name, [
    ['M12 20.5 V12', 'K'],
    ['M12 12 L4.5 4.5', 'K'],
    ['M12 12 L19.5 4.5', 'K'],
    ['M4.5 9.5 V4.5 H9.5', 'A'],
    ['M19.5 9.5 V4.5 H14.5', 'A'],
  ], [fillet()]))
}
