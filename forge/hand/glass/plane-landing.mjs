// forge/hand/glass/plane-landing.mjs — Glass plane landing, hand-drawn: the generated plane was traced from the
// skeleton's thin outline, so its wings and fuselage were slivers of pale frost that broke up at 16px. Here the plane is
// redrawn chunkier on the same descending heading (nose down to the right): a full round-nosed fuselage, broad swept
// wings and a tailplane, in violet glass close behind a thinner frost; the runway is its own rounded glass bar.
// Roles: back/shadow bodies, pane/frost glass, accent orb, etch window line, shine rims. Motion: plane wm-k, runway wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, erode, dilate, translateSet, setOf } from '../../kernel/bool.mjs'

const NAME = 'plane-landing'
const D = (set, t = 0.04) => setD(set, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = (F, dx = 0.3, dy = 0.45) => { const e = erode(F, 0.1); return differenceSets(e, translateSet(e, dx, dy)) }

// the plane is drawn level (nose +x) around the origin, then turned 20 degrees nose-down onto the 24 grid
const TH = 20 * Math.PI / 180, CX = 12.15, CY = 11.15
const turn = ([x, y]) => [CX + x * Math.cos(TH) - y * Math.sin(TH), CY + x * Math.sin(TH) + y * Math.cos(TH)]
const area = d => unionSets(parsePath(d, 0.2).map(s => setOf([s.pts.map(turn)])))

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }

  // one continuous outline (fuselage with round nose, swept wings, tailplane), drawn level with nose +x. Every concave
  // join has a real fillet: the wing leading roots (r ~0.8), the wing trailing roots (r ~0.6) and the tailplane front
  // roots (r ~0.8), so frost, body and shine rim turn those corners smoothly. The tailplane rear edges run straight
  // into one round tail cap (x -7.7), and the wing trailing edges land tangent on the fuselage: a single clean contour.
  const plane = area([
    'M9.6 0 C9.6 -0.6 9 -1.45 6.9 -1.45 L3.6 -1.31 Q3.2 -1.3 2.96 -1.62 L-1.55 -7.6',
    'C-1.75 -7.9 -2.05 -8 -2.45 -8 L-4.25 -8 C-4.7 -8 -4.9 -7.7 -4.75 -7.3 L-2.61 -1.87 Q-2.29 -1.07 -3.15 -1.03',
    'L-4.92 -0.96 Q-5.37 -0.94 -5.6 -1.33 L-6.95 -3.55 C-7.1 -3.8 -7.35 -3.9 -7.65 -3.9 L-8.6 -3.9 C-8.9 -3.9 -9.05 -3.7 -8.95 -3.4',
    'L-8 -1.28 C-7.72 -0.66 -7.72 0.66 -8 1.28',
    'L-8.95 3.4 C-9.05 3.7 -8.9 3.9 -8.6 3.9 L-7.65 3.9 C-7.35 3.9 -7.1 3.8 -6.95 3.55 L-5.6 1.33 Q-5.37 0.94 -4.92 0.96',
    'L-3.15 1.03 Q-2.29 1.07 -2.61 1.87 L-4.75 7.3 C-4.9 7.7 -4.7 8 -4.25 8 L-2.45 8 C-2.05 8 -1.75 7.9 -1.55 7.6',
    'L2.96 1.62 Q3.2 1.3 3.6 1.31 L6.9 1.45 C9 1.45 9.6 0.6 9.6 0 Z',
  ].join(' '))
  const runway = unionSets(parsePath('M3.4 19.5 H20.6 A0.95 0.95 0 0 1 20.6 21.4 H3.4 A0.95 0.95 0 0 1 3.4 19.5 Z', 0.2).map(s => setOf([s.pts])))

  const pane = M => translateSet(erode(M, 0.1), -0.25, -0.25)
  const back = M => translateSet(erode(M, 0.1), 0.5, 0.5)
  const out = []
  const h = translateSet(unionSets([back(plane), back(runway)]), 0, 0.5)
  out.push(['path', { d: D(dilate(h, 0.9), 0.1), fill: V.shadow, 'fill-opacity': 0.06, class: 'wm-shadow' }])
  out.push(['path', { d: D(dilate(h, 0.35), 0.08), fill: V.shadow, 'fill-opacity': 0.08, class: 'wm-shadow' }])
  const body = grad('linearGradient', { x1: 3, y1: 2, x2: 21, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const frost = grad('linearGradient', { x1: 3, y1: 2, x2: 19, y2: 20 }, [stop(0, V.frost, 0.58), stop(0.4, V.tint, 0.44), stop(1, V.tint, 0.3)])

  // runway: a rounded glass bar the plane descends onto
  const Fr = pane(runway)
  out.push(['path', { d: D(back(runway)), fill: body, class: 'wm-a' }])
  out.push(['path', { d: D(Fr), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.45, class: 'wm-a' }])
  out.push(['path', { d: D(rimOf(Fr, 0.2, 0.35), 0.06), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-a wm-shine' }])

  // the plane
  const Fp = pane(plane)
  const bp = D(back(plane))
  out.push(['path', { d: bp, fill: body, class: 'wm-k' }])
  out.push(['path', { d: bp, fill: grad('radialGradient', { cx: 15.5, cy: 14, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', { d: D(Fp), fill: frost, stroke: 'currentColor', 'stroke-opacity': 0.32, 'stroke-width': 0.5, class: 'wm-k' }])
  out.push(['path', { d: D(rimOf(Fp), 0.06), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  return [['defs', {}, defs], ...out]
}
