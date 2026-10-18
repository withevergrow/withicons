// forge/hand/sketch/variable.mjs — a curvy italic x and a two-bar equals sign, drawn like line but with a wobbly hand.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), 'stroke-width': 0.5, 'stroke-opacity': 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ...S('M2.5 8.1C4.4 6.9 5.8 7.8 6.5 9L9.5 15C10.3 16.3 11.5 17 13 16.2', { class: 'wm-k' }),
    ...S('M3.4 16.6C6 14 9.6 10.6 12.6 7.4', { class: 'wm-k' }),
    ...S('M15.9 10.1Q18.7 9.8 21.5 10.05M16.05 13.95Q18.8 14.2 21.5 13.9', { class: 'wm-a' }),
  ]
}
