// video-off: camera body and lens split by a clean gap, with a thin accent slash running through the gap.
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
  const body = rr(2, 6, 13, 12, 3);
  const lens = [[16, 10.5], [20.6, 7.6], [21.2, 7.5], [22, 8.2], [22, 15.8], [21.2, 16.5], [20.6, 16.4], [16, 13.5]];
  const g = 1.1 * Math.SQRT2;
  const parts = [clip(body, 1, -1, -g), clip(body, -1, 1, -g), clip(lens, 1, -1, -g)];
  return [
    defs('video-off', 2, 6, 22, 18, 15, 15),
    ['path', { d: d(parts, 0.6, 0.8), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.1', class: 'wm-shadow' }],
    ['path', { d: d(parts), fill: 'url(#wg-glass-video-off-0)', 'fill-opacity': '0.4', class: 'wm-k' }],
    ['path', { d: d(parts), fill: 'url(#wg-glass-video-off-2)', stroke: 'currentColor', 'stroke-width': '1.4', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M4 4L20 20', stroke: V('accent', '#F2679E'), 'stroke-width': '1.2', 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
    shine('M8 7.6H11.4Q13.2 7.6 13.4 9.2'),
  ];
}
