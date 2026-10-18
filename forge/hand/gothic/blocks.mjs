// Hand-drawn gothic blocks: three carved stone cubes, each with a quatrefoil.
const V = (r, h) => `var(--with-gothic-${r}, ${h})`;
const INK = V('ink', '#221A26');
const f = (n) => Math.round(n * 100) / 100;
function rr(x, y, w, h, r) {
  return `M${f(x + r)} ${f(y)}H${f(x + w - r)}Q${f(x + w)} ${f(y)} ${f(x + w)} ${f(y + r)}V${f(y + h - r)}Q${f(x + w)} ${f(y + h)} ${f(x + w - r)} ${f(y + h)}H${f(x + r)}Q${f(x)} ${f(y + h)} ${f(x)} ${f(y + h - r)}V${f(y + r)}Q${f(x)} ${f(y)} ${f(x + r)} ${f(y)}Z`;
}
function quatre(cx, cy, s) {
  const r = s * 0.42, d = s * 0.5;
  const c = (x, y) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
  return c(cx, cy - d) + c(cx + d, cy) + c(cx, cy + d) + c(cx - d, cy);
}
function block(x, y, s, face, gem) {
  const out = [];
  out.push(['path', { d: rr(x + 0.6, y + 0.8, s, s, 1.6), fill: V('shadow', '#140F18'), 'fill-opacity': '.25', class: 'wm-shadow' }]);
  out.push(['path', { d: rr(x, y, s, s, 1.6), fill: INK, class: 'wm-k' }]);
  out.push(['path', { d: rr(x + 0.7, y + 0.7, s - 1.4, s - 1.4, 1.1), fill: V('tint', '#D3CDC0'), class: 'wm-k' }]);
  out.push(['path', { d: rr(x + 1.7, y + 1.7, s - 3.4, s - 3.4, 0.8), fill: V(face[0], face[1]), stroke: INK, 'stroke-width': '.5', class: 'wm-k' }]);
  const c = s / 2;
  out.push(['path', { d: quatre(x + c, y + c, s * 0.26), fill: V('c3', '#E6A421'), stroke: INK, 'stroke-width': '.45', class: 'wm-k' }]);
  out.push(['circle', { cx: f(x + c), cy: f(y + c), r: f(s * 0.08), fill: V(gem[0], gem[1]), stroke: INK, 'stroke-width': '.3', class: 'wm-k' }]);
  const k = 1.15;
  for (const [px, py] of [[x + k, y + k], [x + s - k, y + k], [x + k, y + s - k], [x + s - k, y + s - k]])
    out.push(['circle', { cx: f(px), cy: f(py), r: '.35', fill: V('edge', '#837A6F'), class: 'wm-deco' }]);
  out.push(['path', { d: `M${f(x + 2.4)} ${f(y + s - 2.6)}V${f(y + 2.4)}H${f(x + s - 2.6)}`, fill: 'none', stroke: V('shine', '#FFF6DE'), 'stroke-width': '.5', 'stroke-linecap': 'round', 'stroke-opacity': '.8', class: 'wm-shine' }]);
  return out;
}
export default function render() {
  return [
    ...block(6.5, 1.2, 10.4, ['c2', '#2552B4'], ['c1', '#B3163B']),
    ...block(1.2, 12.2, 10.4, ['c1', '#B3163B'], ['c2', '#2552B4']),
    ...block(12.3, 12.2, 10.4, ['c2', '#2552B4'], ['c1', '#B3163B']),
  ];
}
