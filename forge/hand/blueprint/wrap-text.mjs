// forge/hand/blueprint/wrap-text.mjs — the full-width top line between two nodes sets the margin, the second line
// turns round it into a clean mitred chevron, the short line sits beside the head; replaces the generated drawing
// whose arc centre mark, split dimension line and node on the arrow tail cluttered the return head at 16px.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M4.58 5H19.43M3 19H8', class: 'wm-k' }],
    ['path', { d: ring(3, 5) + ring(21, 5), ...node('wm-k') }],
    // wrapping line and its arrowhead, one part so the nudge moves them together
    ['path', { d: 'M3 12H17.5A3.5 3.5 0 0 1 17.5 19H12.5M14.5 16.5L12 19L14.5 21.5', class: 'wm-a' }],
  ]
}
