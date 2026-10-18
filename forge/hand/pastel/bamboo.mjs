const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const f = (n) => n.toFixed(2);
const stalk = (x, y0, y1, nodes) => {
  const out = [
    ['rect', { x: f(x + 0.5), y: f(y0 + 0.6), width: '3.6', height: f(y1 - y0), rx: '1.5', fill: V('shadow', '#F09F7C'), 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ['rect', { x: f(x), y: f(y0), width: '3.6', height: f(y1 - y0), rx: '1.5', fill: V('c1', '#FFCBAF'), stroke: V('edge', '#F8B596'), 'stroke-width': '0.6', class: 'wm-k' }],
    ['rect', { x: f(x + 0.7), y: f(y0 + 0.8), width: '0.8', height: f(y1 - y0 - 1.6), rx: '0.4', fill: V('shine', '#FFFFFF'), 'fill-opacity': '0.45', class: 'wm-shine' }],
  ];
  for (const n of nodes) out.push(['rect', { x: f(x - 0.4), y: f(n - 0.55), width: '4.4', height: '1.1', rx: '0.55', fill: V('edge', '#F8B596'), class: 'wm-k' }]);
  return out;
};
const leaf = (d) => ['path', { d, fill: V('c4', '#B8E6C4'), stroke: V('edge', '#86CF9C'), 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-deco' }];
export default function render() {
  return [
    ...stalk(6.2, 2, 22, [8, 15]),
    ...stalk(14.2, 6, 22, [12, 17.5]),
    leaf('M9.8 7.6C12 5 15.5 4 19.6 4.4C17.8 7.6 14 9 9.8 7.6Z'),
    leaf('M6.2 12.2C4.4 11.8 2.6 10 2 7.4C4.6 7.8 6 9.4 6.2 12.2Z'),
    leaf('M17.8 11.4C19.6 9.8 21.4 9.6 22.6 10C21.6 11.8 19.8 12.4 17.8 11.4Z'),
    ['path', { d: 'M11 7.3C13.4 6 15.8 5.3 18.4 5', fill: 'none', stroke: V('edge', '#86CF9C'), 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-deco' }],
  ];
}
