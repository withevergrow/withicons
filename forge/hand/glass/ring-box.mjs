// forge/hand/glass/ring-box.mjs — Glass ring box, hand-drawn: the generated drawing was a tall frosted tub with a
// small pink gem stuck on its lid and the ring lost as a faint etch circle, so it read as a chest or a jar. Here the
// lid stands open behind with a deep velvet lining, a big accent ring band rises out of the cushioned base, and a
// large faceted frosted diamond sits on top of the band against the dark velvet, so the jewellery dominates at 16px.
// Roles: back/shadow box body + velvet, pane/frost glass and diamond, accent ring band, etch facets, shine rims.
// Motion: box wm-k, ring band wm-a (pops about 12 13.5), diamond wm-s (twinkles about 12 6.5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'ring-box'
const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const P = d => place(area(d))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, dx, dy)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const X = v => f2(12 + (v - 12) * S - 0.5)
const seg = pts => 'M' + pts.map(([x, y]) => `${X(x)} ${X(y)}`).join('L')
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coordinates
const LID = 'M4.25 14 V5.25 A2.25 2.25 0 0 1 6.5 3 H17.5 A2.25 2.25 0 0 1 19.75 5.25 V14 Z'
const VELVET = 'M5.9 14 V6.1 A1.4 1.4 0 0 1 7.3 4.7 H16.7 A1.4 1.4 0 0 1 18.1 6.1 V14 Z'
const BASE = 'M3.25 14.75 H20.75 V19 A2.25 2.25 0 0 1 18.5 21.25 H5.5 A2.25 2.25 0 0 1 3.25 19 Z'
const RX = 12, RY = 13.75, RO = 3.85, RI = 2.5
const GEM = 'M9.75 5.1 H14.25 L16 7.4 L12 11.1 L8 7.4 Z'

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const lid = P(LID), velvet = P(VELVET), base = P(BASE), gem = P(GEM)
  const band = tidy(differenceSets(place(differenceSets(setOf([circle(RX, RY, RO, 0.15)]), setOf([circle(RX, RY, RI, 0.15)]))), base))
  const lidB = translateSet(tidy(erode(lid, 0.3)), 0.7, 0.7)
  const baseB = translateSet(tidy(erode(base, 0.3)), 0.8, 0.8)
  const all = tidy(unionSets([lidB, baseB]))

  // soft diffuse shadow
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gPane = grad('linearGradient', { x1: 3, y1: 2.5, x2: 17, y2: 21 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  // the open lid behind: colour body, frosted frame, a deep velvet lining
  out.push(['path', { d: D(lidB), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(lid), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(velvet), fill: grad('linearGradient', { x1: 6, y1: 4, x2: 15, y2: 14 }, [stop(0, V.frost, 0.9), stop(1, V.tint, 0.75)]), stroke: 'currentColor', 'stroke-opacity': 0.16, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(lid)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the ring band rising out of the cushion: accent glass, a light upper face, a deep underside
  out.push(['path', { d: D(translateSet(band, 0.25, 0.35)), fill: V.shadow, 'fill-opacity': 0.5, class: 'wm-a' }])
  out.push(['path', { d: D(band), fill: V.accent, 'fill-rule': 'evenodd', stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.4, class: 'wm-a' }])
  out.push(['path', { d: D(band), fill: grad('linearGradient', { x1: 8, y1: 9.5, x2: 13, y2: 14.5 }, [stop(0, V.shine, 0.65), stop(1, V.shine, 0)]), 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: `M${X(8.8)} ${X(13.4)}A${f2(3.2 * S)} ${f2(3.2 * S)} 0 0 1 ${X(10.6)} ${X(10.85)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-a' }])

  // the cushioned base in front
  out.push(['path', { d: D(baseB), fill: gBack, class: 'wm-k' }])
  out.push(['path', { d: D(baseB), fill: grad('radialGradient', { cx: 16, cy: 19, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', { d: D(base), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: seg([[4.75, 16.6], [19.25, 16.6]]), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(base, 0.3, 0.5)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the diamond: bright frosted glass with a shaded far pavilion, fine facets and a specular glint
  out.push(['path', { d: D(translateSet(gem, 0.3, 0.45)), fill: V.shadow, 'fill-opacity': 0.45, class: 'wm-s' }])
  out.push(['path', { d: D(gem), fill: grad('linearGradient', { x1: 9, y1: 5, x2: 14, y2: 11 }, [stop(0, V.tint), stop(0.5, V.c1, 0.75), stop(1, V.shadow, 0.95)]), stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: 'M' + [[12, 7.4], [16, 7.4], [12, 11.1]].map(([x, y]) => `${X(x)} ${X(y)}`).join('L') + 'Z', fill: V.shadow, 'fill-opacity': 0.45, class: 'wm-s' }])
  out.push(['path', { d: seg([[8, 7.4], [16, 7.4]]) + seg([[10.9, 5.1], [10.3, 7.4], [12, 11.1], [13.7, 7.4], [13.1, 5.1]]), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-s' }])
  out.push(['path', { d: seg([[9.1, 7], [10.15, 5.6]]), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
