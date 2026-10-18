const V = (r, h) => `var(--with-pastel-${r}, ${h})`;
const f = (n) => (Math.round(n * 100) / 100).toString();
const CX = 12, CY = 12.4, R = 7.4;
const pt = (deg, r = R, dx = 0, dy = 0) => {
  const a = (deg * Math.PI) / 180;
  return [CX + dx + r * Math.cos(a), CY + dy + r * Math.sin(a)];
};
const arc = (a0, a1, dx = 0, dy = 0) => {
  const [x0, y0] = pt(a0, R, dx, dy), [x1, y1] = pt(a1, R, dx, dy);
  return `M${f(x0)} ${f(y0)}A${R} ${R} 0 0 1 ${f(x1)} ${f(y1)}`;
};
const head = (a) => {
  // arrowhead pointing clockwise at angle a
  const tip = pt(a + 14), o = pt(a, R + 3), i = pt(a, R - 3);
  return `M${f(o[0])} ${f(o[1])}L${f(tip[0])} ${f(tip[1])}L${f(i[0])} ${f(i[1])}Z`;
};
const STARTS = [-90, 30, 150];
const SPAN = 74;
export default function render() {
  const out = [['path', { d: STARTS.map((s) => arc(s, s + SPAN, 0.6, 0.6)).join(''), fill: 'none', stroke: V('shadow', '#6EC8A4'), 'stroke-opacity': '0.18', 'stroke-width': '3.4', 'stroke-linecap': 'round', class: 'wm-shadow' }]];
  for (const s of STARTS) {
    const d = arc(s, s + SPAN);
    out.push(['path', { d, fill: 'none', stroke: V('edge', '#6EC8A4'), 'stroke-width': '3.4', 'stroke-linecap': 'round', class: 'wm-k' }]);
    out.push(['path', { d, fill: 'none', stroke: V('c1', '#ABE6CD'), 'stroke-width': '2.3', 'stroke-linecap': 'round', class: 'wm-k' }]);
    out.push(['path', { d: head(s + SPAN), fill: V('c1', '#ABE6CD'), stroke: V('edge', '#6EC8A4'), 'stroke-width': '0.8', 'stroke-linejoin': 'round', class: 'wm-k' }]);
  }
  out.push(['path', { d: arc(-80, -50), fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.55', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
