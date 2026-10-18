// forge/hand/glass/baguette.mjs — the glass baguette. Generated Glass drew a fat round-ended capsule with three faint
// hairline ticks, a pale frosted sausage. Here the loaf is a long slim pane that tapers to soft points at both ends and
// bows gently, on the skeleton's diagonal, with glass's thinner frost and firmer hairline so the violet body glows
// through; three long scores slant across it as deep etch-ink slashes at Line's weight with a fine light lip, the
// baguette's signature. Scores are wm-a (the skeleton's A plate).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { setOf } from '../../kernel/bool.mjs'

const NAME = 'baguette'
const r2 = v => +v.toFixed(2)
// skeleton coordinates -> glass's front (pane) frame: scaled about the centre, 0.5u up-left
const F = v => r2(12 + (v - 12) * G.SCALE - 0.5)

// loaf frame: u along the diagonal (bottom-left -> top-right), v across it (toward the top-left)
const LEN = 12.9, W = 4.7, BOW = 0.6
const A = [Math.SQRT1_2, -Math.SQRT1_2], N = [-Math.SQRT1_2, -Math.SQRT1_2]
const at = (u, v) => { const b = BOW * (1 - (u / LEN) ** 2); return [12 + u * A[0] + (v + b) * N[0], 12 + u * A[1] + (v + b) * N[1]] }
// half-width: full through the middle, easing into rounded points at the tips
const half = u => { const t = Math.min(1, Math.abs(u) / LEN); return W * Math.sqrt(Math.max(0, 1 - t ** 2.6)) }
function outline() {
  const pts = [], K = 72
  for (let i = 0; i <= K; i++) { const u = -LEN + 2 * LEN * i / K; pts.push(at(u, half(u))) }
  for (let i = K - 1; i > 0; i--) { const u = -LEN + 2 * LEN * i / K; pts.push(at(u, -half(u))) }
  return pts.map(p => [r2(p[0]), r2(p[1])])
}
// three long scores, slanted ~25 degrees off the loaf's axis like a baker's cuts, evenly spaced along it
const SC = [-5.8, 0, 5.8].map(u => {
  const th = 25 * Math.PI / 180, l = 2.3, du = Math.cos(th) * l, dv = Math.sin(th) * l
  return [at(u - du, -dv), at(u + du, dv)]
})

export default function render() {
  const ring = outline()
  const d = 'M' + ring.map(p => p.join(' ')).join('L') + 'Z'
  const set = setOf([ring])
  const icon = {
    name: NAME, paths: [], lines: [], cutouts: [],
    fills: [{ d, subs: [{ pts: ring, closed: true }], set }], fillSet: set,
  }
  const L = softLayers(icon)
  if (!L) return null
  L.frost = 0.85; L.edge = 0.3
  const { defs, out } = softPaint(L, NAME)
  // each score: a deep etch-ink cut with a fine light lip on its lit (upper-left) side
  const cut = (dx, dy) => SC.map(([a, b]) => `M${F(a[0] + dx)} ${F(a[1] + dy)}L${F(b[0] + dx)} ${F(b[1] + dy)}`).join('')
  const marks = [
    ['path', { d: cut(0, 0), fill: 'none', stroke: V.etch, 'stroke-width': 1.35, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: cut(-0.45, -0.4), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
