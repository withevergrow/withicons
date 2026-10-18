// forge/hand/engrave/library.mjs — three-book shelf; each spine is hatched on its own ramp, the leaning book stands 0.5u further right with clear paper (no swell, no shadow ticks) in the wedge beside book 2, the shelf swell ends inside both round caps, and book 1's corner swell stops above book 2's top, so the spines stay separate at 16px.
const r2 = v => Math.round(v * 100) / 100
const ease = u => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u))
// crescent swell along a sampled centreline: pts = [[x, y, nx, ny, t]], inner edge on the stroke edge (0.65), outer edge 0.65 + t
function swell(pts) {
  const out = pts.map(([x, y, nx, ny, t]) => [x + nx * (0.65 + t), y + ny * (0.65 + t)])
  const inn = pts.map(([x, y, nx, ny]) => [x + nx * 0.65, y + ny * 0.65]).reverse()
  return 'M' + out.concat(inn.slice(1, -1)).map(([x, y]) => r2(x) + ' ' + r2(y)).join('L') + 'Z'
}
// shift every absolute moveto of a relative-segment path by dx
const shiftM = (d, dx) => d.replace(/M(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `M${r2(+x + dx)} ${y}`)
const DX = 0.5 // book 3 moved right to open the wedge beside book 2
function shelf() {
  const pts = []
  for (let i = 0; i <= 16; i++) { const x = 3 + 18 * i / 16; pts.push([x, 20.5, 0, 1, 0.5 * ease(Math.min(x - 3, 21 - x) / 1.2)]) }
  return swell(pts)
}
function book1Corner() {
  const pts = []
  for (let i = 0; i <= 6; i++) { const a = (-60 + 60 * i / 6) * Math.PI / 180; pts.push([7.5 + Math.cos(a), 4.5 + Math.sin(a), Math.cos(a), Math.sin(a), 0.35 * ease(i / 4)]) }
  for (let i = 1; i <= 3; i++) { const y = 4.5 + 0.6 * i / 3; pts.push([8.5, y, 1, 0, 0.35 * ease((5.1 - y) / 0.6)]) }
  return swell(pts)
}
const hatch1 = 'M5.79 10.19l1.19 1.31.45.33-.33-.45zM4.96 11.34l1.98 2.18.49.29-.29-.49zM4.57 12.93l.33.44 1.99 2.18.54.24-.24-.54-2.18-1.99zM4.57 14.91l.29.48 1.99 2.18.58.2-.2-.58-2.17-1.99zM4.57 16.89l.25.53 1.68 1.85.61.16-.16-.61-1.85-1.68z'
const hatch2 = 'M9.96 12.38l1.02 1.14.45.33-.33-.45zM9.57 13.97l.33.44 1.03 1.14.5.28-.28-.5-1.13-1.03zM9.57 15.95l.28.5 1.02 1.14.56.22-.22-.56-1.14-1.02z'
const book3Swell = shiftM('M17.78 6.82l.21.25.25.52 2.99 11.18.04.32-.02.32-.09.31-.15.29-.19.25-.5-.5.07-.34.21-.55-.02-.58-2.99-11.16-.23-.48-.08-.33z', DX)
const hatch3 = shiftM('M15.82 12.29l1.61 1.81.49.29-.3-.48zM15.3 13.76l.33.44 2.44 2.7.57.2-.2-.58-2.7-2.43zM16.02 16.46l.25.53 1.44 1.61.62.17-.17-.62-1.61-1.44z', DX)
const ticks3 = shiftM('M18.77 9.4l.93.93M19.21 11.04l.93.93M19.65 12.68l.93.93M20.09 14.32l.94.94M20.53 15.96l.94.94M20.97 17.61l.94.93M21.32 19.15l.95.96', DX)
const ticksShelf = 'M22.46 21.5l.98.98M21.46 21.7l.95.95M20.26 21.7l.95.95M19.06 21.7l.95.95M17.85 21.7l.95.95M16.65 21.7l.95.95M15.45 21.7l.95.95M14.25 21.7l.95.95M13.05 21.7l.95.95M11.84 21.7l.95.95M10.64 21.7l.95.95M9.44 21.7l.95.95M8.24 21.7l.95.95M7.03 21.7l.95.95M5.83 21.7l.95.95M4.63 21.7l.95.95'
const b = (x, y) => `${r2(x + DX)} ${y}`
const book3 = `M${b(16.97, 20.24)} L${b(19.38, 19.59)} A1 1 0 0 0 ${b(20.09, 18.37)} L${b(17.11, 7.26)} A1 1 0 0 0 ${b(15.89, 6.55)} L${b(13.47, 7.2)} A1 1 0 0 0 ${b(12.76, 8.43)} L${b(15.74, 19.53)} A1 1 0 0 0 ${b(16.97, 20.24)} Z`
export default function render() {
  return [
    ['path', { d: shelf() + book1Corner() + hatch1 + hatch2 + book3Swell, fill: 'currentColor', stroke: 'none', class: 'wm-k' }],
    ['path', { d: hatch3, fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    ['path', { d: ticks3 + ticksShelf, 'stroke-width': 0.3, class: 'wm-shadow' }],
    ['path', { d: 'M2.5 20.5 H21.5', class: 'wm-k' }],
    ['path', { d: 'M3.5 20.5 V4.5 A1 1 0 0 1 4.5 3.5 H7.5 A1 1 0 0 1 8.5 4.5 V20.5', class: 'wm-k' }],
    ['path', { d: 'M8.5 7.5 A1 1 0 0 1 9.5 6.5 H11.5 A1 1 0 0 1 12.5 7.5 V20.5', class: 'wm-k' }],
    ['path', { d: book3, class: 'wm-k' }],
  ]
}
