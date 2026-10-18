// forge/hand/glass/wind.mjs — three bold glass ribbons with open curls. Generated Glass stacked 2.8u rods 4u apart, so
// the lines melted into one blob. Here the ribbons sit further apart and each ends in a clear hook with an open eye
// (top and middle curl up, the bottom one hooks down), so it reads as wind at 16px. Top and bottom are attached
// parts (wm-a, they gust), the long middle ribbon is the body.
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'

const f2 = v => +v.toFixed(2)
// a ribbon: horizontal run to (x, y), then a curl of radius r about (x, y -/+ r), sweeping `sweep` degrees
const ribbon = (x0, y, x, r, up, sweep) => {
  const cy = up ? y - r : y + r
  const a0 = up ? 90 : -90, a1 = up ? 90 - sweep : -90 + sweep
  const pt = a => `${f2(x + r * Math.cos(a * Math.PI / 180))} ${f2(cy + r * Math.sin(a * Math.PI / 180))}`
  // up: counter-clockwise on screen (sweep-flag 0); down: clockwise (1)
  return `M${x0} ${y} H${x} A${r} ${r} 0 ${sweep > 180 ? 1 : 0} ${up ? 0 : 1} ${pt(a1)}`
}
const PATHS = [
  [ribbon(3.2, 7.6, 8.8, 2.5, true, 215), 'A'],
  [ribbon(3.2, 12.4, 18.6, 3.1, true, 215), 'K'],
  [ribbon(3.2, 17.2, 11.6, 2.3, false, 215), 'A'],
]

function skel(paths) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  return {
    name: 'hand', paths: P, fills: [], cutouts: [],
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: [],
  }
}

export default function render() {
  const L = softLayers(skel(PATHS))
  if (!L) return null
  const { defs, out } = softPaint(L, 'wind')
  // the attached parts' clearer glass layer is the moving part
  for (const n of out) if (!n[1].class && n[1]['fill-opacity'] === 0.35) n[1] = { ...n[1], class: 'wm-a' }
  return [['defs', {}, defs], ...out]
}
