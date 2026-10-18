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
  const N = 'wg-christmas-holi-splash-'
  // irregular splat body: union of offset lobes (no round nucleus)
  const lobes = [circle(11.2, 12.4, 3.4), circle(13.6, 11, 2.6), circle(12.8, 14.2, 2.4), circle(9.8, 10.4, 2)]
  // long tapered arms: [angle deg, length, base half-width, end ball r]
  const arms = [[-95, 10.4, 1.5, 1.1], [-40, 7.4, 1.3, 0], [8, 9.8, 1.5, 1.0], [62, 7, 1.2, 0], [118, 10, 1.5, 1.05], [165, 7.8, 1.3, 0], [212, 9, 1.4, 0.9]]
  const parts = [...lobes.map(c => setOf([c]))]
  const balls = []
  for (const [deg, L, w, br] of arms) {
    const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a)
    const bx = 12 + c * 2.2, by = 12.2 + s * 2.2
    const tx = 12 + c * L, ty = 12.2 + s * L
    parts.push(setOf([[[bx - s * w, by + c * w], [tx, ty], [bx + s * w, by - c * w]]]))
    if (br) balls.push([12 + c * (L + br * 0.6), 12.2 + s * (L + br * 0.6), br])
  }
  const splat = setD(unionSets(parts))
  const green = [[20.2, 4.4, 1.3], [3.4, 16.2, 0.9], [18.4, 20.2, 0.7]]
  const gold = [[4.6, 5.2, 0.8], [21, 14.4, 0.75], [7.6, 21, 0.7]]
  return [
    ['defs', {}, [shade(N + '0', 4, 3, 18, 21)]],
    body(splat, C1, 'wm-k', 0.5),
    ...balls.map(([x, y, r]) => ['circle', { cx: +x.toFixed(2), cy: +y.toFixed(2), r, fill: C1, stroke: INK, 'stroke-width': 0.4, class: 'wm-a' }]),
    ['path', { d: splat, fill: `url(#${N}0)`, class: 'wm-shine' }],
    ['path', { d: 'M6.2 7.4Q7.6 5.6 8.6 7.2Q8.2 8.8 6.2 7.4z', fill: C3, stroke: INK, 'stroke-width': 0.35, class: 'wm-s' }],
    ...green.map(([x, y, r]) => ['circle', { cx: x, cy: y, r, fill: C2, stroke: INK, 'stroke-width': 0.35, class: 'wm-deco' }]),
    ...gold.map(([x, y, r]) => ['circle', { cx: x, cy: y, r, fill: C3, stroke: INK, 'stroke-width': 0.35, class: 'wm-deco' }])
  ]
}
