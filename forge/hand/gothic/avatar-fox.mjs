// forge/hand/gothic/avatar-fox.mjs — the line fox head in amber glass: pointed ears with dark glass lining, a pale stone
// muzzle chevron, two slot eyes and a dark nose; gothic only in the lead, the stone bib and a gilt brow, so the fox
// stays a fox (the old blue lattice shield hid it).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const HEAD = g.path('M12 20.5 C11 19.5 9.5 18.5 8 17.75 L3.5 15.25 C4.5 13.75 5 12.25 5 10.75 V4.75 C5 3.75 5.75 3.5 6.5 4 L10 7 H14 L17.5 4 C18.25 3.5 19 3.75 19 4.75 V10.75 C19 12.25 19.5 13.75 20.5 15.25 L16 17.75 C14.5 18.5 13 19.5 12 20.5 Z')
  const CHEEK = g.path('M3.5 15.25 C6 14.25 9 14.75 12 17 C15 14.75 18 14.25 20.5 15.25 L16 17.75 C14.5 18.5 13 19.5 12 20.5 C11 19.5 9.5 18.5 8 17.75 Z')
  const parts = [
    g.glass(HEAD, 'c3', { tracery: 'none', outline: 0.45, glow: 0.3, dark: 0.35 }),
    g.glass(g.path('M6.2 5.6 V9.8 L9 7.6 Z'), 'c1', { outline: 0.32, tracery: 'none', deep: 0.3 }),
    g.glass(g.path('M17.8 5.6 V9.8 L15 7.6 Z'), 'c1', { outline: 0.32, tracery: 'none', deep: 0.3 }),
    g.stone(g.inter(CHEEK, g.shrink(HEAD, 0.5)), { thin: true, outline: 0.36 }),
    g.iron(g.ellipse(9.5, 12.5, 0.85, 1.15), { outline: 0.2, plate: 'A' }),
    g.iron(g.ellipse(14.5, 12.5, 0.85, 1.15), { outline: 0.2, plate: 'A' }),
    g.iron(g.path('M10.5 17.2 H13.5 L12 19 Z'), { outline: 0.3 }),
    g.shine(g.dot(9.2, 12, 0.3), { op: 0.9 }), g.shine(g.dot(14.2, 12, 0.3), { op: 0.9 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
