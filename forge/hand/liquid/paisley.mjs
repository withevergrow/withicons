// forge/hand/liquid/paisley.mjs: a clear-glass paisley (round bulb, tail swept up and curled to a point) with a smaller
// violet glass paisley inlaid in it and a pink bead in the bulb. The generated rings crowded into a ball and lost the
// tail; the inner shape is now set well clear of the rim so the curled silhouette stays the hero.
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

const BODY = 'M9.5 21.5C5 21.5 2.75 18.25 2.75 14.5C2.75 10.75 5.5 8.5 9 8C12.25 7.5 13.5 5.5 12.75 3.5C12.6 3 13 2.6 13.5 2.8C18 4.5 21.25 8.5 20.5 13.5C19.75 18.5 15.25 21.5 9.5 21.5Z'
const INNER = 'M10 18.25C7.5 18.25 6 16.5 6 14.5C6 12.75 7.5 11.4 9.5 11.1C11.5 10.75 12.5 9.5 12.25 8C15 8.75 17.25 10.75 16.9 14C16.5 16.5 13.5 18.25 10 18.25Z'
const BEAD = 'M11.25 14.75A1.25 1.25 0 1 1 8.75 14.75A1.25 1.25 0 1 1 11.25 14.75Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'paisley'
  return build(skeleton(name, [
    { d: BODY, plate: 'K', fill: true },
    { d: INNER, plate: 'A', fill: true },
    { d: BEAD, plate: 'S', fill: true },
  ])) || []
}
