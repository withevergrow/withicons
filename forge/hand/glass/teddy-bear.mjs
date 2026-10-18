// forge/hand/glass/teddy-bear.mjs — Glass teddy bear, hand-drawn: the generated drawing melted the ears, head, thin
// arm rods and body into one frosted cluster with faint etched features, so at 16px the bear was a lumpy blob with a
// pink dot. Here it is built from a few bold glass masses: two round ears with deep inner ears, a big round head with a
// bright muzzle, solid etch eyes and nose, a round body, two stubby paws, and a clear accent heart hugged to the chest.
// Roles: back/shadow body + inner ears, pane/frost glass, accent heart + glow, etch face, shine rims.
// Motion: bear wm-k (rocks from 12 21.5), heart wm-a (beats about 12 17.75).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, simplify, circle } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'teddy-bear'
const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2)
const place = set => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])))
const area = d => unionSets(parsePath(d, 0.15).map(s => setOf([s.pts])))
const P = d => place(area(d))
const disc = (x, y, r) => place(setOf([circle(x, y, r, 0.15)]))
const D = (s, t = 0.03) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, dx, dy)) }
const box = s => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const r of s) for (const [x, y] of r) { a = Math.min(a, x); b = Math.min(b, y); c = Math.max(c, x); d = Math.max(d, y) } return [a, b, c, d] }
const X = v => f2(12 + (v - 12) * S - 0.5)
const oval = (x, y, rx, ry) => `M${X(x - rx)} ${X(y)}A${f2(rx * S)} ${f2(ry * S)} 0 1 0 ${X(x + rx)} ${X(y)}A${f2(rx * S)} ${f2(ry * S)} 0 1 0 ${X(x - rx)} ${X(y)}Z`
const tf = d => d.replace(/([MLCQZ])([^MLCQZ]*)/g, (m, c, a) => c + (a.match(/-?\d*\.?\d+/g) || []).map(Number).map(X).join(' '))
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.26, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }

// skeleton coordinates
const BODY = 'M12 12.9 C16.6 12.9 19 16.2 19 18.8 C19 20.9 16.7 21.9 12 21.9 C7.3 21.9 5 20.9 5 18.8 C5 16.2 7.4 12.9 12 12.9 Z'
const HEART = 'M12 21 C10.2 20 8.75 18.6 8.75 16.95 C8.75 15.8 9.6 15 10.6 15 C11.25 15 11.75 15.35 12 15.9 C12.25 15.35 12.75 15 13.4 15 C14.4 15 15.25 15.8 15.25 16.95 C15.25 18.6 13.8 20 12 21 Z'

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const out = []

  const ears = tidy(unionSets([disc(6.5, 4.6, 2.5), disc(17.5, 4.6, 2.5)]))
  const head = disc(12, 8.6, 5.5)
  const body = P(BODY)
  const paws = tidy(unionSets([P('M6.2 15.6 C7.3 14.9 8.6 15.4 9 16.6 C9.4 17.8 8.9 19 7.8 19.3 C6.7 19.6 5.8 18.8 5.6 17.6 C5.45 16.8 5.6 16 6.2 15.6 Z'), P('M17.8 15.6 C16.7 14.9 15.4 15.4 15 16.6 C14.6 17.8 15.1 19 16.2 19.3 C17.3 19.6 18.2 18.8 18.4 17.6 C18.55 16.8 18.4 16 17.8 15.6 Z')]))
  const heart = P(HEART)
  const all = tidy(unionSets([ears, head, body]))
  const back = translateSet(tidy(erode(all, 0.3)), 0.8, 0.8)

  // soft diffuse shadow
  out.push(['path', { d: D(translateSet(dilate(back, 0.9), 0, 0.5), 0.08), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(back, 0.35), 0, 0.5), 0.06), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])

  // the colour body behind, an accent orb glowing under the heart
  const [a, b, c, d] = box(back)
  out.push(['path', { d: D(back), fill: grad('linearGradient', { x1: f2(a), y1: f2(b), x2: f2(c + 2), y2: f2(d + 2) }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: D(back), fill: grad('radialGradient', { cx: 14.5, cy: 18.5, r: 6.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])

  // frosted panes, back to front: ears, body, head (each keeps its own hairline so the parts read apart)
  const gPane = grad('linearGradient', { x1: 4, y1: 2, x2: 17, y2: 22 }, [stop(0, V.frost, 0.62), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)])
  out.push(['path', { d: D(ears), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: oval(6.8, 4.9, 1.25, 1.25) + oval(17.2, 4.9, 1.25, 1.25), fill: V.c1, 'fill-opacity': 0.75, class: 'wm-k' }])
  out.push(['path', { d: D(body), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(head), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(unionSets([rimOf(ears), rimOf(head), rimOf(differenceSets(body, dilate(head, 0.2)))])), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])

  // the face: a bright muzzle, solid etch eyes with glints, a round nose and a small smile
  out.push(['path', { d: oval(12, 10.75, 2.55, 1.85), fill: V.frost, 'fill-opacity': 0.7, stroke: 'currentColor', 'stroke-opacity': 0.12, 'stroke-width': 0.35, class: 'wm-k' }])
  out.push(['path', { d: oval(9.5, 7.9, 0.75, 0.85) + oval(14.5, 7.9, 0.75, 0.85) + oval(12, 10.05, 0.95, 0.7), fill: V.etch, class: 'wm-k' }])
  out.push(['path', { d: tf('M12 10.7 V11.3 M10.9 11.5 C11.3 11.95 11.7 12 12 11.3 C12.3 12 12.7 11.95 13.1 11.5'), fill: 'none', stroke: V.etch, 'stroke-opacity': 0.8, 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }])
  out.push(['path', { d: oval(9.25, 7.6, 0.26, 0.26) + oval(14.25, 7.6, 0.26, 0.26) + oval(11.7, 9.85, 0.26, 0.18), fill: V.shine, class: 'wm-shine' }])

  // the paws hugging the heart
  out.push(['path', { d: D(paws), fill: gPane, ...EDGE, class: 'wm-k' }])
  out.push(['path', { d: D(paws), fill: V.c1, 'fill-opacity': 0.25, class: 'wm-k' }])

  // the heart: luminous accent glass with a deep underside, a light top and a glint
  out.push(['path', { d: D(translateSet(heart, 0.3, 0.45)), fill: V.shadow, 'fill-opacity': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(heart), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.18, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: D(heart), fill: grad('linearGradient', { x1: 9, y1: 14.5, x2: 12, y2: 20 }, [stop(0, V.shine, 0.65), stop(1, V.shine, 0)]), class: 'wm-a' }])
  out.push(['path', { d: tf('M9.75 16.6 C9.85 16.1 10.2 15.85 10.6 15.85'), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.95, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
