// forge/hand/glass/sun-moon.mjs — a frosted glass sun disc with six thick rays and a deep etched crescent over its right half.
const f = (n) => (Math.round(n * 100) / 100).toString();
const V = (r, h) => `var(--with-glass-${r}, ${h})`;
// shapes: array of (dx, dy) => d ; etch: array of [d, attrs]; shine: d
function glass(name, shapes, etch, shine, box) {
  const [x1, y1, x2, y2] = box;
  const id = (n) => `wg-glass-${name}-${n}`;
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: f(x1 + 1.5), y1: f(y1 + 1.5), x2: f(x2 + 1.5), y2: f(y2 + 1.5), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('back', '#7484FF') }],
      ['stop', { offset: '1', 'stop-color': V('shadow', '#6A45D6') }]]],
    ['radialGradient', { id: id(1), cx: f(x2 - 3), cy: f(y2 - 3), r: '8', gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.5', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0.22' }],
      ['stop', { offset: '1', 'stop-color': V('accent', '#F2679E'), 'stop-opacity': '0' }]]],
    ['linearGradient', { id: id(2), x1: f(x1), y1: f(y1), x2: f(x2), y2: f(y2), gradientUnits: 'userSpaceOnUse' }, [
      ['stop', { offset: '0', 'stop-color': V('frost', '#FFFFFF'), 'stop-opacity': '0.6' }],
      ['stop', { offset: '0.4', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.55' }],
      ['stop', { offset: '1', 'stop-color': V('pane', '#E4E8FF'), 'stop-opacity': '0.42' }]]],
  ]];
  const out = [defs];
  for (const s of shapes) out.push(['path', { d: s(1.2, 1.4), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.1', 'fill-rule': 'evenodd', class: 'wm-shadow' }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(1)})`, 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const s of shapes) out.push(['path', { d: s(0, 0), fill: `url(#${id(2)})`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', 'fill-rule': 'evenodd', class: 'wm-k' }]);
  for (const [d, a] of etch) out.push(['path', { d, fill: 'none', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.62', 'stroke-width': '0.9', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...a }]);
  if (shine) out.push(['path', { d: shine, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.85', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
// helpers
const rr = (x, y, w, h, r) => (dx, dy) => { x += 0; const X = x + dx, Y = y + dy; return `M${f(X + r)} ${f(Y)}H${f(X + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w)} ${f(Y + r)}V${f(Y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w - r)} ${f(Y + h)}H${f(X + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X)} ${f(Y + h - r)}V${f(Y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + r)} ${f(Y)}Z`; };
const ci = (cx, cy, r) => (dx, dy) => `M${f(cx + dx - r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx + r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx - r)} ${f(cy + dy)}Z`;
export default function render() {
  const rays = []
  for (const k of [2, 3, 4, 5, 6]) { const a = k * Math.PI / 4, c = Math.cos(a), s = Math.sin(a); rays.push(`M${f(11 + 7.2 * c)} ${f(12 + 7.2 * s)}L${f(11 + 9.2 * c)} ${f(12 + 9.2 * s)}`) }
  return glass('sun-moon', [(dx, dy) => `M${f(11 + dx)} ${f(6.4 + dy)}A5.6 5.6 0 0 0 ${f(11 + dx)} ${f(17.6 + dy)}Z`], [
    [rays.join(''), { stroke: 'url(#wg-glass-sun-moon-0)', 'stroke-opacity': '1', 'stroke-width': '2', class: 'wm-deco' }],
  ], 'M7.6 10.2C8 9 8.8 8 9.8 7.6', [5.4, 6.4, 11, 17.6]).concat([
    ['path', { d: 'M13.4 5.4A6.6 6.6 0 0 1 13.4 18.6A3.6 6.6 0 0 0 13.4 5.4Z', fill: V('etch', '#3E3A8C'), 'fill-opacity': '0.95', stroke: V('back', '#7484FF'), 'stroke-opacity': '0.9', 'stroke-width': '0.9', 'stroke-linejoin': 'round', class: 'wm-a' }]])
}
