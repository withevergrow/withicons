// forge/hand/gothic/log-out.mjs — the open-sided door bracket of the common log-out (a carved stone jamb, head and
// sill round a sapphire glass leaf) and a broad gilded arrow, ruby enamelled, that spans it and leaves to the right;
// the generated drawing was a closed arched doorway with a small arrow that read as a keyhole door, not an exit.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
const HEAD = s => [['M', [0, 0]], ['C', [-2.4 * s, -2.3 * s], [-4.9 * s, -4.3 * s], [-6.9 * s, -5.3 * s]],
  ['L', [-5 * s, 0]], ['L', [-6.9 * s, 5.3 * s]], ['C', [-4.9 * s, 4.3 * s], [-2.4 * s, 2.3 * s], [0, 0]]]
const headD = (tx, ty, s) => HEAD(s).map(([k, ...p]) => k + p.map(([x, y]) => `${f1(tx + x)} ${f1(ty + y)}`).join(' ')).join(' ') + ' Z'

export default function render(icon) {
  const tx = 21.3, ty = 12, s = 1.05
  const arrow = g.union(g.rr(7.4, ty - 1.3, tx - 4.8 * s, ty + 1.3, 0.6), g.path(headD(tx, ty, s)))
  const parts = [
    g.glass(g.rr(4.6, 4.6, 10.4, 19.4, 0.6), 'c2', { tracery: 'lancet', outline: 0.3, dark: 0.4, glow: 0.16 }),
    g.stone(g.stroke('M10.6 4.2 H5.6 A2 2 0 0 0 3.6 6.2 V17.8 A2 2 0 0 0 5.6 19.8 H10.6', 2.4),
      { ticks: [[[2, 9], [6, 9]], [[2, 15], [6, 15]], [[8, 3], [8, 6]], [[8, 18], [8, 21]]] }),
    g.cut(g.grow(arrow, 0.85)),
    g.gilt(arrow, { plate: 'A' }),
    g.glass(g.shrink(arrow, 0.9), 'c1', { plate: 'A', outline: 0.2, tracery: 'none', dark: 0.12, glow: 0.22, glint: false }),
  ]
  return paint(enamel(parts.flat(Infinity).filter(Boolean), icon))
}
