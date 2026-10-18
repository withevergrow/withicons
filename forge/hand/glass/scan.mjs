// forge/hand/glass/scan.mjs — four frosted corner brackets with a glowing accent scan bar across the middle.
import { V } from '../../styles/_glass-soft.mjs'
import { setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const D = s => setD(s, 0.05)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const strokes = (lines, w) => unionSets(lines.map(l => roundStrokeSet(l, w)))
const SHAPE = () => strokes([[[3,8],[3,3],[8,3]],[[16,3],[21,3],[21,8]],[[3,16],[3,21],[8,21]],[[16,21],[21,21],[21,16]]], 2.6)
const EXTRA = () => [['path', { d: 'M6.5 12H17.5', fill: 'none', stroke: V.accent, 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-a' }], ['path', { d: 'M7 11.6H12', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }]]
export default function render(icon) {
  const name = (icon && icon.name) || 'scan'
  const pane = SHAPE()
  const back = translateSet(erode(pane, 0.35), 0.7, 0.7)
  const rim = differenceSets(erode(pane, 0.1), translateSet(pane, 0.3, 0.4))
  const g = i => `wg-glass-${name}-${i}`
  const defs = ['defs', {}, [
    ['linearGradient', { id: g(0), x1: 2, y1: 2, x2: 23, y2: 23, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.c1), stop(1, V.shadow)]],
    ['linearGradient', { id: g(1), x1: 1, y1: 1, x2: 22, y2: 22, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]]
  ]]
  const out = [defs,
    ['path', { d: D(translateSet(dilate(back, 0.4), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }],
    ['path', { d: D(back), fill: `url(#${g(0)})`, 'fill-rule': 'evenodd' }],
    ['path', { d: D(pane), fill: `url(#${g(1)})`, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5, 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: D(rim), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }]]
  return out.concat(EXTRA())
}
