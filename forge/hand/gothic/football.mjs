// forge/hand/gothic/football.mjs — a football after the new skeleton: a limestone ball with a ruby glass centre
// pentagon, five stone seams and five ruby glass panels hugging the rim; the generated drawing floated five
// outward-pointing pentagons round the centre, which read as a star or flower at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const PENT = 'M12 8.3 L15.52 10.86 L14.17 15 L9.83 15 L8.48 10.86 Z'
const EDGE = 'M7.84 3.46 L9.18 4.25 L12 5 L14.82 4.25 L16.16 3.46 A9.5 9.5 0 0 0 7.84 3.46 Z M18.83 5.4 L18.5 6.92 L18.66 9.84 L20.24 12.29 L21.41 13.32 A9.5 9.5 0 0 0 18.83 5.4 Z M20.39 16.46 L18.84 16.61 L16.11 17.66 L14.27 19.93 L13.65 21.36 A9.5 9.5 0 0 0 20.39 16.46 Z M10.35 21.36 L9.73 19.93 L7.89 17.66 L5.16 16.61 L3.61 16.46 A9.5 9.5 0 0 0 10.35 21.36 Z M2.59 13.32 L3.76 12.29 L5.34 9.84 L5.5 6.92 L5.17 5.4 A9.5 9.5 0 0 0 2.59 13.32 Z'
const SEAMS = [
  [[12, 8.3], [12, 5]], [[15.52, 10.86], [18.66, 9.84]], [[14.17, 15], [16.11, 17.66]], [[9.83, 15], [7.89, 17.66]], [[8.48, 10.86], [5.34, 9.84]],
]

export default function render() {
  const ball = g.circle(12, 12, 9.5)
  const parts = [
    g.stone(ball),
    g.lead(SEAMS, { w: 0.55 }),
    g.glass(g.inter(g.path(EDGE), g.shrink(ball, 0.6)), 'c1', { plate: 'A', outline: 0.38, glint: false, glow: 0.12 }),
    g.glass(g.path(PENT), 'c1', { plate: 'A', outline: 0.42, tracery: 'none', glow: 0.26 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
