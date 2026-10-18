// forge/hand/bauhaus/lightbulb.mjs — a bulb: yellow globe running into a short neck, a red Y filament, a blue
// collar and a black half-disc tip.
import { circle, poly, unite, stroke, rr, half } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const glass = unite(circle(12, 9.25, 7.25), poly([[6.6, 12.5], [17.4, 12.5], [15, 16.5], [9, 16.5]], [0.9, 0.9, 0.9, 0.9]))
  return compose([
    ['c2', glass],
    ['c1', stroke('M12 16 V12.5 M9.25 9.5 L12 12.5 L14.75 9.5', 1.9)],
    ['c3', rr(8.75, 16.75, 15.25, 19, 1.1)],
    ['ink', half(12, 19.5, 3.25, 's')],
  ], icon)
}
