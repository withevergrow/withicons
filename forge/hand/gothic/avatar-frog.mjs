// forge/hand/gothic/avatar-frog.mjs — the line frog: a wide emerald glass head, two stone-ringed eye bumps on top with
// dark slot pupils and a wide leaded smile (the old blue oval muzzle read as a mouth with no face).
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

export default function render(icon) {
  const parts = [
    g.glass(g.ellipse(12, 15, 8.7, 5.8), 'c4', { tracery: 'none', outline: 0.45, glow: 0.3, dark: 0.35 }),
    ...g.pane(g.circle(7.5, 8.2, 3.5), 'c4', { frame: 1.05, tracery: 'none', glass: { dark: 0.2 } }),
    ...g.pane(g.circle(16.5, 8.2, 3.5), 'c4', { frame: 1.05, tracery: 'none', glass: { dark: 0.2 } }),
    g.iron(g.ellipse(7.5, 8.2, 0.95, 1.4), { outline: 0.2 }),
    g.iron(g.ellipse(16.5, 8.2, 0.95, 1.4), { outline: 0.2 }),
    g.shine(g.dot(7.2, 7.6, 0.32), { op: 0.9 }), g.shine(g.dot(16.2, 7.6, 0.32), { op: 0.9 }),
    g.iron(g.stroke('M7.6 15.4 C9.4 18.6 14.6 18.6 16.4 15.4', 0.95), { outline: 0.22 }),
    g.iron(g.union(g.dot(11, 12.8, 0.3), g.dot(13, 12.8, 0.3)), { outline: 0.1 }),
  ]
  return paint(parts.flat(Infinity).filter(Boolean))
}
