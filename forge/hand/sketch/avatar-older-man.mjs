// forge/hand/sketch/avatar-older-man.mjs — a calm bald head with two side tufts, two eye dots and a thick moustache over a pair of shoulders.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const head = 'M6.7 10.6Q6.4 4.9 12 4.9Q17.6 4.9 17.3 10.6Q17.5 16.8 12 16.8Q6.5 16.8 6.7 10.6Z'
  const body = 'M4.8 22.4Q4.8 19.4 12 19.4Q19.2 19.4 19.2 22.4'
  return [
    ['path', { d: 'M14.2 6.6L15.4 7.6M5.6 21.4L7 20.2M17 21.4L18.4 20.2', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(head + body), ...GHOST, class: 'wm-k' }],
    ['path', { d: head + body, class: 'wm-k' }],
    ['path', { d: 'M7.3 7.4Q4.7 8 4.6 10.6Q4.6 12 6.4 12.6M16.7 7.4Q19.3 8 19.4 10.6Q19.4 12 17.6 12.6', class: 'wm-a' }],
    ['path', { d: 'M9.5 10.2L9.6 10.2M14.5 10.2L14.6 10.2', 'stroke-width': 1.8, class: 'wm-s' }],
    ['path', { d: 'M8.9 14.6Q10.4 12.8 12 13.8Q13.6 12.8 15.1 14.6Q13.6 15.4 12 14.8Q10.4 15.4 8.9 14.6Z', 'stroke-width': 1.1, class: 'wm-k' }],
  ]
}
