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
  const N = 'wg-christmas-avatar-person-wheelchair-'
  const wheel = setD(differenceSets(setOf([circle(9, 16.6, 5.3)]), setOf([circle(9, 16.6, 3.7)])))
  const frame = setD(roundStrokeSet([[5.2, 6.8], [5.2, 13.4], [14.4, 13.4], [16.4, 19.6], [19.6, 19.6]], 1.3))
  const person = setD(unionSets([
    setOf([[[7.6, 7.6], [8.4, 6.4], [10.4, 6.4], [11.2, 7.6], [11.2, 9.6], [14.2, 9.6], [15.2, 10.4], [15.2, 11.8], [14.2, 12.5], [7.6, 12.5]]]),
    roundStrokeSet([[14.2, 11], [15.8, 16.8]], 2.2)
  ]))
  return [
    ['defs', {}, [shade(N + '0', 4, 3, 16, 22)]],
    body(frame, C3),
    body(wheel, C2),
    ['circle', { cx: 9, cy: 16.6, r: 1, fill: C3, stroke: INK, 'stroke-width': 0.5 }],
    body(person, C1, 'wm-k'),
    ['path', { d: 'M15.4 17.2h1.8a.8 .8 0 0 1 0 1.6h-1.8z', fill: INK }],
    ['circle', { cx: 9.4, cy: 3.4, r: 2.3, fill: C4, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: wheel + person, fill: `url(#${N}0)`, 'fill-rule': 'evenodd', class: 'wm-shine' }],
    sparkle(20, 4, 1.6)
  ]
}
