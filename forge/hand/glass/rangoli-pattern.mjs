// forge/hand/glass/rangoli-pattern.mjs — the rangoli as every other style draws it (a broken outer ring, a four-petal
// kolam flower with a heart, four dots on the diagonals), in glass's own layers and paint (_glass-soft.mjs). The generator
// etched the petal veins and gave every small petal and dot its own glass slab, so at 16px it was a busy blur; here the
// four petals meet in one connected glass flower with a small window at its heart, the ring stays the skeleton's plain
// glass rods, and the diagonal dots become luminous accent beads that twinkle (the motion spec's parts.A, tagged wm-a).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { softLayers, softPaint } from '../../styles/_glass-soft.mjs'

// a skeleton in the shape softLayers() expects: parts [{ d, plate, fill, rod }], cutouts [d] (rod: false = a fill with no outline)
function skeleton(name, parts, cuts = []) {
  const paths = parts.filter(p => p.rod !== false).map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const tag = (nodes, map) => nodes.map(([t, a, k]) => {
  const cls = a.class ? map[a.class] ?? a.class : map[''] ?? ''
  return [t, cls ? { ...a, class: cls } : a, ...(k ? [k] : [])]
})

const r2 = v => Math.round(v * 100) / 100
// one petal of the kolam flower, pointing up from the heart: a teardrop with a round lobe (centre 12,7.25 r 1.9),
// rotated a quarter turn at a time about the centre so the four petals meet in one connected flower
const rot = ([x, y], k) => { for (let i = 0; i < k; i++) [x, y] = [24 - y, x]; return [x, y] }
const petal = k => {
  const P = (x, y) => rot([x, y], k).map(r2).join(' ')
  return `M${P(12, 12)}C${P(10.6, 10.75)} ${P(10.1, 9.5)} ${P(10.1, 7.25)}A1.9 1.9 0 0 1 ${P(13.9, 7.25)}C${P(13.9, 9.5)} ${P(13.4, 10.75)} ${P(12, 12)}Z`
}
const FLOWER = [0, 1, 2, 3].map(petal).join('')
const HEART = 'M13 12A1 1 0 1 1 11 12A1 1 0 1 1 13 12Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'rangoli-pattern'
  // the skeleton's broken outer ring (K) and its four diagonal dots (A) carry over; the dots become S beads
  const ring = icon.paths.filter(p => p.plate === 'K' && p.subs.every(x => !x.closed))
  const dots = icon.paths.filter(p => p.plate === 'A')
  const parts = [
    ...ring.map(p => ({ d: p.d, plate: 'K' })),
    { d: FLOWER, plate: 'K', fill: true, rod: false },
    ...dots.map(p => ({ d: p.d, plate: 'S', fill: true })),
  ]
  const L = softLayers(skeleton(name, parts, [HEART]))
  if (!L) return null
  const { defs, out } = softPaint(L, name)
  return [['defs', {}, defs], ...tag(out, { '': 'wm-k', 'wm-s': 'wm-a' })]
}
