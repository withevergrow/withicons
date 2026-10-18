// forge/hand/blueprint/avatar-older-woman.mjs — the drafted grandmother: a round bun on top, a soft hair cap with a side
// fringe, two thin round glasses and a gentle smile. The generated drawing filled the lenses with plus marks and ran
// hair lines through them, so bun, glasses and hair fused into a dark blob; here each part has its own clear space.
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
    ['path', { d: chainArc(10, 150, 236) + chainArc(10, -56, 30), ...con(0.34) }],
    ['path', { d: 'M6.2 23H17.8', ...con(0.5) }],
    ['path', { d: 'M3.85 23.65L5.15 22.35M18.85 23.65L20.15 22.35', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // face (lower half) and smile
    ['path', { d: 'M6.5 10.5C6.5 13.81 8.96 16.75 12 16.75C15.04 16.75 17.5 13.81 17.5 10.5M10.5 14.6C11.3 15.4 12.7 15.4 13.5 14.6', class: 'wm-k' }],
    // hair cap with the bun on top, side fringe
    ['path', { d: 'M6.5 10.5C6.1 7.9 7.6 5.6 10.25 4.9A1.75 1.75 0 1 1 13.75 4.9C16.4 5.6 17.9 7.9 17.5 10.5C16.6 8.9 15 8 12.75 7.75C10.25 7.5 7.75 8.4 6.5 10.5Z', class: 'wm-a' }],
    // thin round glasses
    ['path', { d: 'M11.25 11.5A1.75 1.75 0 1 1 7.75 11.5A1.75 1.75 0 1 1 11.25 11.5ZM16.25 11.5A1.75 1.75 0 1 1 12.75 11.5A1.75 1.75 0 1 1 16.25 11.5ZM11.25 11.1H12.75', 'stroke-width': 1, class: 'wm-k' }],
    // shoulders
    ['path', { d: 'M4.82 19.97C5.43 18.69 6.83 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.17 18 18.57 18.69 19.18 19.97', class: 'wm-a' }],
    ['path', { d: 'M5.3 21.5A.8.8 0 1 0 3.7 21.5A.8.8 0 1 0 5.3 21.5M20.3 21.5A.8.8 0 1 0 18.7 21.5A.8.8 0 1 0 20.3 21.5', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
