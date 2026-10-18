// forge/hand/blueprint/folder-open.mjs — the drafted open folder without the keyline circle (the generated drawing ran
// the dashed Ø20 guide across the folder's top and right side, where it tangled with the tab and the open flap and blurred
// the flap's edge at 16px): the back panel and the open front flap at full weight, a ring on the tab, the corner fillet
// construction and the width dimension kept below, clear of the drawing.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    // fillet construction and the width dimension
    ['path', { d: 'M3 4.32V2.9M.9 5H2.32M18.67 21.11L18.41 22.01M21.1 20H20.14M21.86 11.5H23.28M22.09 9.49L21.6 11.15M19.68 7H21.1M19 4.9V6.32M3 22.4H20.98M3 20.7V23.1M20.98 20.2V23.1', ...con(0.5) }],
    ['path', { d: 'M2.35 23.05L3.65 21.75M20.33 23.05L21.63 21.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // open front flap (swings on the hinge at 5,20 with the back panel)
    ['path', { d: 'M5 20L7.18 12.58A1.5 1.5 0 0 1 8.62 11.5H19.5A1.5 1.5 0 0 1 20.93 13.42L19.42 18.56A2 2 0 0 1 17.5 20Z', class: 'wm-k' }],
    // back panel with its tab, opened at the tab's ring
    ['path', { d: 'M5 20A2 2 0 0 1 3 18V7A2 2 0 0 1 5 5H7.43M10.11 6.11L11 7H17A2 2 0 0 1 19 9V11.5', class: 'wm-a' }],
    ['path', { d: ring(9, 5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
