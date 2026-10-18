// forge/hand/christmas/avatar-teen.mjs — a teen in a cranberry hoodie: hood framing a big brown face with a dark fringe, ink eyes and a smile, drawstrings, snow on the hood.
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
  const n = 'avatar-teen';
  const SKIN = V('c1', '#7B4B2C'), HAIR = V('c2', '#2A2120'), HOOD = V('c4', '#C8203A'), SH = V('shadow', '#43230F');
  const body = 'M3.4 22C3.4 18.8 6.4 17.4 12 17.4C17.6 17.4 20.6 18.8 20.6 22Z';
  const hood = 'M12 2.8C17.2 2.8 19.8 6.6 19.6 11.6C19.5 15 18.8 17.4 17.6 18.8L6.4 18.8C5.2 17.4 4.5 15 4.4 11.6C4.2 6.6 6.8 2.8 12 2.8Z';
  const opening = 'M12 4.8C16 4.8 18.4 7.8 18.4 11.8C18.4 15.4 15.8 18 12 18C8.2 18 5.6 15.4 5.6 11.8C5.6 7.8 8 4.8 12 4.8Z';
  const face = 'M12 6.8C15.4 6.8 17.3 9.2 17.3 12.2C17.3 15.4 15.2 17.6 12 17.6C8.8 17.6 6.7 15.4 6.7 12.2C6.7 9.2 8.6 6.8 12 6.8Z';
  const fringe = 'M6.8 11.2C6.6 8.2 8.8 6.4 12 6.4C15.2 6.4 17.4 8.2 17.2 11.2C16 9.6 14.2 9.2 12.8 9.7C11.4 8.8 8.4 9.2 6.8 11.2Z';
  return [defs(n),
    K(body, HOOD, 'wm-k'),
    K(hood, HOOD, 'wm-k'),
    ['path', { d: opening, fill: SH, 'fill-opacity': '0.38', stroke: INK, 'stroke-width': '0.5', 'stroke-linejoin': 'round', class: 'wm-k' }],
    K(face, SKIN, 'wm-k'),
    K(fringe, HAIR, 'wm-k'),
    ['circle', { cx: '9.9', cy: '12.8', r: '0.8', fill: INK }],
    ['circle', { cx: '14.1', cy: '12.8', r: '0.8', fill: INK }],
    ['circle', { cx: '10.15', cy: '12.5', r: '0.28', fill: V('shine', '#FFFFFF') }],
    ['circle', { cx: '14.35', cy: '12.5', r: '0.28', fill: V('shine', '#FFFFFF') }],
    ['path', { d: 'M10.1 15.1Q12 17 13.9 15.1', stroke: INK, 'stroke-width': '0.65', 'stroke-linecap': 'round', fill: 'none' }],
    ['path', { d: 'M9.6 18.6L9.2 21M14.4 18.6L14.8 21', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.9', 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }],
    snow(n, 'M6.8 5.6C7.8 1.6 16.2 1.6 17.2 5.6C16.5 6.2 15.9 5.3 15.2 5.8C14.5 6.3 13.9 5.4 13.2 5.8C12.5 6.2 11.9 5.4 11.2 5.8C10.5 6.2 9.9 5.4 9.2 5.8C8.5 6.2 7.5 6.2 6.8 5.6Z'),
    ...holly(14.6, 3.7),
    shine(n, body + hood)];
}
