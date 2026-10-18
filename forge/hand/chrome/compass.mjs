// forge/hand/chrome/compass.mjs: a chrome disc cut by one fine groove into a bezel ring and a face, and a big diamond
// needle across the face: an accent enamel north half and a pale chrome south half, each faceted light and shade with
// a dark steel edge, on a dark pin. The generated needle was a tiny low-contrast lozenge in the disc, so it read as a
// plain ball; here the needle is the subject and the face and bezel are two distinct pieces.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const f = v => Math.round(v * 100) / 100
const circ = (r) => `M${12 + r} 12A${r} ${r} 0 1 1 ${12 - r} 12A${r} ${r} 0 1 1 ${12 + r} 12Z`

// needle in output units: axis NE, centre c, half length L, half width W
const C = tf([12, 12]), L = 7.3, W = 3.1, U = [Math.SQRT1_2, -Math.SQRT1_2], V = [Math.SQRT1_2, Math.SQRT1_2]
const pt = (a, b) => [f(C[0] + U[0] * a + V[0] * b), f(C[1] + U[1] * a + V[1] * b)]
const tri = (...p) => 'M' + p.map(q => q.join(' ')).join('L') + 'Z'
const N = pt(L, 0), Sp = pt(-L, 0), A = pt(0, -W), B = pt(0, W), O = pt(0, 0)
// a facet inset towards the axis, so the steel edge stays a clean outline
const edge = { stroke: col('shadow'), 'stroke-width': 0.9, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const name = (icon && icon.name) || 'compass'
  const disc = circ(9.5)
  const Kf = F.strokes(lines(disc), 2.55, M0)
  F.region(rings(disc), M0, Kf)
  // one fine groove 0.55u wide: bezel outside, face inside (two chrome pieces, each with its own bevel)
  const groove = F.strokes(lines(circ(7.1)), 0.55, M0)
  const K = F.open(F.subtract(F.copy(Kf), groove), 0.32)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(Kf), txt: null, seam: null })
  for (const l of Ls.list) if (!l.cls) l.cls = 'wm-k'
  const glint = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []
  const n = defs.length, id = k => `wg-chrome-${name}-${n + k}`
  const st = (o, r, op) => ['stop', op == null ? { offset: o, 'stop-color': col(r) } : { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  const ramp = (k, a, b, stops) => ['linearGradient', { id: id(k), x1: a[0], y1: a[1], x2: b[0], y2: b[1], gradientUnits: 'userSpaceOnUse' }, stops]
  const wm = { class: 'wm-a' }
  // north half: enamel, light facet on the upper-left, deep facet on the lower-right; south half: pale chrome
  const g = [
    ramp(0, pt(L, -W), pt(0, W), [st(0, 'accent'), st(1, 'accent')]),
    ramp(1, pt(L, 0), pt(0, W), [st(0, 'accent'), st(1, "ink", 0.3)]),
    ramp(2, pt(0, -W), pt(-L, W), [st(0, 'shine'), st(0.5, 'tint'), st(1, 'c1')]),
    ramp(3, pt(0, 0), pt(-L, W), [st(0, 'tint'), st(1, 'c2')]),
    ['radialGradient', { id: id(4), cx: f(C[0] - 1.5), cy: f(C[1] - 2), r: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, 'shine'), st(0.6, 'tint'), st(1, 'c1')]],
  ]
  const face = [
    ['circle', { cx: f(C[0]), cy: f(C[1]), r: 5.75, fill: `url(#${id(4)})`, class: 'wm-k' }],
    ...[[0, -1], [1, 0], [0, 1], [-1, 0]].map(([a, b]) => ['path', { d: `M${f(C[0] + a * 4.4)} ${f(C[1] + b * 4.4)}L${f(C[0] + a * 5.3)} ${f(C[1] + b * 5.3)}`, fill: 'none', stroke: col('shadow'), 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-deco' }]),
  ]
  const needle = [
    // steel edge under both halves, as one outline
    ['path', { d: tri(N, B, Sp, A), fill: col('shadow'), ...edge, ...wm }],
    ['path', { d: tri(N, A, O), fill: `url(#${id(0)})`, ...wm }],
    ['path', { d: tri(N, B, O), fill: `url(#${id(1)})`, ...wm }],
    ['path', { d: tri(Sp, A, O), fill: `url(#${id(2)})`, ...wm }],
    ['path', { d: tri(Sp, B, O), fill: `url(#${id(3)})`, ...wm }],
    // a crisp white sickle down the north half's light facet, and the pin
    ['path', { d: tri(pt(L - 1.1, -0.1), pt(0.9, -W + 0.55), pt(1.5, -0.2)), fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }],
    ['circle', { cx: O[0], cy: O[1], r: 1.05, fill: col('ink'), ...wm }],
    ['circle', { cx: f(O[0] - 0.3), cy: f(O[1] - 0.3), r: 0.32, fill: col('shine'), class: 'wm-shine' }],
  ]
  return [['defs', {}, [...defs, ...g]], ...out, ...face, ...needle, ...(glint ? [glint] : [])]
}
