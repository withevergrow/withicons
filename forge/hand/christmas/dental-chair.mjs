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
  return [
    ...line2('M21.5 2.5H16.2V6', C2, 0.7, 'wm-a'),
    fillp('M13.5 8.6a2.7 2.7 0 0 1 5.4 0z', AC, 'wm-a'),
    ['path', { d: 'M12 15.6V19', stroke: INK, 'stroke-width': '2.6', 'stroke-linecap': 'round' }],
    ['path', { d: 'M12 15.6V19', stroke: C2, 'stroke-width': '1.4', 'stroke-linecap': 'round' }],
    fillp('M8.5 19h7a1 1 0 0 1 1 1v.5a.5 .5 0 0 1-.5 .5h-8a.5 .5 0 0 1-.5-.5V20a1 1 0 0 1 1-1z', C2),
    ...line2('M5.4 7L7.9 14.6H18.4L20.6 18.6', C1, 2.4, 'wm-k'),
    fillp('M4.5 2.4a1.6 1.6 0 1 0 0 3.2a1.6 1.6 0 1 0 0-3.2z', C1, 'wm-k'),
  ];
}
