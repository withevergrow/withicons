// forge/hand/blueprint/monitor-smartphone.mjs — the drafted monitor with a phone in front, kept plain (the generated
// drawing ringed it with six fillet-construction marks and a dimension line squeezed under the phone, a haze of ticks
// that crowded two dense outlines at 24px): only the objects remain, with one control ring on the monitor's cut
// bottom edge where it stops short of the phone.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    // monitor, its bottom edge stopping at a control ring before the phone
    ['path', { d: 'M10.43 16.5H4A2 2 0 0 1 2 14.5V5.5A2 2 0 0 1 4 3.5H18A2 2 0 0 1 20 5.5V6.5', class: 'wm-k' }],
    ['path', { d: ring(12, 16.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
    // stand
    ['path', { d: 'M7.5 16.5V20.5M4.5 20.5H10.5', class: 'wm-a' }],
    // phone with its home bar
    ['path', { d: 'M17 9.5H20A1.5 1.5 0 0 1 21.5 11V20A1.5 1.5 0 0 1 20 21.5H17A1.5 1.5 0 0 1 15.5 20V11A1.5 1.5 0 0 1 17 9.5ZM17.75 19H19.25', class: 'wm-s' }],
  ]
}
