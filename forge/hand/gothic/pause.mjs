// forge/hand/gothic/pause.mjs — two straight upright bars (not pointed lancets, which read as a pair of arches):
// ruby glass bars in carved stone frames, lancet transoms, a small gold quatrefoil jewel set in each.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const bar = (x0, plate) => [
  ...g.pane(g.rr(x0, 3.4, x0 + 6.2, 20.6, 1.7), 'c1', { frame: 1.35, plate, tracery: [[[x0, 7.6], [x0 + 7, 7.6]], [[x0, 16.4], [x0 + 7, 16.4]]] }),
  g.glass(g.foil(x0 + 3.1, 12, 1.4, 4), 'c3', { outline: 0.28, glint: false, plate }),
]

export default function render(icon) {
  const parts = [...bar(4.2, "K"), ...bar(13.6, "K")]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
