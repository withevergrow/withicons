const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const SH = 'var(--with-christmas-shine, #FFFFFF)';
const SD = 'var(--with-christmas-shadow, #4A0716)';
const TI = 'var(--with-christmas-tint, #C9DAEC)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const K = { stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round' };
const g = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: 'wg-christmas-skip-back-' + n, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])];
const DEFS = ['defs', {}, [
  g(0, '3', '3', '13', '21', [['0', SH, '0.34'], ['0.42', SH, '0'], ['0.58', SD, '0'], ['1', SD, '0.42']]),
  g(1, '0', '2', '0', '10', [['0.25', SH], ['1', TI]]),
]];
const SHINE = 'url(#wg-christmas-skip-back-0)';
const SNOW = 'url(#wg-christmas-skip-back-1)';
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: AC, stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const TRI = 'M18.6 5.4Q20.5 4.5 20.5 6.6V17.4Q20.5 19.5 18.6 18.6L9.6 13.3Q7.6 12 9.6 10.7Z';
const BAR = 'M3.5 5.5Q3.5 4 5 4Q6.5 4 6.5 5.5V18.5Q6.5 20 5 20Q3.5 20 3.5 18.5Z';
export default function render() {
  return [
    DEFS,
    ['path', { d: TRI, fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: BAR, fill: C1, ...K, class: 'wm-a' }],
    ['path', { d: TRI + BAR, fill: SHINE, class: 'wm-shine' }],
    ['path', { d: 'M15.6 7.4L18.6 5.2Q20.8 4.3 20.8 6.6V8Q20.1 8.7 19.4 8Q18.6 8.9 17.8 8.1Q16.8 8.7 15.6 7.4Z', fill: SNOW, ...K, 'stroke-width': '0.42', class: 'wm-deco' }],
    ['path', { d: 'M3.2 5.6Q3.2 3.7 5 3.7Q6.8 3.7 6.8 5.6Q6.1 6.3 5.4 5.7Q4.5 6.5 3.2 5.6Z', fill: SNOW, ...K, 'stroke-width': '0.42', class: 'wm-deco' }],
    star(9.5, 3.5),
  ];
}
