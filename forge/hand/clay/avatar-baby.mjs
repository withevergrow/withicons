// forge/hand/clay/avatar-baby.mjs — a baby avatar in clay: a round skin-tone head (not an egg) with a little brown topknot,
// two big dark glossy dot eyes, rosy cheeks and a clear inked smile, sitting on pink rounded shoulders. The generated
// avatar had an egg-shaped head, pinprick eyes and no readable smile. Head, topknot, eyes and shoulders are the generator's
// model and light (_clay-core.mjs, skin family and clothes material as for the other avatars); cheeks and the smile are
// laid on the face through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, ellD } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`
const r2 = n => Math.round(n * 100) / 100

const HEAD = disc(12, 10.2, 6.1)
const KNOT = disc(12, 3.5, 1.7)
const EYES = [disc(9.5, 10.7, 1.15), disc(14.5, 10.7, 1.15)]
// shoulders: a rounded yoke along the bottom, the neck notch left to the head
const SHOULDERS = 'M3.6 21.8C3.6 19 5.6 17.4 8.4 17.4C10 17.4 10.6 16.3 12 16.3C13.4 16.3 14 17.4 15.6 17.4C18.4 17.4 20.4 19 20.4 21.8Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-baby'
  const sk = skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: KNOT, plate: 'A', fill: true },
    { d: SHOULDERS, plate: 'A', fill: true },
  ], EYES)
  const nodes = build(sk)
  if (!nodes) return nodes
  const { col } = colorsFor(sk)
  const s = K.SCALE
  const tf = (x, y) => [r2((x - 12) * s + 12 + K.TX), r2((y - 12) * s + 12 + K.TY)]
  // rosy cheeks, then an inked smile with a lit lip below it
  for (const x of [7.4, 16.6]) {
    const [cx, cy] = tf(x, 13.2)
    nodes.push(['path', { d: ellD(cx, cy, 1.2, 0.75), fill: col('c3'), 'fill-opacity': 0.42, class: 'wm-k' }])
  }
  const [ax, ay] = tf(10, 13.4), [bx, by] = tf(14, 13.4), rr = r2(2.5 * s)
  const smile = `M${ax} ${ay}A${rr} ${rr} 0 0 0 ${bx} ${by}`
  const lip = `M${ax} ${r2(ay + 0.24)}A${rr} ${rr} 0 0 0 ${bx} ${r2(by + 0.24)}`
  nodes.push(['path', { d: lip, stroke: col('shine'), 'stroke-opacity': 0.5, 'stroke-width': 0.9, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  nodes.push(['path', { d: smile, stroke: col('ink'), 'stroke-width': 0.95, 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }])
  return nodes
}
