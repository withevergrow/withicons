// forge/hand/liquid/oven.mjs: clear glass oven body with a control strip (violet display, two knob beads),
// a violet glass window and a drawer band, on two short feet. The heat waves are drawn on top as thin accent
// strokes so they stay three readable waves instead of fusing into one glass blob.
import { parsePath } from "../../kernel/geom.mjs"
import { build, col, L } from "../../styles/_liquid-core.mjs"

function model(name, paths, fills, cuts = []) {
  const P = paths.map(([d, plate], i) => ({ id: `p${i}`, d, plate, subs: parsePath(d) }))
  return {
    name, paths: P,
    cutouts: cuts.map(d => ({ d, subs: parsePath(d) })),
    fills: fills.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
  }
}
// map a 24-grid point into liquid's frame (the recipe scales the drawing slightly)
const T = (x, y) => [12 + (x - 12) * L.SCALE + L.TX, 12 + (y - 12) * L.SCALE + L.TY]
const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => T(x, y).map(r2).join(" ")

const BODY = 'M6 2.5H18A2 2 0 0 1 20 4.5V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V4.5A2 2 0 0 1 6 2.5Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'oven'
  const nodes = build(model(name, [
    [BODY, 'K'], ['M4 6.75H20', 'K'], ['M4 17H20', 'K'], ['M6.5 22H8M16 22H17.5', 'K'],
    ['M9.6 4.6H13.4', 'A'], ['M16.4 4.6H16.41M18.1 4.6H18.11', 'S'],
    ['M7 8.75H17V15H7Z', 'A'],
  ], [BODY, 'M7 8.75H17V15H7Z']))
  if (!nodes) return null
  const wave = x => `M${P(x, 10.1)}C${P(x - 0.7, 10.8)} ${P(x - 0.7, 11.4)} ${P(x, 12)}C${P(x + 0.7, 12.6)} ${P(x + 0.7, 13.2)} ${P(x, 13.8)}`
  return [...nodes, ['path', { d: [9.7, 12, 14.3].map(wave).join(''), stroke: col('accent'), 'stroke-width': 0.95,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }]]
}
