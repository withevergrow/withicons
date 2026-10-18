// forge/hand/sketch/candy-corn.mjs — the rounded kernel split by two bowed bands, with dense hatching on the base band,
// light hatching on the middle band and a clean white tip, so the three candy colours read in pencil.
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100} ${Math.round((+y + dy) * 100) / 100}`)
const BODY = 'M11.4 2.6Q12 2.45 12.6 2.55Q14.4 2.9 15.3 5.6L19.45 16.5Q20.6 19.4 17.4 20.65Q15.2 21.5 12 21.5Q8.8 21.5 6.6 20.65Q3.4 19.4 4.55 16.5L8.7 5.6Q9.6 2.9 12.4 2.55'
const BANDS = 'M7.2 8.85Q12 10.6 16.8 8.85M5.2 13.8Q12 16.15 18.8 13.8'
export default function render() {
  return [
    ['path', { d: 'M6.6 18.3L8.9 16.5M7.6 20.1L11.2 17.3M10.2 20.85L14.3 17.65M13.4 20.85L17 18.05M16.6 19.9L18.3 18.6' +
      'M12.8 13.4L15.2 11.55M15 13.15L16.6 11.9', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: g(BODY), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: g(BANDS, 0.2, 0.3), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ['path', { d: BODY, class: 'wm-k' }],
    ['path', { d: BANDS, class: 'wm-a' }],
  ]
}
