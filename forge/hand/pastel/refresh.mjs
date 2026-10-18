const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const A1 = 'M4.6 10.4A7.6 7.6 0 0 1 16.6 6';
const A2 = 'M19.4 13.6A7.6 7.6 0 0 1 7.4 18';
const H1 = 'M15.2 2.8L20.4 6.4L15 9.4Z';
const H2 = 'M8.8 21.2L3.6 17.6L9 14.6Z';
const tube = (d) => [
  ['path', { d, fill: 'none', stroke: V('edge', '#B6A1EF'), 'stroke-width': '3.4', 'stroke-linecap': 'round', class: 'wm-k' }],
  ['path', { d, fill: 'none', stroke: V('c1', '#CDBBF7'), 'stroke-width': '2.3', 'stroke-linecap': 'round', class: 'wm-k' }],
];
const head = (d) => ['path', { d, fill: V('c1', '#CDBBF7'), stroke: V('edge', '#B6A1EF'), 'stroke-width': '0.8', 'stroke-linejoin': 'round', class: 'wm-k' }];
export default function render() {
  return [
    ['path', { d: 'M5.2 11A7.6 7.6 0 0 1 17.2 6.6M20 14.2A7.6 7.6 0 0 1 8 18.6', fill: 'none', stroke: V('shadow', '#9E87E6'), 'stroke-opacity': '0.18', 'stroke-width': '3.4', 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ...tube(A1), head(H1),
    ...tube(A2), head(H2),
    ['path', { d: 'M6.4 8.6A6 6 0 0 1 9.6 5.6', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.55', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ];
}
