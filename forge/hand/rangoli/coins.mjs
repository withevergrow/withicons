// forge/hand/rangoli/coins.mjs — two coins drawn as real cylinders: a c3 -> c4 coin up left and a festive-glow
// stack of two coins below right, each with its face rim knocked out and a clear gap between them, plus a corner
// marigold. The generated drawing lost the back coin's rim, so it fused into a speech-bubble blob over the stack.
// Motion: back coin wm-a (hops, origin 8 11.5), stack wm-k, marigold wm-deco.
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'coins'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100

// back coin: face (8, 4.75) rx 6 ry 2.6, 3.75 thick; the face's front rim knocked out as a tapered band
const back = (dy = 0) => {
  const y = v => r2(v + dy)
  return `M2 ${y(4.75)}A6 2.6 0 0 1 14 ${y(4.75)}V${y(8.5)}A6 2.6 0 0 1 2 ${y(8.5)}Z` +
    `M2.8 ${y(4.75)}A5.2 2.05 0 0 0 13.2 ${y(4.75)}A5.2 3.05 0 0 1 2.8 ${y(4.75)}Z`
}
// front stack: face (15.5, 14.5) rx 6.5 ry 2.75, 4.75 thick; face rim knocked out, a seam between the two coins
const stack = (dy = 0) => {
  const y = v => r2(v + dy)
  return `M9 ${y(14.5)}A6.5 2.75 0 0 1 22 ${y(14.5)}V${y(19.25)}A6.5 2.75 0 0 1 9 ${y(19.25)}Z` +
    `M9.8 ${y(14.5)}A5.7 2.2 0 0 0 21.2 ${y(14.5)}A5.7 3.25 0 0 1 9.8 ${y(14.5)}Z` +
    `M9 ${y(16.55)}A6.5 2.75 0 0 0 22 ${y(16.55)}V${y(17.5)}A6.5 2.75 0 0 1 9 ${y(17.5)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c3')), st(1, col('c4'))]],
      ['radialGradient', { id: id(1), cx: 12.64, cy: 14, r: 15.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: back(3.5) + stack(0.5), 'fill-rule': 'evenodd', fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: back(3), 'fill-rule': 'evenodd', fill: url(0), class: 'wm-a' }],
    ['path', { d: stack(), 'fill-rule': 'evenodd', fill: url(1), class: 'wm-k' }],
    // rim light along each face's upper-left edge
    ['path', { d: 'M2.6 7.75A5.4 2.0 0 0 1 8 5.75A5.1 1.6 0 0 0 2.6 7.75Z' +
      'M9.6 14.5A5.9 2.2 0 0 1 15.5 12.3A5.6 1.8 0 0 0 9.6 14.5Z', fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
  ]
}
