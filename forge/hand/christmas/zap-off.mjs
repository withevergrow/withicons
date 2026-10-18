const V = (r, h) => `var(--with-christmas-${r}, ${h})`;
const INK = V('ink', '#3A0F17');
const K = (d, f, cls, w = 0.6) => ['path', { d, fill: f, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }];
const ST = (d, c, w, cls) => [['path', { d, fill: 'none', stroke: INK, 'stroke-width': w + 1.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }], ['path', { d, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }]];
const SH = (d, id) => ['path', { d, fill: `url(#${id})`, 'fill-rule': 'evenodd', class: 'wm-shine' }];
const DEFS = (id) => ['defs', {}, [['linearGradient', { id, x1: 2, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: 0, 'stop-color': V('shine', '#FFFFFF'), 'stop-opacity': 0.34 }],
  ['stop', { offset: 0.42, 'stop-color': V('shine', '#FFFFFF'), 'stop-opacity': 0 }],
  ['stop', { offset: 0.58, 'stop-color': V('shadow', '#4A0716'), 'stop-opacity': 0 }],
  ['stop', { offset: 1, 'stop-color': V('shadow', '#4A0716'), 'stop-opacity': 0.42 }]]]]];
const SPARK = (x, y) => K(`M${x} ${y - 1.55}Q${x + 0.34} ${y - 0.34} ${x + 1.55} ${y}Q${x + 0.34} ${y + 0.34} ${x} ${y + 1.55}Q${x - 0.34} ${y + 0.34} ${x - 1.55} ${y}Q${x - 0.34} ${y - 0.34} ${x} ${y - 1.55}z`, V('accent', '#F4C24D'), 'wm-deco', 0.28);
const RED = V('c1', '#C8203A'), GREEN = V('c2', '#1F6E46'), GOLD = V('c3', '#E2A93B'), CREAM = V('c4', '#FFF5E6');export default function render() {
  const id = 'wg-christmas-zap-off-0';
  const b = 'M14.4 1.6L4.4 13.6h6.4l-1.8 8.8 10.6-12.6h-6.6z';
  return [DEFS(id), K(b, GOLD, 'wm-k'), SH(b, id),
    ...ST('M3.5 3.5l17 17', GREEN, 1.1, 'wm-s')];
}
