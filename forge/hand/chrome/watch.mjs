// forge/hand/chrome/watch.mjs — a round chrome watch case with a side crown, a dial ring cut clean round a bright glass
// face, two dark gunmetal hands on it, and two gunmetal strap ends behind the case. The generator fused case and straps
// into one pale chrome blob and cut the hands as a thin groove the horizon band ran through, so it read as a pebble at
// 24 and 16px; the two-metal straps, the ring and the dark hands make it a watch.
// Same layer recipe as the generator (_chrome-core.mjs layers/emit); the hands are drawn as inlays like alert-circle.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = 0.7
const f = v => Math.round(v * 100) / 100
const minus = (A, B) => F.subtract(F.copy(A), B)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
// a capsule from a to b of radius r (output units)
function cap([ax, ay], [bx, by], r) {
  const L = Math.hypot(bx - ax, by - ay), nx = (by - ay) / L * r, ny = -(bx - ax) / L * r
  return `M${f(ax + nx)} ${f(ay + ny)}L${f(bx + nx)} ${f(by + ny)}A${f(r)} ${f(r)} 0 0 1 ${f(bx - nx)} ${f(by - ny)}` +
    `L${f(ax - nx)} ${f(ay - ny)}A${f(r)} ${f(r)} 0 0 1 ${f(ax + nx)} ${f(ay + ny)}Z`
}
const dot = ([x, y], r) => `M${f(x - r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x + r)} ${f(y)}A${f(r)} ${f(r)} 0 1 0 ${f(x - r)} ${f(y)}Z`

const CASE = disc(12, 12, 6)
const CROWN = 'M18.25 12H19.75'
const RING = 'M16.4 12A4.4 4.4 0 0 1 7.6 12 M7.6 12A4.4 4.4 0 0 1 16.4 12'   // the dial groove (open arcs: a groove, not a hole)
const STRAPS = 'M8.75 9L9.25 3.75A1 1 0 0 1 10.25 2.75H13.75A1 1 0 0 1 14.75 3.75L15.25 9Z M8.75 15L9.25 20.25A1 1 0 0 0 10.25 21.25H13.75A1 1 0 0 0 14.75 20.25L15.25 15Z'
// the hands, from the skeleton (12 12 -> 12 9, and 12 12 -> 14 13.5), slightly longer
const C = tf([12, 12]), H1 = tf([12, 8.6]), H2 = tf([14.3, 13.7])

export default function render(icon) {
  const name = (icon && icon.name) || 'watch'
  const fK = F.strokes([...lines(CASE), ...lines(CROWN)], K.WK, M0)
  F.region(rings(CASE), M0, fK)
  const fS = F.strokes(lines(STRAPS), 2, M0)
  F.region(rings(STRAPS), M0, fS)
  const rec = F.strokes(lines(RING), 0.95, M0)
  const body = minus(fK, rec)
  // the straps run in under the case, which overlaps them on its dark edge (never showing through the dial groove)
  const straps = minus(fS, F.region(rings(disc(12, 12, 5.1)), M0))
  const sil = F.copy(fK); F.union(sil, fS); F.subtract(sil, rec)
  // the glass face keeps a clear field: the horizon and the dark ground stay out from under the hands
  const face = F.region(rings(disc(12, 12, 3.6)), M0)
  const round = Fd => F.open(Fd, K.ROUND)
  const Ls = layers({ T: {}, K: round(body), Af: null, Ab: round(straps), S: null, sil, txt: face, seam: null })
  // the straps are body (gunmetal, but they do not tick with the hands)
  for (const L of Ls.list) L.cls = L.cls === 'wm-shine' || L.cls === 'wm-shadow' ? L.cls : 'wm-k'
  const glint = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0][0] === 'defs' ? out.shift()[2] : []
  const id = `wg-chrome-${name}-${defs.length}`
  const metal = ['linearGradient', { id, x1: 0, y1: f(H1[1] - 1), x2: 0, y2: f(H2[1] + 1), gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': col('c1') }],
    ['stop', { offset: 0.5, 'stop-color': col('c2') }],
    ['stop', { offset: 1, 'stop-color': col('c3') }],
  ]]
  const hands = r => cap(C, H1, r) + cap(C, H2, r)
  const mark = [
    ['path', { d: hands(1.05), fill: col('ink'), class: 'wm-a' }],
    ['path', { d: hands(0.72), fill: `url(#${id})`, class: 'wm-a' }],
    ['path', { d: dot(C, 1.05), fill: col('ink'), class: 'wm-a' }],
    ['path', { d: dot([C[0] - 0.2, C[1] - 0.2], 0.4), fill: col('shine'), 'fill-opacity': 0.85, class: 'wm-shine' }],
  ]
  return [['defs', {}, [...defs, metal]], ...out, ...mark, ...(glint ? [glint] : [])]
}
