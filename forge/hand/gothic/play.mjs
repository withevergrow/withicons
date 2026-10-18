// forge/hand/gothic/play.mjs — the line design's rounded play triangle (point right): a gilded rim of gothic metal round
// a ruby glass pane, no lead seam, no shield plate, no trefoil.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const TRI = 'M5.2 6.4 A2.3 2.3 0 0 1 8.7 4.4 L19.1 10.4 A2.3 2.3 0 0 1 19.1 13.6 L8.7 19.6 A2.3 2.3 0 0 1 5.2 17.6 Z'

export default function render(icon) {
  const body = g.path(TRI)
  const parts = [
    g.gilt(body, { glint: false }),
    g.glass(g.shrink(body, 1.35), 'c1', { tracery: 'none', glow: 0.3, outline: 0.22 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
