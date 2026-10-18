// forge/hand/rangoli/check-square.mjs — a clean festive-glow checkbox with a bold knocked-out tick and no corner
// ornament. The generated drawing moated a sparkle into the top-right corner, which nicked the box and turned into a
// stray speck at 16px; the tick is also a touch heavier here so it stays open at small sizes.
// Recipe as the generator: depth lip (shadow 0.5), body c1 -> c2 radial glow from the upper left, rim shine (0.7).
import { col } from '../../styles/_rangoli-core.mjs'

const NAME = 'check-square'
const id = n => `wg-rangoli-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
const r2 = v => Math.round(v * 100) / 100

// box 2..22 (r 3) with the tick knocked out (round caps, round outer join), shifted down by dy for the lip
const box = (dy = 0) => {
  const y = v => r2(v + dy)
  return `M5 ${y(2)}H19A3 3 0 0 1 22 ${y(5)}V${y(19)}A3 3 0 0 1 19 ${y(22)}H5A3 3 0 0 1 2 ${y(19)}V${y(5)}A3 3 0 0 1 5 ${y(2)}Z` +
    `M8.53 ${y(11.72)}L10.72 ${y(13.91)}L15.44 ${y(8.76)}A1.1 1.1 0 0 1 17.06 ${y(10.24)}L11.56 ${y(16.24)}` +
    `A1.1 1.1 0 0 1 9.97 ${y(16.28)}L6.97 ${y(13.28)}A1.1 1.1 0 0 1 8.53 ${y(11.72)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 7.6, cy: 6.4, r: 25.2, gradientUnits: 'userSpaceOnUse' },
        [st(0, col('c1')), st(0.3, col('c1')), st(1, col('c2'))]],
    ]],
    ['path', { d: box(0.5), 'fill-rule': 'evenodd', fill: col('shadow'), 'fill-opacity': 0.5, class: 'wm-shadow' }],
    ['path', { d: box(), 'fill-rule': 'evenodd', fill: url(0), class: 'wm-k' }],
    // the tick on its own (wm-a, motion moves it), bold and filling the knockout
    ['path', { d: 'M7.75 12.5L10.75 15.5L16.25 9.5', fill: 'none', stroke: col('shine'), 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    // rim light just inside the upper-left edge, tapering out along the top and the left side
    ['path', { d: 'M2.5 13.6V5A2.5 2.5 0 0 1 5 2.5H13.6L13.1 2.95H5.2A2.25 2.25 0 0 0 2.95 5.2V13.1Z', fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }],
  ]
}
