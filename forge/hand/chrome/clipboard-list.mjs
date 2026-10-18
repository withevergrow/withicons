// forge/hand/chrome/clipboard-list.mjs — the chrome clipboard (one slab with the gunmetal spring clip clamped on its top
// edge, as the hand-drawn clipboard) with a two-row list standing proud of it: a big round gunmetal bullet and a
// gunmetal bar per row, each on a dark seam (the same paint as clipboard-check's tick and the clip), centred in the
// board below the clip. The generated list (and the first hand pass, rows cut through to the ground) faded into the
// board's warm shading on white; raised dark marks read on white and on #0B0B12, and the dot-and-bar rhythm with a
// wide gap keeps it apart from the plain clipboard at 16px. Same paint as the generator (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { model, layers, emit, K as CK } from '../../styles/_chrome-core.mjs'

const BOARD = 'M6.5 4.5H17.5A2 2 0 0 1 19.5 6.5V19.5A2 2 0 0 1 17.5 21.5H6.5A2 2 0 0 1 4.5 19.5V6.5A2 2 0 0 1 6.5 4.5Z'
// the clip's centre line (the clipboard's): a tab over a wide jaw, inflated by the gunmetal tube
const CLIP = 'M10.25 3.25H13.75V5.75H15.5V7.25H8.5V5.75H10.25Z'
// two rows centred below the clip: a bullet and an item bar, a wide gap between them
const Y = [12.75, 17]
const DOT = 8.25, BAR = [12.5, 16.5]

const tf = p => [(p[0] - 12) * CK.SCALE + 12 + CK.TX, (p[1] - 12) * CK.SCALE + 12 + CK.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = CK.M
const minus = (A, B) => F.subtract(F.copy(A), B)
const prep = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

export default function render(icon) {
  const name = (icon && icon.name) || 'clipboard-list'
  // the board: the slab inflated by the style's K tube and filled
  const Kf = F.strokes(lines(BOARD), CK.WK, M0)
  F.region(rings(BOARD), M0, Kf)
  // the list, gunmetal, in front of the board, with a parting gap that reads as a dark seam
  const Af = F.field(M0), clear = F.field(M0)
  for (const y of Y) {
    const dot = [{ pts: [tf([DOT, y])], closed: false }], bar = lines(`M${BAR[0]} ${y}H${BAR[1]}`)
    F.strokes(dot, 2.2, M0, Af)
    F.strokes(bar, 1.6, M0, Af)
    // a clear channel round each row: the horizon band and dark ground stay out from under it
    F.strokes(lines(`M${DOT} ${y}H${BAR[1]}`), 3.4, M0, clear)
  }
  const gap = F.offset(F.copy(Af), -CK.GAP)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), CK.ROUND)
  const A = F.open(Af, CK.ROUND)
  const board = layers({ T: {}, K, Af: A, Ab: null, S: null, sil: F.copy(Kf), txt: clear, seam })
  for (const L of board.list) if (!L.cls) L.cls = 'wm-k'
  // the clip, a separate gunmetal piece laid over the board's top edge
  const cl = parsePath(CLIP)
  const clip = layers(model({
    name, paths: [{ id: 'p', d: CLIP, plate: 'A', subs: cl }], fills: [prep(CLIP)], cutouts: [],
    lines: cl.map(x => ({ pts: x.pts, closed: x.closed, plate: 'A', pathId: 'p' })),
  }))
  for (const L of clip.list) L.cls = 'wm-a'
  const Ls = { list: [...board.list, ...clip.list], glint: board.glint }
  let out = emit(Ls, name, 0)
  for (let t = 1; t < 3 && size(out) > 8000; t++) out = emit(Ls, name, t)
  return out
}
