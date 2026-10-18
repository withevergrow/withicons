// forge/hand/blueprint/settings-2.mjs — two drafted sliders, one clean ring per knob. The earlier drawing packed a solid
// hub into each knob and kept the dashed keyline circle running through them, so the knobs read as doubled rings with
// stray dots; here the knobs are plain open rings, the keyline circle is gone, and the only drafting marks sit at the far
// ends of the tracks (a control ring each) plus the dimension line underneath.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M3 22.9H21M3 20.7V23.3M21 20.7V23.3', ...con(0.5) }],
    ['path', { d: 'M2.35 23.55L3.65 22.25M20.35 23.55L21.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // tracks
    ['path', { d: 'M3 7H4.75M11.25 7H20.2M3.8 17H12.75M19.25 17H21', class: 'wm-k' }],
    // knobs
    ['circle', { cx: 8, cy: 7, r: 3.25, class: 'wm-a' }],
    ['circle', { cx: 16, cy: 17, r: 3.25, class: 'wm-a' }],
    // control rings at the track ends
    ['path', { d: ring(21, 7) + ring(3, 17), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
