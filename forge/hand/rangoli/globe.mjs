// forge/hand/rangoli/globe.mjs — the line globe stays the main drawing: a saffron-glow disc with a violet meridian
// ellipse and equator, edged only by a ring of twelve kumkum-to-violet rangoli petals. Replaces the generated drawing,
// whose flower-like sectors hid the globe lines.
// Roles: disc c1 -> c2, petals c3 -> c4, lines c4, highlight shine. Motion: disc wm-k, petals wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { petal } from '../../styles/_rangoli-motifs.mjs'

const N = 'globe'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]

export default function render() {
  let ring = ''
  for (let i = 0; i < 12; i++) ring += petal(12, 12, -Math.PI / 2 + i * Math.PI / 6, 7.4, 11.5, 1.45)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 9, cy: 8, r: 15, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: ring, fill: url(0), class: 'wm-deco' }],
    ['circle', { cx: 12, cy: 12, r: 7.9, fill: url(1), class: 'wm-k' }],
    ['path', { d: 'M12 4.4C9.9 6.3 9 9 9 12S9.9 17.7 12 19.6C14.1 17.7 15 15 15 12S14.1 6.3 12 4.4ZM4.3 12H19.7', stroke: col('c4'), 'stroke-width': 1.3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-k' }],
    ['path', { d: 'M6.3 9.4A6.3 6.3 0 0 1 9.4 6.3', stroke: col('shine'), 'stroke-opacity': 0.7, 'stroke-width': 0.8, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
  ]
}
