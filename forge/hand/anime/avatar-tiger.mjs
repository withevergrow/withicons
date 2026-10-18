// anime avatar-tiger: round orange tiger face, round ears, forehead + cheek stripes, cream muzzle, pink nose.
const INK = 'var(--with-anime-ink, #2B2148)';
const F = 'var(--with-anime-c1, #F28A2E)';
const ST = 'var(--with-anime-c2, #2A1A10)';
const M = 'var(--with-anime-c3, #FFF4E6)';
const P = 'var(--with-anime-c4, #F4A6B0)';
const SH = 'var(--with-anime-shadow, #794517)';
const W = 'var(--with-anime-shine, #FFFFFF)';
const o = { stroke: INK, 'stroke-width': '1.1', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const s = { fill: 'none', stroke: ST, 'stroke-width': '1.3', 'stroke-linecap': 'round', class: 'wm-k' };
export default function render() {
  return [
    ['circle', { cx: '5.8', cy: '7.7', r: '2.8', fill: F, ...o, class: 'wm-k' }],
    ['circle', { cx: '18.2', cy: '7.7', r: '2.8', fill: F, ...o, class: 'wm-k' }],
    ['circle', { cx: '5.9', cy: '7.9', r: '1.3', fill: P, class: 'wm-k' }],
    ['circle', { cx: '18.1', cy: '7.9', r: '1.3', fill: P, class: 'wm-k' }],
    ['path', { d: 'M3.4 14a8.6 7.2 0 1 0 17.2 0a8.6 7.2 0 1 0-17.2 0z', fill: F, ...o, class: 'wm-k' }],
    ['path', { d: 'M20.6 14A8.6 7.2 0 0 1 12 21.2Q16.4 18.6 20.6 14z', fill: SH, 'fill-opacity': '.35', class: 'wm-k' }],
    ['path', { d: 'M12 7.8v2.4M9 8.4l.6 1.6M15 8.4l-.6 1.6M3.9 12.8h2.6M4.4 15.7h2.4M20.1 12.8h-2.6M19.6 15.7h-2.4', ...s }],
    ['ellipse', { cx: '12', cy: '17.1', rx: '3.9', ry: '2.6', fill: M, stroke: INK, 'stroke-width': '.9', class: 'wm-k' }],
    ['path', { d: 'M10.6 15h2.8l-1.4 1.5z', fill: P, stroke: INK, 'stroke-width': '.8', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M12 16.5v.8M10.5 18.1c.8.8 1.5.7 1.5-.8 0 1.5.7 1.6 1.5.8', fill: 'none', stroke: INK, 'stroke-width': '.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['ellipse', { cx: '8.8', cy: '12.8', rx: '.95', ry: '1.2', fill: INK, class: 'wm-a' }],
    ['ellipse', { cx: '15.2', cy: '12.8', rx: '.95', ry: '1.2', fill: INK, class: 'wm-a' }],
    ['circle', { cx: '9.1', cy: '12.3', r: '.4', fill: W, class: 'wm-shine' }],
    ['circle', { cx: '15.5', cy: '12.3', r: '.4', fill: W, class: 'wm-shine' }],
    ['path', { d: 'M5.4 5.9c.5-.4 1.1-.6 1.7-.5M6.6 11.2c.3-1.2 1-2.1 2-2.8', fill: 'none', stroke: W, 'stroke-width': '.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
