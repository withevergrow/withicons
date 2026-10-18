// forge/hand/sketch/credit-card.mjs — straight card outline, solid magnetic stripe across the upper third, hatching only below it.
const R = (v) => Math.round(v * 100) / 100
const g = (d, dx = -0.25, dy = 0.3) => d.replace(/(-?\d*\.?\d+)\s+(-?\d*\.?\d+)/g, (_, x, y) => `${R(+x + dx)} ${R(+y + dy)}`)
const HATCH = { 'stroke-width': 0.8, 'stroke-opacity': 0.5 }
const GHOST = { 'stroke-width': 0.5, 'stroke-opacity': 0.5 }
export default function render() {
  const card = 'M4.6 4.9L19.4 4.9Q21.8 4.9 21.8 7.3L21.8 16.7Q21.8 19.1 19.4 19.1L4.6 19.1Q2.2 19.1 2.2 16.7L2.2 7.3Q2.2 4.9 4.6 4.9Z'
  return [
    ['path', { d: 'M13.2 18.2L17.4 13.6M16.2 18.2L20 14M10.4 18.2L13.6 14.6', ...HATCH, class: 'wm-k' }],
    ['path', { d: g(card), ...GHOST, class: 'wm-k' }],
    ['path', { d: card, class: 'wm-k' }],
    ['path', { d: 'M2.5 8.2L21.5 8.2L21.5 10.9L2.5 10.9Z', fill: 'currentColor', class: 'wm-a' }],
    ['path', { d: 'M5.2 15.1L9.6 15.1M5.2 17.1L7.4 17.1', class: 'wm-s' }],
  ]
}
