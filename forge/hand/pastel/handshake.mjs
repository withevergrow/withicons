// Hand-drawn pastel handshake.
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
  const hands = 'M5 9.6L9.6 7.9Q12 7.1 14.4 7.9L19 9.6V14.6L14.6 17.6Q12.6 18.9 10.6 18.1L5 14.8Z';
  return [
    drop(rr(1.5, 8.6, 3.8, 8.4, 1.3)),
    drop(rr(18.7, 8.6, 3.8, 8.4, 1.3)),
    drop(hands.replace(/^M5 9.6/, 'M5 10.2')),
    body(hands, 'P'),
    shade('M5.3 13.6L10.6 16.9Q12.6 17.7 14.6 16.4L18.7 13.6V14.5L14.6 17.4Q12.6 18.7 10.6 17.9L5.3 14.7Z', 'P'),
    tint('M7 9.6L10 8.6Q12 8 14 8.6L17 9.6L14 9.6Q12 9 10 9.6Z', 'P', 0.6),
    body(circ(7.6, 15.6, 1.15), 'P'),
    body(circ(9.4, 16.8, 1.15), 'P'),
    body(circ(11.4, 17.6, 1.15), 'P'),
    body(circ(13.4, 17.2, 1.1), 'P'),
    inkLine('M15.4 10.2Q13.2 10 10.6 12.3', 1.1, 'wm-k', '#B4613D'),
    inkLine('M9.6 13.2L12.4 15.2', 0.9, 'wm-k', '#B4613D'),
    body(rr(1.5, 8, 3.8, 8.4, 1.3), 'L'),
    body(rr(18.7, 8, 3.8, 8.4, 1.3), 'L'),
    tint(rr(2.1, 8.6, 1.4, 4, 0.7), 'L', 0.5),
    tint(rr(19.3, 8.6, 1.4, 4, 0.7), 'L', 0.5),
    shine(rr(2.3, 9, 0.7, 2, 0.35)),
  ];
}
