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
  const id = 'wg-christmas-phone-missed-0';
  const h = 'M5.5 3.5h2.6l1.5 4.2-2.1 1.5a11 11 0 0 0 5.3 5.3l1.5-2.1 4.2 1.5v2.6a2.2 2.2 0 0 1-2.2 2.2A16.5 16.5 0 0 1 3.3 5.7a2.2 2.2 0 0 1 2.2-2.2z';
  return [DEFS(id), K(h, RED, 'wm-k'), SH(h, id),
    ...ST('M21.2 2.8l-5.9 5.9M15 4.2v4.6h4.6', CREAM, 1.7, 'wm-s'), SPARK(19.6, 8.6)];
}
