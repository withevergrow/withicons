// forge/hand/glass/dragon-head.mjs - the Line design in glass: a front-facing dragon head, a frosted violet-glass skull with a
// clearer snout pane (nostrils, two fangs), angry etched brows over glowing pink slit eyes, two branching pink glass antlers
// (a main beam with an outward and an inward tine) and a long whisker each side ending in a bead. The generated drawing was a
// vague blob with small horns. Roles: back/shadow body, pane/frost glass, accent antlers/whiskers/eyes, etch brows + slits,
// shine rim. Motion: skull + snout wm-k, antlers/whiskers/face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, erode, dilate, translateSet, differenceSets, setOf } from '../../kernel/bool.mjs'

const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.02, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts])))
const D = (s, t = 0.06) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const tf = d => d.replace(/([MLCZ])([^MLCZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const mirror = d => d.replace(/([MLC])([^MLCZ]*)/g, (m, c, a) => c + a.trim().split(/[\s,]+/).map((v, i) => i % 2 === 0 ? f2(24 - Number(v)) : v).join(' '))
const oval = (cx, cy, rx, ry = rx) => { const kx = f2(rx * 0.5523), ky = f2(ry * 0.5523); return `M${cx} ${f2(cy - ry)} C${f2(cx + kx)} ${f2(cy - ry)} ${f2(cx + rx)} ${f2(cy - ky)} ${f2(cx + rx)} ${cy} C${f2(cx + rx)} ${f2(cy + ky)} ${f2(cx + kx)} ${f2(cy + ry)} ${cx} ${f2(cy + ry)} C${f2(cx - kx)} ${f2(cy + ry)} ${f2(cx - rx)} ${f2(cy + ky)} ${f2(cx - rx)} ${cy} C${f2(cx - rx)} ${f2(cy - ky)} ${f2(cx - kx)} ${f2(cy - ry)} ${cx} ${f2(cy - ry)} Z` }

const HEAD = 'M12 7.6 C15.7 7.6 18 9.9 18 13 C18 14.3 18.3 15.2 18.6 16.2 C19.1 18.6 16.5 20 12 20 C7.5 20 4.9 18.6 5.4 16.2 C5.7 15.2 6 14.3 6 13 C6 9.9 8.3 7.6 12 7.6 Z'
const SNOUT = oval(12, 17.1, 4.7, 2.4)
const ANTLER = ['M9.5 8.6 C9.4 6 8.1 4.2 6.2 2.5', 'M7.5 4.2 L4.2 4.3', 'M8.8 6.1 L10.5 3.7']
const WHISKER = 'M5.7 17.3 C4.4 16.4 3.4 18.4 2.5 17.5'

export default function render(icon) {
  const name = (icon && icon.name) || 'dragon-head'
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBack = grad('linearGradient', { x1: 3, y1: 3, x2: 21, y2: 23 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 17, r: 7.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gHead = grad('linearGradient', { x1: 5, y1: 6, x2: 19, y2: 20 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.5), stop(1, V.tint, 0.36)])
  const gSnout = grad('linearGradient', { x1: 8, y1: 14, x2: 16, y2: 20 }, [stop(0, V.frost, 0.85), stop(1, V.tint, 0.6)])

  const head = place(area(HEAD)), snout = place(area(SNOUT))
  const back = tidy(translateSet(tidy(erode(head, 0.3)), 0.8, 0.8))
  const out = []
  // whiskers and antlers sit behind the skull
  const tube = (d, w) => {
    out.push(['path', { d: tf(d), fill: 'none', stroke: V.accent, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
    out.push(['path', { d: tf(d), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.6, 'stroke-width': f2(w * 0.3), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  }
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5), 0.16), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5), 0.12), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  for (const d of [...ANTLER, ...ANTLER.map(mirror)]) tube(d, 1.5)
  for (const d of [WHISKER, mirror(WHISKER)]) tube(d, 1.1)
  for (const x of [2.5, 21.5]) {
    out.push(['circle', { cx: X(x), cy: X(17.5), r: f2(1.05 * S), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-a' }])
    out.push(['circle', { cx: X(x - 0.25), cy: X(17.2), r: f2(0.4), fill: V.shine, 'fill-opacity': 0.7, class: 'wm-a' }])
  }
  const bd = D(back, 0.1)
  out.push(['path', { d: bd, fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: bd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(head), fill: gHead, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(head)), fill: V.shine, 'fill-opacity': 0.88, class: 'wm-shine' }])
  out.push(['path', { d: D(snout), fill: gSnout, ...EDGE, 'stroke-opacity': 0.26, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(snout)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  // fangs, nostrils
  for (const x of [9.6, 14.4]) {
    const d = tf(`M${x - 0.95} 18.7 L${x + 0.95} 18.7 L${x} 21.3 Z`)
    out.push(['path', { d, fill: V.frost, 'fill-opacity': 0.95, stroke: V.etch, 'stroke-opacity': 0.55, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-a' }])
  }
  for (const x of [10.9, 13.1]) out.push(['ellipse', { cx: X(x), cy: X(16.0), rx: 0.42, ry: 0.55, fill: V.etch, 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: tf('M7.9 18.6 C10 19.6 14 19.6 16.1 18.6'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.7, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-a' }])
  // eyes: glowing slits
  for (const x of [8.9, 15.1]) {
    out.push(['ellipse', { cx: X(x), cy: X(12.9), rx: 1.45, ry: 1.1, fill: V.accent, 'fill-opacity': 0.95, stroke: V.etch, 'stroke-opacity': 0.4, 'stroke-width': 0.4, class: 'wm-a' }])
    out.push(['ellipse', { cx: X(x), cy: X(12.9), rx: 0.4, ry: 1.05, fill: V.etch, class: 'wm-a' }])
    out.push(['circle', { cx: X(x - 0.7), cy: X(12.5), r: 0.28, fill: V.shine, 'fill-opacity': 0.95, class: 'wm-a' }])
  }
  // angry brows
  out.push(['path', { d: tf('M7.4 9.9 L10.9 11.6 M16.6 9.9 L13.1 11.6'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.92, 'stroke-width': 1.15, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
