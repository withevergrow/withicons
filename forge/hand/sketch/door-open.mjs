// forge/hand/sketch/door-open.mjs: clean frame, a leaf hinged flush on the left jamb swung open in perspective,
// one knob and a light floor line; sparse hatch inside the open gap only.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const FRAME = 'M5 21Q4.9 12 5.1 3Q12 2.9 18.9 3Q19.1 12 19 21'
const FLOOR = 'M2.5 21.1Q12 20.9 21.5 21.1'
const LEAF = 'M5.1 3Q8.6 4.1 12.1 5.2Q12 13.1 12.1 21Q8.6 21 5 21'
const BODY = FRAME + FLOOR + LEAF
const HATCH = 'M14 8.5L17.5 6M14 13L17.5 10.5M14 17.5L17.5 15'
export default function render() {
  return [
    ['path', { d: HATCH, 'stroke-width': 0.6, 'stroke-opacity': 0.45, class: 'wm-deco' }],
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: 'M10.2 12.6Q10.3 13.4 10.2 14.2', class: 'wm-a' }],
  ]
}
