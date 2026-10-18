// utsav bot-off: the full robot head (marigold plaque, gold inner line, cream eyes, dotted grille, antenna bulb, pink ear bolts) under a peacock-teal slash.
const INK = 'var(--with-utsav-ink, #3B0A45)';
const EDGE = 'var(--with-utsav-edge, #F4C95D)';
const SHINE = 'var(--with-utsav-shine, #FFF4DC)';
const C3 = 'var(--with-utsav-c3, #E11D74)';
const C4 = 'var(--with-utsav-c4, #0F766E)';
const r2 = (n) => Math.round(n * 100) / 100;
const circ = (x, y, r) => `M${r2(x - r)} ${r2(y)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`;
const rr = (x0, y0, x1, y1, r) =>
  `M${r2(x0 + r)} ${y0}H${r2(x1 - r)}A${r} ${r} 0 0 1 ${x1} ${r2(y0 + r)}V${r2(y1 - r)}A${r} ${r} 0 0 1 ${r2(x1 - r)} ${y1}H${r2(x0 + r)}A${r} ${r} 0 0 1 ${x0} ${r2(y1 - r)}V${r2(y0 + r)}A${r} ${r} 0 0 1 ${r2(x0 + r)} ${y0}z`;

export default function render(icon) {
  const n = icon && icon.name ? icon.name : 'bot-off';
  const g = `wg-utsav-${n}-0`;
  const grille = [9.4, 10.7, 12, 13.3, 14.6].map((x) => circ(x, 17.5, 0.3)).join('');
  return [
    ['defs', {}, [
      ['linearGradient', { id: g, x1: 9, y1: 8, x2: 15, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': 'var(--with-utsav-c1, #F59E0B)' }],
        ['stop', { offset: 1, 'stop-color': 'var(--with-utsav-c2, #F97316)' }],
      ]],
    ]],
    ['line', { x1: 12, y1: 8.2, x2: 12, y2: 5, stroke: INK, 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 12, cy: 3.8, r: 1.5, fill: C3, stroke: INK, 'stroke-width': 0.62, class: 'wm-a' }],
    ['path', { d: rr(2, 12, 5.2, 18, 1.3), fill: C3, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(18.8, 12, 22, 18, 1.3), fill: C3, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(4.5, 7.8, 19.5, 20.8, 3.6), fill: `url(#${g})`, stroke: INK, 'stroke-width': 0.62, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: rr(5.7, 9, 18.3, 19.6, 2.6), fill: 'none', stroke: EDGE, 'stroke-width': 0.36, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['circle', { cx: 9, cy: 13, r: 1.9, fill: SHINE, stroke: INK, 'stroke-width': 0.55, class: 'wm-k' }],
    ['circle', { cx: 15, cy: 13, r: 1.9, fill: SHINE, stroke: INK, 'stroke-width': 0.55, class: 'wm-k' }],
    ['circle', { cx: 9, cy: 13, r: 0.8, fill: INK, class: 'wm-k' }],
    ['circle', { cx: 15, cy: 13, r: 0.8, fill: INK, class: 'wm-k' }],
    ['path', { d: grille, fill: SHINE, class: 'wm-shine' }],
    ['line', { x1: 3, y1: 3, x2: 21, y2: 21, stroke: INK, 'stroke-width': 2.5, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: 3, y1: 3, x2: 21, y2: 21, stroke: C4, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
