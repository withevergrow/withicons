// forge/hand/blueprint/layout-grid.mjs — the drafted 2x2 tile grid kept plain (the generated drawing ran chain centre
// lines through both gutters, a crosshair that crowded the tiles and read as a fifth shape at 16px): only the outer
// fillet construction and the dimension line remain, so the four tiles stand clear.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tile = (x, y) => `M${x + 1.5} ${y}H${x + 5.5}A1.5 1.5 0 0 1 ${x + 7} ${y + 1.5}V${y + 5.5}A1.5 1.5 0 0 1 ${x + 5.5} ${y + 7}H${x + 1.5}A1.5 1.5 0 0 1 ${x} ${y + 5.5}V${y + 1.5}A1.5 1.5 0 0 1 ${x + 1.5} ${y}Z`

export default function render() {
  return [
    ['path', { d: 'M3 2.1V.9M.9 3H2.1M21.93 3H23.1M21 .9V2.1M21 21.93V23.1M23.1 21H21.93M2.1 21H.9M3 23.1V21.93M3 23H21M3 21.9V23.3M21 21.9V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.65L3.65 22.35M20.35 23.65L21.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: tile(3, 3) + tile(14, 3) + tile(14, 14) + tile(3, 14), class: 'wm-k' }],
  ]
}
