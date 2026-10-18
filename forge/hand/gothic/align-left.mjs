// forge/hand/gothic/align-left.mjs — four plain carved stone lintels, flush left, long and short in turn, the
// long ones let with a slim sapphire glass channel; the generated rows stood on corbel brackets with segmented
// inlays and read as stacked bricks or shelves instead of lines of text.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const H = 2.8
const bar = (x0, y, x1) => g.rr(x0, y - H / 2, x1, y + H / 2, 1)
const slot = (x0, y, x1) => g.rr(x0 + 1.5, y - 0.5, x1 - 1.5, y + 0.5, 0.5)
const ROWS = [[2.6, 4.5, 21.4, true], [2.6, 9.5, 15.4, false], [2.6, 14.5, 21.4, true], [2.6, 19.5, 15.4, false]]

export default function render(icon) {
  const parts = [
    g.stone(g.union(...ROWS.map(([a, y, b]) => bar(a, y, b)))),
    g.glass(g.union(...ROWS.filter(r => r[3]).map(([a, y, b]) => slot(a, y, b))), 'c2', { outline: 0.24, glint: false, glow: 0.34 }),
  ]
  return paint(enamel(parts, icon))
}
