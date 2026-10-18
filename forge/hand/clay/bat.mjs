// forge/hand/clay/bat.mjs — a violet clay bat in flight: two broad wings that sweep up to a point and end in a scalloped
// trailing edge (three bites each), a plump orange body with two pointed ears and two dark eyes. The generated bat blew the
// wings up into two round puffs round a gold stub; here the scallops and ears are kept (wings are fills, not fat tubes) so
// the silhouette reads as a bat at 16px. Same model and light as the generator (_clay-core.mjs).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { colorsFor } from '../../styles/_clay-color.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.filter(p => p.d).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.f).map(p => { const subs = parsePath(p.f); return { d: p.f, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = n => Math.round(n * 100) / 100
const disc = (x, y, r) => `M${x - r} ${y}A${r} ${r} 0 1 0 ${x + r} ${y}A${r} ${r} 0 1 0 ${x - r} ${y}Z`

// the same outline shrunk toward a centre: the tube round it then ends at the wing's own edge, keeping the scallops
const inset = (d, cx, cy, k) => d.replace(/(-?[\d.]+)([ ,]+)(-?[\d.]+)/g, (m, a, sep, b) => `${r2(cx + (+a - cx) * k)} ${r2(cy + (+b - cy) * k)}`)
const WING_R = 'M14.6 9.4C16.4 8.9 19 7.6 22 5.4C22.6 8.8 22.4 12 21.2 14.6C20.2 13.4 18.8 13.4 17.6 14.9C16.6 13.6 15.4 13.9 14.6 16.2Z'
const WING_L = 'M9.4 9.4C7.6 8.9 5 7.6 2 5.4C1.4 8.8 1.6 12 2.8 14.6C3.8 13.4 5.2 13.4 6.4 14.9C7.4 13.6 8.6 13.9 9.4 16.2Z'
const BODY = 'M10.2 5.2L11.4 7.6H12.6L13.8 5.2V12.6C13.8 14.4 13 15.6 12 15.6C11 15.6 10.2 14.4 10.2 12.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'bat'
  const sk = skeleton(name, [
    { d: inset(WING_R, 17.7, 10.8, 0.76), f: WING_R, plate: 'K' },
    { d: inset(WING_L, 6.3, 10.8, 0.76), f: WING_L, plate: 'K' },
    { d: 'M12 11.5V13.6', f: BODY, plate: 'A' },
  ])
  const nodes = build(sk)
  if (!nodes) return nodes
  // two dark glossy eyes set into the head, placed through the model's own transform
  const { col } = colorsFor(sk)
  const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
  for (const x of [11.05, 12.95]) {
    const [cx, cy] = tf(x, 10.6)
    nodes.push(['path', { d: disc(cx, cy, 0.62), fill: col('ink'), class: 'wm-k' }])
    nodes.push(['path', { d: disc(cx - 0.17, cy - 0.2, 0.2), fill: col('shine'), 'fill-opacity': 0.9, class: 'wm-shine' }])
  }
  return nodes
}
