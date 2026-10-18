// forge/hand/blueprint/ungroup.mjs — two boxes that have just left their group: the old group frame is left behind as four
// corner brackets (thin construction) and the boxes sit apart on the diagonal, one per opposite corner, with clear paper
// between them and the brackets. The generated drawing ran a dimension line through the gap and read as two stray shapes.
const ACCENT = 'var(--with-accent, currentColor)'
const con = (op, w = 0.45) => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': w, 'stroke-opacity': op, class: 'wm-deco' })
const box = (x0, y0, x1, y1, r = 1.5) =>
  `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render() {
  return [
    // the old group frame: four corner brackets
    ['path', { d: 'M2 5V2H5M19 2H22V5M22 19V22H19M5 22H2V19', ...con(0.75, 0.6) }],
    ['path', { d: box(4.5, 4.5, 11.5, 11.5), class: 'wm-k' }],
    ['path', { d: box(12.5, 12.5, 19.5, 19.5), class: 'wm-a' }],
  ]
}
