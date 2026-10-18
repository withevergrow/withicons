// forge/hand/rangoli/rose-bouquet.mjs — three spiral roses (c3 -> c4 heads, each with a light swirl) over a festive-glow
// wrapped cone tied with a bow, and a leaf at each side. The generated drawing fused the roses into one magenta blob;
// here each head is a clear disc with its swirl, parted by a gap.
// Motion: leaves wm-a (sway), cone wm-k, roses wm-s, swirls wm-shine.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'rose-bouquet'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const f2 = v => Math.round(v * 100) / 100
const disc = (x, y, r) => `M${f2(x - r)} ${y}a${r} ${r} 0 1 0 ${f2(2 * r)} 0a${r} ${r} 0 1 0 ${f2(-2 * r)} 0z`
const swirl = (x, y) => `M${f2(x - 0.5)} ${y}A0.5 0.5 0 0 1 ${f2(x + 0.5)} ${y}A1 1 0 0 1 ${f2(x - 1.5)} ${y}A2 2 0 0 1 ${f2(x + 2.5)} ${y}`
const ROSES = [[12, 5.4], [7.2, 10.4], [16.8, 10.4]]

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 9, cy: 12, r: 14, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: 'M5.4 12.9C3.6 13.2 2.3 14.6 2 16.6C3.9 17.1 6 16.3 7.4 14.7Z', fill: col('c4'), class: 'wm-a' }],
    ['path', { d: 'M18.6 12.9C20.4 13.2 21.7 14.6 22 16.6C20.1 17.1 18 16.3 16.6 14.7Z', fill: col('c4'), class: 'wm-a' }],
    ['path', { d: 'M8.4 14.2H15.6L13.9 21.4Q13.8 22 13.2 22H10.8Q10.2 22 10.1 21.4Z', fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M12 17.6C10.5 16.4 9.3 16.8 9.5 17.7C9.7 18.6 11.1 18.4 12 17.6C12.9 18.4 14.3 18.6 14.5 17.7C14.7 16.8 13.5 16.4 12 17.6Z', fill: col('tint'), class: 'wm-deco' }],
    ...ROSES.map(([x, y]) => ['path', { d: disc(x, y, 3.2), fill: url(1), class: 'wm-s' }]),
    ...ROSES.map(([x, y]) => ['path', { d: swirl(x, y), stroke: col('shine'), 'stroke-opacity': 0.85, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-shine' }]),
  ]
}
