// forge/hand/soft3d/bat.mjs: a night bat with the line version's scalloped wing edge and eared head, rendered as slate extruded wings with a dark grey torso with a small red chest accent.
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
   "d": "M13 9.2 C16.4 8.8 19 7.6 21.9 5.4 C22.3 8 22.1 11 21.4 13.8 C20.6 12.2 19.4 11.6 18.5 12.4 C18.4 14.2 18.1 15.6 17.6 16.8 C16.9 15 15.9 14.2 14.7 14.4 L13 14.6",
   "plate": "K"
  },
  {
   "d": "M11 9.2 C7.6 8.8 5 7.6 2.1 5.4 C1.7 8 1.9 11 2.6 13.8 C3.4 12.2 4.6 11.6 5.5 12.4 C5.6 14.2 5.9 15.6 6.4 16.8 C7.1 15 8.1 14.2 9.3 14.4 L11 14.6",
   "plate": "K"
  },
  {
   "d": "M9.6 3.4 L11.2 5.8 H12.8 L14.4 3.4 V8.6 C14.4 9.6 14 10.3 13.6 10.8 C14.1 12.2 14 14 13.5 15.6 C13.1 16.9 12.6 17.6 12 17.6 C11.4 17.6 10.9 16.9 10.5 15.6 C10 14 9.9 12.2 10.4 10.8 C10 10.3 9.6 9.6 9.6 8.6 Z",
   "plate": "K"
  },
  {
   "d": "M12 12.9 C12.65 13.6 12.8 14.3 12.8 14.8 C12.8 15.4 12.5 15.8 12 15.8 C11.5 15.8 11.2 15.4 11.2 14.8 C11.2 14.3 11.35 13.6 12 12.9 Z",
   "plate": "A"
  }
 ],
 "fills": [
  "M13 9.2 C16.4 8.8 19 7.6 21.9 5.4 C22.3 8 22.1 11 21.4 13.8 C20.6 12.2 19.4 11.6 18.5 12.4 C18.4 14.2 18.1 15.6 17.6 16.8 C16.9 15 15.9 14.2 14.7 14.4 L13 14.6 Z",
  "M11 9.2 C7.6 8.8 5 7.6 2.1 5.4 C1.7 8 1.9 11 2.6 13.8 C3.4 12.2 4.6 11.6 5.5 12.4 C5.6 14.2 5.9 15.6 6.4 16.8 C7.1 15 8.1 14.2 9.3 14.4 L11 14.6 Z",
  "M9.6 3.4 L11.2 5.8 H12.8 L14.4 3.4 V8.6 C14.4 9.6 14 10.3 13.6 10.8 C14.1 12.2 14 14 13.5 15.6 C13.1 16.9 12.6 17.6 12 17.6 C11.4 17.6 10.9 16.9 10.5 15.6 C10 14 9.9 12.2 10.4 10.8 C10 10.3 9.6 9.6 9.6 8.6 Z",
  "M12 12.9 C12.65 13.6 12.8 14.3 12.8 14.8 C12.8 15.4 12.5 15.8 12 15.8 C11.5 15.8 11.2 15.4 11.2 14.8 C11.2 14.3 11.35 13.6 12 12.9 Z"
 ],
 "cutouts": [
  "M11.5 8.4 A0.6 0.6 0 1 1 10.3 8.4 A0.6 0.6 0 1 1 11.5 8.4 Z",
  "M13.7 8.4 A0.6 0.6 0 1 1 12.5 8.4 A0.6 0.6 0 1 1 13.7 8.4 Z"
 ]
}

export default function render(icon) {
  return draw(icon, RAW)
}
