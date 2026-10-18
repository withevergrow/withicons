// forge/hand/gloss/megaphone.mjs — a glossy megaphone: rounded box, wide flared horn with a carved slot at the throat, and
// the grip hanging below as its own pill. The generated drawing inflated the handle stroke into the body, so the grip
// fused into a lump under the box; here the grip is a separate fill parted from the body by a clear gap, lit by the
// same gloss renderer (forge/styles/gloss.mjs) as every sibling.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const PATHS = [
  {"d":"M3.5 10.75 A1.75 1.75 0 0 1 5.25 9 H8 L17.25 4.4 Q19.5 3.3 19.5 5.75 V18.25 Q19.5 20.7 17.25 19.6 L8 15 H5.25 A1.75 1.75 0 0 1 3.5 13.25 Z","plate":"K"},
]
const FILLS = [
  "M3.5 10.75 A1.75 1.75 0 0 1 5.25 9 H8 L17.25 4.4 Q19.5 3.3 19.5 5.75 V18.25 Q19.5 20.7 17.25 19.6 L8 15 H5.25 A1.75 1.75 0 0 1 3.5 13.25 Z",
  "M5.75 17.25 H9.25 V20.25 A1.5 1.5 0 0 1 7.75 21.75 H7.25 A1.5 1.5 0 0 1 5.75 20.25 Z",
]
const CUTS = ["M8 10 V14"]

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'megaphone', PATHS, FILLS, CUTS)
  return gloss.render(sk).map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }])
}
