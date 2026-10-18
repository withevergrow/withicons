// anime turtle: side view, hex-patterned domed shell, head up on the right, four legs, small tail.
const INK = 'var(--with-anime-ink, #2B2148)';
const G = 'var(--with-anime-c4, #5FCF8C)';
const SH = 'var(--with-anime-shadow, #4B2C8F)';
const Y = 'var(--with-anime-c3, #FFC740)';
const W = 'var(--with-anime-shine, #FFFFFF)';
const P = 'var(--with-anime-c2, #FF8DB6)';
const o = { stroke: INK, 'stroke-width': '1.1', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
export default function render() {
  const leg = (x) => ['path', { d: `M${x} 14.6v3.4a1.2 1.2 0 0 0 2.4 0v-3.4z`, fill: G, ...o, class: 'wm-k' }];
  return [
    ['path', { d: 'M3.9 15l-2.2.9 2.4.6z', fill: G, ...o, class: 'wm-k' }],
    leg(4.6), leg(7.2), leg(12.4), leg(15),
    ['path', { d: 'M16.2 13.6c1-1 1.4-2 1.6-3.2.2-1.2 1-2.4 2.4-2.4 1.5 0 2.4 1.1 2.4 2.4 0 1.5-1.2 2.4-2.6 2.6-.6.9-1.2 1.6-2 2.1z', fill: G, ...o, class: 'wm-a' }],
    ['circle', { cx: '20.6', cy: '9.7', r: '.75', fill: INK, class: 'wm-a' }],
    ['circle', { cx: '20.85', cy: '9.45', r: '.27', fill: W, class: 'wm-shine' }],
    ['ellipse', { cx: '21.3', cy: '11.4', rx: '.6', ry: '.35', fill: P, 'fill-opacity': '.85', class: 'wm-a' }],
    ['path', { d: 'M3.2 14.9C3.2 9.4 6.4 5.4 10.3 5.4s7.1 4 7.1 9.5z', fill: G, ...o, class: 'wm-k' }],
    ['path', { d: 'M14.6 7.6c1.6 1.7 2.5 4.2 2.5 7H3.6c0-.5 0-1 .1-1.4h9.6c1.1 0 1.9-.8 1.8-2z', fill: SH, 'fill-opacity': '.3', class: 'wm-k' }],
    ['path', { d: 'M8.9 8.1h2.8l1.4 2.4-1.4 2.4H8.9l-1.4-2.4zM8.9 8.1l-1-2M11.7 8.1l1-2M7.5 10.5H4M13.1 10.5h3.6M8.9 12.9l-.8 2M11.7 12.9l.8 2', fill: 'none', stroke: INK, 'stroke-width': '.9', 'stroke-linejoin': 'round', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M2.6 14.9h15.4a1.1 1.1 0 0 1 0 2.2H2.6a1.1 1.1 0 0 1 0-2.2z', fill: Y, ...o, class: 'wm-k' }],
    ['path', { d: 'M6 8.4c.8-1.3 2-2 3.2-2.2', fill: 'none', stroke: W, 'stroke-width': '.9', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
