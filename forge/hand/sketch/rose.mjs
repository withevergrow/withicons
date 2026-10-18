// forge/hand/sketch/rose.mjs — cupped rose bloom with an open spiral heart, straight stem and two leaves.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const cup = 'M6.8 8.2C6.3 5 8.5 3.2 12 3.2C15.5 3.2 17.7 5 17.2 8.2C16.8 11.2 14.5 12.9 12 12.9C9.5 12.9 7.2 11.2 6.8 8.2Z'
  const heart = 'M12.3 9.4Q10.9 9.6 10.5 8.3Q10.3 6.8 12 6.4Q14.2 6.2 14.5 8.4Q14.7 10.6 12.1 11.2'
  const stem = 'M12 12.9L12.1 21.6'
  return [
    ['path', { d: 'M13.6 5.6L15.4 4.6', ...HATCH, class: 'wm-deco' }],
    ['path', { d: g(cup + stem), ...GHOST, class: 'wm-k' }],
    ['path', { d: cup + heart + stem, class: 'wm-k' }],
    ['path', { d: 'M12 17.6Q8.2 17.8 6.4 14.6Q10.4 14.4 12 17.6ZM12.1 19.2Q15.8 19.4 17.6 16.4Q13.8 16.1 12.1 19.2Z', class: 'wm-a' }],
  ]
}
