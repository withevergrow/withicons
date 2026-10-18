// forge/hand/blueprint/sort.mjs — the drafted sort arrow with one unbroken mitred head (the generated drawing hollowed
// the tip with a control ring, so the head fell apart into a detached left barb and a long right barb at 16px): rings
// stay on the tail and the two barb ends, the shaft stops inside the V, and the shrinking rows keep one ring on the top row.
const ACCENT = 'var(--with-accent, currentColor)'
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`
const node = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M2 22.4H21M2 20.2V23.1M21 20.2V23.1', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }],
    ['path', { d: 'M1.35 23.05L2.65 21.75M20.35 23.05L21.65 21.75', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M13.5 5H19.43M13.5 12H18.5M13.5 19H16', class: 'wm-k' }],
    ['path', { d: ring(21, 5), ...node('wm-k') }],
    ['path', { d: 'M6 5.58V19M3.11 17.11L6 20L8.89 17.11', class: 'wm-a' }],
    ['path', { d: ring(6, 4) + ring(2, 16) + ring(10, 16), ...node('wm-a') }],
  ]
}
