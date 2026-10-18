// forge/hand/sticker/compass.mjs — a candy case with a big diagonal needle in two contrasting halves (lemon north,
// paper south) on an ink pivot, and the sparkles pushed out into the free corners; replaces the generated drawing,
// whose small needle was half the case's own pink and read as a dot at 16px, with a sparkle pressing on the ring.
import { build } from '../../styles/_sticker-core.mjs'
import { sparkleD } from '../../styles/_sticker-path.mjs'
import { VAR, EDGE, INK } from '../../styles/_sticker-tune.mjs'

// the sticker's art transform (scale 0.84 about the centre, optical shift)
const S = 0.84, OX = -0.25, OY = -0.35
const f = v => +v.toFixed(2)
const P = (x, y) => `${f(12 + (x - 12) * S + OX)} ${f(12 + (y - 12) * S + OY)}`
const ring = (x, y, r) => `M${P(x + r, y)}A${f(r * S)} ${f(r * S)} 0 1 1 ${P(x - r, y)}A${f(r * S)} ${f(r * S)} 0 1 1 ${P(x + r, y)}Z`
const firstXY = d => d.match(/-?\d*\.?\d+/g).slice(0, 2).map(Number)

// needle: tips on the NE-SW diagonal, sides on the other diagonal
const N = [16.95, 7.05], SO = [7.05, 16.95], L = [10.3, 10.3], R = [13.7, 13.7]

export default function render(icon) {
  const gen = build(icon)
  const shadow = gen.find(n => n[1].class === 'wm-shadow')
  const edge = gen.find(n => n[1].fill === EDGE && !n[1].class)
  const shine = gen.find(n => n[1].class === 'wm-shine')
  const out = [shadow, edge]
  const CASE = VAR('bubblegum')
  out.push(['path', { d: ring(12, 12, 9.5), fill: CASE }])
  out.push(['path', { d: ring(12, 12, 9.5), stroke: INK, 'stroke-width': 1.5 }])
  if (shine) out.push(shine)
  // needle (motion parts.A rocks about the pivot)
  out.push(['path', { d: `M${P(...N)}L${P(...R)}L${P(...L)}Z`, fill: VAR('lemon'), class: 'wm-a' }])
  out.push(['path', { d: `M${P(...SO)}L${P(...L)}L${P(...R)}Z`, fill: EDGE, class: 'wm-a' }])
  out.push(['path', { d: `M${P(...N)}L${P(...R)}L${P(...SO)}L${P(...L)}Z`, stroke: INK, 'stroke-width': 1.5, class: 'wm-a' }])
  out.push(['path', { d: ring(12, 12, 0.85), fill: INK, class: 'wm-a' }])
  // sparkles: same colours, out in the corners clear of the ring
  const decos = gen.filter(n => n[1].class === 'wm-deco')
  for (const n of decos) {
    const [x, y] = firstXY(n[1].d)
    const d = x > 12 ? sparkleD(21.85, 1.85, 1.45, 0.2) : sparkleD(1.55, 22.4, 1.0, 0.2)
    out.push(['path', { ...n[1], d }])
  }
  return out.filter(Boolean)
}
