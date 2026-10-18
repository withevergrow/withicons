// forge/hand/christmas/avatar-koala.mjs — a silvery koala: big round fluffy ears with pale inner ears, a large dark oval nose, small eyes; snow and holly between the ears.
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
  const n = 'avatar-koala';
  const head = 'M12 6.4C16.6 6.4 19 9.4 19 13.2C19 17.2 16.2 19.8 12 19.8C7.8 19.8 5 17.2 5 13.2C5 9.4 7.4 6.4 12 6.4Z';
  const fur = V('tint', '#C9DAEC');
  const shade = (d) => ['path', { d, fill: V('shadow', '#4A0716'), 'fill-opacity': '0.2', 'fill-rule': 'evenodd', class: 'wm-k' }];
  const ears = 'M5.1 4.6a3.7 3.7 0 1 0 .01 0zM18.9 4.6a3.7 3.7 0 1 0 .01 0z';
  const earL = 'M1.4 8.5a3.7 3.7 0 1 0 7.4 0a3.7 3.7 0 1 0 -7.4 0z';
  const earR = 'M15.2 8.5a3.7 3.7 0 1 0 7.4 0a3.7 3.7 0 1 0 -7.4 0z';
  void ears;
  return [defs(n),
    K(earL, fur, 'wm-a'),
    K(earR, fur, 'wm-a'),
    shade(earL + earR),
    ['path', { d: 'M3 8.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0zM17 8.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0z', fill: V('c4', '#FFF5E6'), stroke: INK, 'stroke-width': '0.42', class: 'wm-a' }],
    K(head, fur, 'wm-k'),
    shade(head),
    ['path', { d: 'M8.4 15.4C9.2 17.2 10.4 18 12 18C13.6 18 14.8 17.2 15.6 15.4', fill: V('shine', '#FFFFFF'), 'fill-opacity': '0.35', class: 'wm-deco' }],
    K('M12 11.2C13.6 11.2 14.2 12.6 14.2 14C14.2 15.8 13.2 16.8 12 16.8C10.8 16.8 9.8 15.8 9.8 14C9.8 12.6 10.4 11.2 12 11.2Z', INK, 'wm-k'),
    ['path', { d: 'M11.1 12.4C11.5 12 12.2 12 12.5 12.3', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.6', 'stroke-linecap': 'round', fill: 'none' }],
    ['circle', { cx: '8.3', cy: '12', r: '0.95', fill: INK }],
    ['circle', { cx: '15.7', cy: '12', r: '0.95', fill: INK }],
    ['circle', { cx: '8.6', cy: '11.7', r: '0.32', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '16', cy: '11.7', r: '0.32', fill: V('shine', '#FFFFFF') }],
    ['path', { d: 'M10.6 18.1C11.4 18.9 12.6 18.9 13.4 18.1', stroke: INK, 'stroke-width': '0.6', 'stroke-linecap': 'round', fill: 'none' }],
    ['path', { d: 'M5.8 15.6a1.1 .75 0 1 0 2.2 0a1.1 .75 0 1 0 -2.2 0zM16 15.6a1.1 .75 0 1 0 2.2 0a1.1 .75 0 1 0 -2.2 0z', fill: V('c1', '#C8203A'), 'fill-opacity': '0.3', class: 'wm-deco' }],
    snow(n, 'M8.6 9.4C9.4 5.4 14.6 5.4 15.4 9.4C14.8 9.9 14.3 9.2 13.7 9.6C13.1 10 12.6 9.3 12 9.7C11.4 9.3 10.9 10 10.3 9.6C9.7 9.2 9.2 9.9 8.6 9.4Z'),
    ...holly(13.9, 6.6),
    shine(n, head + earL + earR)];
}
