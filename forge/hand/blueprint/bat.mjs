// forge/hand/blueprint/bat.mjs — the drafted bat: a body with two pointed ears and broad wings whose leading edge sweeps up
// to closed, mitred tips and whose trailing edge falls in two deep scallops. The generated drawing broke both wing tips
// open for control rings and kept the skeleton's shallow scallops, so each wing was a thin sliver whose gaps closed at
// 16px and the bat read as a zigzag. Here every wing is one closed outline, taller (about 4u of daylight under the
// leading edge), the scallop notches are deeper and wider, and the construction is a keyline arc over the head, a short
// centre mark above the ears and the dimension line.
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
    ['path', { d: chainArc(10, -140, -41) + chainArc(10, 40, 140), ...con(0.34) }],
    ['path', { d: 'M1.75 20.25H22.25M1.75 18.1V20.6M22.25 18.1V20.6', ...con(0.5) }],
    ['path', { d: 'M12 3.4V5.8M12 6.5V6.9', ...con(0.5) }],
    ['path', { d: 'M1.1 20.9L2.4 19.6M21.6 20.9L22.9 19.6', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }],
    // wings: leading edge up to the tip, outer edge down, two deep scallops back to the body
    ['path', { d: 'M14 10C16.5 9.5 19 8.1 21.75 5.75C22.4 8.6 22.15 11.4 20.9 13.85C20.05 12.15 17.95 12 17.15 14.35C16.35 12.9 14.9 12.85 14 14.75'
      + 'M10 10C7.5 9.5 5 8.1 2.25 5.75C1.6 8.6 1.85 11.4 3.1 13.85C3.95 12.15 6.05 12 6.85 14.35C7.65 12.9 9.1 12.85 10 14.75', class: 'wm-k' }],
    // body with ears
    ['path', { d: 'M10 6.25L11.25 8.25H12.75L14 6.25V14.75C14 16.5 13 17.75 12 17.75C11 17.75 10 16.5 10 14.75Z', class: 'wm-a' }],
  ]
}
