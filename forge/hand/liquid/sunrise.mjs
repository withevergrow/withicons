// forge/hand/liquid/sunrise.mjs: a big coloured-glass half sun rising behind a clear glass horizon bar, two short
// coloured rays, a short ground bar below and a small accent-bead arrow climbing above it, painted with the style's own
// glass recipe and a deeper tint. The generated sun was clear glass fused into the horizon line, so the pair read as a
// flat hat or a UFO under a pink arrow, and the sun never became the dominant shape.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const fill = d => ({ subs: parsePath(d) })

// deeper clear glass (0), deeper coloured glass (1), a firmer hairline and a fuller accent bead
function tune(nodes, name, { k, a, ink, s }) {
  const defs = nodes[0] && nodes[0][0] === 'defs' ? nodes[0][2] : []
  const set = (n, ops) => {
    const g = defs.find(x => x[1].id === `wg-liquid-${name}-${n}`)
    if (g) g[2].forEach((st, i) => { if (ops[i] !== undefined) st[1]['stop-opacity'] = ops[i] })
  }
  set(0, k); set(1, a)
  for (const n of nodes) {
    const at = n[1]
    if (!at) continue
    if (at['stroke-opacity'] === 0.3) at['stroke-opacity'] = ink
    if (String(at.fill).includes('liquid-accent') && at['fill-opacity'] === 0.75) at['fill-opacity'] = s
  }
  return nodes
}

// the sun: a half disc standing on the horizon bar (its foot tucks behind it); an inner arc keeps the fill on plate A
const SUN = 'M6.25 16.25 A5.75 5.75 0 0 1 17.75 16.25 Z'
const SUN_CORE = 'M9.5 14.9 A2.5 2.5 0 0 1 14.5 14.9'
// rays on radii from the sun's centre (12 16.25), at 45 degrees
const RAYS = ['M6.63 10.88 L5.57 9.82', 'M17.37 10.88 L18.43 9.82']
const HORIZON = 'M2.5 18 H21.5'
const GROUND = 'M9 21.75 H15'
const ARROW = ['M12 8.25 V2.75', 'M9.5 5.25 L12 2.75 L14.5 5.25']

export default function render(icon) {
  const name = (icon && icon.name) || 'sunrise'
  const nodes = build({
    name, paths: [],
    lines: [
      ...lines(HORIZON, 'K'), ...lines(GROUND, 'K'),
      ...lines(SUN_CORE, 'A'), ...RAYS.flatMap(d => lines(d, 'A')),
      ...ARROW.flatMap(d => lines(d, 'S')),
    ],
    fills: [fill(SUN)],
    cutouts: [],
  })
  if (!nodes) return null
  tune(nodes, name, { k: [0.24, 0.48, 0.74], a: [0.5, 0.92], ink: 0.45, s: 0.9 })
  // paint the coloured sun first so the clear horizon bar lies over its foot: the sun rises from behind the horizon
  const isA = n => n[1] && n[1].class === 'wm-a'
  const head = nodes.filter(n => n[0] === 'defs' || (n[1] && n[1].class === 'wm-shadow'))
  return [...head, ...nodes.filter(isA), ...nodes.filter(n => !head.includes(n) && !isA(n))]
}
