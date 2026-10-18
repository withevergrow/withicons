// forge/hand/rangoli/avatar-koala.mjs — a koala face with two oversized round ears and cream fluff, small eyes and a big
// dark pear nose: the generated drawing had bear-sized ears and a small open muzzle, so it read as the bear.
import { col } from '../../styles/_rangoli-core.mjs'

const N = 'avatar-koala'
const id = n => `wg-rangoli-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const disc = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0z`
const head = dy => disc(5.5, 8.7 + dy, 4.2) + disc(18.5, 8.7 + dy, 4.2) + disc(12, 14.2 + dy, 6.8)
const line = { fill: 'none', 'stroke-width': 0.6, 'stroke-linecap': 'round', stroke: col('shine'), 'stroke-opacity': 0.7, class: 'wm-shine' }

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.4, cy: 9.4, r: 21.5, gradientUnits: 'userSpaceOnUse' }, [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    // depth lip
    ['path', { d: head(0.5), fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    // ears, head
    ['path', { d: disc(5.5, 8.7, 4.2) + disc(18.5, 8.7, 4.2), fill: url(0), class: 'wm-k' }],
    ['path', { d: disc(5.2, 8.6, 2.4) + disc(18.8, 8.6, 2.4), fill: col('tint'), class: 'wm-k' }],
    ['path', { d: disc(12, 14.2 + 0.35, 6.8), fill: col('shadow'), 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: disc(12, 14.2, 6.8), fill: url(0), class: 'wm-k' }],
    // eyes
    ['circle', { cx: 9, cy: 12.6, r: 0.95, fill: col('ink'), class: 'wm-a' }],
    ['circle', { cx: 15, cy: 12.6, r: 0.95, fill: col('ink'), class: 'wm-a' }],
    // big nose
    ['path', { d: 'M12 12.5C13.35 12.5 14.2 13.85 14.2 15.4C14.2 17.15 13.25 18.3 12 18.3C10.75 18.3 9.8 17.15 9.8 15.4C9.8 13.85 10.65 12.5 12 12.5Z', fill: col('ink'), class: 'wm-k' }],
    ['ellipse', { cx: 11.2, cy: 14.2, rx: 0.42, ry: 0.7, fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
    // shine
    ['path', { d: 'M6.6 12.4A5.9 5.9 0 0 1 9.4 8.9', ...line }],
    ['path', { d: 'M2.15 8.2A3.4 3.4 0 0 1 4 5.6', ...line }],
  ]
}
