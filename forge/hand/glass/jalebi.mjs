// forge/hand/glass/jalebi.mjs: a fat two-turn coil of frosted batter with a short flicked tail and a syrup sheen
// running along the lit side of each coil. Few thick coils with clear gaps so it reads as a jalebi, not a snail.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const D = set => setD(set, 0.03)
const f = v => +v.toFixed(2)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

const CX = 11.8, CY = 12.4
// archimedean coil from the middle out, then a short tail leaving along the tangent and curling up
function coil() {
  const pts = []
  const T0 = 0, T1 = Math.PI * 3.7
  for (let t = T0; t <= T1 + 1e-6; t += 0.12) {
    const r = 0.9 + 1.95 * t / Math.PI
    pts.push([CX + r * Math.cos(t - 2.2), CY + r * Math.sin(t - 2.2)])
  }
  return pts
}
const spiral = coil()
const end = spiral[spiral.length - 1], prev = spiral[spiral.length - 2]
const tdx = end[0] - prev[0], tdy = end[1] - prev[1], tl = Math.hypot(tdx, tdy)
const tail = [end, [end[0] + tdx / tl * 1.0, end[1] + tdy / tl * 1.0], [end[0] + tdx / tl * 1.8 + 0.3, end[1] + tdy / tl * 1.8 - 0.6]]

export default function render(icon) {
  const NAME = (icon && icon.name) || 'jalebi'
  const g = i => `wg-glass-${NAME}-${i}`, url = i => `url(#${g(i)})`
  const W = 2.6
  const pane = unionSets([roundStrokeSet(spiral, W), roundStrokeSet(tail, W)])
  const back = translateSet(erode(pane, 0.1), 0.5, 0.5)
  const defs = ['defs', {}, [
    ['linearGradient', { id: g(0), x1: 2, y1: 2, x2: 22, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]],
    ['radialGradient', { id: g(1), cx: 15, cy: 15, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.7), stop(0.5, V.accent, 0.26), stop(1, V.accent, 0)]],
    ['linearGradient', { id: g(2), x1: 2, y1: 2, x2: 20, y2: 20, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.5), stop(0.45, V.tint, 0.4), stop(1, V.tint, 0.28)]],
  ]]
  // syrup sheen: a lit streak on the upper-left side of the coil, inset from the edge, only where the coil faces the light
  const sheen = []
  let run = []
  const inset = 0.5
  for (let i = 4; i < spiral.length; i++) {
    const p = spiral[i], q = spiral[i - 1]
    const dx = p[0] - q[0], dy = p[1] - q[1], l = Math.hypot(dx, dy)
    // left-hand normal of travel: (dy, -dx)/l; the coil winds clockwise, so it points up-left on the lit flank when nx+ny < 0
    const nx = dy / l, ny = -dx / l
    const lit = nx + ny < -0.35
    if (lit) run.push([f(p[0] + nx * inset), f(p[1] + ny * inset)])
    else { if (run.length > 4) sheen.push(run); run = [] }
  }
  if (run.length > 4) sheen.push(run)
  return [defs,
    ['path', { d: D(dilate(translateSet(back, 0, 0.4), 0.5)), fill: V.shadow, 'fill-opacity': 0.07, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: D(back), fill: url(0), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(back), fill: url(1), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(pane), fill: url(2), stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ...sheen.map(run => ['path', { d: 'M' + run.map(p => p.join(' ')).join('L'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.85, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }]),
  ]
}
