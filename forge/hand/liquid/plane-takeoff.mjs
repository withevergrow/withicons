const r2 = (n) => Math.round(n * 100) / 100;
const V = (k, h) => `var(--with-liquid-${k}, ${h})`;
function rr(x, y, w, h, r) { return `M${r2(x + r)} ${r2(y)}H${r2(x + w - r)}A${r} ${r} 0 0 1 ${r2(x + w)} ${r2(y + r)}V${r2(y + h - r)}A${r} ${r} 0 0 1 ${r2(x + w - r)} ${r2(y + h)}H${r2(x + r)}A${r} ${r} 0 0 1 ${r2(x)} ${r2(y + h - r)}V${r2(y + r)}A${r} ${r} 0 0 1 ${r2(x + r)} ${r2(y)}Z`; }
function circ(cx, cy, r) { return `M${r2(cx - r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx + r)} ${r2(cy)}A${r} ${r} 0 1 0 ${r2(cx - r)} ${r2(cy)}Z`; }
function poly(pts) { return 'M' + pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L') + 'Z'; }
function defs(id) {
  const g = (n) => `wg-liquid-${id}-${n}`;
  const lin = (n, kids, a = [2.5, 3, 21, 21]) => ['linearGradient', { id: g(n), x1: a[0], y1: a[1], x2: a[2], y2: a[3], gradientUnits: 'userSpaceOnUse' }, kids];
  const st = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }];
  return ['defs', {}, [
    lin(0, [st(0, V('c1', '#4A9DFF'), 0.14), st(0.6, V('c1', '#4A9DFF'), 0.36), st(1, V('c1', '#4A9DFF'), 0.62)]),
    lin(1, [st(0, V('c2', '#A77BFF'), 0.3), st(1, V('c2', '#A77BFF'), 0.75)]),
    lin(2, [st(0, V('c3', '#1C3F9E'), 0.36), st(1, V('c3', '#1C3F9E'), 0.95)]),
    ['radialGradient', { id: g(3), cx: 8.5, cy: 7.5, r: 10, gradientUnits: 'userSpaceOnUse' }, [st(0, V('shine', '#FFFFFF'), 0.8), st(1, V('shine', '#FFFFFF'), 0)]],
    lin(4, [st(0, V('shadow', '#0C1A3A'), 0.1), st(1, V('c4', '#FF7EC1'), 0.32)]),
  ]];
}
const U = (id, n) => `url(#wg-liquid-${id}-${n})`;
function glassy(id, d, cls = 'wm-k', fillN = 0) {
  return [
    ['path', { d, fill: U(id, fillN), 'fill-rule': 'evenodd', stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, class: cls }],
    ['path', { d, stroke: U(id, 2), 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: cls }],
  ];
}
const shadow = (id, d) => ['path', { d, fill: U(id, 4), 'fill-rule': 'evenodd', class: 'wm-shadow' }];
const shine = (id, d) => ['path', { d, fill: U(id, 3), class: 'wm-shine' }];
export default function render() {
  const id = 'plane-takeoff';
  const P = [[8,0],[7.2,0.9],[5.8,1.2],[1.6,1.2],[-1.6,6.4],[-3.2,6.4],[-1.8,1.2],[-5,1.2],[-6.6,3.4],[-7.8,3.4],[-7,1],[-7.4,0]];
  const pts = P.concat(P.slice(1, -1).reverse().map(([x, y]) => [x, -y]));
  const t = -30 * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
  const plane = (o) => poly(pts.map(([x, y]) => [12 + x * c - y * s + o, 9.2 + x * s + y * c + o]));
  const run = (o) => rr(2.2 + o, 19.4 + o, 19.6, 1.6, 0.8);
  return [defs(id),
    shadow(id, plane(0.5)),
    ...glassy(id, run(0), 'wm-deco', 1),
    ['path', { d: plane(0), fill: U(id, 0), stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.22, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: plane(0), stroke: U(id, 2), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: plane(-0.0), fill: U(id, 3), class: 'wm-shine' }],
  ];
}
