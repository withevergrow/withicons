// forge/hand/soft3d/spider-web.mjs: a hexagonal spider web with sagging scalloped edges and six spokes, the thread windows cut through the slate slab as embossed relief.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import { build } from '../../styles/_soft3d-core.mjs'

function prep(icon, raw) {
  const paths = raw.paths.map((p, i) => ({ id: 'h' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = raw.cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { ...icon, paths, fills, cutouts,
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: fills.length ? unionSets(fills.map(f => f.set)) : [] }
}
function draw(icon, raw) {
  const ic = prep(icon, raw)
  let nodes = null
  for (const lite of [0, 1, 2, 3]) {
    nodes = build(ic, lite)
    if (nodes && nodes.length > 1 && JSON.stringify(nodes).length < 18500) break
  }
  return nodes && nodes.length > 1 ? nodes : null
}

const RAW = {
 "paths": [
  {
   "d": "M12 2 L12 22 M20.66 7 L3.34 17 M20.66 17 L3.34 7",
   "plate": "K"
  },
  {
   "d": "M12 2 Q15.29 6.3 20.66 7 Q18.58 12 20.66 17 Q15.29 17.7 12 22 Q8.71 17.7 3.34 17 Q5.42 12 3.34 7 Q8.71 6.3 12 2 Z",
   "plate": "K"
  }
 ],
 "fills": [
  "M12 2 Q15.29 6.3 20.66 7 Q18.58 12 20.66 17 Q15.29 17.7 12 22 Q8.71 17.7 3.34 17 Q5.42 12 3.34 7 Q8.71 6.3 12 2 Z"
 ],
 "cutouts": [
  "M12.8 8.8 L12.8 4.6 Q14.38 7.87 18.01 7.61 L14.37 9.71 Q13.98 8.57 12.8 8.8 Z",
  "M15.17 11.09 L18.81 8.99 Q16.77 12 18.81 15.01 L15.17 12.91 Q15.96 12 15.17 11.09 Z",
  "M14.37 14.29 L18.01 16.39 Q14.38 16.13 12.8 19.4 L12.8 15.2 Q13.98 15.43 14.37 14.29 Z",
  "M11.2 15.2 L11.2 19.4 Q9.62 16.13 5.99 16.39 L9.63 14.29 Q10.02 15.43 11.2 15.2 Z",
  "M8.83 12.91 L5.19 15.01 Q7.23 12 5.19 8.99 L8.83 11.09 Q8.04 12 8.83 12.91 Z",
  "M9.63 9.71 L5.99 7.61 Q9.62 7.87 11.2 4.6 L11.2 8.8 Q10.02 8.57 9.63 9.71 Z"
 ]
}

export default function render(icon) {
  return draw(icon, RAW)
}
