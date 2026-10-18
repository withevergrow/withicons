// Jalebi: a fat orange syrup-glazed coil, two turns, with glossy highlights.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`;
const INK = V('ink', '#1D1029');
const n = (v) => +v.toFixed(2);
const TURNS = 2, R0 = 1.0, R1 = 8.9;
const pt = (th, off = 0, dx = 0, dy = 0) => {
  const r = R0 + (R1 - R0) * th / (TURNS * 2 * Math.PI) + off;
  const a = th - Math.PI / 2;
  return [12 + dx + r * Math.cos(a), 12 + dy + r * Math.sin(a)];
};
// Catmull-Rom through the spiral between two angles
const coil = (t0, t1, off = 0, dx = 0, dy = 0) => {
  const step = Math.PI / 6, P = [];
  for (let t = t0; t < t1 - 1e-6; t += step) P.push(pt(t, off, dx, dy));
  P.push(pt(t1, off, dx, dy));
  const f = (p) => `${n(p[0])} ${n(p[1])}`;
  let d = `M${f(P[0])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const a = P[Math.max(0, i - 1)], b = P[i], c = P[i + 1], e = P[Math.min(P.length - 1, i + 2)];
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6], c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += `C${f(c1)} ${f(c2)} ${f(c)}`;
  }
  return d;
};
export default function render() {
  const g = 'wg-halloween-jalebi-0';
  const end = TURNS * 2 * Math.PI;
  const cap = { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none' };
  return [
    ['defs', {}, [['radialGradient', { id: g, cx: 12, cy: 12, r: 11, fx: 8.5, fy: 7.5, gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: 0, 'stop-color': V('accent', '#FFB52E') }], ['stop', { offset: 0.45, 'stop-color': V('c1', '#FF9F2E') }], ['stop', { offset: 1, 'stop-color': V('c2', '#E5530F') }]]]]],
    ['path', { d: coil(0, end, 0, 0.15, 0.85), stroke: V('shadow', '#2A1642'), 'stroke-opacity': 0.3, 'stroke-width': 3, ...cap, class: 'wm-shadow' }],
    ['path', { d: coil(0, end), stroke: INK, 'stroke-width': 3, ...cap, class: 'wm-k' }],
    ['path', { d: coil(0, end), stroke: `url(#${g})`, 'stroke-width': 1.8, ...cap, class: 'wm-k' }],
    ['path', { d: coil(5.0, 6.3, -0.3), stroke: V('tint', '#FFF1B8'), 'stroke-width': 0.8, 'stroke-opacity': 0.9, ...cap, class: 'wm-shine' }],
    ['path', { d: coil(10.6, 11.7, -0.3), stroke: V('tint', '#FFF1B8'), 'stroke-width': 0.8, 'stroke-opacity': 0.9, ...cap, class: 'wm-shine' }],
  ];
}
