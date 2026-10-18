// forge/hand/chrome/radar.mjs: a chrome disc cut by one fine groove into a bezel ring and a dark scope face; on the face two
// thin well-spaced range rings, a narrow accent sweep wedge fanning from the centre with a bright leading edge, a pale
// centre dot and one small blip. The generated radar had a fat wedge and heavy rings that merged into a pie or clock.
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
const C = tf([12, 12])
const ang = (a, r) => [f(C[0] + Math.cos(a * Math.PI / 180) * r), f(C[1] + Math.sin(a * Math.PI / 180) * r)]
const oc = (r) => `M${f(C[0] + r)} ${f(C[1])}A${r} ${r} 0 1 1 ${f(C[0] - r)} ${f(C[1])}A${r} ${r} 0 1 1 ${f(C[0] + r)} ${f(C[1])}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'radar'
  const disc = circ(9.5)
  const Kf = F.strokes(lines(disc), 2.55, M0)
  F.region(rings(disc), M0, Kf)
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

  // sweep: narrow wedge pointing up-right, trailing side is the faded one
  const A0 = -62, H = 19, R = 5.7
  const lead = ang(A0 + H, R), trail = ang(A0 - H, R)
  const tip = ang(A0, R)
  const g = [
    ['radialGradient', { id: id(0), cx: f(C[0] - 1.2), cy: f(C[1] - 1.6), r: 8, gradientUnits: 'userSpaceOnUse' }, [st(0, 'c3'), st(0.55, 'shadow'), st(1, 'ink')]],
    ['linearGradient', { id: id(1), x1: C[0], y1: C[1], x2: tip[0], y2: tip[1], gradientUnits: 'userSpaceOnUse' }, [st(0, 'accent', 0.95), st(1, 'accent', 0.3)]],
  ]
  const wm = { class: 'wm-a' }
  const ring = r => ['path', { d: oc(r), fill: 'none', stroke: col('tint'), 'stroke-width': 0.45, 'stroke-opacity': 0.6, class: 'wm-k' }]
  const blip = ang(A0 + 150, 3.1)
  const face = [
    ['circle', { cx: f(C[0]), cy: f(C[1]), r: 6, fill: `url(#${id(0)})`, class: 'wm-k' }],
    ring(4.1), ring(2.15),
  ]
  const sweep = [
    ['path', { d: `M${f(C[0])} ${f(C[1])}L${lead.join(' ')}A${R} ${R} 0 0 0 ${trail.join(' ')}Z`, fill: `url(#${id(1)})`, ...wm }],
    ['path', { d: `M${f(C[0])} ${f(C[1])}L${lead.join(' ')}`, fill: 'none', stroke: col('accent'), 'stroke-width': 0.6, 'stroke-linecap': 'round', ...wm }],
    ['circle', { cx: f(C[0]), cy: f(C[1]), r: 0.85, fill: col('shine'), ...wm }],
  ]
  const deco = [
    ['circle', { cx: blip[0], cy: blip[1], r: 0.6, fill: col('accent'), class: 'wm-deco' }],
    ['path', { d: `M${ang(-148, 5.2).join(' ')}A5.2 5.2 0 0 1 ${ang(-112, 5.2).join(' ')}`, fill: 'none', stroke: col('shine'), 'stroke-width': 0.5, 'stroke-linecap': 'round', 'stroke-opacity': 0.7, class: 'wm-shine' }],
  ]
  return [['defs', {}, [...defs, ...g]], ...out, ...face, ...sweep, ...deco, ...(glint ? [glint] : [])]
}
