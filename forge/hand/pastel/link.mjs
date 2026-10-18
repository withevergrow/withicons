// forge/hand/pastel/link.mjs — the pastel link: the skeleton's two open chain hooks on the diagonal, redrawn as broad
// soft bands (3.25, up from the faint 2.5 the composer gave) whose tips tuck into each other's slot with a moat between
// them, lavender (K) and sky (A), with a deeper 0.8 hue rim so the chain holds its edge on white at 16px.
import * as Prim from '../../styles/_pastel-prim.mjs'
import { entriesOf } from '../../styles/_pastel-compose.mjs'
import { HUES, paintEntries } from '../../styles/_pastel-paint.mjs'

const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16))
const mix = (a, b, t) => '#' + hx(a).map((c, i) => Math.round(c + (hx(b)[i] - c) * t).toString(16).padStart(2, '0')).join('').toUpperCase()
const deeper = names => Object.fromEntries(names.map(n => [n, { ...HUES[n], rim: mix(HUES[n].base, HUES[n].deep, 0.85) }]))

export default function render(icon) {
  const { stroke } = Prim
  const W = 3.25, R = 3.5
  // one hook: lower end centre (6.875, 17.125), upper end centre (10.76, 13.24); the tip stops at 300 degrees
  const tip = a => [10.76 + R * Math.cos(a * Math.PI / 180), 13.24 + R * Math.sin(a * Math.PI / 180)].map(v => +v.toFixed(2))
  const [tx, ty] = tip(298)
  const hook = `M11.5 17.45 L9.35 19.6 A3.5 3.5 0 0 1 4.4 14.65 L8.29 10.76 A3.5 3.5 0 0 1 ${tx} ${ty}`
  // the other hook: the same drawing turned half a turn about the centre
  const hookA = `M12.5 6.55 L14.65 4.4 A3.5 3.5 0 0 1 19.6 9.35 L15.71 13.24 A3.5 3.5 0 0 1 ${+(24 - tx).toFixed(2)} ${+(24 - ty).toFixed(2)}`
  const K = stroke(hook, W), A = stroke(hookA, W)
  const E = entriesOf([
    ['lavender@K', K],
    ['cut', stroke(hookA, W + 2 * 0.9)],
    ['sky@A', A],
  ], icon)
  for (const e of E) if (e.mode !== 'ink') e.rim = 0.8
  return paintEntries(E, { hues: deeper(['lavender', 'sky']), glint: true })
}
