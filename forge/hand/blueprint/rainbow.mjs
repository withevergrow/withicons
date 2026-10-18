// forge/hand/blueprint/rainbow.mjs — the drafted rainbow as three evenly spaced, full-weight bands (the generated
// drawing laid the dashed Ø20 keyline right over the outer band, ran a chain axis down through every gap and ringed
// four band ends, so the bands broke into beads and the arcs blurred into a dome at 16px). Here the two inner bands
// run whole to the ground, control rings sit only on the outer band's feet, and the drafting is one centre mark at the
// arcs' common centre and one dimension line below.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const ring = (x, y) => `M${x + 0.8} ${y}A.8.8 0 1 0 ${x - 0.8} ${y}A.8.8 0 1 0 ${x + 0.8} ${y}`

export default function render() {
  return [
    ['path', { d: 'M2 21H22M2 20.1V21.6M22 20.1V21.6', ...con(0.5) }],
    ['path', { d: 'M11.2 18h1.6M12 17.2v1.6', ...con(0.5) }],
    ['path', { d: 'M1.35 21.65L2.65 20.35M21.35 21.65L22.65 20.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    ['path', { d: 'M2.15 16.26A10 10 0 0 1 21.85 16.26M5.25 18A6.75 6.75 0 0 1 18.75 18', class: 'wm-k' }],
    ['path', { d: 'M8.5 18A3.5 3.5 0 0 1 15.5 18', class: 'wm-a' }],
    ['path', { d: ring(2, 18) + ring(22, 18), color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-k' }],
  ]
}
