// forge/hand/christmas/jalebi.mjs — a thick golden-orange syrupy coil of fried batter with a glossy glint; no snow cap, a sparkle.
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


// centre line of the coil: a loose, slightly wobbly spiral (jalebi is piped by hand) turned into cubic Beziers
function spiral(off = [0, 0], t0 = 0, t1 = 1) {
  const steps = 40, pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + (t1 - t0) * (i / steps), a = 2.4 + t * 2.3 * Math.PI * 2;
    const r = (1.6 + 6.5 * t) * (1 + 0.1 * Math.sin(2.1 * a + 0.8));
    pts.push([11.2 + off[0] + r * 1.04 * Math.cos(a), 11.6 + off[1] + r * 0.94 * Math.sin(a)]);
  }
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

export default function render() {
  const n = 'jalebi';
  const coil = spiral();
  const glint = spiral([-0.4, -0.4], 0.45, 0.97);
  const stroke = (w, c, extra = {}) => ['path', { d: coil, fill: 'none', stroke: c, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }];
  return [defs(n),
    stroke('2.7', INK, { class: 'wm-k' }),
    stroke('1.7', V('c3', '#E2A93B'), { class: 'wm-k' }),
    stroke('0.8', V('edge', '#FFB347'), { class: 'wm-k', 'stroke-opacity': '0.8' }),
    ['path', { d: glint, fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.45', 'stroke-linecap': 'round', 'stroke-dasharray': '5 3', 'stroke-opacity': '0.9', class: 'wm-shine' }],
    ['path', { d: 'M19.6 15.6Q19.9 17 21.1 18.1Q22.2 19.2 21.4 20.6Q20.7 21.8 19.4 21.7Q18 21.6 17.7 20.2Q17.4 18.9 18.4 17.8Q19.4 16.8 19.6 15.6z', fill: V('c3', '#E2A93B'), stroke: INK, 'stroke-width': '0.5', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: 'M19.1 19.2Q18.9 20.1 19.5 20.6', fill: 'none', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.5', 'stroke-linecap': 'round', 'stroke-opacity': '0.9', class: 'wm-shine' }],
    ['path', { d: 'M21 1.45Q21.34 2.66 22.55 3Q21.34 3.34 21 4.55Q20.66 3.34 19.45 3Q20.66 2.66 21 1.45z', fill: V('accent', '#F4C24D'), stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }]];
}
