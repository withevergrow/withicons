// forge/hand/glass/avatar-dino.mjs — the glass dino as a side-view head: rounded skull, long snout to the right, a neck to the bottom edge and three distinct deep violet back spikes, solid etch eye and nostril, mouth line, firm rim so it holds at 16px. Motion: body wm-k, spikes wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-dino'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.05) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.38, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLCZ])([^MLCZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${cy - ry} C${cx + kx} ${cy - ry} ${cx + rx} ${cy - ky} ${cx + rx} ${cy} C${cx + rx} ${cy + ky} ${cx + kx} ${cy + ry} ${cx} ${cy + ry} C${cx - kx} ${cy + ry} ${cx - rx} ${cy + ky} ${cx - rx} ${cy} C${cx - rx} ${cy - ky} ${cx - kx} ${cy - ry} ${cx} ${cy - ry} Z` }

const HEAD = 'M5.5 22 C5.5 18.5 6.2 15.6 7.6 13.4 C6.9 10.2 8 6.9 10.8 5.3 C13.4 3.9 16.6 4.3 18.7 5.9 C20.3 7.1 21.3 8.6 21.3 10.4 C21.3 12.2 20 13.4 18.2 13.4 L14.7 13.6 C13.7 14.6 13.4 16.1 13.8 17.8 L15.2 22 Z'
const SPIKES = ['M8.1 6.6 L7.4 3.4 L10.4 5.1 Z', 'M6.6 10.2 L3.6 9.2 L6.4 12.8 Z', 'M6.2 15.6 L2.9 15.4 L5.6 18.6 Z']
function pieces() {
  return [[area(HEAD), 'skin'], ...SPIKES.map(d => [tidy(differenceSets(dilate(area(d), 0.35), area(HEAD))), 'dark', 'wm-a', 0.8])]
}
function extras(out) {
  out.push(['circle', { cx: X(15.7), cy: X(8.6), r: 1.05, fill: V.etch, 'fill-opacity': 0.95, class: 'wm-k' }])
  out.push(['circle', { cx: X(15.35), cy: X(8.25), r: 0.3, fill: V.shine, class: 'wm-k' }])
  out.push(['circle', { cx: X(19.9), cy: X(8.4), r: 0.42, fill: V.etch, 'fill-opacity': 0.85, class: 'wm-k' }])
  out.push(['path', { d: tf('M20.4 11.6 C19 11.9 17.6 11.9 16.4 11.5'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.8, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }])
}

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 18, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 7, y1: 6, x2: 16, y2: 18 }, [stop(0, V.frost, 0.8), stop(0.4, V.tint, 0.72), stop(1, V.tint, 0.6)])
  const gHood = grad('linearGradient', { x1: 3, y1: 2, x2: 20, y2: 20 }, [stop(0, V.frost, 0.42), stop(0.5, V.tint, 0.18), stop(1, V.tint, 0.08)])
  const P = pieces()
  const sets = P.map(([s]) => place(s))
  const vis = sets.map((s, i) => i < sets.length - 1 ? tidy(differenceSets(s, unionSets(sets.slice(i + 1)))) : s)
  const all = tidy(translateSet(tidy(erode(unionSets(sets), 0.3)), 0.8, 0.8))
  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.14), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const bd = D(all, 0.07)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  vis.forEach((s, i) => {
    const [, kind, cls = 'wm-k', op = 0.55] = P[i]
    if (!s.length) return
    out.push(['path', { d: D(s), fill: kind === 'skin' ? gPane : gHood, ...EDGE, 'fill-rule': 'evenodd', class: cls }])
    if (kind === 'dark') out.push(['path', { d: D(s), fill: V.c1, 'fill-opacity': op, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': kind === 'dark' ? 0.7 : 0.85, class: 'wm-shine' }])
  })
  extras(out)
  return [['defs', {}, defs], ...out]
}
