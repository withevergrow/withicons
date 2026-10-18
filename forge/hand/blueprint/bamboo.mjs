// forge/hand/blueprint/bamboo.mjs — two clean jointed stalks (rounded segments split at the nodes) with two leaves.
// The guide circle is gone; the only construction is a thin dimension baseline under the stalks.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const seg = (x, y0, y1, w) => `M${x} ${y0 + 0.8}A.8.8 0 0 1 ${x + 0.8} ${y0}H${x + w - 0.8}A.8.8 0 0 1 ${x + w} ${y0 + 0.8}V${y1 - 0.8}A.8.8 0 0 1 ${x + w - 0.8} ${y1}H${x + 0.8}A.8.8 0 0 1 ${x} ${y1 - 0.8}Z`

export default function render() {
  return [
    ['path', { d: 'M7 22.8H17M7 21.7V23.3M17 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M6.35 23.45L7.65 22.15M16.35 23.45L17.65 22.15', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: seg(7, 2.5, 8.6, 3) + seg(7, 9.8, 15.6, 3) + seg(7, 16.8, 21, 3), class: 'wm-k' }],
    ['path', { d: seg(14, 10.5, 16, 3) + seg(14, 17.2, 21, 3), class: 'wm-k' }],
    ['path', { d: 'M10 9.2C10.5 5.4 13 3 17.8 2.6C17.3 6.4 14.4 8.9 10 9.2Z', class: 'wm-a' }],
    ['path', { d: 'M7 9.2C4.4 9 2.6 7.2 2.3 4.4C5.2 4.6 7 6.2 7 9.2Z', class: 'wm-a' }],
  ]
}
