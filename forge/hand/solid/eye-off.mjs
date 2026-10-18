// eye-off (solid): the eye's almond with its iris ring and a pupil, parted by a gap along the slash,
// so the pupil reads on both sides of the slash (above and below the line).
import { parsePath, circle, setD } from '../../kernel/geom.mjs'
import { normalize, unionSets, differenceSets, strokeSet, roundStrokeSet } from '../../kernel/bool.mjs'

const ALMOND = 'M10.8 4.08L9.36 4.35L8 4.81L7.2 5.2L6.48 5.62L5.81 6.08L5.04 6.71L3.92 7.85L2.85 9.28L2.4 10L1.58 11.6L1.51 11.92L1.52 12.18L1.93 13.12L2.45 14.08L3.35 15.44L3.92 16.15L4.53 16.8L5.2 17.42L5.84 17.94L7.05 18.72L8 19.19L8.72 19.46L9.68 19.73L10.48 19.89L11.2 19.97L12.08 20L13.52 19.89L14.32 19.73L15.2 19.49L15.92 19.22L16.95 18.72L18.19 17.92L18.97 17.28L19.47 16.8L20.08 16.15L20.64 15.45L21.6 14L22.42 12.4L22.49 12.08L22.47 11.76L22.03 10.8L21.6 10L20.58 8.48L20.07 7.84L19.04 6.79L18.16 6.06L17.6 5.67L16.8 5.2L16 4.81L15.2 4.51L14.32 4.27L12.8 4.03L12 4Z'

export default function render() {
  const almond = normalize(parsePath(ALMOND)[0].pts)
  const eye = unionSets([
    differenceSets(almond, normalize(circle(12, 12, 4.6, 0.15))),
    normalize(circle(12, 12, 3.2, 0.15)),
  ])
  const gap = strokeSet([[0.5, 0.5], [23.5, 23.5]], 4)
  const body = differenceSets(eye, gap)
  const slash = roundStrokeSet([[3, 3], [21, 21]], 2)
  return [
    ['path', { d: setD(body), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: setD(slash), 'fill-rule': 'evenodd', class: 'wm-s' }],
  ]
}
