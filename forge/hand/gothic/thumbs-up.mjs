// forge/hand/gothic/thumbs-up.mjs — the common thumb-up silhouette: a raised thumb, a rounded fist block with three
// finger grooves, and a ruby cuff on the left in a gilded frame. Hand in carved stone; the generated open hand with
// flat fingers running right read as a wave or a glove.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const HAND = 'M8 10.2 L10.4 4.2 A2.3 2.3 0 0 1 14.7 5.2 L14.4 9.2 H18.8 C20.3 9.2 21.4 10.5 21.1 12 L19.7 19.3 C19.5 20.4 18.6 21.2 17.5 21.2 H8 Z'
const CUFF = 'M7.5 10.2 H4.6 A1.6 1.6 0 0 0 3 11.8 V19.6 A1.6 1.6 0 0 0 4.6 21.2 H7.5 Z'

export default function render(icon) {
  const cuff = g.path(CUFF)
  const parts = [
    g.stone(g.path(HAND), { plate: 'K' }),
    g.lead([[[8.6, 13.4], [19.2, 13.4]], [[8.6, 16.2], [18.6, 16.2]], [[8.6, 18.9], [18, 18.9]]], { w: 0.3 }),
    g.gilt(cuff, { plate: 'A', glint: false }),
    g.glass(g.shrink(cuff, 0.85), 'c1', { plate: 'A', tracery: 'none', glow: 0.3, outline: 0.2 }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
