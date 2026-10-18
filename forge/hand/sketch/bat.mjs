// forge/hand/sketch/bat.mjs — broad wings with two deep, wide scallops each and a plain eared body, so the wing
// notches stay open at 16px instead of closing into a ragged bar.
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${Math.round((+x + dx) * 100) / 100} ${Math.round((+y + dy) * 100) / 100}`)
const WINGS = 'M13.9 9.8Q17.6 9.1 22.1 5.4M22 5.1Q22.6 10.2 21.1 14.1Q19.4 10.9 17.6 14.6Q15.9 11.5 13.9 15.2' +
  'M10.1 9.8Q6.4 9.1 1.9 5.4M2 5.1Q1.4 10.2 2.9 14.1Q4.6 10.9 6.4 14.6Q8.1 11.5 10.1 15.2'
const BODY = 'M10 6.6L11.3 8.55Q12 8.5 12.7 8.55L14 6.6Q14.05 10.6 14 14.4Q13.95 17.5 12 17.55Q10.05 17.5 10 14.4Q9.95 10.6 10.05 6.9'
export default function render() {
  return [
    ['path', { d: 'M18.3 10.7L19.6 9.7M12.5 16.3L13.3 15.6', 'stroke-width': 0.8, 'stroke-opacity': 0.5 }],
    ['path', { d: g(WINGS), 'stroke-width': 0.5, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: WINGS, class: 'wm-k' }],
    ['path', { d: BODY, class: 'wm-a' }],
  ]
}
