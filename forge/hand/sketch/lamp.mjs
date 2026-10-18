// forge/hand/sketch/lamp.mjs — wobbly pencil table lamp: trapezoid shade with light hatching, short stem, dome base,
// each stroke doubled with a faint ghost line like the line design, replacing the tangled scribble.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const SHADE = 'M8.4 3.15Q12 2.85 15.6 3.05L19.65 12.1Q12 12.4 4.35 11.95L8.55 3.2'
const STEM = 'M12 12.4Q12.15 15.6 11.95 18.6'
const BASE = 'M6.95 21.1Q7.3 18.9 12 18.6Q16.75 18.9 17.1 21Q12 21.35 6.9 21.1'
const BODY = SHADE + STEM + BASE
export default function render() {
  return [
    ['path', { d: 'M7 10.6L9.7 6M9.6 10.7L12.6 5.4M12.5 10.7L15.1 6.4M15.2 10.7L16.7 8.2', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
  ]
}
