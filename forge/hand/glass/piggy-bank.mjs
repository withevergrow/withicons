// forge/hand/glass/piggy-bank.mjs - frosted glass piggy bank in the violet sibling palette, coin over the slot.
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
  const g = kit((icon && icon.name) || 'piggy-bank')
  const body = ell(11.6, 13.6, 7.6, 5.6)
  const snout = ell(19, 13.6, 2.2, 2.1)
  const ear = setOf([[[8, 9.4], [9.2, 5.6], [11.6, 8.4]]])
  const legs = unionSets([rrect(7.2, 16.6, 9.6, 20.6, 0.9), rrect(13.4, 16.6, 15.8, 20.6, 0.9)])
  const tail = roundStrokeSet([[4.2, 12.2], [2.8, 11.6], [3.2, 10.2]], 0.45)
  const coin = disc(12.4, 4.6, 2.3)
  const pig = unionSets([body, snout, erode(dilate(ear, 0.5), 0.5), legs])
  g.shadow(unionSets([backOf(pig, 0.5, 0.8), coin]))
  g.part(differenceSets(legs, dilate(body, 0.3)), { e: 0.4, sh: 0.5 })
  g.part(unionSets([body, erode(dilate(ear, 0.5), 0.5)]), { glow: [9, 10, 7] })
  g.part(differenceSets(snout, dilate(body, 0.2)), { e: 0.4, sh: 0.5 })
  const o = g.out
  o.push(['path', { d: D(tail), fill: V.shadow, class: 'wm-deco' }])
  // slot, eye, nostrils
  o.push(['path', { d: 'M10.2 9.2L14.2 9.2', fill: 'none', stroke: V.etch, 'stroke-width': 0.9, 'stroke-linecap': 'round' }])
  o.push(['circle', { cx: 15.6, cy: 11.4, r: 0.75, fill: V.etch }])
  o.push(['circle', { cx: 19.4, cy: 13.6, r: 0.45, fill: V.etch }])
  o.push(['circle', { cx: 20.6, cy: 13.6, r: 0.45, fill: V.etch }])
  // coin
  o.push(['path', { d: D(coin), fill: g.rad(11.6, 3.8, 3, [stop(0, V.frost), stop(1, V.accent)]), stroke: V.etch, 'stroke-opacity': 0.4, 'stroke-width': 0.4, class: 'wm-a' }])
  o.push(['path', { d: 'M12.4 3.4L12.4 5.8', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.6, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, g.defs], ...o]
}
