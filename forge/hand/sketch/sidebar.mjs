// forge/hand/sketch/sidebar.mjs — one clean rounded panel, one straight divider at ~35%, hatch only in the side column.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const frame = 'M6 4.2Q12 3.9 18 4.1Q20.4 4.2 20.4 6.6L20.3 17.5Q20.2 19.9 18 19.9L6.1 20.1Q3.7 20.1 3.7 17.8L3.8 6.5Q3.8 4.3 6 4.2Z'
  return [
    ['path', { d: 'M5.4 9.6L7.6 7.8M5.4 13.4L7.6 11.6M5.4 17.2L7.6 15.4', ...HATCH, class: 'wm-deco' }],
    ['path', { d: frame, class: 'wm-k' }],
    ['path', { d: 'M9.3 4.3L9.1 19.9', class: 'wm-k' }],
  ]
}
