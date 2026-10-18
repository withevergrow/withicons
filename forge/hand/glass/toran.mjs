// toran: beaded garland bar with four hanging mango leaves, each with a dark rim and midrib.
const f = (n) => String(Math.round(n * 100) / 100);
function rr(x, y, w, h, r) {
  const p = [], seg = 5;
  const cs = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
  for (const [cx, cy, a0] of cs) for (let i = 0; i <= seg; i++) {
    const a = (a0 + (90 * i) / seg) * Math.PI / 180;
    p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return p;
}
function clip(poly, a, b, c) {
  const out = [], s = (q) => a * q[0] + b * q[1] + c;
  for (let i = 0; i < poly.length; i++) {
    const P = poly[i], Q = poly[(i + 1) % poly.length], sp = s(P), sq = s(Q);
    if (sp >= 0) out.push(P);
    if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
  }
  return out;
}
const d = (polys, dx = 0, dy = 0) => polys.filter((p) => p.length > 2).map((p) => 'M' + p.map((q) => f(q[0] + dx) + ' ' + f(q[1] + dy)).join('L') + 'Z').join('');
const V = (role, hex) => `var(--with-glass-${role}, ${hex})`;
function defs(icon, x0, y0, x1, y1, gx, gy) {
  const id = (n) => `wg-glass-${icon}-${n}`;
  return ['defs', {}, [
    ['linearGradient', { id: id(0), x1: f(x0 + 1), y1: f(y0 + 1), x2: f(x1 + 2), y2: f(y1 + 2), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }], ['stop', { offset: '1', 'stop-color': V('shadow', '#6A45D6') }]]],
    ['radialGradient', { id: id(1), cx: f(gx), cy: f(gy), r: '8', gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.5', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.22' }],
      ['stop', { offset: '1', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0' }]]],
    ['linearGradient', { id: id(2), x1: f(x0 - 1), y1: f(y0 - 1), x2: f(x1), y2: f(y1), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }],
      ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
  ]];
}
// glass slab: soft shadow, offset back plate, frosted front pane
function slab(icon, polys, cls = 'wm-k') {
  return [
    ['path', { d: d(polys, 1.3, 1.8), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.08', class: 'wm-shadow' }],
    ['path', { d: d(polys, 1.1, 1.4), fill: `url(#wg-glass-${icon}-0)`, class: cls }],
    ['path', { d: d(polys, 1.1, 1.4), fill: `url(#wg-glass-${icon}-1)`, class: cls }],
    ['path', { d: d(polys), fill: `url(#wg-glass-${icon}-2)`, stroke: 'currentColor', 'stroke-opacity': '0.22', 'stroke-width': '0.5', 'stroke-linejoin': 'round', class: cls }],
  ];
}
const shine = (dd) => ['path', { d: dd, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.85', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-shine' }];
export default function render(icon) {
  const leaf = (cx, y0, L, w) => { const p = []; for (let i = 0; i <= 12; i++) { const t = i / 12; p.push([cx + w * Math.sin(Math.PI * t) * (1 - 0.35 * t), y0 + L * t]); } for (let i = 11; i > 0; i--) { const t = i / 12; p.push([cx - w * Math.sin(Math.PI * t) * (1 - 0.35 * t), y0 + L * t]); } return p; };
  const xs = [4.5, 9.5, 14.5, 19.5], L = [10, 13, 13, 10];
  const leaves = xs.map((x, i) => leaf(x, 7, L[i], 2.7));
  const bar = [rr(2, 3, 20, 3.5, 1.75)];
  const out = [defs('toran', 2, 3, 22, 20, 12, 12)];
  out.push(['path', { d: d(leaves, 1.1, 1.4), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.1', class: 'wm-shadow' }]);
  leaves.forEach((p, i) => out.push(['path', { d: d([p]), fill: i % 3 === 0 ? 'url(#wg-glass-toran-0)' : 'url(#wg-glass-toran-2)', stroke: V('shadow', '#6A45D6'), 'stroke-opacity': '0.75', 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-a' }]));
  xs.forEach((x, i) => out.push(['path', { d: `M${f(x)} 7.8V${f(7 + L[i] - 1.6)}`, stroke: i % 3 === 0 ? V('frost', '#FFFFFF') : V('shadow', '#6A45D6'), 'stroke-opacity': '0.7', 'stroke-width': '0.5', 'stroke-linecap': 'round', class: 'wm-a' }]));
  out.push(...slab('toran', bar));
  for (const x of [4.5, 9.5, 14.5, 19.5]) out.push(['circle', { cx: f(x), cy: '6.9', r: '1.1', fill: V('accent', '#F2679E'), stroke: 'currentColor', 'stroke-opacity': '0.15', 'stroke-width': '0.3', class: 'wm-deco' }]);
  for (const x of [7, 12, 17]) out.push(['circle', { cx: f(x), cy: '6.6', r: '0.6', fill: V('accent', '#F2679E'), 'fill-opacity': '0.8', class: 'wm-deco' }]);
  out.push(shine('M3.8 4.2H20'));
  return out;
}
