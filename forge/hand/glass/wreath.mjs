// forge/hand/glass/wreath.mjs — a Christmas wreath. Generated Glass fused leaves, berries and bow into a lumpy donut.
// Here a round ring of thirteen swept leaves (one glass pane with a scalloped rim and etched midribs) around a wide
// open centre, three accent berries, and a clear accent bow with two loops, a knot and two tails across the bottom.
// Ring wm-k; berries and bow wm-a (they pulse).
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const F = v => f2(12 + (v - 12) * G.SCALE - 0.5)
const P = ([x, y]) => `${F(x)} ${F(y)}`
const CX = 12, CY = 10.6, RM = 6.3, N = 13, LEN = 5.2, HW = 1.95, TILT = 20 * Math.PI / 180

// one leaf: base on the ring, swept clockwise and a little outward
const leaf = i => {
  const th = i * 2 * Math.PI / N - Math.PI / 2
  const base = [CX + RM * Math.cos(th), CY + RM * Math.sin(th)]
  const ph = th + Math.PI / 2 - TILT
  const dir = [Math.cos(ph), Math.sin(ph)], nrm = [-dir[1], dir[0]]
  const at = (a, b) => [base[0] + dir[0] * a + nrm[0] * b, base[1] + dir[1] * a + nrm[1] * b]
  return { base, tip: at(LEN, 0), dir, at }
}
const LEAVES = Array.from({ length: N }, (_, i) => leaf(i))
const leafD = ({ at, base, tip }) => {
  const q = p => p.map(f2).join(' ')
  return `M${q(at(-0.6, 0))} C${q(at(1.1, HW * 1.45))} ${q(at(3.6, HW * 1.1))} ${q(tip)} C${q(at(3.6, -HW * 1.1))} ${q(at(1.1, -HW * 1.45))} ${q(at(-0.6, 0))} Z`
}
const R_IN = RM - 1.4, R_OUT = RM + 1.6
const ring = r => `M${CX + r} ${CY} A${r} ${r} 0 1 1 ${CX - r} ${CY} A${r} ${r} 0 1 1 ${CX + r} ${CY} Z`
const RING = ring(R_OUT) + ' ' + ring(R_IN)

function skel(shapes) {
  const fills = shapes.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name: 'hand', paths: [], fills, cutouts: [], lines: [], fillSet: fills.flatMap(f => f.set) }
}

export default function render() {
  const L = softLayers(skel([RING, ...LEAVES.map(leafD)]))
  if (!L) return null
  const { defs, out } = softPaint(L, 'wreath')
  const cap = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.4 }
  // leaf midribs etched on the pane
  const ribs = LEAVES.map(l => `M${P(l.at(0.9, 0))}L${P(l.at(LEN - 1.1, 0))}`).join('')
  // berries
  const berry = (a, r = 0.95) => {
    const th = a * Math.PI / 180, p = [CX + (RM + 0.6) * Math.cos(th), CY + (RM + 0.6) * Math.sin(th)]
    return [
      ['circle', { cx: F(p[0]), cy: F(p[1]), r: f2(r), fill: V.accent, ...edge, class: 'wm-a' }],
      ['path', { d: `M${F(p[0] - 0.3)} ${F(p[1] - 0.3)}h0`, ...cap, stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.5, class: 'wm-a' }],
    ]
  }
  // bow across the bottom of the ring
  const BX = 12, BY = 19
  const mir = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${2 * BX - +x} ${y}`)
  const loop = 'M12 19 C10.2 16.6 5.6 16.3 5.5 19 C5.5 21.6 10 21.6 12 19 Z'
  const tail = 'M11.4 19.8 L8.8 23 L11.1 22.6 L12.4 20.3 Z'
  const T = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${F(+x)} ${F(+y)}`)
  const marks = [
    ['path', { d: ribs.replace(/L/g, 'L'), ...cap, stroke: V.etch, 'stroke-opacity': 0.3, 'stroke-width': 0.5 }],
    ...berry(-128), ...berry(-52), ...berry(24),
    ['path', { d: T(tail), fill: V.accent, ...edge, class: 'wm-a' }],
    ['path', { d: T(mir(tail)), fill: V.accent, ...edge, class: 'wm-a' }],
    ['path', { d: T(loop), fill: V.accent, ...edge, class: 'wm-a' }],
    ['path', { d: T(mir(loop)), fill: V.accent, ...edge, class: 'wm-a' }],
    ['path', { d: `M${P([6.7, 19.4])}C${P([7, 17.9])} ${P([8.6, 17.4])} ${P([10, 17.7])}M${P([17.3, 19.4])}C${P([17, 17.9])} ${P([15.4, 17.4])} ${P([14, 17.7])}`, ...cap, stroke: V.shine, 'stroke-opacity': 0.6, 'stroke-width': 0.7, class: 'wm-a' }],
    ['ellipse', { cx: F(12), cy: F(19), rx: f2(1.45 * G.SCALE), ry: f2(1.55 * G.SCALE), fill: V.accent, ...edge, 'stroke-opacity': 0.28, class: 'wm-a' }],
    ['path', { d: `M${F(11.5)} ${F(18.4)}h0`, ...cap, stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.6, class: 'wm-a' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...marks)
  return [['defs', {}, defs], ...out]
}
