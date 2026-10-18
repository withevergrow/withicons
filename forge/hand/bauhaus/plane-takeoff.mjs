// forge/hand/bauhaus/plane-takeoff.mjs — the airliner climbing away from the runway: the same red wings, tail and
// blue fuselage stripe as plane-landing, mirrored so the nose rises, above the flat ink runway bar.
import { path, seg2, clip, pill, flipY } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const PLANE = 'M19.11 11.98 C20.43 12.45 20.93 13.41 20.82 14.3 C20.33 15.06 19.33 15.46 18.02 14.98 L14.26 13.62 L7.99 18.57 L6.67 18.09 L10.31 12.18 L6.74 10.88 L4.49 12.4 L3.92 12.2 L5.79 8.83 L6.52 5.05 L7.09 5.26 L7.84 7.87 L11.41 9.17 L12.42 2.3 L13.74 2.78 L15.35 10.61 Z'

export default function render(icon) {
  const plane = flipY(path(PLANE), 10.5)
  return compose([
    ['c1', plane],
    ['c3', clip(seg2(5.6, 14.1, 20.2, 7.4, 3.1), plane)],
    ['ink', pill(2.5, 20.25, 21.5, 22.75)],
  ], icon)
}
