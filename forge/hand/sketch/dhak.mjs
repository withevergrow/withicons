// forge/hand/sketch/dhak.mjs — horizontal barrel drum: ellipse head at left, bulging right end, X lacing and a leafy tuft on top.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M5.25 11.1L18.5 10.9C21.3 13 21.2 19.4 18.5 21.45L5.25 21.5', { class: 'wm-k' }),
    ['path', { d: 'M7.5 16.25C7.5 13.3 6.5 11.05 5.25 11.05C4 11.05 3 13.3 3 16.25C3 19.2 4 21.5 5.25 21.5C6.5 21.5 7.5 19.2 7.5 16.25Z', class: 'wm-k' }],
    ['path', { d: 'M4.6 14.4L5.6 13.4M4.5 17.8L6 16.4', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M8.6 11.2L13.5 21.3L18.4 11.1M8.6 21.4L13.5 11.2L18.4 21.3', 'stroke-width': 1.1, class: 'wm-a' }],
    ['path', { d: 'M15.4 10.8Q14.3 6.5 12.6 3M16.1 10.8Q16.4 6.5 17.9 2.6M17 10.9Q19 8.2 21.8 6.6', class: 'wm-deco' }],
  ]
}
