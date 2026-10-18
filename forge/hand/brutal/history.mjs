// forge/hand/brutal/history.mjs — counter-clockwise ink arrow ring (big solid head) round a yellow clock face with ink
// hands, hard ink shadow down-right and a paper keyline so ring and arrow survive on dark pages.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)'
const PAPER = 'var(--with-brutal-shine, #FFFDF5)'
// paper keyline behind every part (the brutal sticker edge): invisible on light pages, keeps the ink readable on dark
const halo = nodes => nodes.map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : PAPER, stroke: PAPER, 'stroke-width': +((+a['stroke-width'] || 0) + 1.6).toFixed(2), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }])
export default function render() {
  const ring = ['path', { d: 'M5.2 8.4A8.6 8.6 0 1 1 3.4 12.6', fill: 'none', stroke: INK, 'stroke-width': 2.4, 'stroke-linecap': 'round', class: 'wm-k' }]
  const head = ['path', { d: 'M1.4 4.6L7.9 5.9L3.3 10.9Z', fill: INK, stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round', class: 'wm-k' }]
  const sh = ['circle', { cx: 13.25, cy: 13.25, r: 5.1, fill: INK, class: 'wm-shadow' }]
  const face = ['circle', { cx: 12, cy: 12, r: 5.1, fill: C1, stroke: INK, 'stroke-width': 2.2, class: 'wm-k' }]
  return [
    ...halo([ring, head, sh, face]),
    ring, head, sh, face,
    ['path', { d: 'M12 9.4V12.2L13.9 13.6', fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
