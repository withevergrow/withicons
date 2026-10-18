const INK = 'var(--with-christmas-ink, #3A0F17)';
const C1 = 'var(--with-christmas-c1, #C8203A)';
const C2 = 'var(--with-christmas-c2, #1F6E46)';
const AC = 'var(--with-christmas-accent, #F4C24D)';
const TINT = 'var(--with-christmas-tint, #C9DAEC)';
const SHINE = 'var(--with-christmas-shine, #FFFFFF)';
const SHADOW = 'var(--with-christmas-shadow, #4A0716)';
const shade = (id, x1, y1, x2, y2) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: '0', 'stop-color': SHINE, 'stop-opacity': '0.34' }],
  ['stop', { offset: '0.42', 'stop-color': SHINE, 'stop-opacity': '0' }],
  ['stop', { offset: '0.58', 'stop-color': SHADOW, 'stop-opacity': '0' }],
  ['stop', { offset: '1', 'stop-color': SHADOW, 'stop-opacity': '0.42' }]]];
const fillp = (d, fill, cls, extra = {}) => ['path', { d, fill, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': '0.6', 'stroke-linejoin': 'round', ...extra, ...(cls ? { class: cls } : {}) }];
const line2 = (d, col, w, cls) => [
  ['path', { d, stroke: INK, 'stroke-width': String(+(w + 1.2).toFixed(2)), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }],
  ['path', { d, stroke: col, 'stroke-width': String(w), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }]];
const holly = (x, y) => {
  const f = (v) => +v.toFixed(2);
  return [
    ['path', { d: `M${f(x)} ${f(y)}q-1 -1.1 -2.2 -.5q.5 1.2 2.2 .5zM${f(x)} ${f(y)}q1 -1.1 2.2 -.5q-.5 1.2 -2.2 .5z`, fill: C2, stroke: INK, 'stroke-width': '0.3', 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['circle', { cx: f(x - .45), cy: f(y + .15), r: '0.55', fill: C1, stroke: INK, 'stroke-width': '0.28', class: 'wm-deco' }],
    ['circle', { cx: f(x + .45), cy: f(y + .15), r: '0.55', fill: C1, stroke: INK, 'stroke-width': '0.28', class: 'wm-deco' }]];
};
const C3 = 'var(--with-christmas-c3, #E2A93B)';
const C4 = 'var(--with-christmas-c4, #FFF5E6)';
const snowGrad = (id, y1, y2) => ['linearGradient', { id, x1: '0', y1, x2: '0', y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: '0.25', 'stop-color': SHINE }],
  ['stop', { offset: '1', 'stop-color': TINT }]]];
const snow = (d, id) => ['path', { d, fill: `url(#${id})`, stroke: INK, 'stroke-width': '0.45', 'stroke-linejoin': 'round', class: 'wm-deco' }];
const sparkle = (x, y, s = 1.5) => {
  const f = (v) => +v.toFixed(2);
  const k = s * 0.3;
  return ['path', { d: `M${f(x)} ${f(y - s)}Q${f(x + k)} ${f(y - k)} ${f(x + s)} ${f(y)}Q${f(x + k)} ${f(y + k)} ${f(x)} ${f(y + s)}Q${f(x - k)} ${f(y + k)} ${f(x - s)} ${f(y)}Q${f(x - k)} ${f(y - k)} ${f(x)} ${f(y - s)}z`, fill: AC, stroke: INK, 'stroke-width': '0.3', 'stroke-linejoin': 'round', class: 'wm-deco' }];
};
export default function render() {
  const track = 'M7.5 6.5h9a5.5 5.5 0 0 1 0 11h-9a5.5 5.5 0 0 1 0-11z';
  return [
    ['defs', {}, [shade('wg-christmas-toggle-0', '2', '6.5', '10', '17.5'), snowGrad('wg-christmas-toggle-1', '5', '8.4')]],
    fillp(track, C2, 'wm-k'),
    ['path', { d: track, fill: 'url(#wg-christmas-toggle-0)', class: 'wm-shine' }],
    ['path', { d: 'M6.4 8.8h4.6', stroke: SHINE, 'stroke-opacity': '0.28', 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M7.4 9.8v4.4', stroke: C4, 'stroke-width': '1.6', 'stroke-linecap': 'round', class: 'wm-s' }],
    ['circle', { cx: '16.6', cy: '12.2', r: '5', fill: SHADOW, 'fill-opacity': '0.28', class: 'wm-shadow' }],
    ['circle', { cx: '16.5', cy: '12', r: '4.9', fill: C4, stroke: INK, 'stroke-width': '0.7', class: 'wm-a' }],
    ['path', { d: 'M19.6 14.9A4.8 4.8 0 0 1 13 16.3A4.3 4.3 0 0 0 19.6 14.9z', fill: TINT, 'fill-opacity': '0.7', class: 'wm-a' }],
    ['circle', { cx: '14.4', cy: '10', r: '1', fill: SHINE, class: 'wm-shine' }],
    snow('M3.1 8.6C3.4 6.4 5 5.9 7.2 5.9h5.4c1.2 0 1.9 .8 2 2.1q-.6 .7-1.2-.1q-.7-.9-1.3 .1q-.6 .8-1.3-.1q-.7-.8-1.4 .1q-.7 .9-1.4-.1q-.6-.7-1.2 0q-.6 .8-1.2 0q-.5-.4-.9 .1q-.5 .5-.8-.1z', 'wg-christmas-toggle-1'),
    ...holly(8.6, 6.4),
  ];
}
