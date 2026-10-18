// forge/hand/chrome/alert-circle.mjs: a polished chrome disc (the style's own layer recipe) with the exclamation as one
// bold dark gunmetal inlay, a tapered bar over a round dot, inside a wide clear channel where the horizon and dark ground
// stop 2u short of the mark along its whole height, so the horizon can never bridge bar and dot into a cross. No socket
// ring: the bar and dot stay two separate dark shapes across a 2.4u gap. The generated mark was a thin pale groove that
// the disc's dark horizon cut straight through, so at 16px the disc read as a plain chrome ball.
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

// a capsule tapering from radius r1 (top, centre y1) to r2 (bottom, centre y2), on the vertical x
function taper(x, y1, r1, y2, r2) {
  const s = (r1 - r2) / (y2 - y1), c = Math.sqrt(1 - s * s)
  return `M${f(x - r1 * c)} ${f(y1 + r1 * s)}A${f(r1)} ${f(r1)} 0 1 1 ${f(x + r1 * c)} ${f(y1 + r1 * s)}` +
    `L${f(x + r2 * c)} ${f(y2 + r2 * s)}A${f(r2)} ${f(r2)} 0 0 1 ${f(x - r2 * c)} ${f(y2 + r2 * s)}Z`
}
const dot = (x, y, r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`

// the mark in output units, on the disc's centre line (x 11.8). The disc's horizon lies at about y 11-12.6, so the
// bar runs through it (top 5.15, bottom 13.1) and the 2.25u bar-to-dot gap and the dot sit below it in the pale lower metal
const X = 11.8, BAR = [6.6, 1.45, 12.1, 1], DOT = [16.75, 1.4], CH = 7.6

export default function render(icon) {
  const name = (icon && icon.name) || 'alert-circle'
  const disc = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
  const Kf = F.strokes(lines(disc), 2.55, M0)
  F.region(rings(disc), M0, Kf)
  const K = F.open(F.copy(Kf), 0.32)
  const [y1, r1, y2, r2] = BAR, [dy, dr] = DOT
  // a clear channel round the mark: the horizon band stops 2.3u either side of it, top of the bar to foot of the dot.
  // The ground ramp stays whole (cleared, it left a pale tongue down the disc), so only the horizon is cut.
  const M = txt => ({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(Kf), txt, seam: null })
  const Ls = layers(M(F.strokes([{ pts: [[X, y1], [X, dy]], closed: false }], CH, M0)))
  const whole = layers(M(null)).list.find(L => Array.isArray(L.fill) && L.fill[0] === 'ground')
  Ls.list = Ls.list.map(L => (whole && Array.isArray(L.fill) && L.fill[0] === 'ground') ? whole : L)
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const glint = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []

  // the inlay: darker than info-circle's (a warning), a gunmetal ramp running down into near black
  const n = defs.length, id = k => `wg-chrome-${name}-${n + k}`
  const metal = (k, a, b) => ['linearGradient', { id: id(k), x1: 0, y1: f(a), x2: 0, y2: f(b), gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c2') }],
    ['stop', { offset: 0.4, 'stop-color': col('ink') }],
    ['stop', { offset: 1, 'stop-color': col('shadow') }],
  ]]
  const sheen = { fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }
  const mark = [
    // the inlay: a near-black steel edge, then the gunmetal ramp (no socket ring, so bar and dot stay two shapes)
    ['path', { d: taper(X, y1, r1, y2, r2) + dot(X, dy, dr), fill: col('shadow'), class: 'wm-a' }],
    ['path', { d: taper(X, y1, r1 - 0.2, y2, r2 - 0.2), fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: dot(X, dy, dr - 0.2), fill: `url(#${id(1)})`, class: 'wm-a' }],
    // a crisp sheen down the upper-left of each piece
    ['path', { d: taper(X - 0.5, y1 - 0.1, 0.36, y2 - 1.1, 0.2), ...sheen }],
    ['path', { d: `M${f(X - 0.85)} ${f(dy - 0.1)}A.9 .9 0 0 1 ${f(X + 0.1)} ${f(dy - 0.85)}A1.05 1.05 0 0 0 ${f(X - 0.85)} ${f(dy - 0.1)}Z`, ...sheen }],
  ]
  return [['defs', {}, [...defs, metal(0, y1 - r1, y2 + r2), metal(1, dy - dr, dy + dr)]], ...out, ...mark, ...(glint ? [glint] : [])]
}
