// forge/hand/bauhaus/plane.mjs — the line jetliner flying north-east: red swept wings and tailplane cut from the
// skeleton silhouette, with a blue fuselage bar down its axis and a yellow cockpit window at the nose.
import { path, seg2, clip, circle } from '../../styles/_bauhaus-prim.mjs'
import { compose } from '../../styles/_bauhaus-compose.mjs'

const PLANE = 'M16.6 4.58C17.83 3.34 19.18 3.27 20.13 3.87C20.73 4.82 20.66 6.17 19.42 7.4L15.89 10.94L18.19 20.66L16.95 21.9L12.18 14.65L8.82 18.01L9.35 21.37L8.82 21.9L5.99 18.01L2.1 15.18L2.63 14.65L5.99 15.18L9.35 11.82L2.1 7.05L3.34 5.81L13.06 8.11Z'

export default function render(icon) {
  const plane = path(PLANE)
  return compose([
    ['c1', plane],
    ['c3', clip(seg2(19.6, 4.4, 5.2, 18.8, 3.4), plane)],
    ['c2', circle(17.9, 6.1, 1.05)],
  ], icon)
}
