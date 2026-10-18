// forge/hand/blueprint/avatar-older-man.mjs — the drafted grandfather: a bald dome with two curly side tufts, bushy brows
// and one solid moustache. The generated drawing stacked a full hair outline, glasses-like brow marks and a thin moustache
// into one dark mass at 16px; here the head is one clean oval, the tufts are two open curls, the moustache is a solid wedge.
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
    // bald head, one oval
    ['path', { d: 'M6.5 10.5A5.5 6.25 0 1 1 17.5 10.5A5.5 6.25 0 1 1 6.5 10.5Z', class: 'wm-k' }],
    // side tufts (open curls that start and end on the head)
    ['path', { d: 'M7.4 6.9C5.75 6.5 4.5 7.5 4.75 8.9C3.9 9.6 4.3 11.1 5.6 11.2C6 11.25 6.3 11.2 6.55 11.1M16.6 6.9C18.25 6.5 19.5 7.5 19.25 8.9C20.1 9.6 19.7 11.1 18.4 11.2C18 11.25 17.7 11.2 17.45 11.1', class: 'wm-k' }],
    // eyes: two calm dots
    ['path', { d: 'M10.1 10.5A.6.6 0 1 0 8.9 10.5A.6.6 0 1 0 10.1 10.5M15.1 10.5A.6.6 0 1 0 13.9 10.5A.6.6 0 1 0 15.1 10.5', fill: 'currentColor', stroke: 'none', class: 'wm-a' }],
    // moustache
    ['path', { d: 'M8.5 14.25C9.5 12.6 11.25 12.5 12 13.4C12.75 12.5 14.5 12.6 15.5 14.25C14.25 15.5 12.9 15.1 12 14.6C11.1 15.1 9.75 15.5 8.5 14.25Z', fill: 'currentColor', 'stroke-width': 0.75, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // shoulders
    ['path', { d: 'M4.82 19.97C5.43 18.69 6.83 18 8.5 18C9.75 18 10.75 18.75 12 18.75C13.25 18.75 14.25 18 15.5 18C17.17 18 18.57 18.69 19.18 19.97', class: 'wm-a' }],
    ['path', { d: 'M5.3 21.5A.8.8 0 1 0 3.7 21.5A.8.8 0 1 0 5.3 21.5M20.3 21.5A.8.8 0 1 0 18.7 21.5A.8.8 0 1 0 20.3 21.5', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: 'wm-a' }],
  ]
}
