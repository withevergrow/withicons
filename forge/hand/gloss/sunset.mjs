// forge/hand/gloss/sunset.mjs — a glossy half sun on a heavy horizon, two short rays and a short sinking arrow that
// floats well clear above the dome. The generated drawing ran the arrow's tip down into the sun, so arrow + dome
// fused into one shape that read as a download tray. Same inflated vinyl recipe as the generator (forge/styles/gloss.mjs
// models and lights it); only the skeleton is redrawn for this style: shorter arrow, 2.5u gap, rays pushed off the dome.
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

const DOME = 'M7.5 16.5 A4.5 4.5 0 0 1 16.5 16.5'
// a crisp arrowhead laid on exactly (a chevron of tubes webs into a heart-shaped blob), corners softly rounded
const HEAD = 'M9.6 4.4H14.4A.6 .6 0 0 1 14.85 5.4L12.45 7.95A.6 .6 0 0 1 11.55 7.95L9.15 5.4A.6 .6 0 0 1 9.6 4.4Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'sunset'
  // sun, horizon and rays (the renderer splits the ray blobs off as wm-a)
  const scene = gloss.render(prep(name, [
    { d: DOME, plate: 'K' },
    { d: 'M2.5 16.5 H21.5', plate: 'K' },
    { d: 'M8 21 H16', plate: 'K' },
    { d: 'M5.9 10.4 L4.75 9.25 M18.1 10.4 L19.25 9.25', plate: 'A' },
  ], [DOME + ' Z']))
  // the sinking arrow: its own blob, the part that nudges down (parts.S)
  const arrow = gloss.render(prep(name, [{ d: 'M12 2.25 V5.25', plate: 'K' }], [HEAD]))
  return [
    ...scene.map(([t, a]) => [t, { ...a, class: a.class || 'wm-k' }]),
    ...arrow.map(([t, a]) => [t, { ...a, class: 'wm-s' }]),
  ]
}
