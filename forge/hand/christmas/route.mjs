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
  const road = 'M6 18.5H15A3 3 0 0 0 15 12.5H9A3 3 0 0 1 9 6.5H15';
  const pin = 'M18 11.2C17 9.8 14.7 8.4 14.7 5.7a3.3 3.3 0 0 1 6.6 0C21.3 8.4 19 9.8 18 11.2z';
  return [
    ['defs', {}, [snowGrad('wg-christmas-route-0', '2', '5')]],
    ['path', { d: road, stroke: INK, 'stroke-width': '4', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: road, stroke: C2, 'stroke-width': '2.8', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: road, stroke: C4, 'stroke-width': '0.7', 'stroke-dasharray': '1.3 1.5', class: 'wm-a' }],
    fillp(pin, C1, 'wm-s'),
    ['circle', { cx: '18', cy: '6.1', r: '1.15', fill: C4, stroke: INK, 'stroke-width': '0.4', class: 'wm-s' }],
    snow('M14.8 5C14.9 3 16.2 2 18 2s3.1 1 3.2 3q-.5 .8-1.1 .1q-.6-.9-1.2 .1q-.6 .8-1.3 0q-.6-.9-1.2 .1q-.6 .8-1.2 0q-.6-.4-.6-.4z', 'wg-christmas-route-0'),
    ['circle', { cx: '5.4', cy: '18.5', r: '2.7', fill: C4, stroke: INK, 'stroke-width': '0.6', class: 'wm-s' }],
    ['circle', { cx: '5.4', cy: '18.5', r: '1.2', fill: C1, class: 'wm-s' }],
    ['circle', { cx: '4.7', cy: '17.8', r: '0.5', fill: SHINE, class: 'wm-shine' }],
    ...holly(18, 2.9),
  ];
}
