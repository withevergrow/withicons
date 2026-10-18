// Hand-drawn pastel camera-off.
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
  return [
    drop(rr(2, 7.6, 20, 13, 2.6)),
    body(rr(8, 4.2, 8, 4.5, 1.4), 'L'),
    body(rr(2, 7, 20, 13, 2.6), 'L'),
    shade(rr(2.4, 17.4, 19.2, 2.3, 1.6), 'L'),
    tint(rr(3.4, 8, 17.2, 2.6, 1.3), 'L', 0.45),
    shine(rr(3.6, 8.6, 2.4, 0.8, 0.4)),
    body(circ(12, 13.6, 4.1), 'W', 'wm-a'),
    body(circ(12, 13.6, 2.4), 'B', 'wm-a'),
    shine(circ(11.1, 12.7, 0.6)),
    ink(circ(18.2, 10.1, 0.75)),
    ['line', { x1: '3.5', y1: '3.5', x2: '20.5', y2: '20.5', stroke: v('edge', '#F8A9C5'), 'stroke-width': '3', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: '3.5', y1: '3.5', x2: '20.5', y2: '20.5', stroke: v('c3', '#FFC3D7'), 'stroke-width': '1.9', 'stroke-linecap': 'round', class: 'wm-s' }],
  ];
}
