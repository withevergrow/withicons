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
export default function render() {
  const body = 'M4 7h2.6l1.5-2.2h7.8l1.5 2.2H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2zM12 9.3a3.7 3.7 0 1 0 0 7.4a3.7 3.7 0 1 0 0-7.4z';
  return [
    ['defs', {}, [shade('wg-christmas-camera-off-0', '2', '4.8', '14', '20')]],
    fillp(body, C2, 'wm-k'),
    ['path', { d: body, fill: 'url(#wg-christmas-camera-off-0)', 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['circle', { cx: '12', cy: '13', r: '2.3', fill: TINT, stroke: INK, 'stroke-width': '0.5', class: 'wm-a' }],
    ['circle', { cx: '11.2', cy: '12.2', r: '0.6', fill: SHINE, class: 'wm-shine' }],
    ...holly(18.8, 9.4),
    ...line2('M3 3L21 21', C1, 1.4, 'wm-s'),
  ];
}
