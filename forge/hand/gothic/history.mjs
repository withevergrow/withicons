// forge/hand/gothic/history.mjs — the redesigned history glyph: a broad gilt band sweeping counter-
// clockwise round a small sapphire rose-window clock (gilt hands), ending at the left in a large separated gilt
// arrowhead pointing down; the generated drawing was the old glyph (corner bracket arrow over a full clock).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const RAD = Math.PI / 180
const r2 = v => Math.round(v * 100) / 100
const polar = (cx, cy, r, a) => [r2(cx + r * Math.cos(a * RAD)), r2(cy + r * Math.sin(a * RAD))]
const rays = (cx, cy, r0, r1, n, rot = 0) => Array.from({ length: n }, (_, k) => [polar(cx, cy, r0, rot + 360 * k / n), polar(cx, cy, r1, rot + 360 * k / n)])

export default function render(icon) {
  const cx = 13, cy = 12.5, R = 8.4

  const parts = [
    ...g.pane(g.circle(cx, cy, 5.6), 'c2', { frame: 1.1, tracery: 'none', glass: { dark: 0.4 } }),
    g.gilt(g.union(g.stroke([[cx, 8.9], [cx, cy]], 1.5), g.stroke([[cx, cy], [15.6, 14.2]], 1.4)), { thin: true, plate: 'A' }),
    g.gilt(g.circle(cx, cy, 1), { thin: true, glint: false, outline: 0.28, plate: 'A' }),
    g.gilt(g.arc(cx, cy, R, 120, -170, 2.2)),
    g.gilt(g.poly([[1.8, 11.3], [7.4, 11.3], [4.6, 15]])),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
