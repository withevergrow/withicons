// forge/hand/sketch/list-ordered.mjs — taller, heavier pencil numerals 1 and 2 (full 7u high instead of 6u squeezed
// glyphs) beside three wobbly bars, so the numbers keep their shape and contrast at 16px.
const r2 = n => Math.round(n * 100) / 100
// faint second pencil pass: the same stroke nudged by a small affine
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const BARS = [
  'M11.2 6.1Q13.6 5.8 16 5.95Q18.4 6.1 21 5.9',
  'M11.1 12.05Q13.7 11.85 16.2 12.05Q18.6 12.2 20.9 11.95',
  'M11.2 18.1Q13.5 17.9 16 18Q18.5 18.15 20.9 17.95',
]
const ONE = 'M3.1 5.4Q4.3 4.5 5.5 3.3Q5.6 6.8 5.5 10.3M3.2 10.35Q5.4 10.2 7.7 10.3'
const TWO = 'M3 15.4Q3.4 13.7 5.3 13.6Q7.6 13.6 7.65 15.8Q7.6 16.9 6.4 17.8Q4.8 19.1 3.15 20.6Q5.4 20.45 7.8 20.55'
export default function render() {
  return [
    ['path', { d: BARS.map(d => ghost(d, 0.15, -0.3)).join(''), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: ghost(ONE + TWO, -0.35, 0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: BARS.join(''), class: 'wm-k' }],
    ['path', { d: ONE + TWO, 'stroke-width': 1.45, class: 'wm-a' }],
  ]
}
