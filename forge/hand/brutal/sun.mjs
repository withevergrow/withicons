// forge/hand/brutal/sun.mjs — a yellow disc in a 2.2 ink ring with its hard shadow, and eight clean round-capped ink
// rays standing well clear of it (the generated drawing gave every ray its own ink shadow, so the rays swelled into
// blobs that crowded the disc). Rays take the style's line-work c1 echo instead (as on snowflake) and carry wm-a so
// they spin about the centre while the disc pulses. The disc is small (R 3.2) and the diagonal rays start further out
// than the straight ones so the lower-right ray keeps >= 1.5u clear of the disc's hard shadow (no magnifier handle),
// and every echo keeps >= 1.5u off the disc ring; everything stays inside the 1..23 canvas.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const W = 2.2, SHIFT = -0.6, OFF = 1.25
const r2 = n => Math.round(n * 100) / 100
const CX = 12 + SHIFT, CY = 12 + SHIFT, R = 3.2

function rays(o = 0) {
  let d = ''
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4, diag = k % 2 === 1
    const r0 = diag ? 8.7 : 8.1, r1 = diag ? 9.9 : 9.3
    const c = Math.cos(a), s = Math.sin(a)
    d += `M${r2(CX + o + c * r0)} ${r2(CY + o + s * r0)} L${r2(CX + o + c * r1)} ${r2(CY + o + s * r1)} `
  }
  return d.trim()
}

export default function render() {
  return [
    ['circle', { cx: CX + OFF, cy: CY + OFF, r: R + W / 2, fill: INK, class: 'wm-shadow' }],
    ['circle', { cx: CX, cy: CY, r: R, fill: C1, stroke: INK, 'stroke-width': W }],
    ['path', { d: rays(OFF), fill: 'none', stroke: C1, 'stroke-width': W, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: rays(), fill: 'none', stroke: INK, 'stroke-width': W, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
