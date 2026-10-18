// forge/hand/soft3d/warehouse.mjs — the warehouse as a soft cream slab with a raised terracotta roof band along its pitched
// top (the roof of the house family) and a raised wooden roller door in two slats. The generated drawing outlined the roof
// in nothing and knocked the door panels through, so pale cream walls with white holes almost vanished on white.
// Built with the house soft3d front-slab recipe (forge/styles/_soft3d-core.mjs build) from a hand-made skeleton.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const SHED = 'M3 21 V9 L12 4 L21 9 V21 Z'
// the roof band: two merged 2u strokes just inside the pitched top, one ~3.3u eave band (raised, c2)
const ROOF = 'M3.75 9.75 L12 5.15 L20.25 9.75 M4.75 11 L12 6.95 L19.25 11'
// the roller door: two closed slats (each filled solid, plus the 2u stroke around it): visible x 7..17, y 12.5..21
const SLAT_1 = 'M8 13.5 H16 V15.5 H8 Z'
const SLAT_2 = 'M8 18 H16 V20 H8 Z'
const WOOD = 'var(--with-soft3d-c3, #B8763E)'

export default function render(icon) {
  const nodes = build(skel(icon, { paths: [[SHED, 'K'], [ROOF, 'A'], [SLAT_1, 'A'], [SLAT_2, 'A']], fills: [SHED], cutouts: [] }))
  // the parts take the roles in turn (roof c2, slats c3 and c4): both slats are the door's wood (c3)
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids]
    const b = { ...a }
    for (const k of ['fill', 'stroke']) if (/--with-soft3d-c4,/.test(String(b[k] || ''))) b[k] = WOOD
    return [tag, b]
  })
}

function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: icon.name, category: icon.category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
