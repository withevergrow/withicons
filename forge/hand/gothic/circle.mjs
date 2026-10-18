// forge/hand/gothic/circle.mjs — a plain ring: a jointed stone rim with an open centre (the page shows through), four
// gilded rivets at the compass points as the only ornament; the old filled web-and-gem disc read as a shield, not a circle.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const CX = 12, CY = 12, R = 9.5, W = 2.6
const rays = Array.from({ length: 16 }, (_, k) => {
  const a = (k + 0.5) * Math.PI / 8, r0 = R - W - 0.4, r1 = R + 0.4
  return [[CX + r0 * Math.cos(a), CY + r0 * Math.sin(a)], [CX + r1 * Math.cos(a), CY + r1 * Math.sin(a)]]
})

export default function render(icon) {
  const mid = R - W / 2
  const parts = [
    g.stone(g.rim(g.circle(CX, CY, R), W), { ticks: rays }),
    g.studs([[CX, CY - mid], [CX + mid, CY], [CX, CY + mid], [CX - mid, CY]], 0.62, { plate: 'A' }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
