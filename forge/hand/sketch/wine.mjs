// forge/hand/sketch/wine.mjs — single clean rim (no doubled top), smooth bowl, stem and foot, one light ghost pass,
// wine surface as the moving part.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const BOWL = 'M6.6 2.7Q12 2.5 17.4 2.7C18.1 8.6 16.2 13.4 12 13.5C7.8 13.4 5.9 8.6 6.6 2.7'
const STEM = 'M12 13.6Q12.1 17.5 12 21.2'
const FOOT = 'M7.8 21.3Q12 21.05 16.2 21.3'
const BODY = BOWL + STEM + FOOT
const WINE = 'M6.9 7.2Q12 7.5 17.1 7.1'
export default function render() {
  return [
    ['path', { d: 'M9.9 11.1l3.1-2.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: ghost(STEM + FOOT, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: WINE, class: 'wm-a' }],
  ]
}
