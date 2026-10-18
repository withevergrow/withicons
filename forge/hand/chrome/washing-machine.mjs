// forge/hand/chrome/washing-machine.mjs — a polished chrome washing machine: a tall cabinet with a control panel parted
// off by a groove (a drawer slot and a gunmetal dial knob), and a big porthole door: a fat gunmetal ring set in on a
// dark seam round dark glass with a white reflection. The generated door was a thin pale ring on pale chrome and the
// panel knobs fused into goggles, so the drum all but vanished at 16px; the dark door now reads at a glance.
// Painted with the style's own layer recipe (_chrome-core layers/emit); only the geometry is drawn here.
import { parsePath, area } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

// the style's placement: drawing scaled about the centre and lifted for the shadow
const S = 0.88, OX = -0.2, OY = -0.55, M0 = 0.7
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const reg = (d, into = null) => F.region(rings(d), M0, into)
const minus = (A, B) => F.subtract(F.copy(A), B)
const grow = (A, e) => F.offset(F.copy(A), -e)
const disc = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const smooth = r => r.length < 5 ? r : r.map((p, i) => {
  const a = r[(i - 1 + r.length) % r.length], b = r[(i + 1) % r.length]
  return [(a[0] + 2 * p[0] + b[0]) / 4, (a[1] + 2 * p[1] + b[1]) / 4]
})
const flat = (Fd, role, cls, op) => {
  const L = { loops: F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), fill: col(role), cls, q: 'body' }
  if (op != null) L.op = op
  return L
}
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const CAB = 'M5.5 1.75H18.5A2.25 2.25 0 0 1 20.75 4V20A2.25 2.25 0 0 1 18.5 22.25H5.5A2.25 2.25 0 0 1 3.25 20V4A2.25 2.25 0 0 1 5.5 1.75Z'
const PANEL = 'M3.25 6.5H20.75'
const SLOT = 'M6.25 4.25H10'
const KNOB = [16.5, 4.25], KR = 1.15
const DOOR = [12, 14.5], DR = 5.4, GR = 3.25
// the glass reflection: a crescent along the upper-left of the glass
const GLINT = 'M9.45 14.1A2.6 2.6 0 0 1 12.4 11.55A3.3 3.3 0 0 0 9.45 14.1Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'washing-machine'
  const cab = reg(CAB)
  const cut = F.strokes(lines(PANEL), 1.05, M0)
  F.strokes(lines(SLOT), 1.15, M0, cut)
  // front pieces: the dial knob and the door ring, each set in on a seam
  const knob = reg(disc(KNOB[0], KNOB[1], KR))
  const door = reg(disc(DOOR[0], DOOR[1], DR))
  const glass = reg(disc(DOOR[0], DOOR[1], GR))
  const ring = F.open(minus(door, grow(glass, 0.05)), 0.2)
  const front = F.copy(knob); F.union(front, door)
  const g = grow(front, 0.42)
  const K = F.open(minus(minus(cab, cut), g), 0.32)
  const seam = minus(F.intersect(F.copy(g), cab), cut)
  const sil = minus(cab, cut)

  const Lk = layers({ T: {}, K, Af: knob, Ab: null, S: null, sil, txt: null, seam })
  const Ld = layers({ T: { noGlint: true }, K: null, Af: ring, Ab: null, S: null, sil, txt: null, seam: null })
  const body = Lk.list.map(l => ({ ...l, cls: l.cls === 'wm-shine' || l.cls === 'wm-shadow' ? l.cls : 'wm-k' }))
  // the door tumbles round its centre: ring, glass and reflection are the A part
  const doorL = Ld.list.filter(l => l.cls !== 'wm-shadow').map(l => ({ ...l, cls: 'wm-a' }))
  const list = [
    ...body, ...doorL,
    flat(glass, 'ink', 'wm-a'),
    flat(F.offset(F.copy(glass), 0.3), 'c3', 'wm-a'),
    flat(reg(GLINT), 'shine', 'wm-a', 0.85),
  ]
  const Ls = { list, glint: Lk.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
