// forge/hand/blueprint/sky-lantern.mjs: the hanging hexagon lantern with its hook, cross ribs and three tassels,
// drafted in linework with small nodes on the tassel ends and a dimension line under it.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const node = (cx, cy) => `M${cx + 0.7} ${cy}A.7.7 0 1 0 ${cx - 0.7} ${cy}A.7.7 0 1 0 ${cx + 0.7} ${cy}`

export default function render() {
  return [
    ['path', { d: 'M6 23.1H18M6 21.9V23.5M18 21.9V23.5', ...con(0.5) }],
    ['path', { d: 'M5.35 23.75L6.65 22.45M17.35 23.75L18.65 22.45', ...con(0.75, 0.5) }],
    ['path', { d: 'M12 3.5L18.5 7.5V12.5L12 16L5.5 12.5V7.5ZM12 2V3.5', class: 'wm-k' }],
    ['path', { d: 'M12 3.5V16M5.5 7.5H18.5M5.5 12.5H18.5', 'stroke-width': 0.9, class: 'wm-k' }],
    ['path', { d: 'M8.8 15.2L8.2 19.6M12 16V20.3M15.2 15.2L15.8 19.6', class: 'wm-a' }],
    ['path', { d: node(8.2, 20.3) + node(12, 21) + node(15.8, 20.3), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
