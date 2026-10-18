// forge/hand/sketch/thermometer.mjs — straight-sided tube flowing into a round bulb, a mercury line and three level ticks.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M6.5 14L6.6 5.6Q6.6 3.1 9 3.05Q11.4 3.1 11.45 5.6L11.5 13.9A4 4 0 1 1 6.5 14Z', { class: 'wm-k' }),
    ['path', { d: 'M9 15.2L9 8.8', 'stroke-width': 1.5, class: 'wm-k' }],
    ['path', { d: 'M6.9 17.9L8.7 16.4M7.6 19.7L10.4 17.5', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M15.4 5.1L19.6 5M15.4 9L18 9.05M15.4 13L19.5 12.9', class: 'wm-a' }],
  ]
}
