// forge/hand/glass/bread.mjs — the glass loaf. Generated Glass etched the three crust scores as 0.7u hairlines at 62%
// on a pale frosted dome, so at 24px the loaf was a blank bun and at 16px a grey half-disc. Here the dome is glass's own
// pane with a thinner frost and a firmer hairline (the violet body glows through), and each score is a deep etch-ink
// slash at Line's weight, gently curved like a blade cut, with a fine light lip on its lit side. Scores are wm-a (A plate).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const NAME = 'bread'
// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => +(12 + (v - 12) * G.SCALE - 0.5).toFixed(2)
const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)

// three scores, each a gentle arc (start, control, end) across the crown
const SCORES = [
  [[6.4, 13.6], [7.1, 11.6], [8.6, 10.1]],
  [[10.9, 13.1], [11.6, 11.1], [13.1, 9.6]],
  [[15.4, 13.6], [16.1, 11.6], [17.6, 10.1]],
]

export default function render() {
  const loaf = 'M4.5 20 H19.5 A2 2 0 0 0 21.5 18 V13.5 C21.5 8 17.5 4.5 12 4.5 C6.5 4.5 2.5 8 2.5 13.5 V18 A2 2 0 0 0 4.5 20 Z'
  const P = [{ id: 'p0', d: loaf, plate: 'K', subs: parsePath(loaf) }]
  const subs = parsePath(loaf)
  const fills = [{ d: loaf, subs, set: setOf(subs.map(s => s.pts)) }]
  const icon = {
    name: NAME, paths: P, fills, fillSet: unionSets(fills.map(f => f.set)),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    cutouts: [],
  }
  const L = softLayers(icon)
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  const cut = (dx, dy) => SCORES.map(([a, c, b]) => T(`M${a[0] + dx} ${a[1] + dy} Q${c[0] + dx} ${c[1] + dy} ${b[0] + dx} ${b[1] + dy}`)).join('')
  const marks = [
    ['path', { d: cut(0, 0), fill: 'none', stroke: V.etch, 'stroke-width': 1.35, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: cut(-0.5, -0.35), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
