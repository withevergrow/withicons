// forge/hand/sketch/puzzle-piece.mjs — clean jigsaw piece with two equal knobs (top, right).
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), "stroke-width": 0.5, "stroke-opacity": 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M4.5 8.5L9.6 8.5C9 7.9 8.8 7.2 8.8 6.6C8.8 5.2 10.2 4 11.8 4C13.4 4 14.8 5.2 14.8 6.6C14.8 7.2 14.6 7.9 14 8.5L18.5 8.5L18.5 12.4C19.1 11.8 19.8 11.6 20.4 11.6C21.2 11.6 22 12.8 22 14.2C22 15.6 21.2 16.8 20.4 16.8C19.8 16.8 19.1 16.6 18.5 16L18.5 20L4.5 20Z', { class: 'wm-k', 'stroke-width': 1.5 }),
  ]
}
