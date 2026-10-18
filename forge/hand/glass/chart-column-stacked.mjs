// forge/hand/glass/chart-column-stacked.mjs — three columns each split into stacked glass segments with clear gaps, so it reads as stacked rather than as a bar chart.
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const seg = (x, y0, y1) => 'M' + x + ' ' + y0 + ' H' + (x + 4.5) + ' V' + y1 + ' H' + x + ' Z'
const SEGS = [seg(1.5, 15, 21), seg(1.5, 9, 12), seg(9.75, 12, 21), seg(9.75, 3, 9), seg(18, 17, 21), seg(18, 10, 14)]
const ICON = { paths: SEGS.map(d => [d, 'K']), fills: SEGS, cutouts: [] }

export default function render() {
  const { defs, out } = softPaint(softLayers(skel(ICON)), 'chart-column-stacked')
  return [['defs', {}, defs], ...out]
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
