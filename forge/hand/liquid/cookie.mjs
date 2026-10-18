// forge/hand/liquid/cookie.mjs — the cookie redrawn for liquid glass: a round clear-glass biscuit (the style's own
// engine) with one big two-scallop bite out of the top-right, and four chips set into it as solid deep-glass drops
// with a pin-point glint. The old chips were holes cut through the glass, ringed by rims, so the cookie read as a donut.
import { parsePath } from '../../kernel/geom.mjs'
import { build, col, L } from '../../styles/_liquid-core.mjs'

const BODY = 'M13.65 2.64 A9.5 9.5 0 1 0 21.36 10.35 A2.75 2.75 0 0 1 17.5 6.5 A2.75 2.75 0 0 1 13.65 2.64 Z'
// chips on the 24 grid: [x, y, r]
const CHIPS = [[8.25, 9, 1.6], [13, 11.5, 1.45], [8.25, 15.5, 1.5], [14.5, 16.25, 1.6]]

export default function render(icon) {
  const nodes = build(glass(icon && icon.name || 'cookie'))
  const r2 = v => Math.round(v * 100) / 100
  const tf = (x, y) => [r2((x - 12) * L.SCALE + 12 + L.TX), r2((y - 12) * L.SCALE + 12 + L.TY)]
  for (const [x, y, r] of CHIPS) {
    const [cx, cy] = tf(x, y), rr = r2(r * L.SCALE)
    nodes.push(['circle', { cx, cy, r: rr, fill: col('c3'), 'fill-opacity': 0.88, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22 }])
    nodes.push(['circle', { cx: r2(cx - rr * 0.38), cy: r2(cy - rr * 0.38), r: r2(rr * 0.32), fill: col('shine'), 'fill-opacity': 0.75, class: 'wm-shine' }])
  }
  return nodes
}

function glass(name) {
  const subs = parsePath(BODY)
  return {
    name,
    paths: [{ id: 'p0', d: BODY, plate: 'K', subs }],
    lines: subs.map(s => ({ pts: s.pts, closed: s.closed, plate: 'K', pathId: 'p0' })),
    fills: [{ d: BODY, subs, set: [] }],
    cutouts: [],
  }
}
