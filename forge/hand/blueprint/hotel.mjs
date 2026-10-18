// forge/hand/blueprint/hotel.mjs — the drafted hotel: a tall block with a roof sign, a 2x2 window grid and an
// entrance door (replaces the bed-in-a-box, which read as a filing cabinet at 16-24px), on a ground
// line with one dimension line below like the sibling shop front.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M2 23.3H22M2 22.1V23.6M22 22.1V23.6', ...con(0.5) }],
    ['path', { d: 'M1.35 23.95L2.65 22.65M21.35 23.95L22.65 22.65', ...con(0.75, 0.5) }],
    ['path', { d: 'M5 21.5V6.5H19V21.5M2 21.5H22', class: 'wm-k' }],
    ['path', { d: 'M8.5 2.5H15.5V6.5H8.5Z', class: 'wm-s' }],
    ['path', { d: 'M7.5 8.75H10V11.25H7.5ZM14 8.75H16.5V11.25H14ZM7.5 12.75H10V15.25H7.5ZM14 12.75H16.5V15.25H14ZM10.25 21.5V17.5H13.75V21.5', class: 'wm-a' }],
  ]
}
