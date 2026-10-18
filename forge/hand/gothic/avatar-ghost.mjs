// forge/hand/gothic/avatar-ghost.mjs — the line ghost in a dark-lit sapphire pane with a thin stone rim: a domed head,
// two dark dot eyes with a candle catch-light, an open mouth and the wavy hem (the old arched stained-glass window
// read as a window, not a ghost).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const BODY = g.path('M5 20 V11 A7 7 0 0 1 19 11 V20 C19 20.75 18.5 21 17.75 20.5 L16.75 19.75 C16 19.25 15.5 19.25 14.75 19.75 L13.25 20.75 C12.5 21.25 11.5 21.25 10.75 20.75 L9.25 19.75 C8.5 19.25 8 19.25 7.25 19.75 L6.25 20.5 C5.5 21 5 20.75 5 20 Z')
  const parts = [
    ...g.pane(BODY, 'c2', { frame: 0.95, tracery: 'none', glass: { glow: 0.2, dark: 0.45 } }),
    g.iron(g.ellipse(9.5, 11.5, 0.95, 1.3), { outline: 0.2, plate: 'A' }),
    g.iron(g.ellipse(14.5, 11.5, 0.95, 1.3), { outline: 0.2, plate: 'A' }),
    g.shine(g.dot(9.2, 11, 0.3), { op: 0.9 }), g.shine(g.dot(14.2, 11, 0.3), { op: 0.9 }),
    g.iron(g.ellipse(12, 15.3, 1.1, 1.4), { outline: 0.2, plate: 'A' }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
