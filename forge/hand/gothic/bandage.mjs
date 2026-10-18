// forge/hand/gothic/bandage.mjs — the new skeleton's plaster: a limestone strip laid on the diagonal with pricked
// tape ends, and a ruby glass gauze pad across its middle pierced by four lit holes; the old short stone strip
// with a small diamond pad read as a pill or a capsule.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const STRIP = 'M14 3.5 A2.83 2.83 0 0 1 18 3.5 L20.5 6 A2.83 2.83 0 0 1 20.5 10 L10 20.5 A2.83 2.83 0 0 1 6 20.5 L3.5 18 A2.83 2.83 0 0 1 3.5 14 Z'

export default function render(icon) {
  const strip = g.path(STRIP)
  const pad = g.inter(g.shrink(strip, 0.9), g.poly([[11.5, 6], [18, 12.5], [12.5, 18], [6, 11.5]]))
  const holes = [[12, 9.6], [14.4, 12], [12, 14.4], [9.6, 12]]
  const pricks = [[15.4, 5.6], [17.6, 7.8], [6.4, 15.6], [8.6, 17.8]]
  const parts = [
    g.stone(strip),
    g.recess(g.union(...pricks.map(([x, y]) => g.circle(x, y, 0.5))), { outline: 0 }),
    g.glass(pad, 'c1', { outline: 0.42, glint: false, glow: 0.24, plate: 'A' }),
    g.recess(g.union(...holes.map(([x, y]) => g.circle(x, y, 0.62))), { outline: 0, plate: 'A' }),
  ]
  return paint(parts)
}
