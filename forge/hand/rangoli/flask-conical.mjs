// forge/hand/rangoli/flask-conical.mjs: an upright conical flask: orange glass outline with a lip, neck and a wide
// rounded base, pale glass inside, and a c3 -> c4 liquid with a wavy surface carrying a small marigold and bubbles.
// The generated drawing was a solid orange blob with petals under it, so it did not read as a flask.
// Motion: liquid wm-a, glass wm-k, marigold/bubbles wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'
import { marigold } from '../../styles/_rangoli-motifs.mjs'

const NAME = 'flask-conical'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const body = 'M9.5 3.4V9L4.4 17.9A1.9 1.9 0 0 0 6 20.8H18A1.9 1.9 0 0 0 19.6 17.9L14.5 9V3.4'
const liquid = 'M6.75 13.9C8.5 12.7 10.2 15.1 12 13.9C13.8 12.7 15.5 15.1 17.25 13.9L19.6 17.9A1.9 1.9 0 0 1 18 20.8H6A1.9 1.9 0 0 1 4.4 17.9Z'

export default function render() {
  const [o, i, h] = marigold(12, 17.6, 1.9)
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 8.6, cy: 7, r: 20.6, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
      ['linearGradient', { id: id(1), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
    ]],
    ['path', { d: body + 'Z', fill: col('shadow'), 'fill-opacity': 0.5, stroke: col('shadow'), 'stroke-opacity': 0.5, 'stroke-width': 2, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: body + 'Z', fill: col('tint'), class: 'wm-k' }],
    ['path', { d: liquid, fill: url(1), class: 'wm-a' }],
    ['path', { d: body, stroke: url(0), 'stroke-width': 2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.8 3.4H16.2', stroke: url(0), 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: o, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: i, fill: url(0), class: 'wm-deco' }],
    ['path', { d: h, fill: col('shadow'), class: 'wm-deco' }],
    ['circle', { cx: 8.6, cy: 18.4, r: 0.55, fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-deco' }],
    ['circle', { cx: 15.6, cy: 16.4, r: 0.7, fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-deco' }],
    ['circle', { cx: 14.6, cy: 19.3, r: 0.45, fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-deco' }],
  ]
}
