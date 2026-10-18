// forge/hand/engrave/text-cursor-input.mjs — text field with an I-beam cursor; the field stays open where the cursor stands, clear paper on both sides of the stem (no shadow column there), clean tapered swells that end on the round caps, and only a light hatch ramp at the field's lower-right below the dash, so the cursor leads at 16px.
const r2 = v => Math.round(v * 100) / 100
const ease = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u))
// crescent swell along a sampled centreline: pts = [[x, y, nx, ny, t]], inner edge on the stroke edge (0.65), outer edge 0.65 + t
function swell(pts) {
  const out = pts.map(([x, y, nx, ny, t]) => [x + nx * (0.65 + t), y + ny * (0.65 + t)])
  const inn = pts.map(([x, y, nx, ny]) => [x + nx * 0.65, y + ny * 0.65]).reverse()
  return 'M' + out.concat(inn.slice(1, -1)).map(([x, y]) => r2(x) + ' ' + r2(y)).join('L') + 'Z'
}
// tapered 45-degree hatch sliver from (x, y), length l, width w
function sliver(x, y, l, w) {
  const d = l / Math.SQRT2, h = w / 2 / Math.SQRT2
  const mx = x + d / 2, my = y + d / 2
  return `M${r2(x)} ${r2(y)}L${r2(mx + h)} ${r2(my - h)}L${r2(x + d)} ${r2(y + d)}L${r2(mx - h)} ${r2(my + h)}Z`
}
function rightBox() {
  const pts = [], T = 0.5
  for (let i = 0; i <= 8; i++) { const a = (-60 + 60 * i / 8) * Math.PI / 180; pts.push([20 + 2 * Math.cos(a), 9 + 2 * Math.sin(a), Math.cos(a), Math.sin(a), T * ease(i / 6)]) }
  for (let i = 0; i <= 8; i++) { const a = (90 * i / 8) * Math.PI / 180; pts.push([20 + 2 * Math.cos(a), 15 + 2 * Math.sin(a), Math.cos(a), Math.sin(a), T]) }
  for (let i = 1; i <= 6; i++) { const x = 20 - 2.5 * i / 6; pts.push([x, 17, 0, 1, T * ease((x - 17.5) / 2)]) }
  return swell(pts)
}
function stem() {
  const pts = [], T = 0.5
  for (let i = 0; i <= 10; i++) { const y = 4.8 + 14.4 * i / 10; pts.push([14.5, y, 1, 0, T * ease(Math.min(y - 4.8, 19.2 - y) / 1.4)]) }
  return swell(pts)
}
const field = [sliver(8.16, 14.01, 2.6, 0.55), sliver(7.49, 14.44, 2, 0.55), sliver(6.81, 14.86, 1.4, 0.5), sliver(6.06, 15.21, 0.9, 0.45)].join('')
const ticks = [
  // stem shadow, only between the boxes' top and bottom strokes
  'M15.7 7.53l.95.95M15.7 8.73l.95.95M15.7 9.93l.95.95M15.7 11.13l.95.95M15.7 12.33l.95.95M15.7 13.54l.95.95M15.7 14.74l.95.95M15.7 15.94l.95.95',
  // under the serifs
  'M17.48 4.49l.97.98M16.47 4.69l.96.96M17.55 21.4l.98.98M16.65 21.7l.95.95M15.44 21.69l.96.96M14.23 21.68l.97.97M13.35 22.01l.64.64',
  // right box
  'M23.18 10.2l.47.47M23.18 11.4l.47.47M23.19 12.61l.46.46M23.19 13.82l.46.45M23.2 15.02l.45.46M23.1 16.13l.55.55M22.75 16.98l.9.9M22.16 17.59l.98.98M21.4 18.04l.96.96M20.36 18.2l.95.95M19.15 18.19l.96.96M18.36 18.6l.54.54',
  // left box, stopping short of its open end
  'M10.45 18.2l.95.95M9.25 18.2l.95.95M8.04 18.2l.95.95M6.84 18.2l.95.95M5.64 18.2l.95.95M4.53 18.29l.86.86',
].join('')
export default function render() {
  return [
    ['path', { d: rightBox() + field, fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
    ['path', { d: stem(), fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['path', { d: ticks, 'stroke-width': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M11.5 17 H4 A2 2 0 0 1 2 15 V9 A2 2 0 0 1 4 7 H11.5', class: 'wm-k' }],
    ['path', { d: 'M17.5 7 H20 A2 2 0 0 1 22 9 V15 A2 2 0 0 1 20 17 H17.5', class: 'wm-k' }],
    ['path', { d: 'M5.5 12 H9', class: 'wm-a' }],
    ['path', { d: 'M12.5 3.5 H16.5 M14.5 3.5 V20.5 M12.5 20.5 H16.5', class: 'wm-a' }],
  ]
}
