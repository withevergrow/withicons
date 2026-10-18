// forge/hand/sketch/camera-off.mjs: camera body with a plain lens circle and one clean slash; no hatching.
const r2 = n => Math.round(n * 100) / 100
const ghost = (d, dx, dy, k = 0.012) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) =>
  `${r2(+x + dx + (+y - 12) * k)} ${r2(+y + dy - (+x - 12) * k)}`)
const BODY = 'M3.2 7.4Q3.1 6.6 4 6.5L7.4 6.4L9 4.3L15 4.2L16.6 6.4L20 6.5Q20.9 6.6 20.8 7.5L20.9 18.3Q20.9 19.3 20 19.3L4.1 19.4Q3.1 19.4 3.2 18.4Z'
const LENS = 'M12.2 9.6C14.2 9.7 15.6 11.1 15.5 12.9C15.5 14.7 14 16.1 12 16.1C10.1 16.1 8.6 14.7 8.6 12.9C8.6 11 10.1 9.6 12.4 9.75'
const SLASH = 'M3.4 3.2Q12 11.9 20.7 20.8'
export default function render() {
  return [
    ['path', { d: ghost(BODY, 0.3, -0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: LENS, class: 'wm-a' }],
    ['path', { d: SLASH, 'stroke-width': 1.6, class: 'wm-s' }],
  ]
}
