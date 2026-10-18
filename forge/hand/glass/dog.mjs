// forge/hand/glass/dog.mjs — Glass dog, hand-drawn: the generated drawing fused the floppy ears into the head as one
// wide frosted blob with etched slits and ring eyes, so it read as a skull or a ghost. Here the head is a clear pane,
// the two floppy ears are separate deeper violet glass lobes hanging over its sides, a frosted muzzle sits low on the
// face, and solid etch-ink eyes and a rounded nose give it an unmistakable puppy face at 16px.
// Roles: back/shadow body, pane/frost glass, accent glow, etch face, shine rim. Motion: head + ears wm-k, face wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'dog'
const S = 0.94
const f2 = v => +v.toFixed(2)
const X = v => f2(12 + (v - 12) * S - 0.5)
// tidy rings (round, drop near-duplicate points) so the boolean ops stay robust
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
// skeleton-coord path (absolute M L H V C Q Z) -> glass front frame
const tf = d => d.replace(/([MLHVCQZ])([^MLHVCQZ]*)/g, (m, c, a) => {
  const v = (a.match(/-?\d*\.?\d+/g) || []).map(Number)
  return c + v.map(n => X(n)).join(' ')
})

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  // skeleton coords: the head (domed brow, rounded jaw) and two floppy teardrop ears over its sides
  const head = place(area('M12 4.4 C15.2 4.4 17.1 6.6 17.1 9.6 V14 C17.1 18 15.1 20.6 12 20.6 C8.9 20.6 6.9 18 6.9 14 V9.6 C6.9 6.6 8.8 4.4 12 4.4 Z'))
  const earL = place(area('M8.9 6.1 C7.3 4.5 4.3 4.7 3.4 7.3 C2.6 9.8 2.7 13.3 3.9 14.8 C4.9 16 6.6 15.4 7.4 13.4 C8.3 11.2 9.2 8.4 8.9 6.1 Z'))
  const earR = place(area('M15.1 6.1 C16.7 4.5 19.7 4.7 20.6 7.3 C21.4 9.8 21.3 13.3 20.1 14.8 C19.1 16 17.4 15.4 16.6 13.4 C15.7 11.2 14.8 8.4 15.1 6.1 Z'))
  const ears = unionSets([earL, earR])
  const muzzle = place(area('M12 13.2 C14.1 13.2 15.4 14.6 15.4 16.3 C15.4 18.2 13.9 19.4 12 19.4 C10.1 19.4 8.6 18.2 8.6 16.3 C8.6 14.6 9.9 13.2 12 13.2 Z'))
  const headB = translateSet(tidy(erode(head, 0.3)), 0.8, 0.8)
  const earsB = translateSet(tidy(erode(ears, 0.25)), 0.6, 0.6)
  const all = tidy(unionSets([headB, earsB]))

  const out = []
  out.push(['path', { d: D(translateSet(dilate(all, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const [a, b, c, d] = box(all)
  const gBack = grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 15, cy: 17, r: 7 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 6, y1: 3.5, x2: 17, y2: 20 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])

  // head: colour body, glow, clear frosted pane
  out.push(['path', { d: D(headB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(headB), fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(head), fill: gPane, ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(head)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // muzzle: a brighter frost patch low on the face
  out.push(['path', { d: D(muzzle), fill: V.frost, 'fill-opacity': 0.5, class: 'wm-k' }])
  // ears: deeper violet glass lobes laid over the head's sides (thin frost so the colour reads)
  out.push(['path', { d: D(earsB), fill: gBack, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(ears), fill: grad('linearGradient', { x1: 3, y1: 4.5, x2: 20, y2: 15.5 }, [stop(0, V.frost, 0.45), stop(0.5, V.tint, 0.26), stop(1, V.tint, 0.16)]), ...EDGE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(ears)), fill: V.shine, 'fill-opacity': 0.8, class: 'wm-shine' }])
  // face: solid etch eyes and a rounded nose, a small mouth, specular dots
  const ink = { fill: V.etch, 'fill-opacity': 0.9, class: 'wm-a' }
  out.push(['path', { d: tf('M10 9.85 C10.65 9.85 11.1 10.35 11.1 11 C11.1 11.65 10.65 12.15 10 12.15 C9.35 12.15 8.9 11.65 8.9 11 C8.9 10.35 9.35 9.85 10 9.85 Z M14 9.85 C14.65 9.85 15.1 10.35 15.1 11 C15.1 11.65 14.65 12.15 14 12.15 C13.35 12.15 12.9 11.65 12.9 11 C12.9 10.35 13.35 9.85 14 9.85 Z'), ...ink }])
  out.push(['path', { d: tf('M10.5 14.2 H13.5 C14.1 14.2 14.35 14.8 14 15.25 L12.7 16.55 C12.3 16.9 11.7 16.9 11.3 16.55 L10 15.25 C9.65 14.8 9.9 14.2 10.5 14.2 Z'), ...ink }])
  out.push(['path', { d: tf('M12 16.6 V17.4 M10.7 17.5 C11.3 18.2 11.8 18 12 17.4 C12.2 18 12.7 18.2 13.3 17.5'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.75, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: tf('M9.7 10.45 L9.75 10.4 M13.7 10.45 L13.75 10.4 M11.25 14.8 L11.3 14.75'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
