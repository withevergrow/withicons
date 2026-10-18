// forge/hand/glass/peacock-feather.mjs — Glass peacock feather, hand-drawn: the generated drawing was a round frosted
// blob on a stick, and the first redraw kept a near-round vane (a magnifier or lollipop at 16px). Here the vane is a long
// slim tilted glass egg (about 2.2:1), tapering to the quill and fullest just below the tip; three shallow V-notches a
// side, cut along the barb angle, split its edges symmetrically, and the shine rim stops at each notch. The rachis is
// etched up to the eye and leaves as a deep-glass quill. The eye sits in the top third, about 5.5u wide, inside a clear
// frosted band: accent ring, violet iris, a small indigo heart. Motion: feather wm-k (sways from 6 20), eye wm-a
// (twinkles about 16.5 7.5).
import { V } from '../../styles/_glass-soft.mjs'
import { setD, simplify, ribbon } from '../../kernel/geom.mjs'
import { unionSets, differenceSets, dilate, translateSet, setOf, roundStrokeSet, normalize } from '../../kernel/bool.mjs'

const NAME = 'peacock-feather'
const S = 0.94
const f2 = v => +v.toFixed(2)
const tidy = (set, tol = 0.03) => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), tol, true)).filter(r => r.length > 2)
const place = (set, tol) => tidy(set.map(r => r.map(([x, y]) => [12 + (x - 12) * S - 0.5, 12 + (y - 12) * S - 0.5])), tol)
const P = ([x, y]) => [f2(12 + (x - 12) * S - 0.5), f2(12 + (y - 12) * S - 0.5)]
const D = (s, t = 0.06) => setD(s, t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const soften = (set, r) => { const e = tidy(differenceSets(set, rim(set, r))); return tidy(unionSets([e, rim(e, r)])) }
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.34, 'stroke-width': 0.5, 'stroke-linejoin': 'round' }
const rim = (set, r) => unionSets(set.map(ring => { const rb = ribbon(ring, () => r * 2, null, true); return differenceSets(normalize(rb.outer), normalize(rb.inner)) }))

// the feather's own frame: u runs up the quill from its end (6.1 20.1) on a 3-4-5 slope, v across it (to the right)
const T = (u, v) => [6.1 + 0.6 * u + 0.8 * v, 20.1 - 0.8 * u + 0.6 * v]
// vane: a slim egg, fuller toward the tip (k), centred at CU with half-length HU and half-width HV
const CU = 13.1, HU = 9, HV = 4.05, K = 0.3
const eggUV = (cu, hu, hv, k, steps) => {
  const r = []
  for (let i = 0; i < steps; i++) { const t = (i / steps) * Math.PI * 2, c = Math.cos(t); r.push([cu + hu * c, hv * Math.sin(t) * (1 + k * c)]) }
  return r
}
const egg = (cu, hu, hv, k, steps) => setOf([eggUV(cu, hu, hv, k, steps).map(([u, v]) => T(u, v))])
// the vane's half-width at u (on the full-size egg)
const halfAt = u => { const c = (u - CU) / HU; return HV * Math.sqrt(Math.max(0, 1 - c * c)) * (1 + K * c) }
const poly = pts => setOf([pts.map(([u, v]) => T(u, v))])
const rod = (pts, w) => roundStrokeSet(pts.map(([u, v]) => T(u, v)), w)
const line = pts => pts.map(([u, v]) => P(T(u, v)).join(' ')).join('L')

