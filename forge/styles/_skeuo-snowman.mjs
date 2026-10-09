// SKEUO snowman, hand-built: one glazed white-ceramic figurine (two balls and a top hat in a
// single moulded piece), the hat band glazed charcoal and the knitted scarf (with its hanging
// end) glazed red as zones of the same piece, raised charcoal coal eyes and buttons, wooden twig arms
// (A) and a glossy orange carrot (S). A skeleton for Skeuo only, prepared like forge/lib/load.mjs.
import { parsePath } from '../kernel/geom.mjs'
import { setOf, unionSets } from '../kernel/bool.mjs'

const BODY = 'M10.5 5.25 A3.5 3.5 0 0 0 10 11.9 A5.25 5.25 0 1 0 14 11.9 A3.5 3.5 0 0 0 13.5 5.25 Z'
const HAT = 'M9.75 5.5 V2.6 A0.85 0.85 0 0 1 10.6 1.75 H13.4 A0.85 0.85 0 0 1 14.25 2.6 V4.5 H16.1 A0.6 0.6 0 0 1 16.1 5.7 H7.9 A0.6 0.6 0 0 1 7.9 4.5 H9.75 Z'
const RAW = {
  paths: [
    { d: BODY, plate: 'K' },
    { d: HAT, plate: 'K' },
    { d: 'M7.3 14.6 L4 12.2 M4.9 12.9 L4.7 10.6 M4.5 12.5 L2.6 12.5', plate: 'A' },
    { d: 'M16.7 14.6 L20 12.2 M19.1 12.9 L19.3 10.6 M19.5 12.5 L21.4 12.5', plate: 'A' },
    { d: 'M12.4 9.9 L14.5 10.4', plate: 'S' },
  ],
  fills: [BODY, HAT],
  cutouts: [
    'M11.6 8.2 A0.85 0.85 0 1 1 9.9 8.2 A0.85 0.85 0 1 1 11.6 8.2 Z',
    'M14.1 8.2 A0.85 0.85 0 1 1 12.4 8.2 A0.85 0.85 0 1 1 14.1 8.2 Z',
    'M12.75 15.6 A0.75 0.75 0 1 1 11.25 15.6 A0.75 0.75 0 1 1 12.75 15.6 Z',
    'M12.75 18.7 A0.75 0.75 0 1 1 11.25 18.7 A0.75 0.75 0 1 1 12.75 18.7 Z',
  ],
}
function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    paths, fills, cutouts: raw.cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(fills.map(f => f.set)),
  }
}
let cache = null
export const SNOWMAN = () => cache || (cache = prepare(RAW))
export const SNOWMAN_TUNE = {
  body: 'white', part: 'wood', sig: 'orange', wA: 1.3, wS: 1.4, decal: { 0: 'charcoal', 1: 'charcoal', 2: 'charcoal', 3: 'charcoal' },
  zones: [
    { y1: 4.5, x0: 9, x1: 15, mat: 'charcoal', role: 'c2' },
    { y0: 4.5, y1: 5.8, mat: 'charcoal', role: 'c2' },
    { y0: 3.6, y1: 4.5, x0: 9, x1: 15, mat: 'red', role: 'c3' },
    { y0: 11.5, y1: 13.2, mat: 'red', role: 'c3' },
    { y0: 13.2, y1: 16.8, x0: 13.5, x1: 15.3, mat: 'red', role: 'c3' },
  ],
}
