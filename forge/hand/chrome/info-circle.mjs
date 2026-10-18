// forge/hand/chrome/info-circle.mjs: a polished chrome disc (the style's own layer recipe) with the "i" as a bold dark
// gunmetal inlay, a round dot over a pill stem, each set in a black socket inside a clear channel where the horizon and
// the dark ground stop short. The generated i was a thin pale groove that the disc's dark horizon band cut straight
// through, so at 16px it read as a cross. Built like its sibling alert-circle (the same mark, turned over).
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

// a vertical pill of radius r between centres y1 and y2 on x
const pill = (x, y1, y2, r) =>
  `M${f(x - r)} ${f(y1)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y1)}V${f(y2)}A${f(r)} ${f(r)} 0 0 1 ${f(x - r)} ${f(y2)}Z`
const dot = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`

// the mark in output units, on the disc's centre line (x 11.8): dot over stem, sockets just clear of each other
const X = 11.8, DOT = [7.05, 1.3], STEM = [11.15, 16.05, 1.1], SOCK = 0.5

export default function render(icon) {
  const name = (icon && icon.name) || 'info-circle'
  const disc = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
  const Kf = F.strokes(lines(disc), 2.55, M0)
  F.region(rings(disc), M0, Kf)
  const K = F.open(F.copy(Kf), 0.32)
  // a clear channel round the mark: the horizon band and the dark ground stay out from under it
  const [dy, dr] = DOT, [s1, s2, sr] = STEM
  const txt = F.strokes([{ pts: [[X, dy], [X, s2]], closed: false }], 4.6, M0)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(Kf), txt, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const glint = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []

  const n = defs.length, id = k => `wg-chrome-${name}-${n + k}`
  const metal = (k, a, b) => ['linearGradient', { id: id(k), x1: 0, y1: f(a), x2: 0, y2: f(b), gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c1') }],
    ['stop', { offset: 0.45, 'stop-color': col('c2') }],
    ['stop', { offset: 1, 'stop-color': col('ink') }],
  ]]
  const sheen = { fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }
  const mark = [
    // the sockets: a dark seam round each inlay (part of the disc)
    ['path', { d: dot(X, dy, dr + SOCK) + pill(X, s1, s2, sr + SOCK), fill: col('shadow'), class: 'wm-k' }],
    // the inlay: a dark steel edge, then the gunmetal ramp
    ['path', { d: dot(X, dy, dr) + pill(X, s1, s2, sr), fill: col('ink'), class: 'wm-a' }],
    ['path', { d: dot(X, dy, dr - 0.2), fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: pill(X, s1, s2, sr - 0.2), fill: `url(#${id(1)})`, class: 'wm-a' }],
    // a crisp sheen on the upper-left of each piece
    ['path', { d: `M${f(X - 0.85)} ${f(dy - 0.1)}A.9 .9 0 0 1 ${f(X + 0.1)} ${f(dy - 0.85)}A1.05 1.05 0 0 0 ${f(X - 0.85)} ${f(dy - 0.1)}Z`, ...sheen }],
    ['path', { d: pill(X - 0.5, s1 - 0.1, s2 - 1.1, 0.3), ...sheen }],
  ]
  return [['defs', {}, [...defs, metal(0, dy - dr, dy + dr), metal(1, s1 - sr, s2 + sr)]], ...out, ...mark, ...(glint ? [glint] : [])]
}
