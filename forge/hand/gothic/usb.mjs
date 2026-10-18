// forge/hand/gothic/usb.mjs — the USB trident as gilded metalwork: an ogee spear head on the stem, two branches held
// clear of the plug, an emerald cabochon and a sapphire square jewel at their ends and a ruby cabochon foot.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render() {
  const arms = g.union(
    g.stroke([[5.5, 11.6], [5.5, 12.6], [12, 15.8]], 1.5),
    g.stroke([[19, 10], [19, 10.6], [12, 14]], 1.5),
  )
  const parts = [
    g.gilt(g.union(g.seg(12, 5.6, 12, 18, 1.9), arms, g.spear(12, 6.4, -90, 1.1))),
    g.gilt(g.circle(5.5, 9.9, 2.15), { thin: true, glint: false }),
    g.glass(g.circle(5.5, 9.9, 1.4), 'c4', { outline: 0.22, glow: 0.3 }),
    g.gilt(g.rr(16.8, 6.3, 21.2, 10.7, 0.5), { thin: true, glint: false }),
    g.glass(g.rr(17.6, 7.1, 20.4, 9.9, 0.2), 'c2', { outline: 0.22, glow: 0.3 }),
    g.gilt(g.circle(12, 19.4, 2.2), { thin: true, glint: false }),
    g.glass(g.circle(12, 19.4, 1.45), 'c1', { outline: 0.22, glow: 0.3 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
