// forge/hand/sketch/heart-pulse.mjs — a clean hand-inked heart with one clear pulse line and only a hint of hatching.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M12 20.5C10.2 19.4 3 15.2 3.05 8.9C3 6.2 5.1 4.05 7.8 4C9.6 4.05 11.1 5 12 6.5C12.9 5 14.4 4.05 16.2 4C18.9 4.05 21 6.2 20.95 8.9C21 15.2 13.8 19.4 12 20.5Z', { class: 'wm-k' }),
    ['path', { d: 'M15.8 8.4L17.8 6.2M16.8 9.2L18.7 7.3', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-k' }],
    ['path', { d: 'M3.75 12.05L7.5 11.95L9 9.5L12 15.5L13.75 12L20.25 12.05', 'stroke-width': 1.5, class: 'wm-a' }],
  ]
}
