// utsav camera-off: the whole marigold camera (centre bump, big cream lens ring with a rani-pink iris, gold inner line, dot work) under a peacock-teal slash.
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const C4 = 'var(--with-utsav-c4, #0F766E)';
const r2 = (n) => Math.round(n * 100) / 100;
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'camera-off';
  const g = `wg-utsav-${n}-0`;
  const body = 'M5 6.8H7.6L9 4.2H15L16.4 6.8H19A3 3 0 0 1 22 9.8V17.8A3 3 0 0 1 19 20.8H5A3 3 0 0 1 2 17.8V9.8A3 3 0 0 1 5 6.8z';
  const inner = 'M5 8H8.3L9.7 5.4H14.3L15.7 8H19A1.8 1.8 0 0 1 20.8 9.8V17.8A1.8 1.8 0 0 1 19 19.6H5A1.8 1.8 0 0 1 3.2 17.8V9.8A1.8 1.8 0 0 1 5 8z';
  const dotsAt = [[5.2, 11], [5.2, 13.3], [5.2, 15.6], [18.8, 11]];
  const dots = dotsAt.map(([x, y]) => circ(x, y, 0.3)).join('');
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 9, y1: 4, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-c1, #F59E0B)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-c2, #F97316)' }],
      ]],
    ]],
    ['path', { d: body, fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: inner, fill: 'none', stroke: EDGE, 'stroke-width': 0.36, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: dots, fill: SHINE, class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 13.8, r: 4.3, fill: SHINE, stroke: INK, 'stroke-width': 0.62, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 13.8, r: 2.6, fill: C3, stroke: INK, 'stroke-width': 0.55, class: 'wm-a' }],
    ['circle', { cx: 12, cy: 13.8, r: 0.9, fill: INK, class: 'wm-a' }],
    ['circle', { cx: 10.9, cy: 12.6, r: 0.45, fill: SHINE, class: 'wm-shine' }],
    ['line', { x1: 3.8, y1: 3.4, x2: 20.2, y2: 20.8, stroke: INK, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: 3.8, y1: 3.4, x2: 20.2, y2: 20.8, stroke: C4, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
