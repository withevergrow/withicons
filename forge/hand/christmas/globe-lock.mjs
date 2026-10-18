import { circle, rect, polyD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, roundStrokeSet, strokeSet, dilate } from '../../kernel/bool.mjs'
import { setD } from '../../kernel/geom.mjs'
const V = (r, h) => `var(--with-christmas-${r}, ${h})`;
const INK = V('ink', '#3A0F17');
const C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6');
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716'), TINT = V('tint', '#C9DAEC'), ACC = V('accent', '#F4C24D');
const shade = (id, x1, y1, x2, y2) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: '0', 'stop-color': SHINE, 'stop-opacity': '0.34' }],
  ['stop', { offset: '0.42', 'stop-color': SHINE, 'stop-opacity': '0' }],
  ['stop', { offset: '0.58', 'stop-color': SHADOW, 'stop-opacity': '0' }],
  ['stop', { offset: '1', 'stop-color': SHADOW, 'stop-opacity': '0.42' }]]];
const snowG = (id, y1, y2) => ['linearGradient', { id, x1: '0', y1, x2: '0', y2, gradientUnits: 'userSpaceOnUse' }, [
  ['stop', { offset: '0.25', 'stop-color': SHINE }], ['stop', { offset: '1', 'stop-color': TINT }]]];
const body = (d, fill, cls, w = 0.6) => ['path', { d, fill, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', ...(cls ? { class: cls } : {}) }];
const sparkle = (x, y, r) => ['path', { d: `M${x} ${y - r}Q${x + 0.22 * r} ${y - 0.22 * r} ${x + r} ${y}Q${x + 0.22 * r} ${y + 0.22 * r} ${x} ${y + r}Q${x - 0.22 * r} ${y + 0.22 * r} ${x - r} ${y}Q${x - 0.22 * r} ${y - 0.22 * r} ${x} ${y - r}z`, fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }];
export default function render() {
  const N = 'wg-christmas-globe-lock-'
  const cut = setOf([rect(12.4, 10.6, 23, 23)])
  const globe = differenceSets(setOf([circle(10.5, 10.5, 9)]), cut)
  const lines = differenceSets(unionSets([
    strokeSet([[1.5, 10.5], [19.5, 10.5]], 1.1),
    roundStrokeSet(circle(10.5, 10.5, 9).length ? [[10.5, 1.5], [7.2, 4], [6.1, 10.5], [7.2, 17], [10.5, 19.5]] : [], 1.1),
    roundStrokeSet([[10.5, 1.5], [13.8, 4], [14.9, 10.5], [13.8, 17], [10.5, 19.5]], 1.1),
    roundStrokeSet([[2.8, 6], [10.5, 6.6], [18.2, 6]], 1),
    roundStrokeSet([[2.8, 15], [10.5, 14.4], [18.2, 15]], 1)
  ]), dilate(cut, 0.3))
  const gd = setD(globe)
  const shackle = setD(roundStrokeSet([[15.2, 16], [15.2, 14.2], [15.6, 12.9], [16.6, 12.2], [17.6, 12.2], [18.6, 12.9], [19, 14.2], [19, 16]], 1.5))
  const lockD = 'M14.6 15.6h5a1.5 1.5 0 0 1 1.5 1.5v3.4a1.5 1.5 0 0 1 -1.5 1.5h-5a1.5 1.5 0 0 1 -1.5 -1.5v-3.4a1.5 1.5 0 0 1 1.5 -1.5zM17.1 17.4a.8 .8 0 0 0 -.45 1.46v.94a.45 .45 0 0 0 .9 0v-.94a.8 .8 0 0 0 -.45 -1.46z'
  return [
    ['defs', {}, [shade(N + '0', 3, 2, 16, 20), shade(N + '1', 13, 15, 21, 22)]],
    body(gd, C3),
    ['path', { d: setD(lines), fill: INK, 'fill-opacity': '0.55' }],
    ['path', { d: gd, fill: `url(#${N}0)`, 'fill-rule': 'evenodd', class: 'wm-shine' }],
    body(shackle, C4, 'wm-s', 0.5),
    body(lockD, C1, 'wm-s'),
    ['path', { d: lockD, fill: `url(#${N}1)`, 'fill-rule': 'evenodd', class: 'wm-shine' }],
    sparkle(21, 3, 1.6)
  ]
}
