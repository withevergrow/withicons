// Hand-drawn pastel nutcracker.
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
  const face = 'M6 12H18V16.4Q18 21.4 12 21.4Q6 21.4 6 16.4Z';
  const shako = 'M6.4 4.3H17.6L16.2 10.4H7.8Z';
  const mo = 'M12 16.7Q10.2 15.2 8.9 16.4Q8 17.5 6.8 16.9Q7 19.1 9.6 18.9Q11.3 18.7 12 17.5Q12.7 18.7 14.4 18.9Q17 19.1 17.2 16.9Q16 17.5 15.1 16.4Q13.8 15.2 12 16.7Z';
  return [
    drop(face.replace('M6 12', 'M6 12.6')),
    body(rr(4.3, 13, 2.4, 4.2, 1.1), 'P'),
    body(rr(17.3, 13, 2.4, 4.2, 1.1), 'P'),
    body(face, 'P'),
    shade('M6.3 16.6Q6.6 20.8 12 20.9Q17.4 20.8 17.7 16.6Q17.4 19.4 12 19.6Q6.6 19.4 6.3 16.6Z', 'P'),
    body('M11 1.6H13L12.6 6.6H11.4Z', 'L', 'wm-a'),
    body(shako, 'B'),
    tint('M7.4 5.1H16.6L16.3 6.4H7.7Z', 'B', 0.55),
    shine(rr(7.6, 5.3, 2, 0.6, 0.3)),
    body(circ(12, 7.6, 1.3), 'Y'),
    body(rr(5, 10, 14, 2.3, 0.9), 'K'),
    ink(circ(9.4, 14.3, 0.85), 'wm-k', '#B4613D'),
    ink(circ(14.6, 14.3, 0.85), 'wm-k', '#B4613D'),
    body(rr(9.6, 18.4, 4.8, 3.4, 0.8), 'W'),
    inkLine('M10.8 19.9V21.4M12 19.9V21.4M13.2 19.9V21.4', 0.7, 'wm-k', '#B4613D'),
    ink(mo, 'wm-k', '#B4613D'),
  ];
}