// barb notches: a narrow V whose apex sits 1.5u inside the edge, opening outward and tip-ward along the barbs (about
// 50 degrees off the rachis), about 1.1u wide where it crosses the edge; mirrored on both sides
function notches() {
  const out = []
  const th = 58 * Math.PI / 180, ph = 13 * Math.PI / 180, L = 4
  for (const ue of [8.2, 10.6, 13]) for (const s of [1, -1]) {
    // apex: back along the barb from the edge point, 1.5u deep
    const depth = 1.35
    const ua = ue - depth / Math.tan(th), va = s * (halfAt(ue) - depth)
    const dir = a => [Math.cos(a), s * Math.sin(a)]
    const [d1, d2] = [dir(th - ph), dir(th + ph)]
    out.push(poly([[ua, va], [ua + L * d1[0], va + L * d1[1]], [ua + L * d2[0], va + L * d2[1]]]))
  }
  return unionSets(out)
}

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }

  const cuts = notches()
  const plain = egg(CU, HU, HV, K, 48)
  const vane = place(soften(differenceSets(plain, cuts), 0.15))
  // colour body behind the pane, offset down-right like every glass back; its notches are cut where the pane's are too,
  // so no sliver of the back peeks past a split
  const pc = place(cuts)
  const B = tidy(differenceSets(translateSet(place(egg(CU, HU - 0.3, HV - 0.32, K, 48)), 0.7, 0.7), unionSets([pc, translateSet(pc, 0.7, 0.7)])))
  const quill = place(rod([[0.3, 0], [CU - HU + 1.2, 0]], 1.3))
  const EU = 17
  const eye = place(egg(EU, 2.9, 2.9, 0.06, 32))
  const iris = place(egg(EU - 0.2, 1.95, 1.95, 0.06, 28))
  const heart = place(egg(EU - 0.35, 1.0, 1.0, 0.06, 24))

  const out = []
  const all = tidy(unionSets([B, translateSet(quill, 0.3, 0.3)]), 0.08)
  out.push(['path', { d: D(tidy(translateSet(dilate(all, 0.9), 0, 0.5), 0.1), 0.1), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(tidy(translateSet(dilate(all, 0.35), 0, 0.5), 0.1), 0.1), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  const gBack = grad('linearGradient', { x1: 6, y1: 4, x2: 20, y2: 19 }, [stop(0, V.c1), stop(1, V.shadow)])

  // quill: a deep glass rod sharing the vane's back gradient
  out.push(['path', { d: D(quill), fill: gBack, stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-k' }])
  // vane: colour body, frosted pane, firm hairline
  out.push(['path', { d: D(B), fill: gBack, class: 'wm-k' }])
  out.push(['path', {
    d: D(vane), fill: grad('linearGradient', { x1: 9, y1: 4, x2: 18, y2: 17 }, [stop(0, V.frost, 0.62), stop(0.45, V.tint, 0.46), stop(1, V.tint, 0.3)]),
    ...EDGE, class: 'wm-k',
  }])
  // the rachis, etched up the vane to the eye
  out.push(['path', { d: `M${line([[CU - HU + 1.4, 0], [EU - 3.4, 0]])}`, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.5, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  // shine rim from the plain egg, clipped clear of every notch so it never bridges a split
  const litE = place(egg(CU, HU - 0.1, HV - 0.1, K, 48))
  const litRim = differenceSets(differenceSets(litE, translateSet(litE, 0.3, 0.45)), place(dilate(cuts, 0.4)))
  out.push(['path', { d: D(tidy(litRim, 0.04)), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the eye, the one focal point, set inside a clear frosted band: accent ring, violet iris, a small indigo heart
  out.push(['path', { d: D(eye), fill: V.accent, stroke: 'currentColor', 'stroke-opacity': 0.24, 'stroke-width': 0.35, class: 'wm-a' }])
  const [ex, ey] = P(T(EU, 0))
  out.push(['path', { d: D(iris), fill: V.c1, class: 'wm-a' }])
  out.push(['path', { d: D(heart), fill: V.etch, 'fill-opacity': 0.8, class: 'wm-a' }])
  out.push(['path', { d: D(eye), fill: grad('radialGradient', { cx: f2(ex - 1.2), cy: f2(ey - 1.4), r: 4 }, [stop(0, V.shine, 0.55), stop(0.5, V.shine, 0), stop(1, V.shadow, 0.2)]), class: 'wm-a' }])
  return [['defs', {}, defs], ...out]
}
