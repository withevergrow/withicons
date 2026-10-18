const W = 'var(--with-brutal-shine, #FFFDF5)';
const K = 'var(--with-brutal-ink, #16130F)';
const Y = 'var(--with-brutal-c1, #FFD23F)';
const G = 'var(--with-brutal-c3, #3DDC97)';
const S = { stroke: K, 'stroke-width': '1.6', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
const f = (n) => Number(n.toFixed(2));
const sh = (d, x, y) => d.replace(/M([\d.]+) ([\d.]+)/, (_, a, b) => `M${f(+a + x)} ${f(+b + y)}`);
const SHELL = 'M3 14.6c0-4.8 3.6-8.4 8-8.4s8 3.6 8 8.4z';
const HEAD = 'M17.4 12.2c.4-2.6 1.6-4.2 3.2-4.2 1.3 0 2 1 2 2.2 0 1.8-1.6 3-3.4 3.2l-.6 1.4z';
const LEGS = [[4.4, 13.6], [7.8, 13.6], [12, 13.6], [15.4, 13.6]];
const TAIL = 'M3.4 14.4l-2.2 1.4 2.4 .4z';
export default function render() {
  const o = 1.25;
  const out = [];
  const HW = { fill: W, stroke: W, 'stroke-width': '3.4', 'stroke-linejoin': 'round', class: 'wm-shadow' };
  for (const d of [0, o]) {
    out.push(['path', { d: sh(TAIL, d, d), ...HW }], ['path', { d: sh(HEAD, d, d), ...HW }], ['path', { d: sh(SHELL, d, d), ...HW }]);
    for (const [x, y] of LEGS) out.push(['rect', { x: f(x + d), y: f(y + d), width: '2.6', height: '5.2', rx: '.8', ...HW }]);
  }
  out.push(['path', { d: sh(TAIL, o, o), fill: K, class: 'wm-shadow' }]);
  out.push(['path', { d: sh(HEAD, o, o), fill: K, class: 'wm-shadow' }]);
  for (const [x, y] of LEGS) out.push(['rect', { x: f(x + o), y: f(y + o), width: '2.6', height: '5.2', rx: '.8', fill: K, class: 'wm-shadow' }]);
  out.push(['path', { d: sh(SHELL, o, o), fill: K, class: 'wm-shadow' }]);
  out.push(['path', { d: TAIL, fill: G, ...S, class: 'wm-k' }]);
  for (const [x, y] of LEGS) out.push(['rect', { x, y: f(y), width: '2.6', height: '5.2', rx: '.8', fill: G, ...S, class: 'wm-k' }]);
  out.push(['path', { d: HEAD, fill: G, ...S, class: 'wm-k' }]);
  out.push(['path', { d: SHELL, fill: Y, ...S, class: 'wm-k' }]);
  // hex pattern
  out.push(['path', { d: 'M9.6 9.2h2.8l1.4 2.4-1.4 2.4h-2.8l-1.4-2.4zM8.2 11.6h-2.6M13.8 11.6h2.8M9.6 9.2l-1-2M12.4 9.2l1-2M9.6 14v.6M12.4 14v.6', fill: 'none', stroke: K, 'stroke-width': '1.2', 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }]);
  out.push(['circle', { cx: '20.5', cy: '10', r: '.75', fill: K }]);
  return out;
}
