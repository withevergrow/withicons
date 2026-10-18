// forge/hand/sketch/satellite.mjs — diagonal satellite: diamond body, two gridded solar panels on the diagonal, dish and signal arc at lower-left.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M10.4 10.8L13.25 13.6L16.1 10.7L13.3 7.9Z', { class: 'wm-k' }),
    ...S('M7.95 9.7L4.1 5.8L8.3 1.6L12.2 5.45Z', { class: 'wm-s' }),
    ...S('M14.3 16.05L18.2 19.9L22.4 15.7L18.55 11.8Z', { class: 'wm-s' }),
    ['path', { d: 'M6 7.75L10.25 3.5M16.3 18L20.5 13.8', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-s' }],
    ['path', { d: 'M14.7 12.15L16.4 13.9M11.8 9.35L10.1 7.6', class: 'wm-a' }],
    ['path', { d: 'M6.7 13.4A3.25 3.25 0 0 0 10.6 17.3M11.85 12.15L9.9 14.1', class: 'wm-a' }],
    ['path', { d: 'M3.7 13.9A6 6 0 0 0 10.1 20.3', class: 'wm-a' }],
  ]
}
