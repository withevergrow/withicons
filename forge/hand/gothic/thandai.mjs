// forge/hand/gothic/thandai.mjs — the line design's tapered tumbler: a saffron glass body in a stone frame, a dark iron rim
// band studded with gilt seed dots, a pale highlight stroke and an emerald leaf at the top right; the generated drawing
// framed it in a stone shield crest.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const BODY = g.path('M4.8 6.4 H17.6 L16.2 20.1 A1.6 1.6 0 0 1 14.6 21.6 H7.8 A1.6 1.6 0 0 1 6.2 20.1 Z')
  const BAND = g.path('M4.8 6.4 H17.6 L17.2 10.6 H5.2 Z')
  const LEAF = g.path('M15.2 6.6 C15 3.9 17.2 2 20.8 2 C21 5.2 18.8 7.2 15.2 6.6 Z')
  const parts = [
    g.glass(LEAF, 'c4', { outline: 0.4, glint: false, glow: 0.3, tracery: 'none', plate: 'A' }),
    g.gilt(g.stroke('M16 6 L19.6 3.2', 0.7), { thin: true, glint: false, outline: 0.2, plate: 'A' }),
    ...g.pane(BODY, 'c3', { frame: 1.25, tracery: 'none' }),
    g.iron(BAND, { outline: 0.3 }),
    g.gilt(g.union(...[[7.6, 8.5], [11.2, 8.5], [14.8, 8.5]].map(([x, y]) => g.circle(x, y, 0.62))), { thin: true, glint: false, outline: 0.2 }),
    g.shine(g.stroke('M7.8 13.2 C8 15.2 8.3 16.6 8.7 18', 1), { op: 0.7 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
