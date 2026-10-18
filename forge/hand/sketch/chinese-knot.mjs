// forge/hand/sketch/chinese-knot.mjs — open diamond knot with a sparse 3x3 weave, two big side loops, a hanging loop
// on top and a tassel, so it never reads as a hatched plus or X at 16px.
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100} ${Math.round((+y + dy) * 100) / 100}`)
const KNOT = 'M12 3.5Q14.8 6.2 17.5 9Q14.8 11.8 12 14.5Q9.2 11.8 6.5 9Q9.2 6.2 12 3.5' +
  'M13.83 5.33L8.33 10.83M15.67 7.17L10.17 12.67M10.17 5.33L15.67 10.83M8.33 7.17L13.83 12.67' +
  'M6.5 9C5.4 6.2 3 5.4 2.6 7.4C2.3 8.6 2.3 9.4 2.6 10.6C3 12.6 5.4 11.8 6.5 9' +
  'M17.5 9C18.6 6.2 21 5.4 21.4 7.4C21.7 8.6 21.7 9.4 21.4 10.6C21 12.6 18.6 11.8 17.5 9' +
  'M12 3.5L12 2.6M11.2 2.2C11.2 1.2 12.8 1.2 12.8 2.2C12.8 2.8 11.2 2.8 11.2 2.2'
const TASSEL = 'M12 14.5L12 15.9M10.9 16.4L13.1 16.4M11.1 16.4L9.6 22.3M12.9 16.4L14.4 22.3M9.6 22.3L14.4 22.3M12 17.4L12 22'
export default function render() {
  return [
    ['path', { d: g(KNOT), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: KNOT, class: 'wm-k' }],
    ['path', { d: g(TASSEL), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: TASSEL, class: 'wm-a' }],
  ]
}
