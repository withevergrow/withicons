// forge/hand/glass/hotel.mjs: a rounded frosted hotel block with a sign bar and a bed (headboard, mattress, pillow, blanket).
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
const bld = (dx, dy) => { const X = 3.5 + dx, Y = 3 + dy; return `M${f(X)} ${f(Y + 18)}V${f(Y + 2)}A2 2 0 0 1 ${f(X + 2)} ${f(Y)}H${f(X + 15)}A2 2 0 0 1 ${f(X + 17)} ${f(Y + 2)}V${f(Y + 18)}Z`; };
const fillShape = (d, col, op, cls, extra = {}) => ['path', { d, fill: col, 'fill-opacity': String(op), ...extra, class: cls }];
export default function render() {
  const mattress = rr(6.2, 15.4, 11.6, 2.8, 1.1)(0, 0);
  const pillow = rr(7.9, 12.9, 4, 2.5, 1.2)(0, 0);
  return [...glass('hotel', [bld], 'M5.4 9V5.4Q5.4 4.4 6.4 4.4H9.4', [3.5, 3, 20.5, 21]),
    etchLine('M8.8 7.2H15.2', 1.6, 0.75, 'wm-k'),
    etchLine('M6.2 11.2V19.4M17.8 17V19.4', 1.7, 0.85, 'wm-k'),
    fillShape(mattress, V('etch', '#3E3A8C'), 0.78, 'wm-k'),
    fillShape(pillow, V('frost', '#FFFFFF'), 0.97, 'wm-a', { stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.7', 'stroke-width': '0.6' }),
    ['path', { d: 'M12.5 15.4V14.8A1.5 1.5 0 0 1 14 13.3H16.2A1.5 1.5 0 0 1 17.7 14.8V15.4Z', fill: V('accent', '#F2679E'), 'fill-opacity': '0.98', stroke: V('etch', '#3E3A8C'), 'stroke-opacity': '0.6', 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-a' }]];
}
