// forge/hand/glass/wifi-off.mjs — Wi-Fi with a clean slash. Generated Glass broke the arcs into faint fragments around a
// fat pink slash. Here the three fan arcs and the dot are bold glass rods that stop short of a slim accent slash
// (a clear gap either side, top-left to bottom-right), so the Wi-Fi mark reads whole at 16px.
import { softLayers, softPaint, V } from '../../styles/_glass-soft.mjs'
import { G } from '../../styles/_glass-core.mjs'

const f2 = v => +v.toFixed(2)
const CX = 12, CY = 20.4
const OFF = -1.8
const A0 = [5, 5 + OFF], A1 = [20.2, 20.2 + OFF]
// distance from the slash line (y = x) and a corridor around it for the rods to stay out of
const CORRIDOR = 3.05
const outside = ([x, y]) => Math.abs(x - y + OFF) / Math.SQRT2 > CORRIDOR
// the fan's arcs as polylines, split where they would run into the slash corridor
const arcLines = r => {
  const runs = []
  let run = []
  for (let a = -47; a <= 47.01; a += 1.5) {
    const t = a * Math.PI / 180
    const p = [CX + r * Math.sin(t), CY - r * Math.cos(t)]
    if (outside(p)) run.push(p.map(f2))
    else { if (run.length) runs.push(run); run = [] }
  }
  if (run.length) runs.push(run)
  return runs
}
const LINES = [4.7, 9.3, 14].flatMap(arcLines).filter(r => r.length > 3).map(pts => ({ pts, closed: false, plate: 'K' }))
LINES.push({ pts: [[CX, CY]], closed: false, plate: 'K' })

// slash, in the pane's frame (the drawing is scaled about the centre, the pane sits 0.5u up-left)
const F = v => f2(12 + (v - 12) * G.SCALE - 0.5)

export default function render() {
  const L = softLayers({ name: 'hand', paths: [], lines: LINES, fills: [], cutouts: [], fillSet: [] })
  if (!L) return null
  const { defs, out } = softPaint(L, 'wifi-off')
  const d = `M${F(A0[0])} ${F(A0[1])}L${F(A1[0])} ${F(A1[1])}`
  const off = 0.38
  const dl = `M${f2(F(A0[0]) - off * 0.7)} ${f2(F(A0[1]) + off * 0.7)}L${f2(F(A1[0]) - off * 0.7)} ${f2(F(A1[1]) + off * 0.7)}`
  const cap = { fill: 'none', 'stroke-linecap': 'round' }
  const slash = [
    ['path', { d, ...cap, stroke: V.shadow, 'stroke-opacity': 0.12, 'stroke-width': 3.4, class: 'wm-shadow' }],
    ['path', { d, ...cap, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 2.7, class: 'wm-s' }],
    ['path', { d, ...cap, stroke: V.accent, 'stroke-width': 2.1, class: 'wm-s' }],
    ['path', { d: dl, ...cap, stroke: V.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.7, class: 'wm-s' }],
  ]
  const rim = out.findIndex(n => n[1].class === 'wm-shine')
  out.splice(rim >= 0 ? rim : out.length, 0, ...slash)
  return [['defs', {}, defs], ...out]
}
