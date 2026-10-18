// clay bamboo: two puffy segmented stalks (light green) with darker green leaves, so leaf and stalk read apart.
const V = (r, h) => `var(--with-clay-${r}, ${h})`;
const n = (v) => +v.toFixed(2);
const rr = (x, y, w, h, r) => `M${n(x + r)} ${n(y)}H${n(x + w - r)}A${r} ${r} 0 0 1 ${n(x + w)} ${n(y + r)}V${n(y + h - r)}A${r} ${r} 0 0 1 ${n(x + w - r)} ${n(y + h)}H${n(x + r)}A${r} ${r} 0 0 1 ${n(x)} ${n(y + h - r)}V${n(y + r)}A${r} ${r} 0 0 1 ${n(x + r)} ${n(y)}Z`;
// leaf: pointed almond from (x1,y1) to (x2,y2), bulge b
const leaf = (x1, y1, x2, y2, b, dy = 0) => {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dyy = y2 - y1, L = Math.hypot(dx, dyy);
  const px = -dyy / L * b, py = dx / L * b;
  return `M${n(x1)} ${n(y1 + dy)}Q${n(mx + px)} ${n(my + py + dy)} ${n(x2)} ${n(y2 + dy)}Q${n(mx - px)} ${n(my - py + dy)} ${n(x1)} ${n(y1 + dy)}Z`;
};
export default function render() {
  const id = (i) => `wg-clay-bamboo-${i}`;
  const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }];
  const SH = V('shadow', '#1F4A18');
  const defs = ['defs', {}, [
    ['radialGradient', { id: id(0), cx: 12, cy: 21.5, r: 8, gradientUnits: 'userSpaceOnUse' }, [stop(0, SH, 0.3), stop(1, SH, 0)]],
    ['radialGradient', { id: id(1), cx: 8, cy: 5, r: 18, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('tint', '#E6F5DC')), stop(0.45, V('c1', '#6DBE45')), stop(1, SH)]],
    ['radialGradient', { id: id(2), cx: 6, cy: 6, r: 16, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('c3', '#C8E6A0')), stop(0.4, V('c2', '#2E8B3E')), stop(1, SH)]],
    ['linearGradient', { id: id(3), x1: 5, y1: 4, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('shine', '#FFFFFF'), 0.2), stop(0.5, SH, 0), stop(1, SH, 0.6)]],
    ['linearGradient', { id: id(4), x1: 0, y1: 2, x2: 0, y2: 12, gradientUnits: 'userSpaceOnUse' }, [stop(0, V('shine', '#FFFFFF'), 0.75), stop(1, V('shine', '#FFFFFF'), 0)]],
  ]];
  const out = [defs, ['ellipse', { cx: 12, cy: 21.5, rx: 8, ry: 1.4, fill: `url(#${id(0)})`, class: 'wm-shadow' }]];
  const part = (d, dd, fill, cls) => {
    out.push(['path', { d: dd, fill: SH, 'fill-opacity': 0.55, class: cls }]);
    out.push(['path', { d, fill, stroke: `url(#${id(3)})`, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: cls }]);
  };
  // leaves behind stalks
  const leaves = [[8.6, 7.6, 2.2, 4, 2.6], [8.8, 12.2, 2.8, 11.2, -2.2], [15.4, 6.4, 21.6, 3, -2.6], [15.4, 11.2, 21.4, 11.4, 2.2]];
  for (const [a, b, c, d, e] of leaves) part(leaf(a, b, c, d, e), leaf(a, b, c, d, e, 0.7), `url(#${id(2)})`, 'wm-a');
  // stalks
  const stalks = [[7, 2.5, 3.6, 18], [13.4, 5, 3.6, 15.5]];
  for (const [x, y, w, h] of stalks) part(rr(x, y, w, h, 1.6), rr(x, y + 0.8, w, h, 1.6), `url(#${id(1)})`, 'wm-k');
  // nodes (joints)
  const joints = [[7, 8.2], [7, 14.2], [13.4, 10.4], [13.4, 15.6]];
  for (const [x, y] of joints) {
    out.push(['path', { d: `M${x + 0.3} ${y}H${n(x + 3.3)}`, stroke: SH, 'stroke-opacity': 0.55, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }]);
    out.push(['path', { d: `M${x + 0.5} ${n(y + 0.55)}H${n(x + 3.1)}`, stroke: V('shine', '#FFFFFF'), 'stroke-opacity': 0.5, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-shine' }]);
  }
  // shine streaks
  for (const [x, y, h] of [[7, 2.5, 5], [13.4, 5, 4.6]]) {
    out.push(['path', { d: rr(x + 0.7, y + 0.8, 0.9, h - 1.2, 0.45), fill: `url(#${id(4)})`, class: 'wm-shine' }]);
  }
  for (const [cx, cy] of [[5.6, 4.6], [17.6, 3.9]]) out.push(['ellipse', { cx, cy, rx: 0.6, ry: 0.3, fill: V('shine', '#FFFFFF'), 'fill-opacity': 0.7, class: 'wm-shine' }]);
  return out;
}
