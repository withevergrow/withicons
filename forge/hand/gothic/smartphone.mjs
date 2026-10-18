// forge/hand/gothic/smartphone.mjs — the common handset: a rounded carved-stone body, a clear sapphire glass screen,
// a small speaker slot and a gilded home pill (A); the generated drawing was a single pointed cathedral window in
// a stone frame, which reads as a window, not a phone.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const parts = [
    g.stone(g.rr(6, 2.5, 18, 21.5, 2.8)),
    g.glass(g.rr(8, 5.4, 16, 15.6, 1), 'c2', { tracery: 'lancet', outline: 0.34, dark: 0.35, glow: 0.2 }),
    g.stone(g.seg(10.8, 3.9, 13.2, 3.9, 0.7), { thin: true, outline: 0.2 }),
    g.gilt(g.seg(10.2, 18.4, 13.8, 18.4, 1.5), { plate: 'A', thin: true, outline: 0.3 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
