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

export default function render() {
  const n = 'kalash';
  const pot = 'M9.6 10.6C5.2 11.6 4.6 21.6 12 21.6C19.4 21.6 18.8 11.6 14.4 10.6Z';
  const leaves = 'M11 8.8C9.2 6.4 6.2 5.8 3.4 6.6C4.8 8.8 7.8 9.8 11 8.8ZM13 8.8C14.8 6.4 17.8 5.8 20.6 6.6C19.2 8.8 16.2 9.8 13 8.8ZM12 7.4C10.2 5.4 10.2 3.2 12 1.4C13.8 3.2 13.8 5.4 12 7.4Z';
  return [defs(n),
    K(leaves, V('c2', '#1F6E46'), 'wm-a'),
    K('M9.2 7.9a2.8 2.5 0 1 0 5.6 0a2.8 2.5 0 1 0 -5.6 0z', V('c3', '#E2A93B'), 'wm-a'),
    snow(n, 'M9.7 6.9C10.4 5 13.6 5 14.3 6.9C13.7 7.3 13.3 6.7 12.7 7.1C12.2 7.5 11.8 6.8 11.3 7.1C10.7 7.5 10.2 6.9 9.7 6.9Z'),
    K(pot, V('c1', '#C8203A'), 'wm-k'),
    K('M8.6 9.4H15.4A.6 .6 0 0 1 15.4 10.6H8.6A.6 .6 0 0 1 8.6 9.4Z', V('accent', '#F4C24D'), 'wm-k'),
    K('M5.7 14.9C9.6 15.9 14.4 15.9 18.3 14.9C18.6 15.7 18.7 16.4 18.6 17.1C14.4 18.1 9.6 18.1 5.4 17.1C5.3 16.4 5.4 15.7 5.7 14.9Z', V('accent', '#F4C24D'), 'wm-s'),
    shine(n, pot)];
}
void f;
