// forge/hand/bauhaus/landmark.mjs — one clear bank silhouette (red pediment with a yellow medallion, four even blue
// columns, ink plinth), replacing the generated half-disc dome that read as a cloche or a cap.
import { poly, rr, circle } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

export default function render(icon) {
  const cols = [6, 10, 14, 18].map(x => rr(x - 1.25, 11.75, x + 1.25, 18.25, 1))
  return compose([
    ['c1', poly([[2.5, 10.25], [12, 3], [21.5, 10.25]], [1.25, 1.75, 1.25])],
    ['c2', circle(12, 7.5, 1.4)],
    ['c3', ...cols],
    ['ink', rr(2.5, 19.5, 21.5, 22, 1.25)],
  ], icon)
}
