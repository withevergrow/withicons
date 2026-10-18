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
  const id = 'wg-christmas-rose-0';
  const head = 'M12 2.5c3.2 0 5.5 2.2 5.5 5 0 3-2.4 5-5.5 5s-5.5-2-5.5-5c0-2.8 2.3-5 5.5-5z';
  const leafL = 'M11.6 16.5c-1.2-2.3-3.6-3.2-6-2.6 .9 2.4 3.4 3.4 6 2.6z';
  const leafR = 'M12.4 18c1.2-2.3 3.6-3.2 6-2.6-.9 2.4-3.4 3.4-6 2.6z';
  return [DEFS(id),
    ...ST('M12 12.5V21.5', GREEN, 1.4),
    K(leafL, GREEN), K(leafR, GREEN),
    K(head, RED, 'wm-a'), SH(head, id),
    ['path', { d: 'M12 7.6c.6-.6 1.6-.2 1.5.7-.1 1.1-1.6 1.6-2.6 1-1.2-.7-1-2.5.2-3.1 1.6-.8 3.5.3 3.6 2.2', fill: 'none', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round' }],
    ['path', { d: 'M8.6 6.5c.6-1.6 2.2-2.4 3.8-2.2', fill: 'none', stroke: INK, 'stroke-width': 0.7, 'stroke-linecap': 'round' }],
    SPARK(20, 3.5)];
}

