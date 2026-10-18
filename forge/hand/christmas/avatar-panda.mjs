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
  const n = 'avatar-panda';
  const head = 'M4 13.4a8 7.6 0 1 0 16 0a8 7.6 0 1 0 -16 0z';
  return [defs(n),
    K('M3.2 7.2a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0zM15.4 7.2a2.7 2.7 0 1 0 5.4 0a2.7 2.7 0 1 0 -5.4 0z', INK, 'wm-k'),
    K(head, V('c4', '#FFF5E6'), 'wm-k'),
    K('M6.9 13.2a2 2.6 0 1 0 4 0a2 2.6 0 1 0 -4 0zM13.1 13.2a2 2.6 0 1 0 4 0a2 2.6 0 1 0 -4 0z', INK, 'wm-k'),
    ['circle', { cx: '9.3', cy: '12.6', r: '0.75', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '14.7', cy: '12.6', r: '0.75', fill: V('shine', '#FFFFFF') }],
    K('M10.9 16.2H13.1C13.1 17 12.6 17.4 12 17.4C11.4 17.4 10.9 17 10.9 16.2Z', INK, 'wm-k'),
    ['path', { d: 'M12 17.4V18.2M10.6 18.4C11.2 18.9 11.6 18.6 12 18.2C12.4 18.6 12.8 18.9 13.4 18.4', stroke: INK, 'stroke-width': '0.6', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    ['path', { d: 'M5.4 17.2a1.3 .8 0 1 0 2.6 0a1.3 .8 0 1 0 -2.6 0zM16 17.2a1.3 .8 0 1 0 2.6 0a1.3 .8 0 1 0 -2.6 0z', fill: V('c1', '#C8203A'), 'fill-opacity': '0.35', class: 'wm-deco' }],
    snow(n, 'M6.6 8.3C8.4 5 15.6 5 17.4 8.3C16.6 9 16 8 15.2 8.6C14.4 9.2 13.8 8.2 13 8.7C12.2 9.2 11.6 8.2 10.8 8.7C10 9.2 9.4 8.3 8.6 8.7C7.8 9.1 7.2 8.6 6.6 8.3Z'),
    ...holly(13.4, 6.5),
    shine(n, head)];
}
