const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const SH = 'var(--with-christmas-shine, #FFFFFF)';
const SD = 'var(--with-christmas-shadow, #4A0716)';
const TI = 'var(--with-christmas-tint, #C9DAEC)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const K = { stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round' };
const g = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: 'wg-christmas-send-horizontal-' + n, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])];
const DEFS = ['defs', {}, [
  g(0, '3', '3', '13', '21', [['0', SH, '0.34'], ['0.42', SH, '0'], ['0.58', SD, '0'], ['1', SD, '0.42']]),
  g(1, '0', '2', '0', '10', [['0.25', SH], ['1', TI]]),
]];
const SHINE = 'url(#wg-christmas-send-horizontal-0)';
const SNOW = 'url(#wg-christmas-send-horizontal-1)';
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: AC, stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const PLANE = 'M3 4L21 12L3 20L6 12Z';
export default function render() {
  return [
    DEFS,
    ['path', { d: 'M3 4L21 12L6 12Z', fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: 'M6 12L21 12L3 20Z', fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: 'M6 12L21 12L3 20Z', fill: SD, 'fill-opacity': '0.35' }],
    ['path', { d: PLANE, fill: SHINE, class: 'wm-shine' }],
    ['path', { d: 'M6 12L21 12', stroke: INK, 'stroke-width': '1.1', 'stroke-linecap': 'round' }],
    ['path', { d: 'M2.6 3.3Q2.2 4.4 3.3 5Q4.4 6 5.5 5.7Q6.6 6.9 7.9 6.6Q9.2 7.8 10.5 7.5Q11.8 8.7 13.6 8.8L13.8 7.9L3.3 3.2Z', fill: SNOW, ...K, 'stroke-width': '0.42', class: 'wm-deco' }],
    star(20, 4.5),
  ];
}
