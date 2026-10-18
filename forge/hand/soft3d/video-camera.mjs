// forge/hand/soft3d/video-camera.mjs â€” a camcorder: a rounded body with a big glass lens on its front and the tapered
// viewfinder horn as part of the same solid, so it reads as a camera instead of the generated black cube with a wire triangle.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

// a prepared skeleton (as forge/lib/load.mjs prepares one), named after the icon so the style's palette, mode and ids apply
function skel(name, category, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name, category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const BODY = 'M4.5 6 H13 A2.5 2.5 0 0 1 15.5 8.5 V15.5 A2.5 2.5 0 0 1 13 18 H4.5 A2.5 2.5 0 0 1 2 15.5 V8.5 A2.5 2.5 0 0 1 4.5 6 Z'
const HORN = 'M15 10 L20.5 7.2 A1 1 0 0 1 22 8.1 V15.9 A1 1 0 0 1 20.5 16.8 L15 14 Z'
// the lens disc (the style rounds it 1u outward: r 3.75)
const LENS = 'M8.75 9.25 A2.75 2.75 0 1 1 8.75 14.75 A2.75 2.75 0 1 1 8.75 9.25 Z'

export default function render() {
  // lighten the body: the palette's near-black c1 read as a blob on dark grounds, so the shell takes the tint role
  return build(skel('video-camera', 'media', { paths: [[BODY, 'K'], [LENS, 'A']], fills: [BODY, HORN], cutouts: [] })).map(([t, a, ...r]) => [t, a && a.class === 'wm-k' && a.fill === 'var(--with-soft3d-c1, #2A2E36)' ? { ...a, fill: 'var(--with-soft3d-tint, #A9D8F2)' } : a, ...r])
}
