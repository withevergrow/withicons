// forge/hand/blueprint/remove-formatting.mjs — an unbroken T whose serifs hang on two control nodes, and a compact
// clean x tucked under its right arm; replaces the generated drawing whose corner nodes chopped the T bar into stubs,
// whose x carried nodes on three of four ends and ran past the frame, and whose dimension line added noise.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    // T: mitred bar with short serifs ending at the nodes, full stem
    ['path', { d: 'M3.5 5.83V4H16.5V5.83M10 4V20', class: 'wm-k' }],
    ['path', { d: ring(3.5, 7.4) + ring(16.5, 7.4), ...node('wm-k') }],
    // the clearing x
    ['path', { d: 'M14.5 15L19.5 20M19.5 15L14.5 20', class: 'wm-s' }],
  ]
}
