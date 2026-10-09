// SKEUO dragon head, hand-built (front view): one glossy red lacquered head whose wide brow
// narrows into a long snout, white-glazed fur tufts at the cheeks, a white lip band and a white
// spiked beard as zones of the same piece, raised orange pearl and coral nose, charcoal eyes and
// nostrils, an engraved open mouth with fangs, gold branching antlers, gold angry brows and
// gold whiskers that sweep out level and curl (A). A skeleton for Skeuo only, prepared like
// forge/lib/load.mjs.
import { parsePath } from '../kernel/geom.mjs'
import { setOf, unionSets } from '../kernel/bool.mjs'

const HEAD = 'M12 5.4 C16 5.4 18.4 7.6 18.4 10.4 C18.4 12.2 17.2 13 15.6 13.4 V19.4 C15.6 20.6 14.2 21.2 12 21.2 C9.8 21.2 8.4 20.6 8.4 19.4 V13.4 C6.8 13 5.6 12.2 5.6 10.4 C5.6 7.6 8 5.4 12 5.4 Z'
const TUFTS = 'M7 8.2 A1.6 1.6 0 1 1 3.8 8.2 A1.6 1.6 0 1 1 7 8.2 Z M6.2 10.6 A1.4 1.4 0 1 1 3.4 10.6 A1.4 1.4 0 1 1 6.2 10.6 Z M20.2 8.2 A1.6 1.6 0 1 1 17 8.2 A1.6 1.6 0 1 1 20.2 8.2 Z M20.6 10.6 A1.4 1.4 0 1 1 17.8 10.6 A1.4 1.4 0 1 1 20.6 10.6 Z'
const BEARD = 'M8.6 20.2 H15.4 L14.6 23 L13.4 21.6 L12 23.2 L10.6 21.6 L9.4 23 Z'
export const RAW = {
  paths: [
    { d: HEAD, plate: 'K' },
    { d: TUFTS, plate: 'K' },
    { d: BEARD, plate: 'K' },
    { d: 'M9.6 7 L7.6 3.7 L6.2 1.6 M7.9 4.2 L9.9 2.3 M6.9 2.7 L4.3 3', plate: 'A' },
    { d: 'M14.4 7 L16.4 3.7 L17.8 1.6 M16.1 4.2 L14.1 2.3 M17.1 2.7 L19.7 3', plate: 'A' },
    { d: 'M8.4 15.4 C6.4 15 4.8 14.4 3.2 15.2 C2 15.8 2.4 17.5 3.7 17.1', plate: 'A' },
    { d: 'M15.6 15.4 C17.6 15 19.2 14.4 20.8 15.2 C22 15.8 21.6 17.5 20.3 17.1', plate: 'A' },
    { d: 'M6.8 8.7 L10.7 10.4 M17.2 8.7 L13.3 10.4', plate: 'A' },
  ],
  fills: [HEAD, TUFTS, BEARD],
  cutouts: [
    'M10.5 11.9 A1 1 0 1 1 8.5 11.9 A1 1 0 1 1 10.5 11.9 Z',
    'M15.5 11.9 A1 1 0 1 1 13.5 11.9 A1 1 0 1 1 15.5 11.9 Z',
    'M13.1 7.6 A1.1 1.1 0 1 1 10.9 7.6 A1.1 1.1 0 1 1 13.1 7.6 Z',
    'M10.3 13.5 C11 13.2 13 13.2 13.7 13.5 C15.7 13.4 16 16.6 14 16.6 C13.2 16.6 12.6 16.2 12 16.2 C11.4 16.2 10.8 16.6 10 16.6 C8 16.6 8.3 13.4 10.3 13.5 Z',
    'M9.4 18.2 H14.6 V19.4 Q14.6 20.2 13.9 20.2 L13.5 18.9 L13.1 20.2 H10.9 L10.5 18.9 L10.1 20.2 Q9.4 20.2 9.4 19.4 Z',
  ],
}
export function prepare(raw) {
  const paths = raw.paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = raw.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    paths, fills, cutouts: raw.cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: unionSets(fills.map(f => f.set)),
  }
}
let cache = null
export const DRAGON = () => cache || (cache = prepare(RAW))
export const DRAGON_TUNE = {
  body: 'red', part: 'gold', sig: 'gold', wA: 1.25,
  decal: { 0: 'charcoal', 1: 'charcoal', 2: 'orange', 3: 'coral' },
  zones: [
    { y0: 6, y1: 12.6, x1: 5.75, mat: 'white', role: 'c3' },
    { y0: 6, y1: 12.6, x0: 18.25, mat: 'white', role: 'c3' },
    { y0: 16.8, y1: 17.9, mat: 'white', role: 'c3' },
    { y0: 20.25, mat: 'white', role: 'c3' },
  ],
}
