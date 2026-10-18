// forge/hand/glass/plum-blossom.mjs — the glass plum blossom. Generated Glass fused the five petals into a puffy
// cloud and lost the branch. Here one large five-petal blossom sits up-right, each petal its own round lobe with a
// clearly cut notch between neighbours and a fine etched seam running into the notch; an accent glass heart (plate S)
// carries the stamens. A slim dark-glass branch with a bud comes in from the lower left, behind the flower.
// Motion: blossom wm-k, heart wm-s (twinkles), branch wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { setD, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, dilate, erode, translateSet, roundStrokeSet } from '../../kernel/bool.mjs'

const NAME = 'plum-blossom'
const f2 = v => +v.toFixed(2)
const D = (s, t = 0.04) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const disc = (x, y, r) => setOf([circle(x, y, r, 0.12)])
const grow = (s, r) => unionSets([s, ...Array.from({ length: 12 }, (_, k) => translateSet(s, r * Math.cos(k * Math.PI / 6), r * Math.sin(k * Math.PI / 6)))])
const rimOf = s => differenceSets(erode(s, 0.1), translateSet(s, 0.3, 0.45))
const qb = (p0, p1, p2, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]] })

export default function render() {
  let n = 0
  const defs = [], gr = g => { defs.push(g); return `url(#${g[1].id})` }, id = () => `wg-glass-${NAME}-${n++}`
  const lin = (x1, y1, x2, y2, stops) => gr(['linearGradient', { id: id(), x1: f2(x1), y1: f2(y1), x2: f2(x2), y2: f2(y2), gradientUnits: 'userSpaceOnUse' }, stops])

  const FX = 14.5, FY = 9.3, PR = 3.9, PRAD = 3.1
  const ang = i => -Math.PI / 2 + i * 2 * Math.PI / 5
  const petals = unionSets([0, 1, 2, 3, 4].map(i => disc(FX + PR * Math.cos(ang(i)), FY + PR * Math.sin(ang(i)), PRAD)))
  // branch (behind the flower): main limb, a short twig and a bud
  const limb = roundStrokeSet([...qb([2.6, 21.6], [5.2, 17.6], [8.6, 15.4]), ...qb([8.6, 15.4], [10.4, 14.2], [11.6, 12.4]).slice(1)], 1.7)
  const twig = roundStrokeSet(qb([5.4, 18.4], [5.6, 16], [3.9, 13.6]), 1.3)
  const bud = disc(3.4, 12.5, 1.8)
  const wood = unionSets([limb, twig])

  const pane = s => translateSet(erode(s, 0.1), -0.25, -0.25)
  const back = s => translateSet(erode(s, 0.1), 0.5, 0.5)
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.28, 'stroke-width': 0.5 }
  const all = unionSets([petals, wood, bud])
  const halo = translateSet(back(all), 0, 0.5)
  const [a, b, c, d] = box(back(all))
  const out = []
  out.push(['path', { d: D(grow(halo, 0.9), 0.1), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(grow(halo, 0.35), 0.08), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])

  // branch and bud: solid deep colour glass with a lit rim
  const gWood = lin(a, b, c, d, [stop(0, V.c1), stop(1, V.shadow)])
  const solid = (set, cls) => {
    const p = pane(set)
    out.push(['path', { d: D(back(set)), fill: V.shadow, 'fill-opacity': 0.5, class: cls }])
    out.push(['path', { d: D(p), fill: gWood, stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.45, class: cls }])
    out.push(['path', { d: D(rimOf(p)), fill: V.shine, 'fill-opacity': 0.75, class: cls + ' wm-shine' }])
  }
  solid(wood, 'wm-k')
  // the bud is a small frosted pane with a pink heart
  const bp = pane(bud)
  out.push(['path', { d: D(translateSet(bud, 0.4, 0.4)), fill: V.accent, 'fill-opacity': 0.8, class: 'wm-k' }])
  out.push(['path', { d: D(bp), fill: V.accent, 'fill-opacity': 0.55, ...edge, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(bp)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-k wm-shine' }])

  // blossom: colour body with an orb of accent light, frosted pane in front
  const bb = back(petals), fp = pane(petals)
  out.push(['path', { d: D(bb), fill: lin(a, b, c + 2, d + 2, [stop(0, V.c1), stop(1, V.shadow)]), 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(bb), fill: gr(['radialGradient', { id: id(), cx: 17.4, cy: 11.6, r: 6.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]]), 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(fp), fill: lin(FX - 7, FY - 7, FX + 7, FY + 7, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]), ...edge, 'fill-rule': 'evenodd', class: 'wm-k' }])
  // seams: a fine etched line into each notch, so five petals read even at 24px
  const seam = [0, 1, 2, 3, 4].map(i => { const t = ang(i) + Math.PI / 5; return `M${f2(FX - 0.25 + 2.4 * Math.cos(t))} ${f2(FY - 0.25 + 2.4 * Math.sin(t))}L${f2(FX - 0.25 + 4.9 * Math.cos(t))} ${f2(FY - 0.25 + 4.9 * Math.sin(t))}` }).join('')
  out.push(['path', { d: seam, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.45, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(fp), 0.05), fill: V.shine, 'fill-opacity': 0.85, 'fill-rule': 'evenodd', class: 'wm-shine' }])

  // the heart of the blossom (plate S): an accent glass disc with a bright catch light
  const heart = disc(FX - 0.25, FY - 0.25, 1.9)
  out.push(['path', { d: D(translateSet(heart, 0.4, 0.4)), fill: V.shadow, 'fill-opacity': 0.35, class: 'wm-s' }])
  out.push(['path', { d: D(heart), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.4, class: 'wm-s' }])
  out.push(['path', { d: `M${f2(FX - 0.95)} ${f2(FY - 0.95)}h0`, fill: 'none', stroke: V.shine, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-s wm-shine' }])
  return [['defs', {}, defs], ...out]
}
