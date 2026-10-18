// forge/hand/rangoli/satellite.mjs — a satellite on the upper-left to lower-right diagonal: two orange solar panels
// with cell lines, a magenta-violet body with a yellow lens, a small dish at the lower left and two signal arcs.
import { col } from '../../styles/_rangoli-core.mjs'
import { sparkle } from '../../styles/_rangoli-motifs.mjs'

const N = 'satellite'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100
const S = Math.SQRT1_2
const U = [S, S], V = [-S, S]            // along the axis (upper-left to lower-right) and across it
const at = (c, u, v) => [c[0] + u * U[0] + v * V[0], c[1] + u * U[1] + v * V[1]]
const P = p => `${r2(p[0])} ${r2(p[1])}`
// rounded rectangle, half-extents a (along U) and b (along V), corner radius r
function rr(c, a, b, r) {
  const k = [at(c, -a, -b), at(c, a, -b), at(c, a, b), at(c, -a, b)]
  const toward = (p, q) => { const d = Math.hypot(q[0] - p[0], q[1] - p[1]); return [p[0] + (q[0] - p[0]) / d * r, p[1] + (q[1] - p[1]) / d * r] }
  const ent = k.map((p, i) => toward(p, k[(i + 3) % 4])), ext = k.map((p, i) => toward(p, k[(i + 1) % 4]))
  let d = `M${P(ent[0])}`
  for (let i = 0; i < 4; i++) d += `A${r} ${r} 0 0 1 ${P(ext[i])}L${P(ent[(i + 1) % 4])}`
  return d + 'Z'
}
const line = (c, u1, v1, u2, v2) => `M${P(at(c, u1, v1))}L${P(at(c, u2, v2))}`
const A = 2.6, B = 3.3

export default function render() {
  const pts = dy => { const C = [12, 12 + dy]; return { C, p1: at(C, -7.1, 0), p2: at(C, 7.1, 0) } }
  const sh = pts(0.6)
  const shadowD = rr(sh.p1, A, B, 0.9) + rr(sh.p2, A, B, 0.9) + rr(sh.C, 2.2, 2.2, 1.2)
  const { C, p1, p2 } = pts(0)
  const D = at(C, 0, 5)                          // dish rim centre, down-left of the body
  const dish = `M${P(at(D, -2.3, 0))}A2.3 1.6 45 0 1 ${P(at(D, 2.3, 0))}Z`
  const arc = (r, a1, a2) => {
    const q = t => [D[0] + r * Math.cos(t * Math.PI / 180), D[1] + r * Math.sin(t * Math.PI / 180)]
    return `M${P(q(a1))}A${r} ${r} 0 0 0 ${P(q(a2))}`
  }
  const cells = c => line(c, -A + 0.5, 0, A - 0.5, 0) + line(c, 0, -B + 0.5, 0, B - 0.5)
  const shine = c => line(c, -A + 0.6, -B + 1.2, -A + 0.6, B - 1.2)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 9, r: 16, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: shadowD, fill: col('shadow'), 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: line(C, -4.6, 0, 4.6, 0), fill: 'none', stroke: col('c4'), 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: rr(p1, A, B, 0.9) + rr(p2, A, B, 0.9), fill: url(0), class: 'wm-k' }],
    ['path', { d: cells(p1) + cells(p2), fill: 'none', stroke: col('shadow'), 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: line(C, 0, 2, 0, 3.4), fill: 'none', stroke: col('c4'), 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: dish, fill: url(1), class: 'wm-a' }],
    ['path', { d: rr(C, 2.2, 2.2, 1.2), fill: url(1), class: 'wm-k' }],
    ['circle', { cx: r2(C[0]), cy: r2(C[1]), r: 1.1, fill: col('accent'), class: 'wm-s' }],
    ['path', { d: shine(p1) + shine(p2), fill: 'none', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: arc(3.4, 175, 95) + arc(5.4, 175, 95), fill: 'none', stroke: col('accent'), 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: sparkle(19.8, 4.4, 1.8), fill: col('accent'), class: 'wm-deco' }],
  ]
}
