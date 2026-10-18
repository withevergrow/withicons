// forge/hand/brutal/circle-dot.mjs — a selected radio: a yellow disc in a 2.2 ink ring with one solid ink centre dot
// and a clear yellow band between them (the generated drawing stacked ink ring, pink band and ink dot into a
// target/donut). House recipe: 2.2 ink, flat c1, hard ink shadow; the dot is the pulsing A part.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const W = 2.2, SHIFT = -0.6, OFF = 1.25
const CX = 12 + SHIFT, CY = 12 + SHIFT, R = 8.75, DOT = 3.6

export default function render() {
  return [
    ['circle', { cx: CX + OFF, cy: CY + OFF, r: R + W / 2, fill: INK, class: 'wm-shadow' }],
    ['circle', { cx: CX, cy: CY, r: R, fill: C1, stroke: INK, 'stroke-width': W }],
    ['circle', { cx: CX, cy: CY, r: DOT, fill: INK, class: 'wm-a' }],
  ]
}
