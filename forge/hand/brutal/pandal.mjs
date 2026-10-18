// forge/hand/brutal/pandal.mjs — a festival pavilion: peaked yellow roof with a finial, two ink pillars, pink drapes
// and a floor slab, hard ink shadows under roof and slab, paper keyline so it reads on dark pages.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const C2 = 'var(--with-brutal-c2, #FF6BA8)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
// paper keyline behind every part (the brutal sticker edge): invisible on light pages, keeps the ink readable on dark
const halo = nodes => nodes.map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : PAPER, stroke: PAPER, 'stroke-width': +((+a['stroke-width'] || 0) + 1.6).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
const S = 'stroke-width'
const roof = (d = 0) => `M${+(2.4 + d).toFixed(2)} ${+(10.6 + d).toFixed(2)}L${+(12 + d).toFixed(2)} ${+(3.8 + d).toFixed(2)}L${+(21.6 + d).toFixed(2)} ${+(10.6 + d).toFixed(2)}Z`
export default function render() {
  const parts = [
    ['path', { d: roof(1.25), fill: INK, class: 'wm-shadow' }],
    ['rect', { x: 4.25, y: 19.85, width: 18, height: 2.6, rx: 0.4, fill: INK, class: 'wm-shadow' }],
    ['path', { d: 'M6 11V19.4M18 11V19.4', fill: 'none', stroke: INK, [S]: 2.4, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['rect', { x: 3, y: 18.6, width: 18, height: 2.6, rx: 0.4, fill: C2, stroke: INK, [S]: 2.2, class: 'wm-k' }],
    ['path', { d: roof(), fill: C1, stroke: INK, [S]: 2.2, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['circle', { cx: 12, cy: 2.3, r: 1.3, fill: INK, class: 'wm-deco' }],
  ]
  return [
    ...halo(parts),
    ...parts,
    ['path', { d: 'M7.2 11H11.2C10.6 13.4 9.2 15 7.2 15.8Z', fill: C2, stroke: INK, [S]: 2, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M16.8 11H12.8C13.4 13.4 14.8 15 16.8 15.8Z', fill: C2, stroke: INK, [S]: 2, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
