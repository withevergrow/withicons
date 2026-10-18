// forge/hand/glass/plus-circle.mjs: a frosted glass disc with a bold white-filled plus, dark-edged so it reads at 16px.
const f = (n) => (Math.round(n * 100) / 100).toString();
const V = (r, h) => `var(--with-glass-${r}, ${h})`;
// shapes: array of (dx, dy) => d. Returns [defs, shadow, body, glow, frost pane, shine] nodes.
function glass(name, shapes, shine, box, kclass = 'wm-k') {
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
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(0)})`, 'fill-rule': 'evenodd', class: kclass }]);
  for (const s of shapes) out.push(['path', { d: s(0.8, 0.9), fill: `url(#${id(1)})`, 'fill-rule': 'evenodd', class: kclass }]);
  for (const s of shapes) out.push(['path', { d: s(0, 0), fill: `url(#${id(2)})`, stroke: 'currentColor', 'stroke-opacity': '0.2', 'stroke-width': '0.5', 'fill-rule': 'evenodd', class: kclass }]);
  if (shine) out.push(['path', { d: shine, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-opacity': '0.85', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }]);
  return out;
}
const etchLine = (d, w, op, cls) => ['path', { d, fill: 'none', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': String(op), 'stroke-width': String(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }];
const rr = (x, y, w, h, r) => (dx, dy) => { const X = x + dx, Y = y + dy; return `M${f(X + r)} ${f(Y)}H${f(X + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w)} ${f(Y + r)}V${f(Y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + w - r)} ${f(Y + h)}H${f(X + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X)} ${f(Y + h - r)}V${f(Y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(X + r)} ${f(Y)}Z`; };
const ci = (cx, cy, r) => (dx, dy) => `M${f(cx + dx - r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx + r)} ${f(cy + dy)}A${f(r)} ${f(r)} 0 1 0 ${f(cx + dx - r)} ${f(cy + dy)}Z`;
const plus = (dx, dy) => { const a = 7.6, b = 10.7, c = 13.3, d = 16.4; const P = [[b, a], [c, a], [c, b], [d, b], [d, c], [c, c], [c, d], [b, d], [b, c], [a, c], [a, b], [b, b]]; return `M${P.map(([x, y]) => `${f(x + dx)} ${f(y + dy)}`).join('L')}Z`; };
export default function render() {
  return [...glass('plus-circle', [ci(12, 12, 9.5)], 'M4.6 9.6C5.4 6.8 7.4 4.9 10.2 4.2', [2.5, 2.5, 21.5, 21.5]),
    ['path', { d: plus(0.7, 0.8), fill: V('shadow', '#6A45D6'), 'fill-opacity': '0.35', 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: plus(0, 0), fill: V('frost', '#FFFFFF'), 'fill-opacity': '0.96', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.85', 'stroke-width': '1', 'stroke-linejoin': 'round', class: 'wm-a' }]];
}
