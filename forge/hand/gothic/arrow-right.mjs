// forge/hand/gothic/arrow-right.mjs — the open arrow of the line set in gilded metal: a straight enamelled shaft driven
// into the chevron family's mitred spear point (ruby trefoil stud in the point), a ball on the tail; the generated
// drawing was a solid barbed blade with a pommel and read as a sword or dagger, not an arrow.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const ax = 19.4, ay = 12, d = 6, w = 2.7, h = w / 2
  const L = Math.hypot(d, d), o = h * d / L, m = h * L / d
  const head = g.poly([[ax - d + o, ay - d - o], [ax + m + 1.3, ay], [ax - d + o, ay + d + o], [ax - d - o, ay + d - o], [ax - m, ay], [ax - d - o, ay - d + o]])
  const parts = [
    g.gilt(g.union(g.seg(3.8, ay, ax - 1, ay, w), head, g.circle(ax - d, ay - d, w * 0.6), g.circle(ax - d, ay + d, w * 0.6), g.circle(4, ay, w * 0.62)), { plate: 'A' }),
    g.glass(g.foil(ax - 1.2, ay, 1.6, 3, 0), 'c1', { outline: 0.24, glint: false, glow: 0.34, plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
