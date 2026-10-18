// forge/hand/blueprint/bed.mjs — the drafted bed with a tall unbroken headboard post, a whole mattress and base, and
// a clear pillow (the generated drawing ringed both short legs so they shrank to stubs, and hung fillet crosses round
// the pillow and the foot corner plus a keyline arc over the headboard, so the construction outweighed the bed at
// 16px). One ring caps the headboard post and a single dimension line runs under the legs.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M3 22.2H21M3 21.5V22.8M21 21.5V22.8', ...con(0.5) }],
    ['path', { d: 'M2.35 22.85L3.65 21.55M20.35 22.85L21.65 21.55', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M3 6.25V19.5M3 12H19A2 2 0 0 1 21 14V19.5M3 16H21', class: 'wm-k' }],
    ['path', { d: 'M7.5 12V10.5A1.5 1.5 0 0 1 9 9H12A1.5 1.5 0 0 1 13.5 10.5V12', class: 'wm-a' }],
    ['path', { d: ring(3, 4.5), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
