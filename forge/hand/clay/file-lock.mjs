// forge/hand/clay/file-lock.mjs — a plump violet clay page with a smaller folded corner and a big orange clay padlock
// pressed on its face: a wide round shackle with an open hole, a chunky body and a dark glossy keyhole. The generator
// fused the skeleton's small lock into one orange blob (the shackle hole closed up and the body merged with the fold);
// here the fold is smaller and higher so the padlock can grow, and the shackle is drawn wide enough to stay open at
// 16px. Same model, light and colour as the generator (_clay-core.mjs); only the geometry and the keyhole are drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { BASE } from '../../styles/_clay-color.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const col = r => `var(--with-clay-${r}, ${BASE[r]})`
// the clay model's placement (scale 0.84 about the centre, lifted 0.95): skeleton point -> drawing point
const tf = (x, y) => [(x - 12) * 0.84 + 12, (y - 12) * 0.84 + 12 - 0.95]

// page with a smaller dog-ear, the fold, the padlock body (fill + rim) and its shackle (an A tube)
const PAGE = 'M15 2.5 H7 A2 2 0 0 0 5 4.5 V19.5 A2 2 0 0 0 7 21.5 H17 A2 2 0 0 0 19 19.5 V6.5 Z'
const FOLD = 'M15 2.5 V5 A1.5 1.5 0 0 0 16.5 6.5 H19'
const BODY = 'M8.5 14.5 H14.5 A0.75 0.75 0 0 1 15.25 15.25 V18 A0.75 0.75 0 0 1 14.5 18.75 H8.5 A0.75 0.75 0 0 1 7.75 18 V15.25 A0.75 0.75 0 0 1 8.5 14.5 Z'
const SHACKLE = 'M8.5 14.5 V12.25 A3 3 0 0 1 14.5 12.25 V14.5'
const fold = 'M15 2.5 V5 A1.5 1.5 0 0 0 16.5 6.5 H19'

export default function render(icon) {
  const name = (icon && icon.name) || 'file-lock'
  const nodes = build(skeleton(name, [
    { d: PAGE, plate: 'K', fill: true },
    { d: FOLD, plate: 'A' },
    { d: SHACKLE, plate: 'A' },
    { d: BODY, plate: 'A', fill: true },
  ], [fold]))
  // keyhole: a dark glossy pit in the padlock body, the clay model's pit recipe (ink, lit lower lip, crisp spec)
  const [kx, ky] = tf(11.5, 16.5)
  const hole = `${ellD(kx, ky - 0.3, 0.7, 0.7)}M${(kx - 0.34).toFixed(2)} ${(ky - 0.1).toFixed(2)}H${(kx + 0.34).toFixed(2)}L${(kx + 0.48).toFixed(2)} ${(ky + 1.25).toFixed(2)}H${(kx - 0.48).toFixed(2)}Z`
  nodes.push(['path', { d: hole, fill: col('ink'), class: 'wm-a' }])
  nodes.push(['path', { d: ellD(kx + 0.06, ky + 1.38, 0.5, 0.13), fill: col('shine'), 'fill-opacity': 0.4, class: 'wm-shine' }])
  nodes.push(['path', { d: ellD(kx - 0.22, ky - 0.52, 0.2, 0.2), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  return nodes
}
