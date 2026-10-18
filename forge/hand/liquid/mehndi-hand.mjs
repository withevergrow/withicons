// hand-drawn liquid mehndi-hand

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

const N = 'mehndi-hand';
const body = (x, y) => {
  const X = (v) => (v + x).toFixed(2), Y = (v) => (v + y).toFixed(2);
  return `M${X(6)} ${Y(13.4)}V${Y(7.6)}a1.5 1.5 0 0 1 3 0V${Y(5)}a1.5 1.5 0 0 1 3 0V${Y(4.4)}a1.5 1.5 0 0 1 3 0V${Y(6)}a1.5 1.5 0 0 1 3 0V${Y(15)}c0 3.6-2.6 6.2-6 6.2h-1.2c-2.4 0-3.8-1.1-5-2.9l-2.5-3.9a1.45 1.45 0 0 1 2.4-1.6z`;
};
export default function render() {
  const out = [defs(N), ...glass(N, body(0, 0), body(0.6, 0.9))];
  for (const [x, y] of [[9, 8.4], [12, 7.6], [15, 7.8]]) out.push(['path', { d: `M${x} ${y}V10.6`, stroke: C3, 'stroke-opacity': 0.6, 'stroke-width': 0.8, 'stroke-linecap': 'round' }]);
  const cx = 12, cy = 15.4;
  for (let i = 0; i < 5; i++) { const a = (i * 72 - 90) * Math.PI / 180; out.push(['circle', { cx: +(cx + 1.6 * Math.cos(a)).toFixed(2), cy: +(cy + 1.6 * Math.sin(a)).toFixed(2), r: 1.15, fill: C4, class: 'wm-a' }]); }
  out.push(['circle', { cx, cy, r: 1, fill: C2, stroke: C3, 'stroke-width': 0.5, class: 'wm-a' }]);
  out.push(['path', { d: 'M7.1 12.6V7.8', stroke: SH, 'stroke-opacity': 0.85, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
