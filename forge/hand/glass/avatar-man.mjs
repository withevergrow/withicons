// forge/hand/glass/avatar-man.mjs — a man: broad violet glass shoulders, a clear frosted face with ears and a firm jaw, a
// deep violet short side-swept haircut with a bright rim, and solid etch eyes and a smile so he reads at 16px. The
// generated drawing washed hair, face and shoulders into one pale shape. Motion: body wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'avatar-man'
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

const SHOULDERS = 'M3 22 C3 18.5 6.6 16.3 12 16.3 C17.4 16.3 21 18.5 21 22 Z'
const FACE = unionSets([area(oval(12, 10.4, 4.7, 5.4)), area(oval(7.2, 10.9, 1, 1.4)), area(oval(16.8, 10.9, 1, 1.4))])
const HAIR = 'M6.9 10 C6.4 5.9 8.8 3.6 12.2 3.6 C15.6 3.6 17.7 5.9 17.2 10 C16.8 8.8 16.3 8 15.5 7.4 C13.2 8.2 10.2 7.8 8.6 6.5 C7.9 7.3 7.3 8.6 6.9 10 Z'
function pieces() {
  return [[area(SHOULDERS), 'dark', 'wm-k', 0.55], [FACE, 'skin', 'wm-a'], [tidy(dilate(area(HAIR), 0.3)), 'dark', 'wm-a', 0.92]]
}
function extras(out) {
  for (const x of [10, 14]) out.push(['ellipse', { cx: X(x), cy: X(10.9), rx: 0.75, ry: 0.95, fill: V.etch, 'fill-opacity': 0.95, class: 'wm-a' }])
  out.push(['path', { d: tf('M10.2 13.1 C11.2 14.1 12.8 14.1 13.8 13.1'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.85, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-a' }])
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
