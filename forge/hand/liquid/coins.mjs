// forge/hand/liquid/coins.mjs — a stack of three clear glass coins: one silhouette (three round top faces' rims stacked
// with a slight sideways stagger) split by hairline grooves where each coin's lower edge meets the next, and a violet-glass
// ring inlaid in the top face as the coin mark. Painted with the style's own glass recipe (_liquid-core build); only the
// geometry is drawn here. No accent colours, so the palette matches the siblings.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

function model(name, paths, fills, cuts = []) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P, cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}

const RX = 7, RY = 2.9, H = 3.3
// coin: top-face centre (cx, cy), rim H tall
const coin = (cx, cy) => `M${cx - RX} ${cy}A${RX} ${RY} 0 0 1 ${cx + RX} ${cy}V${cy + H}A${RX} ${RY} 0 0 1 ${cx - RX} ${cy + H}Z`
const TOP = coin(11.8, 6.6)
const MID = coin(12.4, 10.4)
const BOT = coin(11.8, 14.2)
// K lines run along each coin's lower edge (they keep the three silhouettes clear glass)
const low = (cx, cy) => `M${cx - RX + 2} ${cy + H - 0.2}A${RX - 2} ${RY - 0.9} 0 0 0 ${cx + RX - 2} ${cy + H - 0.2}`
const EDGES = low(11.8, 6.6) + low(12.4, 10.4) + low(11.8, 14.2)
// hairline crescents cut through the glass where the top and middle coins end, so the three coins part
const gap = (cx, cy) => `M${cx - RX - 0.5} ${cy + H}H${cx - RX}A${RX} ${RY} 0 0 0 ${cx + RX} ${cy + H}H${cx + RX + 0.5}V${cy + H + 0.55}H${cx + RX}A${RX} ${RY} 0 0 1 ${cx - RX} ${cy + H + 0.55}H${cx - RX - 0.5}Z`
const GAPS = [gap(11.8, 6.6), gap(12.4, 10.4)]
// coin mark: a ring on the top face
const MARK = 'M15 6.6A3.2 1.25 0 1 1 8.6 6.6A3.2 1.25 0 1 1 15 6.6Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'coins'
  const nodes = build(model(name, [[EDGES, 'K'], [MARK, 'A']], [BOT, MID, TOP], GAPS))
  return nodes || null
}
