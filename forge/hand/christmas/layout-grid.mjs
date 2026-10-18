// forge/hand/christmas/layout-grid.mjs — four equal pine tiles in a clean 2x2, each lit the same way with a slim snow
// cap: the generated drawing lit the grid as one block (the lower right tile sank to near black), snowed only the top
// row and perched a holly sprig on one tile, so the four tiles stopped looking equal. House recipe: 0.6 ink outline,
// warm light (here one gradient in each tile's own box), snow caps (shine to tint) with a soft cool shadow, no ornament.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

// a snow cap resting on a flat top edge x0..x1 at y (corner radius r): thin over the shoulders, full on the flat,
// a wavy lower edge with soft round drips
function snowD(x0, x1, y, r, up, dn, drips) {
  const xa = x0 + 0.3 * r - 0.1, xb = x1 - 0.3 * r + 0.1, ey = y + 0.3 * r, t = y - up, b = y + dn, mid = (xa + xb) / 2
  let d = `M${n(xa)} ${n(ey)}C${n(xa + 0.35)} ${n(t + 0.3)} ${n(xa + 0.9)} ${n(t)} ${n(xa + 1.7)} ${n(t)}`
  d += `Q${n(mid)} ${n(t - 0.3)} ${n(xb - 1.7)} ${n(t)}C${n(xb - 0.9)} ${n(t)} ${n(xb - 0.35)} ${n(t + 0.3)} ${n(xb)} ${n(ey)}`
  d += `Q${n(xb - 0.6)} ${n(b)} ${n(xb - 1.5)} ${n(b)}`
  let x = xb - 1.5
  for (const p of [...drips].sort((a, c) => c.x - a.x)) {
    const R = p.x + p.w, L = p.x - p.w
    d += `Q${n((x + R) / 2)} ${n(b + 0.28)} ${n(R)} ${n(b)}C${n(R)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b + p.l * 1.33)} ${n(L)} ${n(b)}`
    x = L
  }
  d += `Q${n((x + xa + 1.5) / 2)} ${n(b + 0.28)} ${n(xa + 1.5)} ${n(b)}Q${n(xa + 0.6)} ${n(b)} ${n(xa)} ${n(ey)}Z`
  return d
}
const tile = (x, y) => `M${x + 1.5} ${y}H${x + 5.5}A1.5 1.5 0 0 1 ${x + 7} ${y + 1.5}V${y + 5.5}A1.5 1.5 0 0 1 ${x + 5.5} ${y + 7}H${x + 1.5}A1.5 1.5 0 0 1 ${x} ${y + 5.5}V${y + 1.5}A1.5 1.5 0 0 1 ${x + 1.5} ${y}Z`
const TILES = [[3, 3], [14, 3], [3, 14], [14, 14]]
// one drip a tile, never in the same place twice
const DRIP = [0.62, 0.36, 0.42, 0.66]

export default function render(icon) {
  const name = icon.name || 'layout-grid'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const out = [
    ['defs', {}, [
      // each tile's own box: warm light upper left, shade pooling low right, the same on all four
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 0.55, y2: 1 },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 0, y2: 1 },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
  ]
  TILES.forEach(([x, y], i) => {
    const d = tile(x, y)
    out.push(['path', { d, fill: C.c2, ...INK, class: 'wm-k' }])
    out.push(['path', { d, fill: url(0), class: 'wm-shine' }])
  })
  TILES.forEach(([x, y], i) => {
    const drips = [{ x: x + 7 * DRIP[i], w: 0.72, l: 0.6 }]
    out.push(['path', { d: snowD(x + 0.5, x + 6.5, y + 0.42, 1.5, 1.0, 0.6, drips), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }])
    out.push(['path', { d: snowD(x, x + 7, y, 1.5, 1.05, 0.6, drips), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  })
  return out
}
