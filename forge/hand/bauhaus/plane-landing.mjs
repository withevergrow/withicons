// forge/hand/bauhaus/plane-landing.mjs — the plane nose-down toward the runway: red wings and tail with a blue
// fuselage stripe, above a flat ink runway bar (the descending silhouette of line, not a slab across it).
import { path, seg2, clip, pill } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const PLANE = 'M19.11 11.98 C20.43 12.45 20.93 13.41 20.82 14.3 C20.33 15.06 19.33 15.46 18.02 14.98 L14.26 13.62 L7.99 18.57 L6.67 18.09 L10.31 12.18 L6.74 10.88 L4.49 12.4 L3.92 12.2 L5.79 8.83 L6.52 5.05 L7.09 5.26 L7.84 7.87 L11.41 9.17 L12.42 2.3 L13.74 2.78 L15.35 10.61 Z'

export default function render(icon) {
  const plane = path(PLANE)
  return compose([
    ['c1', plane],
    ['c3', clip(seg2(5.6, 6.9, 20.2, 13.6, 3.1), plane)],
    ['ink', pill(2.5, 20.25, 21.5, 22.75)],
  ], icon)
}
