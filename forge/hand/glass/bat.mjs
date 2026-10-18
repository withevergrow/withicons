// forge/hand/glass/bat.mjs — the bat: two scalloped frosted wings in lighter glass, a deep violet body and a separate head with pointed ears and frost eyes, so wings and body contrast. Motion: wings wm-a, body wm-k.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const NAME = 'bat'
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

const WL = 'M10.8 9.4 C8.2 6.2 4.4 5 1 6.4 C2.3 9 2.5 12 1.9 15.8 C3.4 14 5.3 14.3 5.9 16.8 C6.7 14.7 8.6 14.5 9.3 16.6 C9.6 14.4 10.4 13 11.2 12.2 Z'
const WR = 'M13.2 9.4 C15.8 6.2 19.6 5 23 6.4 C21.7 9 21.5 12 22.1 15.8 C20.6 14 18.7 14.3 18.1 16.8 C17.3 14.7 15.4 14.5 14.7 16.6 C14.4 14.4 13.6 13 12.8 12.2 Z'
const BODY = oval(12, 14, 2.4, 4)
const HEADD = oval(12, 9.3, 2.5, 2.3)
const EARS = 'M9.8 8.8 L9.9 4.4 L11.7 7.2 Z M14.2 8.8 L14.1 4.4 L12.3 7.2 Z'
function pieces() {
  return [[area(WL), 'skin', 'wm-a'], [area(WR), 'skin', 'wm-a'], [area(BODY), 'dark', 'wm-k', 0.97], [unionSets([area(HEADD), dilate(area(EARS), 0.2)]), 'dark', 'wm-k', 1]]
}
function extras(out) {
  for (const x of [11.25, 12.75]) out.push(['circle', { cx: X(x), cy: X(9.4), r: 0.5, fill: V.frost, class: 'wm-k' }])
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
    if (kind === 'dark') out.push(['path', { d: D(s), fill: V.shadow, 'fill-opacity': op, 'fill-rule': 'evenodd', class: cls }])
    out.push(['path', { d: D(rimOf(s)), fill: V.shine, 'fill-opacity': kind === 'dark' ? 0.7 : 0.85, class: 'wm-shine' }])
  })
  extras(out)
  return [['defs', {}, defs], ...out]
}
