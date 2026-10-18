// forge/hand/lunar/pichkari.mjs: a bold lacquer-red Holi pichkari (squirt gun) on a slight upward tilt: a fat red tank
// body with a cream liquid window, a pistol grip, a gold pump slide, a gold collar and a tapered gold nozzle, and a
// spray of gold and red droplets. The generated drawing read as a wrapped sweet; the first hand version as a syringe.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${r2(x)} ${r2(y - r)}Q${r2(x + w)} ${r2(y - w)} ${r2(x + r)} ${r2(y)}Q${r2(x + w)} ${r2(y + w)} ${r2(x)} ${r2(y + r)}` +
    `Q${r2(x - w)} ${r2(y + w)} ${r2(x - r)} ${r2(y)}Q${r2(x - w)} ${r2(y - w)} ${r2(x)} ${r2(y - r)}z`
}
// local frame: u runs along the gun (left to right, tilted up), v across it (down is positive)
const A = -12 * Math.PI / 180, CX = 9.6, CY = 11.2
const X = (u, v) => CX + u * Math.cos(A) - v * Math.sin(A)
const Y = (u, v) => CY + u * Math.sin(A) + v * Math.cos(A)
const P = (u, v) => `${r2(X(u, v))} ${r2(Y(u, v))}`
// rounded rectangle in the local frame, corner radius k
const rr = (u0, u1, v0, v1, k) =>
  `M${P(u0 + k, v0)}L${P(u1 - k, v0)}Q${P(u1, v0)} ${P(u1, v0 + k)}L${P(u1, v1 - k)}Q${P(u1, v1)} ${P(u1 - k, v1)}` +
  `L${P(u0 + k, v1)}Q${P(u0, v1)} ${P(u0, v1 - k)}L${P(u0, v0 + k)}Q${P(u0, v0)} ${P(u0 + k, v0)}Z`

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const rim = { stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
  const line = { stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round' }
  const body = rr(-8.4, 4.6, -3.5, 3.1, 2.2)
  const win = rr(-6.6, 2.6, -1.7, 0.7, 1.1)
  const grip = `M${P(-6.6, 2.4)}L${P(-2.4, 2.4)}L${P(-2.2, 7.6)}Q${P(-2.2, 8.9)} ${P(-3.6, 8.9)}L${P(-5.2, 8.9)}Q${P(-6.8, 8.9)} ${P(-6.8, 7.6)}Z`
  const slide = rr(-0.6, 3.8, 2.7, 4.9, 0.9)
  const collar = rr(4.6, 5.9, -2.3, 1.9, 0.5)
  const nozzle = `M${P(5.9, -1.9)}L${P(8.7, -1)}Q${P(9.2, -0.1)} ${P(8.7, 0.8)}L${P(5.9, 1.5)}Z`
  const drop = (u, v, r) => {
    const x = r2(X(u, v)), y = r2(Y(u, v))
    return `M${r2(x - r)} ${y}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`
  }
  const goldDrops = drop(10.4, -0.3, 1.25) + drop(12.7, 1.9, 0.95) + drop(12.4, -3, 0.95)
  const redDrops = drop(11.6, -1.6, 0.8) + drop(13.6, -0.8, 0.8) + drop(10.9, 2.3, 0.75)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 7, x2: 0, y2: 16, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.5, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 6, x2: 21, y2: 19, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    // pistol grip and pump slide (moving parts, gold)
    ['path', { d: grip, fill: url(1), ...line, class: 'wm-a' }],
    ['path', { d: slide, fill: url(1), ...line, class: 'wm-a' }],
    // fat red tank body with a cream liquid window
    ['path', { d: body, fill: url(0), ...rim, class: 'wm-k' }],
    ['path', { d: win, fill: C.tint, ...line, class: 'wm-k' }],
    // gold collar and nozzle
    ['path', { d: collar, fill: url(1), ...line, class: 'wm-k' }],
    ['path', { d: nozzle, fill: url(1), ...line, class: 'wm-k' }],
    // spray: gold and red droplets
    ['path', { d: goldDrops, fill: url(1), stroke: C.c2, 'stroke-width': 0.3, class: 'wm-s' }],
    ['path', { d: redDrops, fill: C.c1, stroke: C.c2, 'stroke-width': 0.3, class: 'wm-s' }],
    // foil glint on the tank
    ['path', { d: glint(X(1.8, -2.1), Y(1.8, -2.1), 0.8), fill: C.shine, class: 'wm-shine' }],
  ]
}
