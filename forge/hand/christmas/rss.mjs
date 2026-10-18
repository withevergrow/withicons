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
const P = (cx, cy, r, deg) => {
  const t = deg * Math.PI / 180;
  return [+(cx + r * Math.sin(t)).toFixed(2), +(cy - r * Math.cos(t)).toFixed(2)];
};
const hi = (r, a, b, o) => {
  const [x1, y1] = P(5.5, 18.5, r, a), [x2, y2] = P(5.5, 18.5, r, b);
  return ['path', { d: `M${x1} ${y1}A${r} ${r} 0 0 1 ${x2} ${y2}`, stroke: SHINE, 'stroke-opacity': String(o), 'stroke-width': '0.8', 'stroke-linecap': 'round', class: 'wm-shine' }];
};
export default function render() {
  const cx = 5.5, cy = 18.5;
  return [
    ...line2('M5.5 4.5A14 14 0 0 1 19.5 18.5', C1, 2.6, 'wm-a'),
    hi(14.5, 8, 42, 0.3),
    ...line2('M5.5 11A7.5 7.5 0 0 1 13 18.5', C2, 2.6, 'wm-a'),
    ['path', { d: 'M5.5 11A7.5 7.5 0 0 1 13 18.5', stroke: SHINE, 'stroke-opacity': '0.16', 'stroke-width': '2.6', 'stroke-linecap': 'round', class: 'wm-a' }],
    hi(8.1, 10, 52, 0.5),
    ['circle', { cx: '5.5', cy: '18.5', r: '2.2', fill: C1, stroke: INK, 'stroke-width': '0.6', class: 'wm-k' }],
    ['circle', { cx: '4.8', cy: '17.8', r: '0.6', fill: SHINE, class: 'wm-shine' }],
    ...holly(14, 21.4),
    sparkle(19.4, 5, 1.6),
  ];
}
