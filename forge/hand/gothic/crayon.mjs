// forge/hand/gothic/crayon.mjs — the common tilted crayon: a ruby wax body with a blunt pointed tip at the lower left, a
// limestone paper wrapper between two gilded bands, and a rounded top; the old rope-wrapped tube read as a boat.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'

const f1 = v => Math.round(v * 100) / 100
// local frame: u along the crayon from its tip (lower left) to its top (upper right), v across
const O = [4.6, 19.4], D = Math.SQRT1_2
const P = (u, v) => [f1(O[0] + (u + v) * D), f1(O[1] + (v - u) * D)]
const band = (u0, u1, h) => g.poly([P(u0, -h), P(u1, -h), P(u1, h), P(u0, h)])
const round = (F, r) => g.grow(g.shrink(F, r), r)

export default function render(icon) {
  const H = 3.5
  const sil = round(g.poly([P(0, 0), P(5.9, -H), P(16.6, -H), P(16.6, H), P(5.9, H)]), 0.95)
  const wrap = g.inter(sil, band(7.6, 13, H + 1))
  const nib = g.inter(sil, g.poly([P(-1, -3), P(5.9, -H), P(5.9, H), P(-1, 3)]))
  const parts = [
    g.gilt(sil, { thin: true, outline: 0.5 }),
    g.glass(g.shrink(sil, 0.8), 'c1', { outline: 0.3, glow: 0.3 }),
    g.stone(g.shrink(wrap, 0.1), { thin: true }),
    g.gilt(g.inter(sil, band(7.1, 7.9, H + 1)), { thin: true, glint: false }),
    g.gilt(g.inter(sil, band(12.7, 13.5, H + 1)), { thin: true, glint: false }),
    g.shine(g.seg(...P(2.8, -1.7), ...P(5.1, -2.5), 0.6), { op: 0.7 }),
  ]
  return paint(parts)
}
