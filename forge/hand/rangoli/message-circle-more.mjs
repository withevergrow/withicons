// forge/hand/rangoli/message-circle-more.mjs — a plain round speech bubble in the orange glow with a soft tail at the
// lower left, three magenta-to-violet typing dots and the corner marigold set in a moat at the upper right; the
// generated drawing ringed the bubble with petals so it read as a sun or flower, and the dots were faint cutouts.
import { col } from '../../styles/_rangoli-core.mjs'
import * as M from '../../styles/_rangoli-motifs.mjs'

const r2 = v => Math.round(v * 100) / 100
// bubble round C (radius R) with its tail at the lower left and a round notch of radius q round N (the marigold's moat)
function bubble(C, R, N, q, dx = 0, dy = 0) {
  const c = [C[0] + dx, C[1] + dy]
  const pt = a => `${r2(c[0] + R * Math.cos(a))} ${r2(c[1] + R * Math.sin(a))}`
  const p = (x, y) => `${r2(x + dx)} ${r2(y + dy)}`
  const d = Math.hypot(N[0] - C[0], N[1] - C[1])
  const phi = Math.atan2(N[1] - C[1], N[0] - C[0]), al = Math.acos((R * R + d * d - q * q) / (2 * R * d))
  // tail ends on the circle at about 120deg and 150deg; walk the rim the short way round through the top (sweep 0)
  const t0 = Math.PI * 2 / 3, t1 = Math.PI * 5 / 6
  return `M${pt(t0)}A${R} ${R} 0 0 0 ${pt(phi + al)}A${q} ${q} 0 0 1 ${pt(phi - al)}A${R} ${R} 0 0 0 ${pt(t1)}` +
    `L${p(3.1, 20.1)}Q${p(2.55, 21.45)} ${p(3.9, 20.9)}Z`
}

export default function render(icon) {
  const id = n => `wg-rangoli-${icon.name}-${n}`
  const C = [12.5, 11.5], R = 9, N = [19.7, 4.3], q = 3.55
  const [o, i, h] = M.marigold(N[0], N[1], 2.4)
  const sh = 'M' + [[C, Math.PI * 1.06], [C, Math.PI * 1.38]].map(([c, a]) => `${r2(c[0] + (R - 1.4) * Math.cos(a))} ${r2(c[1] + (R - 1.4) * Math.sin(a))}`).join(`A${R - 1.4} ${R - 1.4} 0 0 1 `)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.5, cy: 7.5, r: 20.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c1') }],
        ['stop', { offset: 0.3, 'stop-color': col('c1') }],
        ['stop', { offset: 1, 'stop-color': col('c2') }],
      ]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': col('c3') }],
        ['stop', { offset: 1, 'stop-color': col('c4') }],
      ]],
    ]],
    ['path', { d: bubble(C, R, N, q, 0.2, 0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: bubble(C, R, N, q), fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: sh, stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: M.disc(8.25, 11.5, 1.45) + M.disc(12.5, 11.5, 1.45) + M.disc(16.75, 11.5, 1.45), fill: `url(#${id(1)})`, class: 'wm-a' }],
    ['path', { d: o, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: i, fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: h, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
