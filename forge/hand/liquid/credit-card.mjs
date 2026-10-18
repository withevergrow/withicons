// forge/hand/liquid/credit-card.mjs — a thick clear glass card crossed edge to edge by a violet-glass magnetic stripe,
// with a short violet signature bar low on the left. The generated card was nearly colourless: its stripe was only a
// thin groove and the faint tint and hairline let the slab wash out on white. Here the stripe is a solid inlaid band
// that sets the card apart at 16px, and the clear glass gets a denser tint and a firmer edge. Painted with the
// style's own glass recipe (_liquid-core build); only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function model(name, paths, fills) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P, cutouts: [],
    // fills keep their parsed rings as drawn (a cleaned set would drop the band's sampling vertices)
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const CARD = 'M4 5H20A2 2 0 0 1 22 7V17A2 2 0 0 1 20 19H4A2 2 0 0 1 2 17V7A2 2 0 0 1 4 5Z'
// the stripe: a 3.4u band flush with the glass card's outer edge (the card outline grows 1.3u to x 0.7 .. 23.3)
const STRIPE = 'M2.2 9.6H21.8'
// (written with a vertex every 2u: the recipe assigns a fill to a plate by sampling its outline points)
const BAND = 'M0.7 7.9H2H4H6H8H10H12H14H16H18H20H22H23.3V11.3H22H20H18H16H14H12H10H8H6H4H2H0.7Z'
// signature bar
const SIG = 'M6 15.2H10'

export default function render(icon) {
  const name = (icon && icon.name) || 'credit-card'
  const nodes = build(model(name, [[CARD, 'K'], [STRIPE, 'A'], [SIG, 'A']], [CARD, BAND]))
  if (!nodes) return null
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`
  const deeper = { [g0]: [0.22, 0.46, 0.72], [g1]: [0.5, 0.9] }
  return nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    // a firmer ink hairline so the slab's edge holds on white
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.5, 'stroke-width': 0.28 }]
    return n
  })
}
