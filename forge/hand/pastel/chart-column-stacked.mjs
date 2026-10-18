// Hand-drawn pastel chart-column-stacked.
const n = (v) => Math.round(v * 100) / 100;
const C = {
  L: ['c1', '#CDBBF7', '#B6A1EF', '#9E87E6', '#ECE5FC'],
  P: ['c2', '#FFCBAF', '#F8B596', '#F09F7C', '#FFEBE1'],
  Y: ['c3', '#FFE29C', '#F6D077', '#EDBD52', '#FFF4D9'],
  B: ['c4', '#B7D6FA', '#9AC2F2', '#7DAEEA', '#E4EFFD'],
  K: ['c3', '#FFC3D7', '#F8A9C5', '#EE8FB1', '#FFE6EE'],
  W: ['tint', '#FFFFFF', '#CFC4EC', '#CFC4EC', '#FFFFFF'],
};
const v = (r, h) => 'var(--with-pastel-' + r + ', ' + h + ')';
const rr = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return 'M' + n(x + r) + ' ' + n(y) + 'H' + n(x + w - r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + w) + ' ' + n(y + r) + 'V' + n(y + h - r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + w - r) + ' ' + n(y + h) + 'H' + n(x + r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x) + ' ' + n(y + h - r) + 'V' + n(y + r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(x + r) + ' ' + n(y) + 'Z'; };
const circ = (cx, cy, r) => 'M' + n(cx - r) + ' ' + n(cy) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(cx + r) + ' ' + n(cy) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(cx - r) + ' ' + n(cy) + 'Z';
const body = (d, k, cls = 'wm-k') => ['path', { d, fill: v(C[k][0], C[k][1]), stroke: v('edge', C[k][2]), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: cls }];
const shade = (d, k, o = 0.34, cls = 'wm-k') => ['path', { d, fill: v('shadow', C[k][3]), 'fill-opacity': String(o), class: cls }];
const tint = (d, k, o = 0.5, cls = 'wm-k') => ['path', { d, fill: v('tint', C[k][4]), 'fill-opacity': String(o), class: cls }];
const shine = (d) => ['path', { d, fill: v('shine', '#FFFFFF'), 'fill-opacity': '0.55', class: 'wm-shine' }];
const ink = (d, cls = 'wm-k', h = '#6A55B8') => ['path', { d, fill: v('ink', h), class: cls }];
const inkLine = (d, w = 1.1, cls = 'wm-k', h = '#6A55B8') => ['path', { d, fill: 'none', stroke: v('ink', h), 'stroke-width': String(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }];
const drop = (d) => ['path', { d, fill: v('shadow', '#9E87E6'), 'fill-opacity': '0.18', class: 'wm-shadow' }];

export default function render(icon) {
  const cols = [[2.6, 9, 10.6], [9.4, 2.4, 17.2], [16.2, 5.6, 14]];
  const out = [];
  for (const [x, y, h] of cols) out.push(drop(rr(x, y + 0.6, 5.2, h, 1.7)));
  out.push(drop(rr(2, 19.9, 20, 2, 1)));
  for (const [x, y, h] of cols) {
    out.push(body(rr(x, y, 5.2, h, 1.7), 'L'));
    out.push(shade(rr(x + 0.4, y + h - 2.2, 4.4, 1.8, 0.9), 'L'));
    out.push(tint(rr(x + 0.8, y + 0.7, 3.6, Math.min(3.6, h * 0.35), 1.1), 'L', 0.45));
  }
  for (const [x, y] of cols) out.push(shine(rr(x + 1, y + 1, 0.9, 2.2, 0.45)));
  out.push(body(rr(2, 19.3, 20, 2, 1), 'P', 'wm-a'));
  out.push(shade(rr(2.6, 20.4, 18.8, 0.7, 0.35), 'P', 0.3, 'wm-a'));
  return out;
}
