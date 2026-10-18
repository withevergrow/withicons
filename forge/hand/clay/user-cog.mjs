// forge/hand/clay/user-cog.mjs — the violet clay person with a pink candy gear badge: a round hub with eight chunky
// square teeth and a dark axle hole at its centre. The generator ran the gear's thin outline through the candy tube,
// so every tooth melted into a petal and the badge read as a flower; here the gear is a filled outline with short wide
// teeth about 2u deep and clear notches between them, and a large open axle bore (no hub ring), so it reads as a gear at 16px. Same model, light and colour as the
// generator (_clay-core.mjs); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { BASE } from '../../styles/_clay-color.mjs'

function skeleton(name, parts) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100

// gear outline: n teeth, root radius r0, tip radius r1, tooth half-widths (radians) at root and tip
function gear(cx, cy, n, r0, r1, wRoot, wTip) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + i * 2 * Math.PI / n
    const P = (r, t) => `${r2(cx + r * Math.cos(t))} ${r2(cy + r * Math.sin(t))}`
    d += (i ? 'L' : 'M') + P(r0, a - wRoot) + 'L' + P(r1, a - wTip) + 'L' + P(r1, a + wTip) + 'L' + P(r0, a + wRoot)
    d += `A${r0} ${r0} 0 0 1 ` + P(r0, a + 2 * Math.PI / n - wRoot)
  }
  return d + 'Z'
}

const HEAD = 'M12.25 7.5 A3.75 3.75 0 1 1 4.75 7.5 A3.75 3.75 0 1 1 12.25 7.5 Z'
const BUST = 'M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H9.5'
const BUST_FILL = 'M2 21 V19.5 A4.5 4.5 0 0 1 6.5 15 H9.5 V21 Z'
const GX = 17.5, GY = 16.5

const col = r => `var(--with-clay-${r}, ${BASE[r]})`
// the clay model's placement (scale 0.84 about the centre, lifted 0.95): skeleton point -> drawing point
const tf = (x, y) => [(x - 12) * 0.84 + 12, (y - 12) * 0.84 + 12 - 0.95]

export default function render(icon) {
  const nodes = build(gearSkeleton((icon && icon.name) || 'user-cog'))
  // the axle hole: a dark glossy pit at the hub (the clay model's pit recipe: ink, lit lower lip, crisp spec)
  const [hx, hy] = tf(GX, GY)
  const AX = 1.25   // 1.5 before placement: a real bore through the gear
  nodes.push(['path', { d: ellD(hx, hy, AX, AX), fill: col('ink'), class: 'wm-s' }])
  nodes.push(['path', { d: 'M' + (hx - 1.05).toFixed(2) + ' ' + (hy + 0.7).toFixed(2) + 'A1.25 1.25 0 0 0 ' + (hx + 1.05).toFixed(2) + ' ' + (hy + 0.7).toFixed(2) + 'A1.5 1.5 0 0 1 ' + (hx - 1.05).toFixed(2) + ' ' + (hy + 0.7).toFixed(2) + 'Z', fill: col('shine'), 'fill-opacity': 0.4, class: 'wm-shine' }])
  nodes.push(['path', { d: ellD(hx - 0.45, hy - 0.45, 0.26, 0.26), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  return nodes
}

// head and bust in body clay; the gear a filled outline on plate S (the candy badge)
function gearSkeleton(name) {
  const S = skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: BUST, plate: 'K' },
    { d: BUST_FILL, plate: 'K', fill: true },
    { d: gear(GX, GY, 8, 3.0, 5.1, 0.3, 0.2), plate: 'S', fill: true },
    // a tiny S stub at the axle (hidden under the bore) so the gear fill votes onto plate S, the candy badge
    { d: `M${GX} ${GY - 0.1} L${GX} ${GY + 0.1}`, plate: 'S' },
  ])
  S.lines = S.lines.filter(l => l.pathId !== 'p3')   // a tube along the teeth would round them off again
  return S
}
