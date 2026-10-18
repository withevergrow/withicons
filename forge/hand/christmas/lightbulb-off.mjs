const f = (v) => String(+v.toFixed(2));
const V = (r, h) => `var(--with-christmas-${r}, ${h})`;
const INK = V('ink', '#3A0F17');
const K = (d, fill, cls, extra = {}) => ['path', { d, fill, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}), ...extra }];
const defs = (n) => ['defs', {}, [
  ['linearGradient', { id: `wg-christmas-${n}-0`, x1: '3', y1: '2', x2: '13', y2: '22', gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0', 'stop-color': V('shine', '#FFFFFF'), 'stop-opacity': '0.34' }],
    ['stop', { offset: '0.42', 'stop-color': V('shine', '#FFFFFF'), 'stop-opacity': '0' }],
    ['stop', { offset: '0.58', 'stop-color': V('shadow', '#4A0716'), 'stop-opacity': '0' }],
    ['stop', { offset: '1', 'stop-color': V('shadow', '#4A0716'), 'stop-opacity': '0.42' }]]],
  ['linearGradient', { id: `wg-christmas-${n}-1`, x1: '0', y1: '1', x2: '0', y2: '9', gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: '0.25', 'stop-color': V('shine', '#FFFFFF') }],
    ['stop', { offset: '1', 'stop-color': V('tint', '#C9DAEC') }]]]]];
const shine = (n, d) => ['path', { d, fill: `url(#wg-christmas-${n}-0)`, 'fill-rule': 'evenodd', class: 'wm-shine' }];
const snow = (n, d) => ['path', { d, fill: `url(#wg-christmas-${n}-1)`, stroke: INK, 'stroke-width': '0.42', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const holly = (x, y) => [
  ['path', { d: `M${f(x)} ${f(y)}q-1.1-.9-2.2-.1q1 .9 2.2 .1zM${f(x)} ${f(y)}q1.1-.9 2.2-.1q-1 .9-2.2 .1z`, fill: V('c2', '#1F6E46'), stroke: INK, 'stroke-width': '0.3', 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ['circle', { cx: f(x - 0.45), cy: f(y - 0.15), r: '0.5', fill: V('c1', '#C8203A'), stroke: INK, 'stroke-width': '0.28', class: 'wm-deco' }],
  ['circle', { cx: f(x + 0.45), cy: f(y - 0.15), r: '0.5', fill: V('c1', '#C8203A'), stroke: INK, 'stroke-width': '0.28', class: 'wm-deco' }],
  ['circle', { cx: f(x), cy: f(y - 0.75), r: '0.5', fill: V('c1', '#C8203A'), stroke: INK, 'stroke-width': '0.28', class: 'wm-deco' }]];

export default function render() {
  const n = 'lightbulb-off';
  const bulb = 'M12 2.4C8.1 2.4 5.4 5.2 5.4 8.8C5.4 11.3 6.9 12.8 8.2 14.2C8.9 15 9 15.7 9 16.4H15C15 15.7 15.1 15 15.8 14.2C17.1 12.8 18.6 11.3 18.6 8.8C18.6 5.2 15.9 2.4 12 2.4Z';
  return [defs(n),
    K(bulb, V('tint', '#C9DAEC'), 'wm-k', {}),
    K('M9 16.4H15V18.6A1 1 0 0 1 14 19.6H10A1 1 0 0 1 9 18.6Z', V('c3', '#E2A93B'), 'wm-k'),
    K('M10.4 19.6H13.6A1.6 1.6 0 0 1 10.4 19.6Z', V('c3', '#E2A93B'), 'wm-k'),
    ['path', { d: 'M9 17.9H15', stroke: INK, 'stroke-width': '0.5', 'stroke-linecap': 'round' }],
    snow(n, 'M8.2 4.8C9.6 2.4 14.4 2.4 15.8 4.8C15.1 5.4 14.6 4.6 13.9 5.1C13.2 5.6 12.7 4.7 12 5.1C11.3 5.5 10.8 4.7 10.1 5.1C9.4 5.5 8.8 4.9 8.2 4.8Z'),
    ...holly(14.4, 3.7),
    shine(n, bulb),
    ['path', { d: 'M10.3 12.4L11.2 9.6L12.8 11.4L13.7 8.6', fill: 'none', stroke: INK, 'stroke-width': '0.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['line', { x1: '5.2', y1: '4.4', x2: '18.8', y2: '19.2', stroke: V('c1', '#C8203A'), 'stroke-width': '1.6', 'stroke-linecap': 'round', class: 'wm-a' }],
    ['line', { x1: '5.2', y1: '4.4', x2: '18.8', y2: '19.2', stroke: INK, 'stroke-width': '0.5', 'stroke-linecap': 'round', class: 'wm-a' }]];
}
