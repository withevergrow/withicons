// forge/hand/blueprint/battery-charging.mjs — the drafted battery with one unbroken, mitred bolt through its open
// sides (the generated drawing cut the bolt into two loose dashes at its middle corners with four control rings and
// framed every corner with fillet marks, so the bolt crumbled at 16px): rings sit only on the bolt's two free tips,
// and the keyline and a single dimension line stay faint behind.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M21.61 14.76a10 10 0 0 1-.93 2.21m-.37.59l-.23.33m-.43.55a10 10 0 0 1-1.75 1.63m-.58.4l-.34.2m-.62.33a10 10 0 0 1-2.26.78m-.69.12l-.4.05m-.7.05a10 10 0 0 1-2.37-.21M6.22 20.16a10 10 0 0 1-1.78-1.61M4.25 5.68a10 10 0 0 1 1.73-1.66m.57-.4l.34-.21m.61-.34a10 10 0 0 1 2.25-.81m.69-.14l.4-.05M13.81 2.17a10 10 0 0 1 2.29.71m.63.31l.35.19m.59.38a10 10 0 0 1 1.79 1.58m.45.54l.24.32m.38.59a10 10 0 0 1 1 2.17', ...con(0.34) }],
    ['path', { d: 'M2 22.4H22M2 20.2V23.1M22 20.2V23.1', ...con(0.5) }],
    ['path', { d: 'M1.35 23.05L2.65 21.75M21.35 23.05L22.65 21.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M7 7H4A2 2 0 0 0 2 9V15A2 2 0 0 0 4 17H6M15 7H17A2 2 0 0 1 19 9V15A2 2 0 0 1 17 17H14', class: 'wm-k' }],
    ['path', { d: 'M22 10.5V13.5', class: 'wm-a' }],
    ['path', { d: 'M11.8 5.4L8.5 12H12.5L9.2 18.6', class: 'wm-s' }],
    ['path', { d: ring(12.5, 4) + ring(8.5, 20), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-s' }],
  ]
}
