// forge/hand/sketch/pandal.mjs — festival pandal: peaked canopy roof on two posts with one marigold garland swag between them.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const roof = 'M2.4 9.8L12 3.4L21.6 9.8Q12 10.4 2.4 9.8ZM12 3.4L12 1.8'
  const posts = 'M5 10.2L5.1 21M19 10.2L18.9 21M3.4 21h3.4M17.2 21h3.4'
  const swag = 'M5.2 12Q12 17.2 18.8 12'
  return [
    ['path', { d: 'M8.6 8.2L10.6 6.8M12.6 7.8L14.6 6.4', ...HATCH, class: 'wm-deco' }],
    ['path', { d: g(roof), ...GHOST, class: 'wm-k' }],
    ['path', { d: roof + posts, class: 'wm-k' }],
    ['path', { d: swag, class: 'wm-a' }],
    ['path', { d: 'M8.6 14.1h.01M12 14.8h.01M15.4 14.1h.01', 'stroke-width': 2.4, class: 'wm-a' }],
  ]
}
