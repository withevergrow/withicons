// forge/hand/sketch/avatar-monster.mjs — one-eyed monster: clean blob body, two horns, big eye, simple grin, no side marks.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const body = 'M5.6 21.4Q4.9 15 5.2 11.2Q5.6 5.9 12 5.9Q18.4 5.9 18.8 11.2Q19.1 15 18.4 21.4Q12 22.2 5.6 21.4Z'
  const horns = 'M7.6 6.6L6.6 2.6L10.4 5.7M16.4 6.6L17.4 2.6L13.6 5.7'
  return [
    ['path', { d: 'M14.8 20.2L17.2 17.6M16.6 20.6L18 19', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(body + horns), ...GHOST, class: 'wm-k' }],
    ['path', { d: body + horns, class: 'wm-k' }],
    ['path', { d: 'M12 8.9a2.7 2.7 0 1 0 0.01 0Z', class: 'wm-a' }],
    ['path', { d: 'M12.4 11.6h.01', 'stroke-width': 2.4, class: 'wm-a' }],
    ['path', { d: 'M8.6 16Q12 19.2 15.4 16M12 18.3L12 16.9', class: 'wm-s' }],
  ]
}
