// forge/hand/gloss/usb.mjs — the USB trident in gloss: crisp arrowhead, stem, round root, a ball branch left and a square
// branch right on necks long enough to read. The generated drawing put the ball and square right on the arms and
// next to the arrowhead, so the inner corners filled and the top-left branch became a blob; here the terminals sit
// higher with clear necks, the square stays 1.4u off the arrowhead and the arrowhead is a crisp fill. Lit by the gloss renderer.
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
  {"d":"M12 6 V17.25"},
  {"d":"M13.5 19.5 A1.5 1.5 0 1 1 10.5 19.5 A1.5 1.5 0 1 1 13.5 19.5 Z"},
  {"d":"M6.15 7.75 A0.9 0.9 0 1 1 4.35 7.75 A0.9 0.9 0 1 1 6.15 7.75 Z M5.25 8.65 V11.75 L12 15.25"},
  {"d":"M17.5 6.5 H19.5 V8.5 H17.5 Z M18.5 8.5 V10.75 L12 14"},
]
const FILLS = [
  "M12 1.25 L15 6.25 H9 Z",
  "M13.5 19.5 A1.5 1.5 0 1 1 10.5 19.5 A1.5 1.5 0 1 1 13.5 19.5 Z",
  "M6.15 7.75 A0.9 0.9 0 1 1 4.35 7.75 A0.9 0.9 0 1 1 6.15 7.75 Z",
  "M17.5 6.5 H19.5 V8.5 H17.5 Z",
]
const CUTS = []

export default function render(icon) {
  const sk = prep((icon && icon.name) || 'usb', PATHS, FILLS, CUTS)
  return gloss.render(sk).map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }])
}
