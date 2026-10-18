// forge/hand/glass/glasses.mjs — frosted glass spectacles: two round lenses of translucent tinted glass held by a thick
// deep-colour frame, an arched bridge, short temple arms and a diagonal glint across each lens.
// The generated drawing outlined the lenses with a hairline pane and left them empty, so it vanished at 16px; here the
// frame carries the colour body's full weight and the lenses are filled glass that catches light.
import { V } from '../../styles/_glass-soft.mjs'
import { setD, parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const fillOf = d => setOf(parsePath(d, 0.12).filter(s => s.pts.length > 2).map(s => s.pts))
const strokeOf = (d, w) => unionSets(parsePath(d, 0.12).map(s => roundStrokeSet(s.pts, w, s.closed)))
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))

// a lens outline: a squircle w wide, anchored by its left edge x
const lens = x => `M${x + 3.5} 9.6H${x + 4.3}A3.5 3.5 0 0 1 ${x + 7.8} 13.1V14.1A3.5 3.5 0 0 1 ${x + 4.3} 17.6H${x + 3.5}A3.5 3.5 0 0 1 ${x} 14.1V13.1A3.5 3.5 0 0 1 ${x + 3.5} 9.6Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'glasses'
  let n = 0
  const defs = [], add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  const lensL = fillOf(lens(2.2)), lensR = fillOf(lens(14))
  const inL = erode(lensL, 2.0), inR = erode(lensR, 2.0)
  const rings = unionSets([differenceSets(lensL, inL), differenceSets(lensR, inR)])
  const bridge = strokeOf('M9.6 12.4Q12 10.4 14.4 12.4', 2.1)
  const arms = unionSets([strokeOf('M3.4 10.9L2.4 6.8', 2.1), strokeOf('M20.6 10.9L21.6 6.8', 2.1)])
  const frame = unionSets([rings, bridge, arms])
  const glass = unionSets([inL, inR])
  const all = unionSets([frame, glass])

  const out = []
  out.push(['path', { d: D(translateSet(dilate(frame, 0.7), 0.3, 0.9)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(frame, 0.3), 0.3, 0.8)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  const [x0, y0, x1, y1] = box(all)
  const gFrame = lin(x0, y0, x1, y1, [stop(0, V.c1), stop(0.55, V.shadow), stop(1, V.etch)])
  const gLens = lin(x0, y0, x1, y1, [stop(0, V.tint, 0.85), stop(0.5, V.c1, 0.62), stop(1, V.shadow, 0.78)])
  const gGlow = add(['radialGradient', { id: id(), cx: 18.5, cy: 15.8, r: 4.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.8), stop(0.6, V.accent, 0.3), stop(1, V.accent, 0)]])
  const gGlowL = add(['radialGradient', { id: id(), cx: 6.7, cy: 15.8, r: 4.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.8), stop(0.6, V.accent, 0.3), stop(1, V.accent, 0)]])
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.4, 'stroke-width': 0.5 }

  // the lenses: tinted glass with a soft accent bloom (behind the frame)
  out.push(['path', { d: D(glass), fill: gLens, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(inR), fill: gGlow, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(inL), fill: gGlowL, 'fill-rule': 'evenodd' }])
  // the frame: deep colour body, frosted sheen, lit rim
  out.push(['path', { d: D(frame), fill: gFrame, ...edge, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(frame), fill: V.frost, 'fill-opacity': 0.08, 'fill-rule': 'evenodd' }])
  out.push(['path', { d: D(rimOf(frame)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // a glint across each lens
  out.push(['path', { d: 'M4.6 13.2L6.3 11.4M16.4 13.2L18.1 11.4', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
