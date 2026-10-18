// forge/hand/liquid/piggy-bank.mjs: a clear glass pig in side view: round body on four stubby filled legs,
// a big pointed ear, an oval snout with two nostrils, a bold curly tail, a dark slot on the back and a flat
// edge-on coin dropping into it.
import { parsePath } from "../../kernel/geom.mjs"
import { build, L } from "../../styles/_liquid-core.mjs"

function model(name, paths, fills, cuts = []) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P,
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}
const T = (x, y) => [12 + (x - 12) * L.SCALE + L.TX, 12 + (y - 12) * L.SCALE + L.TY]
const r2 = v => Math.round(v * 100) / 100

const BODY = 'M18 13.5A7 5.5 0 1 1 4 13.5A7 5.5 0 1 1 18 13.5Z'
const SNOUT = 'M17.4 11.4H19.6A1.4 1.4 0 0 1 21 12.8V14.2A1.4 1.4 0 0 1 19.6 15.6H17.4Z'
const EAR = 'M12.6 8.4L15.6 5L16.2 9.2Z'
const LEGS = 'M6.2 17.6H8.6V20.6H6.2ZM13.6 17.6H16V20.6H13.6Z'
// flat coin seen edge-on-ish: a tall narrow disc
const COIN = 'M9.4 2.2H11.6A1 1 0 0 1 12.6 3.2V5.8A1 1 0 0 1 11.6 6.8H9.4A1 1 0 0 1 8.4 5.8V3.2A1 1 0 0 1 9.4 2.2Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'piggy-bank'
  const nodes = build(model(name, [
    ['M17.4 11.2A7 5.5 0 1 0 17.4 15.8', 'K'], [EAR, 'K'], [LEGS, 'K'],
    ['M4.1 12.6C2.4 12.6 1.8 10.6 3 9.9C4.1 9.4 4.9 10.6 3.9 11.3', 'K'],
    [SNOUT, 'A'], [COIN, 'S'],
  ], [BODY, EAR, LEGS, SNOUT, COIN]))
  if (!nodes) return null
  const dot = (x, y, r) => { const [a, b] = T(x, y).map(r2); const rr = r2(r * L.SCALE); return `M${r2(a - rr)} ${b}a${rr} ${rr} 0 1 0 ${r2(2 * rr)} 0a${rr} ${rr} 0 1 0 ${r2(-2 * rr)} 0Z` }
  const seg = (x1, y1, x2, y2) => { const [a, b] = T(x1, y1).map(r2), [c, d] = T(x2, y2).map(r2); return `M${a} ${b}L${c} ${d}` }
  return [...nodes,
    // slot on the back, coin edge line, eye and nostrils: solid ink so they hold in dark mode
    ['path', { d: seg(8.6, 8.4, 12.4, 8.4), stroke: 'currentColor', 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: seg(10.5, 3.2, 10.5, 5.8), stroke: 'currentColor', 'stroke-opacity': 0.7, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: dot(14.6, 11.4, 0.65) + dot(18.6, 13.5, 0.4) + dot(20, 13.5, 0.4), fill: 'currentColor', class: 'wm-k' }],
  ]
}
