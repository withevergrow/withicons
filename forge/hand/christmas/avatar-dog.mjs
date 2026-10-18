// forge/hand/christmas/avatar-dog.mjs — a golden dog face with dark floppy ears, a cream muzzle, a big dark nose and a pink-red tongue; snow and holly on the crown.
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
  const n = 'avatar-dog';
  const head = 'M12 5.2C16.4 5.2 18.8 8.2 18.8 12.2C18.8 16.6 16 19.8 12 19.8C8 19.8 5.2 16.6 5.2 12.2C5.2 8.2 7.6 5.2 12 5.2Z';
  const earL = 'M7.4 6.4C4.6 5.6 2.4 8 2.4 11.8C2.4 15 3.4 16.6 5 16.6C6.8 16.6 7.4 14 7.6 11Z';
  const earR = 'M16.6 6.4C19.4 5.6 21.6 8 21.6 11.8C21.6 15 20.6 16.6 19 16.6C17.2 16.6 16.6 14 16.4 11Z';
  const muzzle = 'M12 12.6C14.4 12.6 16 14 16 15.9C16 17.8 14.4 19 12 19C9.6 19 8 17.8 8 15.9C8 14 9.6 12.6 12 12.6Z';
  return [defs(n),
    K(earL, V('c3', '#E2A93B'), 'wm-a'),
    K(earR, V('c3', '#E2A93B'), 'wm-a'),
    ['path', { d: earL + earR, fill: V('shadow', '#4A0716'), 'fill-opacity': '0.62', 'fill-rule': 'evenodd', class: 'wm-a' }],
    K(head, V('c3', '#E2A93B'), 'wm-k'),
    K(muzzle, V('c4', '#FFF5E6'), 'wm-k'),
    ['path', { d: 'M10.9 17.1H13.1V18.3C13.1 19.1 10.9 19.1 10.9 18.3Z', fill: V('c1', '#C8203A'), stroke: INK, 'stroke-width': '0.45', 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: 'M12 14.8V16.2M10.3 16.1C10.9 17.1 11.7 17 12 16.2C12.3 17 13.1 17.1 13.7 16.1', stroke: INK, 'stroke-width': '0.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    K('M10.2 12.9C10.2 12.2 13.8 12.2 13.8 12.9C13.8 14 12.8 14.9 12 14.9C11.2 14.9 10.2 14 10.2 12.9Z', INK, 'wm-k'),
    ['path', { d: 'M10.9 12.9C11.4 12.6 12.2 12.6 12.6 12.8', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.5', 'stroke-linecap': 'round', fill: 'none' }],
    ['circle', { cx: '8.7', cy: '11.4', r: '1.05', fill: INK }],
    ['circle', { cx: '15.3', cy: '11.4', r: '1.05', fill: INK }],
    ['circle', { cx: '9', cy: '11', r: '0.35', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '15.6', cy: '11', r: '0.35', fill: V('shine', '#FFFFFF') }],
    ['path', { d: 'M6.2 14.9a1.2 .8 0 1 0 2.4 0a1.2 .8 0 1 0 -2.4 0zM15.4 14.9a1.2 .8 0 1 0 2.4 0a1.2 .8 0 1 0 -2.4 0z', fill: V('c1', '#C8203A'), 'fill-opacity': '0.3', class: 'wm-deco' }],
    snow(n, 'M7.6 8.4C8.8 4.4 15.2 4.4 16.4 8.4C15.7 9 15.1 8.1 14.4 8.6C13.7 9.1 13.1 8.2 12.4 8.6C11.7 9.1 11.1 8.2 10.4 8.6C9.7 9.1 9.1 8.3 8.5 8.7C8.1 8.9 7.8 8.6 7.6 8.4Z'),
    ...holly(14.6, 6.6),
    shine(n, head + earL + earR)];
}
