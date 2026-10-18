// forge/hand/christmas/gold-ingot.mjs — a stack of three tapered gold bars (two below, one on top) with light flat top faces, one shine and sparkles.
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
  const n = 'gold-ingot';
  const bar = (x, yb, W, Hh, D) => {
    const a = x + 1.2, b = x + W - 1.2;
    return {
      front: `M${f(x)} ${f(yb)}L${f(x + W)} ${f(yb)}L${f(b)} ${f(yb - Hh)}L${f(a)} ${f(yb - Hh)}Z`,
      top: `M${f(a)} ${f(yb - Hh)}L${f(b)} ${f(yb - Hh)}L${f(b - 1)} ${f(yb - Hh - D)}L${f(a + 1)} ${f(yb - Hh - D)}Z`,
    };
  };
  const A = bar(2, 19, 9.6, 4, 2.8), B = bar(12.4, 19, 9.6, 4, 2.8), T = bar(7.2, 13.6, 9.6, 4, 2.8);
  const fr = (d) => K(d, V('c3', '#E2A93B'), 'wm-k');
  const tp = (d) => K(d, V('accent', '#F4C24D'), 'wm-k');
  const spark = (cx, cy, r) => ['path', { d: `M${f(cx)} ${f(cy - r)}Q${f(cx + r * 0.28)} ${f(cy - r * 0.28)} ${f(cx + r)} ${f(cy)}Q${f(cx + r * 0.28)} ${f(cy + r * 0.28)} ${f(cx)} ${f(cy + r)}Q${f(cx - r * 0.28)} ${f(cy + r * 0.28)} ${f(cx - r)} ${f(cy)}Q${f(cx - r * 0.28)} ${f(cy - r * 0.28)} ${f(cx)} ${f(cy - r)}z`, fill: V('accent', '#F4C24D'), stroke: INK, 'stroke-width': '0.28', 'stroke-linejoin': 'round', class: 'wm-deco' }];
  return [defs(n),
    fr(A.front), tp(A.top), fr(B.front), tp(B.top),
    fr(T.front), tp(T.top),
    ['path', { d: 'M8.6 8.9L11.2 8.9', stroke: V('shine', '#FFFFFF'), 'stroke-width': '0.9', 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }],
    shine(n, A.front + A.top + B.front + B.top + T.front + T.top),
    spark(20.4, 4.6, 1.9), spark(4.2, 7.4, 1.2)];
}
