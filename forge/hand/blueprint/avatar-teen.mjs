// forge/hand/blueprint/avatar-teen.mjs — the drafted teen in a hoodie: a big hood arch round an open face, a tuft of fringe,
// two drawstring cords with toggles hanging onto the shoulders. The generated drawing put a thin hood right on the face
// oval, so it read as a parka or a plain head; here the hood is a closed cowl standing 3u off the face, with cords and toggles inside it and shoulder stubs below.
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
    // hood arch, open at the bottom
    ['path', { d: 'M7.5 17.5C5 17.2 3.95 15.2 3.9 12.5C3.5 6.75 7 3 12 3C17 3 20.5 6.75 20.1 12.5C20.05 15.2 19 17.2 16.5 17.5C14.5 18.75 9.5 18.75 7.5 17.5Z', class: 'wm-k' }],
    // face opening, eyes, smile
    ['path', { d: 'M8.25 10.5A3.75 4.5 0 1 1 15.75 10.5A3.75 4.5 0 1 1 8.25 10.5ZM10 10V10.75M14 10V10.75M10.5 12.5C11.25 13.25 12.75 13.25 13.5 12.5', class: 'wm-k' }],
    // fringe tuft
    ['path', { d: 'M8.5 8.25C10 8.25 11.5 7.25 12.5 6.25C12.9 7.5 14.2 8.25 15.5 8.25', class: 'wm-a' }],
    // shoulders + drawstrings
    ['path', { d: 'M7.75 18.5C6 18.85 5 19.5 4.6 20.65M16.25 18.5C18 18.85 19 19.5 19.4 20.65', class: 'wm-a' }],
    ['path', { d: 'M10.4 14.9L9.8 16.6M13.6 14.9L14.2 16.6', class: 'wm-a' }],
    ['path', { d: 'M5.3 21.5A.8.8 0 1 0 3.7 21.5A.8.8 0 1 0 5.3 21.5M20.3 21.5A.8.8 0 1 0 18.7 21.5A.8.8 0 1 0 20.3 21.5', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
