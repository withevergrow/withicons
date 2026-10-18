const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const SH = 'var(--with-christmas-shine, #FFFFFF)';
const SD = 'var(--with-christmas-shadow, #4A0716)';
const TI = 'var(--with-christmas-tint, #C9DAEC)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const K = { stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round' };
const g = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: 'wg-christmas-video-off-' + n, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' },
  stops.map(([o, c, op]) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }])];
const DEFS = ['defs', {}, [
  g(0, '3', '3', '13', '21', [['0', SH, '0.34'], ['0.42', SH, '0'], ['0.58', SD, '0'], ['1', SD, '0.42']]),
  g(1, '0', '2', '0', '10', [['0.25', SH], ['1', TI]]),
]];
const SHINE = 'url(#wg-christmas-video-off-0)';
const SNOW = 'url(#wg-christmas-video-off-1)';
const star = (x, y) => ['path', { d: `M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, fill: AC, stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const BODY = 'M4.5 6H12.5Q15 6 15 8.5V15.5Q15 18 12.5 18H4.5Q2 18 2 15.5V8.5Q2 6 4.5 6Z';
const LENS = 'M15 10.4L20.6 7.3Q21.8 6.7 21.8 8V16Q21.8 17.3 20.6 16.7L15 13.6Z';
const SL = 'M3 3L21 21';
export default function render() {
  return [
    DEFS,
    ['path', { d: LENS, fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: BODY, fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: BODY + LENS, fill: SHINE, class: 'wm-shine' }],
    ['path', { d: 'M1.8 8.4Q1.8 5.7 4.5 5.7H12.5Q15.2 5.7 15.2 8.4Q14.4 9 13.6 8.4Q12.6 9.3 11.6 8.5Q10.5 9.2 9.5 8.4Q8.4 9.3 7.3 8.5Q6.2 9.2 5.2 8.4Q4.1 9.3 3 8.5Q2.4 9 1.8 8.4Z', fill: SNOW, ...K, 'stroke-width': '0.42', class: 'wm-deco' }],
    ['path', { d: SL, stroke: INK, 'stroke-width': '3.6', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: SL, stroke: C1, 'stroke-width': '2.4', 'stroke-linecap': 'round', class: 'wm-s' }],
    star(19.5, 3.5),
  ];
}
