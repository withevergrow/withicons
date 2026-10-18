// hand-drawn liquid message-circle

const V = (r, h) => `var(--with-liquid-${r}, ${h})`;
const C1 = V('c1', '#4A9DFF'), C2 = V('c2', '#A77BFF'), C3 = V('c3', '#1C3F9E'), C4 = V('c4', '#FF7EC1');
const SH = V('shine', '#FFFFFF'), ED = V('edge', '#B9E6FF'), SD = V('shadow', '#0C1A3A');
const lg = (id, s) => ['linearGradient', { id, x1: 2, y1: 2, x2: 22, y2: 22, gradientUnits: 'userSpaceOnUse' }, s.map(([o, c, op]) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': op }])];
function defs(n) {
  const g = (i) => `wg-liquid-${n}-${i}`;
  return ['defs', {}, [
    lg(g(0), [[0, C1, 0.24], [0.6, C1, 0.46], [1, C1, 0.74]]),
    lg(g(1), [[0, C2, 0.6], [1, C2, 0.95]]),
    lg(g(2), [[0, C3, 0.5], [1, C3, 0.95]]),
    ['radialGradient', { id: g(3), cx: 8.5, cy: 7.5, r: 10, gradientUnits: 'userSpaceOnUse' }, [['stop', { offset: 0, 'stop-color': SH, 'stop-opacity': 0.85 }], ['stop', { offset: 1, 'stop-color': SH, 'stop-opacity': 0 }]]],
    lg(g(4), [[0, SD, 0.1], [1, C4, 0.34]]),
  ]];
}
const u = (n, i) => `url(#wg-liquid-${n}-${i})`;
function glass(n, d, sd, cls = 'wm-k') {
  return [
    ['path', { d: sd, fill: u(n, 4), class: 'wm-shadow' }],
    ['path', { d, fill: u(n, 0), stroke: u(n, 2), 'stroke-width': 1.1, 'stroke-linejoin': 'round', class: cls }],
    ['path', { d, fill: u(n, 3), class: 'wm-shine' }],
  ];
}

const N = 'message-circle';
const body = (x, y) => `M${5.6 + x} ${16.6 + y}A8.5 8.5 0 1 1 ${8.4 + x} ${18.7 + y}L${3.2 + x} ${20.8 + y}Z`;
export default function render() {
  return [defs(N), ...glass(N, body(0, 0), body(0.6, 0.9)),
    ['path', { d: 'M6.6 7.2A7 7 0 0 1 12 3.9', stroke: SH, 'stroke-opacity': 0.85, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M20 13.2A8 8 0 0 1 14.5 18.9', stroke: C4, 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round' }]];
}
