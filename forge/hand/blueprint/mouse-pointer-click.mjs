// forge/hand/blueprint/mouse-pointer-click.mjs — the drafted pointer with a short click burst (the generated drawing
// broke the arrow open with control rings at its tip and barbs, so the tip read blunt, ran long rays almost into it and
// circled everything with a keyline that read as a target at 16px): the arrow is one unbroken outline with a crisp
// mitred tip, five short rays stand well clear of it, and a single control ring sits on the tail's free end.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const r2 = v => Math.round(v * 100) / 100
const ring = (x, y) => `M${r2(x + 0.8)} ${y}A.8.8 0 1 0 ${r2(x - 0.8)} ${y}A.8.8 0 1 0 ${r2(x + 0.8)} ${y}`

export default function render() {
  return [
    // width dimension of the drawing, opened around the tail's ring
    ['path', { d: 'M2.5 23H14.9M17.5 23H19M2.5 21.4V23.3M19 21.4V23.3', ...con(0.5) }],
    ['path', { d: 'M1.85 23.65L3.15 22.35M18.35 23.65L19.65 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // the pointer, unbroken
    ['path', { d: 'M9 9L19 16L13.5 16.5L10.5 21Z', class: 'wm-k' }],
    // tail, ending in a control ring
    ['path', { d: 'M13.82 17.04L15.38 19.63', class: 'wm-a' }],
    ['path', { d: ring(16.2, 21), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
    // click burst: short rays, kept clear of the tip
    ['path', { d: 'M9 2.5V4.5M2.5 9H4.5M4.5 4.5L5.75 5.75M13.5 4.5L12.25 5.75M4.5 13.5L5.75 12.25', class: 'wm-s' }],
  ]
}
