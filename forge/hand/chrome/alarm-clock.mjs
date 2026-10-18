// forge/hand/chrome/alarm-clock.mjs — a polished chrome alarm clock: a fat chrome bezel round a darker gunmetal dial
// set in on a seam, bright chrome hands on a dark halo across the dial, two gunmetal bell domes and splayed feet. The
// generated face was one pale chrome disc with thin grooved hands that its own dark horizon cut through, so the dial
// vanished at 16px; the dark dial under light hands now reads at a glance. Same placement and paint as the generator.
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
const flat = (Fd, role, cls) => ({ loops: F.contour(F.copy(Fd)).filter(l => l.length > 2 && Math.abs(area(l)) >= 0.04).map(smooth), fill: col(role), cls, q: 'body' })
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

const CX = 12, CY = 12.75
const BELLS = 'M2.75 9.25A4.6 4.6 0 0 1 9.25 2.75ZM14.75 2.75A4.6 4.6 0 0 1 21.25 9.25Z'
const FEET = 'M7.25 18.25L5 21M16.75 18.25L19 21'
const HANDS = `M${CX} 9.25V${CY}L14.75 14.25`

const only = (L, cls, shadow = false) => L.list.filter(l => shadow === (l.cls === 'wm-shadow')).map(l => ({ ...l, cls: shadow ? l.cls : cls }))

export default function render(icon) {
  const name = (icon && icon.name) || 'alarm-clock'
  const case_ = reg(disc(CX, CY, 8.25))
  // bells and feet: gunmetal, behind the case (they ring with the hands: the A part)
  const back = F.open(minus(F.union(reg(BELLS), F.strokes(lines(FEET), 1.9, M0)), grow(case_, 0.35)), 0.25)
  // the dial: gunmetal, set into the chrome bezel on a dark seam
  const dial = reg(disc(CX, CY, 5.55))
  const g = grow(dial, 0.42)
  const bezel = F.open(minus(case_, g), 0.32)
  const seam = F.intersect(F.copy(g), case_)
  const hands = F.strokes(lines(HANDS), 1.55, M0)
  const sil = F.copy(case_); F.union(sil, back)

  const Lb = layers({ T: { noGlint: true }, K: null, Af: null, Ab: back, S: null, sil, txt: null, seam: null })
  const Lk = layers({ T: {}, K: bezel, Af: dial, Ab: null, S: null, sil, txt: null, seam })
  const Lh = layers({ T: { noGlint: true }, K: hands, Af: null, Ab: null, S: null, sil, txt: null, seam: null })
  const list = [
    ...only(Lb, null, true), ...only(Lb, 'wm-a'), ...only(Lk, 'wm-k'),
    flat(F.intersect(grow(hands, 0.35), dial), 'shadow', 'wm-a'), ...only(Lh, 'wm-a'),
  ]
  const Ls = { list, glint: Lk.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 6500; t++) out = emit(Ls, name, t)
  return out
}
