// forge/hand/blueprint/volume-1.mjs — one closed speaker and a single r5.5 sound arc held between two control nodes,
// over a dimension line; replaces the generated drawing whose dashed keyline halo and chain axis swamped the small
// wave and whose nodes split the speaker into a bracket and a separate cone.
const AC = 'var(--with-accent, currentColor)'
const f = v => Math.round(v * 100) / 100
const ring = (x, y, r = 0.8) => `M${f(x + r)} ${y}A${r} ${r} 0 1 0 ${f(x - r)} ${y}A${r} ${r} 0 1 0 ${f(x + r)} ${y}`
const con = { color: AC, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': 0.5, class: 'wm-deco' }
const tick = { color: AC, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const node = cls => ({ color: AC, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })

export default function render() {
  return [
    ['path', { d: 'M3 21H17M3 18.7V21.7M17 18.7V21.7', ...con }],
    ['path', { d: 'M2.35 21.65L3.65 20.35M16.35 21.65L17.65 20.35', ...tick }],
    // speaker: box and cone as one closed outline
    ['path', { d: 'M9.84 5.98A1 1 0 0 1 11.5 6.73V17.27A1 1 0 0 1 9.84 18.02L7 15.5H4.5A1.5 1.5 0 0 1 3 14V10A1.5 1.5 0 0 1 4.5 8.5H7Z', class: 'wm-k' }],
    // the one wave about the cone, a long arc ending at its nodes so it holds at 16px
    ['path', { d: 'M16.18 9.11A5.5 5.5 0 0 1 16.18 14.89', class: 'wm-a' }],
    ['path', { d: ring(15.18, 7.91) + ring(15.18, 16.09), ...node('wm-a') }],
  ]
}
