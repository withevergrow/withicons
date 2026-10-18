// forge/hand/blueprint/rangoli-pattern.mjs — the drafted rangoli: four teardrop petals pointing at a small centre dot,
// four outer arc segments on the Ø20 keyline and four dots in the gaps (the quatrefoil of the common drawing).
// Petals are rotated copies of one teardrop, so the pattern is exactly four-fold symmetric.
const ACCENT = 'var(--with-accent, currentColor)'
const con = op => ({ color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.45, 'stroke-opacity': op, class: 'wm-deco' })
const tick = { color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.5, 'stroke-opacity': 0.75, class: 'wm-deco' }
const f = v => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, '$1.')
const rot = (x, y, a) => { const dx = x - 12, dy = y - 12, c = Math.cos(a), s = Math.sin(a); return [12 + dx * c - dy * s, 12 + dx * s + dy * c] }

// one teardrop pointing at the centre (tip toward 12,12), lobe at the top
function petal(a) {
  const P = (x, y) => rot(x, y, a).map(f).join(' ')
  return `M${P(12, 9.2)}C${P(11.2, 8.5)} ${P(10, 8.1)} ${P(10, 6.8)}A2 2 0 0 1 ${P(14, 6.8)}C${P(14, 8.1)} ${P(12.8, 8.5)} ${P(12, 9.2)}Z`
}

export default function render() {
  const q = Math.PI / 2
  return [
    ['path', { d: 'M2 23H22M2 21.7V23.3M22 21.7V23.3', ...con(0.5) }],
    ['path', { d: 'M1.35 23.65L2.65 22.35M21.35 23.65L22.65 22.35', ...tick }],
    ['path', { d: 'M12 1.6V3M12 21V21.6', ...con(0.5) }],
    ['path', { d: 'M8.58 2.6A10 10 0 0 1 15.42 2.6M21.4 8.58A10 10 0 0 1 21.4 15.42M15.42 21.4A10 10 0 0 1 8.58 21.4M2.6 15.42A10 10 0 0 1 2.6 8.58', class: 'wm-k' }],
    ['path', { d: [0, 1, 2, 3].map(i => petal(i * q)).join(''), class: 'wm-k' }],
    ['circle', { cx: 12, cy: 12, r: 0.9, class: 'wm-a' }],
    ['path', { d: 'M20.5 5.46A1 1 0 1 0 18.5 5.46A1 1 0 1 0 20.5 5.46M20.5 18.54A1 1 0 1 0 18.5 18.54A1 1 0 1 0 20.5 18.54M5.5 18.54A1 1 0 1 0 3.5 18.54A1 1 0 1 0 5.5 18.54M5.5 5.46A1 1 0 1 0 3.5 5.46A1 1 0 1 0 5.5 5.46', color: ACCENT, stroke: 'currentColor', 'stroke-width': 0.9, class: 'wm-a' }],
  ]
}
