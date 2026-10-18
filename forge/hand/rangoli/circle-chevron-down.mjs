// forge/hand/rangoli/circle-chevron-down.mjs — a glowing orange disc with one bold magenta-to-violet chevron pointing
// down and the style's corner marigold set in a moat at the upper right; the generated drawing wrapped the disc in a
// petal ring that read as a sun burst and knocked the chevron out as a faint cutout, so the glyph got lost.
import { col } from '../../styles/_rangoli-core.mjs'
import * as M from '../../styles/_rangoli-motifs.mjs'

const r2 = v => Math.round(v * 100) / 100
const pt = (c, r, a) => `${r2(c[0] + r * Math.cos(a))} ${r2(c[1] + r * Math.sin(a))}`
// a disc of radius R round C with a round notch of radius q round N (the marigold's moat)
function notched(C, R, N, q, dx = 0, dy = 0) {
  const c = [C[0] + dx, C[1] + dy], d = Math.hypot(N[0] - C[0], N[1] - C[1])
  const phi = Math.atan2(N[1] - C[1], N[0] - C[0]), al = Math.acos((R * R + d * d - q * q) / (2 * R * d))
  return `M${pt(c, R, phi - al)}A${R} ${R} 0 1 0 ${pt(c, R, phi + al)}A${q} ${q} 0 0 1 ${pt(c, R, phi - al)}Z`
}

export default function render(icon) {
  const id = n => `wg-rangoli-${icon.name}-${n}`
  const C = [12, 12], R = 9, N = [19.2, 4.8], q = 3.55
  const [o, i, h] = M.marigold(N[0], N[1], 2.4)
  const a0 = Math.PI * 1.08, a1 = Math.PI * 1.4
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
    ['path', { d: notched(C, R, N, q, 0.2, 0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: notched(C, R, N, q), fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: `M${pt(C, R - 1.4, a0)}A${R - 1.4} ${R - 1.4} 0 0 1 ${pt(C, R - 1.4, a1)}`, stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.75 9.9L12 14.15L16.25 9.9', stroke: `url(#${id(1)})`, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: o, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: i, fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: h, fill: col('shadow'), class: 'wm-deco' }],
  ]
}
