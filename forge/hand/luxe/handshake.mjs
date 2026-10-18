// luxe handshake: gold cuffs, gold left hand with four knuckles front-left, blue enamel right hand with thumb over.
const V = (r, h) => `var(--with-luxe-${r}, ${h})`;
const C1 = V('c1', '#2039B4'), C3 = V('c3', '#16206E'), AC = V('accent', '#E3AE47'), C4 = V('c4', '#7B4A12');
const SH = V('shadow', '#0A0B26'), SN = V('shine', '#FFFFFF'), TI = V('tint', '#FFEFC4');
const rim = (d, fill, edge, cls) => [
  ['path', { d, fill: edge, stroke: edge, 'stroke-width': '1.2', 'stroke-linejoin': 'round', class: cls }],
  ['path', { d, fill, class: cls }],
];
const LCUFF = 'M6.6 6.5L8 7.3 5 12.7 3.6 11.9Z';
const RCUFF = 'M17.4 6.5L16 7.3 19 12.7 20.4 11.9Z';
const LPALM = 'M8 7.4C8.9 7.9 9.6 8.3 10.4 8.5L12.4 10.6 12.6 15 11.2 17.2 6.3 13.8 5.1 12.6Z';
const RHAND = 'M16 8.3L19 12.6 17.6 13.5C18 14.4 17.4 15.3 16.5 15.3 16.4 16.1 15.8 16.6 15 16.5 14.6 17.3 13.8 17.6 13 17.5 12.3 17.7 11.6 17.6 11 17.2L11.2 13.2 10.2 11.8C9.2 12 8.5 11.5 8.9 10.8L10.2 8.8C10.8 8.4 12 8.2 13.3 8.5 14.3 8.7 15.2 8.8 16 8.3Z';
const FINGERS = [[6.95, 14.05, 7.55, 13.25], [7.9, 15.2, 9.2, 13.5], [9.1, 16.1, 10.2, 14.6], [10.4, 16.9, 11.1, 15.9]];
export default function render() {
  const out = [];
  out.push(['path', { d: 'M4.4 13.2L6 14.4 11.3 18.1C12.4 18.6 13.6 18.6 14.4 18.1 16 17.6 17.6 16.6 18.4 15.2L20.6 13.4 12 12Z', fill: SH, 'fill-opacity': '.2', class: 'wm-shadow' }]);
  out.push(...rim(LPALM, AC, C4, 'wm-a'));
  out.push(...rim(RHAND, C1, C3, 'wm-k'));
  // right-hand finger grooves + thumb edge
  out.push(['path', { d: 'M12.9 12.3L17.1 14.7M12.6 13.9L15.9 15.9M12.3 15.5L14.3 16.8M9.8 11.8C10.7 11.6 11.3 10.9 11.9 10.2L13.6 11.1', stroke: C3, 'stroke-width': '.55', 'stroke-linecap': 'round', fill: 'none', class: 'wm-k' }]);
  out.push(['path', { d: 'M10.6 9.2C11.6 8.7 13 8.8 14.2 9.2 14.9 9.4 15.5 9.3 16 9.1', stroke: SN, 'stroke-opacity': '.7', 'stroke-width': '.5', 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }]);
  out.push(['path', { d: 'M16.8 9.6L18.3 12.2', stroke: SN, 'stroke-opacity': '.35', 'stroke-width': '.5', 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }]);
  // left knuckles over the clasp
  for (const [x1, y1, x2, y2] of FINGERS) out.push(['line', { x1, y1, x2, y2, stroke: C4, 'stroke-width': '2.2', 'stroke-linecap': 'round', class: 'wm-a' }]);
  for (const [x1, y1, x2, y2] of FINGERS) out.push(['line', { x1, y1, x2, y2, stroke: AC, 'stroke-width': '1.3', 'stroke-linecap': 'round', class: 'wm-a' }]);
  for (const [x1, y1, x2, y2] of FINGERS) out.push(['line', { x1: x2 - 0.15, y1: y2 + 0.05, x2: x2 + 0.05, y2: y2 - 0.15, stroke: TI, 'stroke-width': '.5', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  // cuffs
  out.push(...rim(LCUFF, AC, C4, 'wm-k'));
  out.push(...rim(RCUFF, AC, C4, 'wm-k'));
  out.push(['path', { d: 'M6.7 7.2L4.4 11.4M17.3 7.2L19.6 11.4', stroke: SN, 'stroke-opacity': '.75', 'stroke-width': '.45', 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }]);
  return out;
}
