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
  const n = 'avatar-penguin';
  const body = 'M12 2.6C7.6 2.6 6.1 6.4 6.1 11C6.1 16.2 6.8 20.4 12 20.4C17.2 20.4 17.9 16.2 17.9 11C17.9 6.4 16.4 2.6 12 2.6Z';
  return [defs(n),
    K('M6.4 10.4C4.4 11.8 3.6 14 3.6 16C5 15.6 6.2 14.6 6.6 13.6ZM17.6 10.4C19.6 11.8 20.4 14 20.4 16C19 15.6 17.8 14.6 17.4 13.6Z', INK, 'wm-a'),
    K(body, INK, 'wm-k'),
    K('M12 9.4C9.4 9.4 8.4 11.8 8.4 14.4C8.4 17.4 9.6 19.4 12 19.4C14.4 19.4 15.6 17.4 15.6 14.4C15.6 11.8 14.6 9.4 12 9.4Z', V('c4', '#FFF5E6'), 'wm-k'),
    ['circle', { cx: '9.9', cy: '7.6', r: '1.15', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '14.1', cy: '7.6', r: '1.15', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '10.1', cy: '7.7', r: '0.55', fill: INK }],
    ['circle', { cx: '13.9', cy: '7.7', r: '0.55', fill: INK }],
    K('M10.5 8.9H13.5L12 11Z', V('accent', '#F4C24D'), 'wm-s'),
    K('M8.2 20.3a1.8 .9 0 1 0 3.6 0a1.8 .9 0 1 0 -3.6 0zM12.2 20.3a1.8 .9 0 1 0 3.6 0a1.8 .9 0 1 0 -3.6 0z', V('accent', '#F4C24D'), 'wm-s'),
    snow(n, 'M7.3 5.6C8.4 1.8 15.6 1.8 16.7 5.6C16 6.2 15.4 5.3 14.7 5.8C14 6.3 13.4 5.4 12.7 5.8C12 6.2 11.4 5.4 10.7 5.8C10 6.2 9.4 5.4 8.7 5.8C8.1 6.1 7.6 5.8 7.3 5.6Z'),
    ...holly(14.2, 3.7),
    shine(n, body)];
}
