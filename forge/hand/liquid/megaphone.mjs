// forge/hand/liquid/megaphone.mjs — a clear-glass megaphone in profile: a short rounded rear cap, a straight horn
// flaring wide to the right, a violet glass lip at the mouth and a stubby handle under the cap. The generated drawing
// lost the handle and turned the cap seam into a separate violet pill, so the horn read as a cone beside a capsule;
// the violet now marks the wide mouth, which is what says "megaphone" at 16px. Same model and light as the generator
// (_liquid-core.mjs); only geometry here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const oval = (x, y, rx, ry) => `M${x - rx} ${y}A${rx} ${ry} 0 1 0 ${x + rx} ${y}A${rx} ${ry} 0 1 0 ${x - rx} ${y}Z`

// body (K): rear cap (x 2.5..8) and the horn flaring from x 8 to the mouth at x 18.5
const BODY = 'M4 9.25H8L18.5 4V20L8 14.75H4A1.5 1.5 0 0 1 2.5 13.25V10.75A1.5 1.5 0 0 1 4 9.25Z'
// handle (K): a stub under the cap, leaning back a touch
const HANDLE = 'M6.25 14.75L6.75 19.25'
// mouth lip (A): a violet glass rim standing across the open end
const LIP = oval(19.25, 12, 1.75, 8.5)

export default function render(icon) {
  const name = (icon && icon.name) || 'megaphone'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: HANDLE, plate: 'K' },
    { d: LIP, plate: 'A', fill: true },
  ], [
    'M8 10.25V13.75',   // seam between the cap and the horn
  ]))
}
