// forge/hand/sketch/panel-right.mjs — framed window with a straight divider and a hatched right pane.
const G = (d, dx = 0.3, dy = 0.3) => d.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (m, x, y) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`)
const S = (d, a = {}) => [['path', { d: G(d), "stroke-width": 0.5, "stroke-opacity": 0.5, ...(a.class ? { class: a.class } : {}) }], ['path', { d, ...a }]]
export default function render() {
  return [
    ['path', { d: 'M16.2 8.8l3.6-2.9M16.2 13.2l3.6-2.9M16.2 17.6l3.6-2.9M17.2 20.2l2.6-2.1', 'stroke-width': 0.8, 'stroke-opacity': 0.5, class: 'wm-a' }],
    ...S('M5 3Q12 2.95 19 3Q21 3.05 21 5Q21.05 12 21 19Q20.95 21 19 21Q12 21.05 5 21Q3 20.95 3 19Q2.95 12 3 5Q3.05 3 5 3ZM15 3L15 21', { class: 'wm-k' }),
  ]
}
