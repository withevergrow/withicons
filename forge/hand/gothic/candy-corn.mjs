// forge/hand/gothic/candy-corn.mjs — the plain candy-corn cone in three bands (stone tip, ruby middle, gold base) leaded
// inside a carved stone rim; the generated stained-glass shield with crosses and a face hid the subject.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const sil = g.path('M12 2.5 C13.5 2.5 14.5 3.75 15.25 5.5 L19.5 16.5 C20.5 19.5 17 21.5 12 21.5 C7 21.5 3.5 19.5 4.5 16.5 L8.75 5.5 C9.5 3.75 10.5 2.5 12 2.5 Z')
  const inner = g.shrink(sil, 1.3)
  const base = g.path('M5.5 14 C9.5 15.25 14.5 15.25 18.5 14 L20.5 24 L3.5 24 Z')
  const mid = g.path('M7.5 9 C10 10 14 10 16.5 9 L18.5 14 C14.5 15.25 9.5 15.25 5.5 14 Z')
  const tip = g.path('M12 0 L7.5 9 C10 10 14 10 16.5 9 Z')
  const parts = [
    g.glass(g.inter(inner, base), 'c3', { outline: 0, glint: false, glow: 0.25 }),
    g.glass(g.inter(inner, mid), 'c1', { outline: 0, glint: false }),
    g.stone(g.inter(inner, tip), { thin: true }),
    g.stone(g.rim(sil, 1.3)),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
