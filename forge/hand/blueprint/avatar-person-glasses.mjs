// forge/hand/blueprint/avatar-person-glasses.mjs — the drafted person with glasses: short hair with a side fringe, an open
// face, thin square-ish frames and a clear smile. The generated drawing used wide heavy frames that ate the whole face
// into a dark smudge at 16px with the smile squeezed under them; here the frames are thin, sit high, and the smile has room.
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
    // face outline (open at the temples, where the hair closes it) and a wide smile
    ['path', { d: 'M6.5 10A5.5 6 0 1 0 17.5 10M10.2 13.3C10.9 14.1 13.1 14.1 13.8 13.3', class: 'wm-k' }],
    // hair: one thin cap with a single side-swept fringe line, forehead left open
    ['path', { d: 'M6.5 10C5.8 5.8 8.5 3 12 3C15.5 3 18.2 5.8 17.5 10C16.6 8.4 15.2 7.4 13.6 6.8', class: 'wm-a' }],
    // thin round frames: two lenses and a bridge
    ['path', { d: 'M10.8 10A1.4 1.4 0 1 0 8 10A1.4 1.4 0 1 0 10.8 10M16 10A1.4 1.4 0 1 0 13.2 10A1.4 1.4 0 1 0 16 10M10.8 9.8C11.4 9.4 12.6 9.4 13.2 9.8', 'stroke-width': 0.75, class: 'wm-k' }],
    // shoulders
    ['path', { d: 'M4.82 19.97C5.43 18.69 6.83 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.17 18 18.57 18.69 19.18 19.97', class: 'wm-a' }],
    ['path', { d: 'M5.3 21.5A.8.8 0 1 0 3.7 21.5A.8.8 0 1 0 5.3 21.5M20.3 21.5A.8.8 0 1 0 18.7 21.5A.8.8 0 1 0 20.3 21.5', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
