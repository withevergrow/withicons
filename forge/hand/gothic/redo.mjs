// forge/hand/gothic/redo.mjs — the wide U-turn of the line set: one gilded enamel band running left along the top, round
// a broad bend and back right along the bottom, the chevron family's spear point at the upper right and a ball on the
// tail, a ruby trefoil in the point; the generated drawing was a diagonal curl with a knob end.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

export default function render(icon) {
  const ax = 20.6, ay = 9.4, d = 5.2, w = 2.6, h = w / 2
  const L = Math.hypot(d, d), o = h * d / L, m = h * L / d
  const head = g.poly([[ax - d + o, ay - d - o], [ax + m + 1.2, ay], [ax - d + o, ay + d + o], [ax - d - o, ay + d - o], [ax - m, ay], [ax - d - o, ay - d + o]])
  const parts = [
    g.gilt(g.union(
      g.seg(8.6, ay, ax - 1, ay, w), g.arc(8.6, 15, 5.6, -90, -270, w), g.seg(8.6, 20.6, 15.4, 20.6, w),
      head, g.circle(ax - d, ay - d, w * 0.6), g.circle(ax - d, ay + d, w * 0.6), g.circle(15.4, 20.6, w * 0.66)), { plate: 'A' }),
    g.glass(g.foil(ax - 1.2, ay, 1.5, 3, 0), 'c1', { outline: 0.24, glint: false, glow: 0.34, plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
