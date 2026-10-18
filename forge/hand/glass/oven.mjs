// forge/hand/glass/oven.mjs — frosted glass oven: control strip with a lit display and two knobs, a glowing window
// with wavy heat lines, a bottom drawer with handle, and two feet.
import { V } from '../../styles/_glass-soft.mjs'
import { circle, setD } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const f2 = v => +v.toFixed(2)
const D = s => setD(s, 0.05)
const disc = (x, y, r) => setOf([circle(x, y, r, 0.3)])
const ell = (cx, cy, rx, ry) => { const p = []; for (let i = 0; i < 64; i++) { const a = i / 64 * 2 * Math.PI; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]) } return setOf([p]) }
const rrect = (x0, y0, x1, y1, r) => dilate(erode(setOf([[[x0, y0], [x1, y0], [x1, y1], [x0, y1]]]), r), r)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const backOf = (s, e, sh) => translateSet(erode(s, e), sh, sh)
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const grow = (s, r) => { try { return dilate(s, r) } catch { try { return unionSets(s.map(g => dilate([g], r))) } catch { return s } } }
const edge = { stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.5 }

function kit(name) {
  let n = 0
  const defs = [], out = []
  const add = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${name}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => add(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])
  const rad = (cx, cy, r, stops) => add(['radialGradient', { id: id(), cx: f2(cx), cy: f2(cy), r: f2(r), gradientUnits: 'userSpaceOnUse' }, stops])
  const shadow = all => {
    out.push(['path', { d: D(translateSet(grow(all, 0.9), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
    out.push(['path', { d: D(translateSet(grow(all, 0.35), 0, 0.5)), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  }
  const backG = s => { const [a, b, c, d] = box(s); return lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)]) }
  const paneG = s => { const [a, b, c, d] = box(s); return lin(a, b, c, d, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]) }
  // one glass part: colour body behind, frosted pane in front, lit rim
  const part = (s, { e = 0.5, sh = 0.8, cls, glow } = {}) => {
    const k = cls ? { class: cls } : {}
    const bk = backOf(s, e, sh)
    out.push(['path', { d: D(bk), fill: backG(bk), 'fill-rule': 'evenodd', ...k }])
    if (glow) out.push(['path', { d: D(bk), fill: rad(glow[0], glow[1], glow[2], [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), 'fill-rule': 'evenodd', ...k }])
    out.push(['path', { d: D(s), fill: paneG(s), ...edge, 'fill-rule': 'evenodd', ...k }])
    out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  }
  return { defs, out, part, shadow, lin, rad, backG, paneG }
}

export default function render(icon) {
  const g = kit((icon && icon.name) || 'oven')
  const body = rrect(3.6, 2.8, 19.4, 19.6, 2)
  const feet = unionSets([rrect(5.4, 18.6, 8.2, 21.4, 0.8), rrect(14.8, 18.6, 17.6, 21.4, 0.8)])
  g.shadow(unionSets([backOf(body, 0.5, 0.8), feet]))
  g.part(differenceSets(feet, dilate(body, 0.4)), { e: 0.3, sh: 0.5 })
  g.part(body, { glow: [11.5, 12, 6] })
  const o = g.out
  // strip and drawer dividers
  o.push(['path', { d: 'M3.9 6.9H19.1M3.9 16.4H19.1', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round' }])
  // display + knobs
  o.push(['path', { d: D(rrect(5.6, 4.1, 10.4, 5.7, 0.5)), fill: V.accent, 'fill-opacity': 0.9, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.4, class: 'wm-s' }])
  o.push(['path', { d: D(unionSets([disc(14.3, 4.9, 1), disc(17, 4.9, 1)])), fill: V.etch, 'fill-opacity': 0.85, class: 'wm-k' }])
  // window
  const win = rrect(6, 8.6, 17, 14.7, 1.1)
  o.push(['path', { d: D(win), fill: V.etch, 'fill-opacity': 0.22, stroke: V.etch, 'stroke-opacity': 0.75, 'stroke-width': 0.8, class: 'wm-k' }])
  o.push(['path', { d: D(win), fill: g.rad(11.5, 12.6, 5, [stop(0, V.accent, 0.75), stop(1, V.accent, 0.1)]) }])
  const wave = x => `M${x} 10.1Q${f2(x + 0.9)} 10.75 ${x} 11.4Q${f2(x - 0.9)} 12.05 ${x} 12.7Q${f2(x + 0.9)} 13.35 ${x} 13.4`
  o.push(['path', { d: [8.9, 11.5, 14.1].map(wave).join(''), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-a' }])
  // drawer handle
  o.push(['path', { d: 'M9.3 18H13.7', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.8, 'stroke-width': 1, 'stroke-linecap': 'round' }])
  return [['defs', {}, g.defs], ...o]
}
