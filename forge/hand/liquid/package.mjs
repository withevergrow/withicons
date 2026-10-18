// forge/hand/liquid/package.mjs: a clear-glass isometric parcel. The top and left faces are clear glass parted by a
// groove at the front edge, the right face is an inlaid violet glass pane so the two faces read as different tints,
// and a violet glass tape strip runs across the lid and down the front face.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// a prepared skeleton in the shape model() expects: lines, fills (subs), cutouts (subs)
function skeleton(name, parts, cuts = []) {
  const lines = [], fills = []
  for (const p of parts) {
    const subs = parsePath(p.d)
    if (p.line !== false) for (const s of subs) lines.push({ pts: s.pts, closed: s.closed, plate: p.plate || 'K' })
    if (p.fill) fills.push({ subs })
  }
  return { name, paths: [], lines, fills, cutouts: cuts.map(d => ({ subs: parsePath(d) })) }
}

const BOX = 'M12 2.5L21 7V17L12 21.5L3 17V7Z'
const RIGHT = 'M13.4 12.9L19.4 9.9V16.4L13.4 19.4Z'
const TAPE = 'M6.5 9.3L8.6 10.3L17.3 5.95L15.2 4.9Z'
const TAPEFRONT = 'M6.5 11.6L8.6 12.6V18.9L6.5 17.9Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'package'
  return build(skeleton(name, [
    { d: BOX, plate: 'K', fill: true },
    { d: RIGHT, plate: 'A', fill: true },
    { d: TAPE, plate: 'A', fill: true },
    { d: TAPEFRONT, plate: 'A', fill: true },
  ], [
    'M3 7L12 11.5L21 7',
  ])) || []
}
