// forge/hand/rangoli/wreath.mjs — a lobed saffron-glow ring (leafy bumps inside and out) with three kumkum berries and a
// two-loop violet bow with a knot on the lower edge. Replaces the generated drawing whose solid purple bow read as a
// moustache and the whole thing as a face; the loops are open ribbons now.
// Roles: ring c1 -> c2, berries c3, bow c3 -> c4 with c4 knot, lip shadow, highlight shine.
// Motion: ring wm-k, bow wm-a, berries wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { disc } from '../../styles/_rangoli-motifs.mjs'

const N = 'wreath'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100
const CX = 12, CY = 10.5

// 12 overlapping leaf lobes (alternating size) round the ring
function lobes(dy) {
  let d = ''
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 6
    d += disc(r2(CX + 5.7 * Math.cos(a)), r2(CY + dy + 5.7 * Math.sin(a)), i % 2 ? 1.85 : 2.1)
  }
  return d
}
const band = dy => `M${CX} ${r2(CY + dy - 5.7)}A5.7 5.7 0 1 1 ${CX} ${r2(CY + dy + 5.7)}A5.7 5.7 0 1 1 ${CX} ${r2(CY + dy - 5.7)}Z`

export default function render() {
  const berry = [[6.9, 7.6], [15.6, 5.3], [17.4, 12.9]]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 8, cy: 5, r: 18, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: lobes(0.7), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: band(0.7), stroke: col('shadow'), 'stroke-opacity': 0.5, 'stroke-width': 3, class: 'wm-shadow' }],
    ['path', { d: lobes(0), fill: url(1), class: 'wm-k' }],
    ['path', { d: band(0), stroke: url(1), 'stroke-width': 3, class: 'wm-k' }],
    ...berry.map(([x, y]) => ['circle', { cx: x, cy: y, r: 1.2, fill: col('c3'), class: 'wm-deco' }]),
    ...berry.map(([x, y]) => ['circle', { cx: r2(x - 0.35), cy: r2(y - 0.35), r: 0.35, fill: col('shine'), class: 'wm-deco' }]),
    ['path', { d: 'M11 19C9.2 15.4 4.4 15.6 4.4 19.2C4.4 22.6 9.2 22.6 11 19ZM13 19C14.8 15.4 19.6 15.6 19.6 19.2C19.6 22.6 14.8 22.6 13 19Z', stroke: url(0), 'stroke-width': 1.8, 'stroke-linejoin': 'round', fill: 'none', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 19, r: 1.9, fill: col('c3'), class: 'wm-a' }],
    ['circle', { cx: 11.4, cy: 18.4, r: 0.5, fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: 'M6.2 6.6A6.4 6.4 0 0 1 9.6 3.4', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
