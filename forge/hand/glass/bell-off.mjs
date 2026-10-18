// forge/hand/glass/bell-off.mjs — the muted bell: a full violet glass bell with a firm frost and clapper, cut by one clean accent slash stroke with no halo gap. Motion: bell wm-k, clapper wm-a, slash wm-s.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'bell-off'
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

const BELL = 'M6.2 16 L6.2 11 C6.2 7.6 8.8 5 12 5 C15.2 5 17.8 7.6 17.8 11 L17.8 16 C17.8 16.5 18 16.9 18.4 17.3 L19.4 18.2 C19.9 18.7 19.6 19.3 18.9 19.3 L5.1 19.3 C4.4 19.3 4.1 18.7 4.6 18.2 L5.6 17.3 C6 16.9 6.2 16.5 6.2 16 Z'
const BEAD = 'M9.6 20.2 L14.4 20.2 C14.4 21.5 13.3 22.4 12 22.4 C10.7 22.4 9.6 21.5 9.6 20.2 Z'
function pieces() { return [[tidy(dilate(area(BELL), 0.5)), 'skin'], [area(BEAD), 'dark', 'wm-a', 0.85]] }
function extras(out) {
  out.push(['path', { d: tf('M3.6 3.6 L20.4 20.4'), fill: 'none', stroke: V.accent, 'stroke-width': 2, 'stroke-linecap': 'round', class: 'wm-s' }])
  out.push(['path', { d: tf('M4.2 3.9 L8 7.7'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-s' }])
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
