// forge/hand/blueprint/list-ordered.mjs: numerals 1 and 2 beside three list bars, as in the line icon. The blueprint
// flavour is kept light: a faint vertical guide between numbers and bars and one small node at the end of each bar.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const node = (cx, cy) => `M${cx + 0.8} ${cy}A.8.8 0 1 0 ${cx - 0.8} ${cy}A.8.8 0 1 0 ${cx + 0.8} ${cy}`

export default function render() {
  return [
    ['path', { d: 'M9.5 1.5V22.5', ...con(0.34) }],
    ['path', { d: 'M12 6H19.4M12 12H19.4M12 18H19.4', class: 'wm-k' }],
    ['path', { d: 'M3.5 4.5L5.5 3V9M3.5 9H7.5M3.5 16.5C3.75 15.5 4.5 15 5.5 15C6.75 15 7.5 15.75 7.5 17C7.5 17.75 7.1 18 6.5 18.5L3.5 21H7.5', class: 'wm-a' }],
    ['path', { d: node(20.8, 6) + node(20.8, 12) + node(20.8, 18), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
