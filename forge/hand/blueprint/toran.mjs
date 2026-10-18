// forge/hand/blueprint/toran.mjs — the drafted toran: a door rod with ring ends, three short hangers and three closed
// mango leaves (the middle one longest). The generated drawing broke every leaf tip open for control rings, so at 16px
// the leaves turned into loose brackets and the garland read as a chandelier; here every leaf is one closed outline
// with a hairline midrib, and the construction is the lower keyline arc, the centre axis and the dimension line.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const ring = cls => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, class: cls })
const f = v => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, '$1.')
const R = Math.PI / 180
const node = (x, y) => `M${f(x + 0.8)} ${f(y)}A.8 .8 0 1 0 ${f(x - 0.8)} ${f(y)}A.8 .8 0 1 0 ${f(x + 0.8)} ${f(y)}`

// chain-dash (long - dot) pieces of the Ø20 keyline circle, a0 -> a1 degrees clockwise
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
    ['path', { d: chainArc(10, 20, 72) + chainArc(10, 108, 160), ...con(0.34) }],
    ['path', { d: 'M2.5 22H21.5M2.5 20.6V22.6M21.5 20.6V22.6', ...con(0.5) }],
    ['path', { d: 'M1.85 22.65L3.15 21.35M20.85 22.65L22.15 21.35', ...tick }],
    ['path', { d: 'M12 1.6V2.6M12 20.7V21.3', ...con(0.5) }],
    // leaf midribs
    ['path', { d: 'M5.2 9.5L4.5 12.5M12 9.5V16.5M18.8 9.5L19.5 12.5', ...con(0.5) }],
    // rod between its ring ends, centre hanger and leaf
    ['path', { d: 'M3.3 4H20.7M12 4V6M12 6C9.25 9 9.25 15.5 12 19.5C14.75 15.5 14.75 9 12 6Z', class: 'wm-k' }],
    // side hangers and leaves
    ['path', { d: 'M6 4V6M6 6C3.25 7.75 2 12.5 3.5 16C6.5 13.5 7.75 8.75 6 6Z'
      + 'M18 4V6M18 6C20.75 7.75 22 12.5 20.5 16C17.5 13.5 16.25 8.75 18 6Z', class: 'wm-a' }],
    ['path', { d: node(2.5, 4) + node(21.5, 4), ...ring('wm-k') }],
  ]
}
