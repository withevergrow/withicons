// forge/hand/gothic/hard-hat.mjs — the safety helmet as a gold glass dome in a stone rim with a gilded ridge rib
// standing just proud of the crown and a stone brim whose lead clearly splits it from the dome; the generated drawing
// filled a stone dome with a rose-window fan and a knob on top, so it read as a bell or an igloo.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const DOME = g.inter(g.circle(12, 16.6, 8.4), g.rect(0, 0, 24, 16.8))
  const parts = [
    ...g.pane(DOME, 'c3', { frame: 1.05, tracery: [[[7.3, 17], [7.9, 10.4]], [[16.7, 17], [16.1, 10.4]]], glass: { glow: 0.22 } }),
    g.gilt(g.inter(g.circle(12, 16.6, 9.3), g.rect(10.5, 0, 13.5, 16.2)), { plate: 'A' }),
    g.stone(g.rr(2, 16, 22, 19.6, 1.5), { ticks: [[[6.6, 15], [6.6, 21]], [[17.4, 15], [17.4, 21]]] }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
