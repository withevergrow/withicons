// forge/hand/blueprint/avatar-cat.mjs — the drafted cat face: one closed head outline with pointed ears, dot eyes that
// blink, a solid nose, and whiskers that stand off the cheeks. The generated drawing ran the whiskers 1.5u into the face
// (crossing the outline into a hash at 16px), drew the nose as a stroked speck, ran a centre chain down through the eyes
// and nose, and left the eyes untagged so the blink never played. Here the whiskers stop short of the cheeks, the nose is
// a solid wedge, the centre line only marks above the ears and below the chin, and the eyes carry wm-a for the blink.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const f = v => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, '$1.')
const R = Math.PI / 180

// chain-dash (long - dot) pieces of the keyline circle, a0 -> a1 degrees clockwise
function chainArc(r, a0, a1) {
  const pat = [2.4, 0.7, 0.4, 0.7], L = (a1 - a0) * R * r
  const pt = s => { const a = a0 * R + s / r; return `${f(12 + r * Math.cos(a))} ${f(12 + r * Math.sin(a))}` }
  let s = 0, k = 0, d = ''
  while (s < L) {
    const e = Math.min(L, s + pat[k % 4])
    if (k % 2 === 0 && e - s >= 0.3) d += `M${pt(s)}A${r} ${r} 0 0 1 ${pt(e)}`
    s += pat[k % 4]; k++
  }
  return d
}

export default function render() {
  return [
    // keyline chain in the clear arcs between ears, whiskers and chin
    ['path', { d: chainArc(10, -112, -68) + chainArc(10, 182, 221) + chainArc(10, -41, -2) + chainArc(10, 108, 135) + chainArc(10, 45, 72), ...con(0.34) }],
    ['path', { d: 'M5 22.9H19M5 21.3V23.3M19 21.3V23.3', ...con(0.5) }],
    // centre marks above the ears' notch and below the chin
    ['path', { d: 'M12 2.3V4.7M12 5.4V5.6M12 21.8V22.5', ...con(0.5) }],
    ['path', { d: 'M4.35 23.55L5.65 22.25M18.35 23.55L19.65 22.25', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // head
    ['path', { d: 'M12 20.5C8 20.5 5 18.25 5 14.5C5 12.75 5.5 11.25 6 10.25V5.5C6 4.5 6.75 4.25 7.5 4.75L10.25 7C10.75 6.75 11.25 6.75 12 6.75C12.75 6.75 13.25 6.75 13.75 7L16.5 4.75C17.25 4.25 18 4.5 18 5.5V10.25C18.5 11.25 19 12.75 19 14.5C19 18.25 16 20.5 12 20.5Z', class: 'wm-k' }],
    // whiskers, standing clear of the cheeks (about 1.2u at the upper caps, 1.5u at the lower, same angles as before)
    ['path', { d: 'M.75 13.6L2.5 14.05M1 17.85L2.75 17M23.25 13.6L21.5 14.05M23 17.85L21.25 17', class: 'wm-k' }],
    // nose
    ['path', { d: 'M10.9 15.1H13.1L12 16.35Z', fill: 'currentColor', 'stroke-width': 0.75, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // eyes (blink)
    ['path', { d: 'M9.5 12.25V12.75M14.5 12.25V12.75', class: 'wm-a' }],
  ]
}
