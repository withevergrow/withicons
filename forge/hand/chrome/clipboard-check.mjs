// forge/hand/chrome/clipboard-check.mjs — the chrome clipboard (one slab with the gunmetal spring clip clamped on its top
// edge, as the hand-drawn clipboard) with one big bold gunmetal check standing proud of it on a dark seam. The
// generated check was a thin groove crossed by the board's dark mirror horizon and dark ground, so the shading
// competed with the tick; here the horizon and the ground stop short of the check, which sits in a clear bright
// channel and is the strongest mark at 16px. Same paint as the generator (_chrome-core layers/emit).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { model, layers, emit, K as CK } from '../../styles/_chrome-core.mjs'

const BOARD = 'M6.5 4.5H17.5A2 2 0 0 1 19.5 6.5V19.5A2 2 0 0 1 17.5 21.5H6.5A2 2 0 0 1 4.5 19.5V6.5A2 2 0 0 1 6.5 4.5Z'
// the clip's centre line (the clipboard's): a tab over a wide jaw, inflated by the gunmetal tube
const CLIP = 'M10.25 3.25H13.75V5.75H15.5V7.25H8.5V5.75H10.25Z'
// the check, centred in the board below the clip
const CHECK = 'M7.75 14.75L10.75 17.75L16.25 12.25'

const tf = p => [(p[0] - 12) * CK.SCALE + 12 + CK.TX, (p[1] - 12) * CK.SCALE + 12 + CK.TY]
const lines = d => parsePath(d).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const rings = d => parsePath(d).map(s => s.pts.map(tf))
const M0 = CK.M
const minus = (A, B) => F.subtract(F.copy(A), B)
const prep = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
const size = n => n.reduce((a, x) => a + (x[0] === 'defs' ? 0 : x[1].d.length + 70), 0)

export default function render(icon) {
  const name = (icon && icon.name) || 'clipboard-check'
  // the board: the slab inflated by the style's K tube and filled
  const Kf = F.strokes(lines(BOARD), CK.WK, M0)
  F.region(rings(BOARD), M0, Kf)
  // the check, gunmetal, in front of the board, with a parting gap that reads as a dark seam
  const ck = lines(CHECK)
  const Af = F.strokes(ck, 2.5, M0)
  const gap = F.offset(F.copy(Af), -CK.GAP)
  const seam = F.intersect(F.copy(gap), Kf)
  const K = F.open(minus(Kf, gap), CK.ROUND)
  const A = F.open(Af, CK.ROUND)
  // a clear channel round the check: the board's horizon band and dark ground stay out from under it
  const txt = F.strokes(ck, 5.4, M0)
  const board = layers({ T: {}, K, Af: A, Ab: null, S: null, sil: F.copy(Kf), txt, seam })
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
