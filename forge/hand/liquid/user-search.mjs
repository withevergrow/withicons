// forge/hand/liquid/user-search.mjs — a clear liquid glass person with an accent glass magnifier as the badge: an
// open lens ring and a handle, the person's shoulder bitten clean by the moat around it. The generator filled the lens
// ring into a solid pink disc (a lollipop) and cut the half-bust off square, so the bust's corner read as a speech
// bubble's tail and the pair misread as chat; here the bust is a whole rounded figure like liquid user-plus and the
// lens is a real ring you can see through. Same model and light as the generator (_liquid-core.mjs).
// Motion: person wm-k, magnifier wm-s (the spec orbits parts.S).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a skeleton in the shape the liquid model expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

// the person (K): head and a whole rounded bust centred under it
const HEAD = 'M12.25 7.5A3.75 3.75 0 1 1 4.75 7.5A3.75 3.75 0 1 1 12.25 7.5Z'
const BUST = 'M2.5 21V19.5A4 4 0 0 1 6.5 15.5H10.5A4 4 0 0 1 14.5 19.5V21'
// the magnifier (S): the lens as an open ring (a closed S ring would be filled into a bead) and its handle
const LENS = 'M19.5 16A3 3 0 1 1 13.5 16A3 3 0 0 1 19.49 15.75'
const HANDLE = 'M18.75 18.25L21 20.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'user-search'
  return build(skeleton(name, [
    { d: HEAD, plate: 'K', fill: true },
    { d: BUST + 'Z', plate: 'K', fill: true },
    { d: LENS, plate: 'S' },
    { d: HANDLE, plate: 'S' },
  ]))
}
