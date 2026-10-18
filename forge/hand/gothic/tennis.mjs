// forge/hand/gothic/tennis.mjs — a tennis racket after the new skeleton: an emerald glass head strung with leads in a
// stone frame, a gilt throat and a long gilt grip wrapped in bands, and a separate gold glass ball with its seam;
// the generated drawing had a short thin handle that read as a magnifier.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const HEAD = 'M14.9 14.9 C14.61 12.6 15.76 6.56 12.6 3.4 A7.31 6.51 45 0 0 2.83 2.83 A7.31 6.51 45 0 0 3.4 12.6 C6.56 15.76 12.6 14.61 14.9 14.9 Z'
const GRIP = 'M14.2 17.8 L17.8 14.2 L21.4 17.8 A2.55 2.55 0 0 1 17.8 21.4 Z'

export default function render() {
  const parts = [
    g.gilt(g.seg(14.3, 14.3, 16.4, 16.4, 2.3)),
    g.gilt(g.path(GRIP)),
    g.lead([[[16.1, 19.5], [19.5, 16.1]], [[17.8, 21.2], [21.2, 17.8]]], { w: 0.6 }),
    ...g.pane(g.path(HEAD), 'c4', { frame: 1.6, tracery: [[[6.5, 2.6], [14, 10.1]], [[2.6, 6.5], [10.1, 14]], [[2.8, 9.8], [9.8, 2.8]]] }),
    g.glass(g.circle(20, 4, 2.9), 'c3', { plate: 'A', outline: 0.55, glow: 0.3, tracery: [[[17.9, 2.4], [19.3, 4], [17.9, 5.6]], [[22.1, 2.4], [20.7, 4], [22.1, 5.6]]] }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
