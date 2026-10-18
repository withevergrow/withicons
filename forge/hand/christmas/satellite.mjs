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
const f = (v) => +v.toFixed(2);
const A = Math.SQRT1_2;
// local frame: u along the panel axis (top-left to bottom-right), v toward the top-right
const pt = (u, v) => [f(12 + (u + v) * A), f(12 + (u - v) * A)];
const q = (u, v) => pt(u, v).join(' ');
const rr = (u0, u1, v0, v1, r) =>
  `M${q(u0 + r, v0)}L${q(u1 - r, v0)}A${r} ${r} 0 0 0 ${q(u1, v0 + r)}L${q(u1, v1 - r)}A${r} ${r} 0 0 0 ${q(u1 - r, v1)}` +
  `L${q(u0 + r, v1)}A${r} ${r} 0 0 0 ${q(u0, v1 - r)}L${q(u0, v0 + r)}A${r} ${r} 0 0 0 ${q(u0 + r, v0)}z`;
const seg = (u0, v0, u1, v1) => `M${q(u0, v0)}L${q(u1, v1)}`;
export default function render() {
  const panelA = rr(-10.8, -4.9, -3.3, 3.3, 0.7);
  const panelB = rr(4.9, 10.8, -3.3, 3.3, 0.7);
  const gridA = seg(-7.85, -3.3, -7.85, 3.3) + seg(-10.8, 0, -4.9, 0);
  const gridB = seg(7.85, -3.3, 7.85, 3.3) + seg(4.9, 0, 10.8, 0);
  const body = rr(-3.3, 3.3, -3.3, 3.3, 1.1);
  const dish = `M${q(-4, -7)}C${q(-3.8, -3.6)} ${q(3.8, -3.6)} ${q(4, -7)}z`;
  const tip = pt(0, -9.6);
  return [
    ['defs', {}, [shade('wg-christmas-satellite-0', '6', '6', '17', '18')]],
    ...line2(seg(-5.2, 0, 5.2, 0), C3, 1.3, 'wm-k'),
    ...line2(seg(0, -3, 0, -5), C3, 1.2, 'wm-k'),
    fillp(panelA, C1, 'wm-a'),
    fillp(panelB, C1, 'wm-a'),
    ['path', { d: gridA + gridB, stroke: C4, 'stroke-width': '0.55', 'stroke-linecap': 'round', class: 'wm-a' }],
    fillp(body, C3, 'wm-k'),
    ['path', { d: body, fill: 'url(#wg-christmas-satellite-0)', class: 'wm-shine' }],
    ['circle', { cx: '12', cy: '12', r: '1.5', fill: TINT, stroke: INK, 'stroke-width': '0.5', class: 'wm-s' }],
    ['circle', { cx: '11.5', cy: '11.5', r: '0.5', fill: SHINE, class: 'wm-shine' }],
    ...line2(seg(0, -5.6, 0, -9), C4, 0.8, 'wm-s'),
    fillp(dish, C4, 'wm-s'),
    ['circle', { cx: String(tip[0]), cy: String(tip[1]), r: '0.95', fill: C1, stroke: INK, 'stroke-width': '0.45', class: 'wm-s' }],
    sparkle(19.4, 4.6, 1.7),
    ...holly(12, 8.4),
  ];
}
