const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const SH = 'var(--with-christmas-shine, #FFFFFF)';
const SD = 'var(--with-christmas-shadow, #4A0716)';
const TI = 'var(--with-christmas-tint, #C9DAEC)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const K = { stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round' };
const g = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: 'wg-christmas-wifi-off-' + n, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])];
const DEFS = ['defs', {}, [
  g(0, '3', '3', '13', '21', [['0', SH, '0.34'], ['0.42', SH, '0'], ['0.58', SD, '0'], ['1', SD, '0.42']]),
  g(1, '0', '2', '0', '10', [['0.25', SH], ['1', TI]]),
]];
const SHINE = 'url(#wg-christmas-wifi-off-0)';
const SNOW = 'url(#wg-christmas-wifi-off-1)';
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: AC, stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const ARCS = 'M9.17 15.67A4 4 0 0 1 14.83 15.67M6.34 12.84A8 8 0 0 1 17.66 12.84M3.51 10.01A12 12 0 0 1 20.49 10.01';
const SL = 'M3.5 3.5L20.5 20.5';
export default function render() {
  return [
    DEFS,
    ['path', { d: ARCS, stroke: INK, 'stroke-width': '3.4', 'stroke-linecap': 'round' }],
    ['path', { d: ARCS, stroke: C2, 'stroke-width': '2.2', 'stroke-linecap': 'round', class: 'wm-k' }],
    ['circle', { cx: '12', cy: '19', r: '1.8', fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: ARCS, stroke: SHINE, 'stroke-width': '2.2', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M8.6 5.6Q12 4.6 15.4 5.6', stroke: C4, 'stroke-width': '1', 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: SL, stroke: INK, 'stroke-width': '3.6', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SL, stroke: C1, 'stroke-width': '2.4', 'stroke-linecap': 'round', class: 'wm-s' }],
    star(20, 4),
  ];
}
