const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const SH = 'var(--with-christmas-shine, #FFFFFF)';
const SD = 'var(--with-christmas-shadow, #4A0716)';
const TI = 'var(--with-christmas-tint, #C9DAEC)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const K = { stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round' };
const g = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: 'wg-christmas-variable-' + n, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])];
const DEFS = ['defs', {}, [
  g(0, '3', '3', '13', '21', [['0', SH, '0.34'], ['0.42', SH, '0'], ['0.58', SD, '0'], ['1', SD, '0.42']]),
  g(1, '0', '2', '0', '10', [['0.25', SH], ['1', TI]]),
]];
const SHINE = 'url(#wg-christmas-variable-0)';
const SNOW = 'url(#wg-christmas-variable-1)';
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: AC, stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const X = 'M3.5 8.5L11 17.5M11 8.5L3.5 17.5';
const EQ = 'M14.5 10H20.5M14.5 15.5H20.5';
const o = (d, c, cls) => [
  ['path', { d, stroke: INK, 'stroke-width': '4.2', 'stroke-linecap': 'round' }],
  ['path', { d, stroke: c, 'stroke-width': '3', 'stroke-linecap': 'round', class: cls }],
  ['path', { d, stroke: SHINE, 'stroke-width': '3', 'stroke-linecap': 'round', class: 'wm-shine' }],
];
export default function render() {
  return [
    DEFS,
    ...o(X, C1, 'wm-k'),
    ...o(EQ, C2, 'wm-a'),
    ['path', { d: 'M13.1 9.8Q13 8.2 14.6 8.2H20.4Q22 8.2 21.9 9.8Q21.2 10.4 20.4 9.9Q19.5 10.7 18.6 10Q17.6 10.7 16.7 10Q15.7 10.6 14.8 10Q13.9 10.6 13.1 9.8Z', fill: SNOW, ...K, 'stroke-width': '0.42', class: 'wm-deco' }],
    star(19.5, 4.5),
  ];
}
