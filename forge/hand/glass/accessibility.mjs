// forge/hand/glass/accessibility.mjs — the access figure cut boldly out of a frosted disc: a big round head, wide arms and splayed legs, so the person reads at 16px.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const DISC = 'M21.5 12 A9.5 9.5 0 1 1 2.5 12 A9.5 9.5 0 1 1 21.5 12 Z'
const HEAD = 'M13.9 6.6 A1.9 1.9 0 1 1 10.1 6.6 A1.9 1.9 0 1 1 13.6 6.6 Z'
const ICON = { paths: [[DISC, 'K']], fills: [DISC], cutouts: [] }
const LD = 'M6.75 10.5 H17.25 M12 10.5 V14 M9 18 L12 14 L15 18'

export default function render() {
  const { defs, out } = softPaint(softLayers(skel(ICON)), 'accessibility')
  const ink = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  return [['defs', {}, defs], ...out,
    ['path', { d: LD, stroke: V.etch, 'stroke-opacity': 0.35, 'stroke-width': 2.7, ...ink }],
    ['path', { d: LD, stroke: V.frost, 'stroke-width': 2.1, ...ink }],
    ['circle', { cx: 12, cy: 6.5, r: 1.95, fill: V.frost, stroke: V.etch, 'stroke-opacity': 0.35, 'stroke-width': 0.6, class: 'wm-a' }]]
}

// a prepared skeleton, as forge/lib/load.mjs prepares one
function skel({ paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: 'hand', paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
