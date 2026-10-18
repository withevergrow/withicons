// forge/hand/blueprint/barcode.mjs — a drafted barcode of five bars in thin and double widths (the generated drawing
// had four bars, two hollow outlines and two thin rods capped with control rings, so it read as pillars or candlesticks):
// the wide bars are two pen strokes laid edge to edge, the gaps stay open enough to read at 16px, there are no rings on
// the bars, and only the dimension line under the code shows the drafting.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })

export default function render() {
  return [
    ['path', { d: 'M5 21H19M5 20.4V21.7M19 20.4V21.7', ...con(0.5) }],
    ['path', { d: 'M4.35 21.65L5.65 20.35M18.35 21.65L19.65 20.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M5 5.5V18.5M8 5.5V18.5M9 5.5V18.5M12 5.5V18.5M15 5.5V18.5M16 5.5V18.5M19 5.5V18.5', class: 'wm-k' }],
  ]
}
