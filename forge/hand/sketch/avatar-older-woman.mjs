// forge/hand/sketch/avatar-older-woman.mjs — bun on top, two plain glasses rings, open face with a gentle smile.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const bun = 'M12 1.5a2.1 2.1 0 1 0 0.01 0Z'
  const head = 'M6.6 10.4Q6.2 5.4 12 5.4Q17.8 5.4 17.4 10.4Q17.6 17.2 12 17.2Q6.4 17.2 6.6 10.4Z'
  const fringe = 'M6.8 9Q10.4 8.6 12 6.2Q13.6 8.6 17.2 9'
  const body = 'M4.8 22.4Q4.8 19.2 12 19.2Q19.2 19.2 19.2 22.4'
  return [
    ['path', { d: 'M14.2 6.4L15.4 7.4M5.6 21.4L7 20.2M17 21.4L18.4 20.2', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + fringe + body, class: 'wm-k' }],
    ['path', { d: bun, class: 'wm-a' }],
    ['path', { d: 'M9.4 10.2a1.6 1.6 0 1 0 0.01 0ZM14.6 10.2a1.6 1.6 0 1 0 0.01 0ZM11 11.8L13 11.8', 'stroke-width': 1.1, class: 'wm-s' }],
    ['path', { d: 'M10 14.8Q12 16.4 14 14.8', class: 'wm-k' }],
  ]
}
