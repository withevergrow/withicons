// forge/hand/sketch/broom.mjs — a diagonal push-broom: long handle, a banded collar and a wide flared bristle head with
// three clear bristle strokes and hachure, so it reads as a broom (not a stick with a tuft) at 16px; no end ticks.
const A = Math.PI / 4, C = Math.cos(A), S = Math.sin(A)
const r2 = v => Math.round(v * 100) / 100
// draw upright around (12,12), then turn 45deg clockwise
const R = (d, dx = 0, dy = 0) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => {
  const u = +x - 12, v = +y - 12.2
  return `${r2(12.3 + u * C - v * S + dx)} ${r2(11.4 + u * S + v * C + dy)}`
})
const HANDLE = 'M12 1.2L12 10.4'
const COLLAR = 'M9.9 10.4L14.1 10.4L14.3 13L9.7 13Z'
const HEAD = 'M9.7 13Q8 16.5 6.4 21.2Q12 22.2 17.6 21.2Q16 16.5 14.3 13'
const BRISTLES = 'M10.9 14.4L9.6 20.6M12 14.4L12 21M13.1 14.4L14.4 20.6'
const HATCH = 'M8.6 18.4L10.5 15.3M7.7 20.6L10.2 16.8M15.3 18.4L13.5 15.3M16.3 20.6L13.8 16.8'
export default function render() {
  return [
    ['path', { d: R(HATCH), 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: R(HANDLE + COLLAR + HEAD, -0.25, 0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: R(HANDLE), class: 'wm-a' }],
    ['path', { d: R(COLLAR + HEAD + BRISTLES), class: 'wm-k' }],
  ]
}
