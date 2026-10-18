// forge/hand/christmas/loader.mjs — eight bold rounded cranberry spokes fading round the dial behind the leading top
// spoke: one hue so the opacity ramp alone shows the spin (red/green alternation read as stripes), spokes pulled in to
// the live area with 2u clearance at the hub, and a tail floor high enough to still show on #0B0B12 at 16px.
import { C, U } from '../../styles/_christmas-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
// a spoke at angle a (screen degrees, 270 = up), from radius r0 to r1, half-width w, round ends
function spoke(a, r0, r1, w) {
  const t = a * Math.PI / 180, u = [Math.cos(t), Math.sin(t)], n = [-u[1], u[0]]
  const at = (r, s) => [12 + u[0] * r + n[0] * w * s, 12 + u[1] * r + n[1] * w * s]
  return `M${P(at(r0, -1))}L${P(at(r1, -1))}A${w} ${w} 0 0 1 ${P(at(r1, 1))}L${P(at(r0, 1))}A${w} ${w} 0 0 1 ${P(at(r0, -1))}Z`
}

export default function render() {
  const id = n => `wg-christmas-loader-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const ink = { stroke: C.ink, 'stroke-width': U.INK, 'stroke-linejoin': 'round' }
  // clockwise spin: the lead is at the top, the tail darkens anticlockwise behind it (wash of the deep shade colour)
  const WASH = [0, 0.42, 0.36, 0.3, 0.24, 0.18, 0.12, 0.06] // 270, 315, 0, 45, 90, 135, 180, 225
  const out = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 13, y2: 22, gradientUnits: 'userSpaceOnUse' },
      [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
  ]]]
  // half-width 1.6 (3.2u thick): r0 6.6 leaves ~1.4u between neighbouring outlines at the hub; r1 8.4 + cap ends at r 10
  for (let i = 0; i < 8; i++) {
    const a = 270 + 45 * i, d = spoke(a, 6.6, 8.4, 1.6), w = WASH[i]
    const cls = i === 0 ? 'wm-k' : 'wm-a'
    out.push(['path', { d, fill: C.c1, ...ink, class: cls }])
    if (w) out.push(['path', { d, fill: C.shadow, 'fill-opacity': w, class: cls }])
    out.push(['path', { d, fill: url(0), class: cls }])
  }
  return out
}
