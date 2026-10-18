// forge/hand/brutal/holi-splash.mjs — a big wavy pink colour splat with a yellow core and two fat drops, heavy ink
// outlines, hard ink shadows and a paper keyline so it reads on dark pages. Simplified for a bold 16-24px read.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const C2 = 'var(--with-brutal-c2, #FF6BA8)'
const C3 = 'var(--with-brutal-c3, #4D7CFE)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
// paper keyline behind every part (the brutal sticker edge): invisible on light pages, keeps the ink readable on dark
const halo = nodes => nodes.map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : PAPER, stroke: PAPER, 'stroke-width': +((+a['stroke-width'] || 0) + 1.6).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
const f = n => +n.toFixed(2)
const blob = (d = 0) => {
  let s = ''
  const N = 60
  for (let i = 0; i < N; i++) {
    const t = (i / N) * Math.PI * 2
    const r = 6.9 + 1.2 * Math.cos(6 * t + 0.5)
    s += (i ? 'L' : 'M') + f(11.4 + d + r * Math.cos(t)) + ' ' + f(12.4 + d + r * Math.sin(t))
  }
  return s + 'Z'
}
export default function render() {
  const parts = [
    ['path', { d: blob(1.25), fill: INK, class: 'wm-shadow' }],
    ['path', { d: blob(), fill: C2, stroke: INK, 'stroke-width': 2.2, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 21.05, cy: 4.25, r: 1.9, fill: INK, class: 'wm-shadow' }],
    ['circle', { cx: 19.8, cy: 3, r: 1.9, fill: C3, stroke: INK, 'stroke-width': 2, class: 'wm-deco' }],
  ]
  return [
    ...halo(parts),
    ...parts,
    ['circle', { cx: 11.4, cy: 12.4, r: 2.6, fill: C1, stroke: INK, 'stroke-width': 2, class: 'wm-a' }],
  ]
}
