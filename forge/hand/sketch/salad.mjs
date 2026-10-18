// forge/hand/sketch/salad.mjs — footed bowl with three readable ingredients: a leaf, a halved egg and a tomato.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const bowl = 'M2.6 12.6Q12 13.1 21.4 12.6M3 12.8Q3.5 19 9 19.6L15 19.6Q20.5 19 21 12.8M9 19.7L9.4 21.5L14.6 21.5L15 19.7'
  const leaf = 'M4.2 12Q2.8 7.4 6.6 4.4Q9.4 7.2 8.6 12M6.5 6.2L6.4 11'
  const egg = 'M11.6 12.1C9.2 12.1 8.9 9.6 9.5 7.6C10 5.6 11 4.8 11.6 4.8C12.2 4.8 13.2 5.6 13.7 7.6C14.3 9.6 14 12.1 11.6 12.1Z'
  const tom = 'M17.8 12.2C15.3 12.2 15 8.8 17.8 7.7C20.6 8.8 20.3 12.2 17.8 12.2ZM16.5 7.9L17.8 8.8L19.1 7.9'
  return [
    ['path', { d: 'M5.6 15.6L7.2 14.4M7.6 17.6L9.6 16M11 18.4L13.6 16.2', ...HATCH, class: 'wm-deco' }],
    ['path', { d: g(bowl), ...GHOST, class: 'wm-k' }],
    ['path', { d: bowl, class: 'wm-k' }],
    ['path', { d: leaf + egg + tom, class: 'wm-a' }],
    ['path', { d: 'M11.6 9.6h.01', 'stroke-width': 2.2, class: 'wm-a' }],
  ]
}
