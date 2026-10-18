// forge/hand/kawaii/poinsettia.mjs: a poinsettia in colour: three mint leaves behind, five layered strawberry bracts with
// pointed tips and pale mid-veins, a lemon cluster of three berries in the heart, plus a sparkle.
import { sparkleD } from '../../styles/_kawaii-face.mjs'
const BRACT = 'var(--with-kawaii-fill-1, #FF6FA5)'
const LEAF = 'var(--with-kawaii-fill-4, #45D99A)'
const CENTRE = 'var(--with-kawaii-fill-3, #FFD23A)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'
const SPARKLE = 'var(--with-kawaii-sparkle, #FFB627)'

const CX = 12, CY = 12.2
const r2 = n => Math.round(n * 100) / 100
// point at distance d along angle a (deg) and sideways offset o
const P = (a, d, o) => {
  const t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  return `${r2(CX + d * c - o * s)} ${r2(CY + d * s + o * c)}`
}
// pointed leaf: base near the centre, widest ~55% out, sharp tip at distance L
const leaf = (a, L, w) =>
  `M${P(a, 1.2, 0)}C${P(a, L * 0.3, w * 1.15)} ${P(a, L * 0.72, w * 0.95)} ${P(a, L, 0)}C${P(a, L * 0.72, -w * 0.95)} ${P(a, L * 0.3, -w * 1.15)} ${P(a, 1.2, 0)}Z`
const vein = (a, L) => `M${P(a, 2.6, 0)}L${P(a, L * 0.72, 0)}`
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`

const BRACTS = [-90, -18, 54, 126, 198]
const LEAVES = [18, 90, 162]

export default function render() {
  const out = []
  for (const a of LEAVES) out.push(['path', { d: leaf(a, 10.2, 3.5), fill: LEAF, 'fill-opacity': 0.9, 'stroke-width': 1.4, class: 'wm-a' }])
  for (const a of BRACTS) {
    out.push(['path', { d: leaf(a, 9.6, 2.8), fill: BRACT, 'fill-opacity': 0.95, 'stroke-width': 1.4, class: 'wm-k' }])
  }
  out.push(['path', { d: BRACTS.map(a => vein(a, 9.6)).join(''), stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.85, class: 'wm-shine' }])
  out.push(['path', { d: disc(12, 12.2, 2.3), fill: CENTRE, 'stroke-width': 1.4, class: 'wm-s' }])
  out.push(['path', { d: disc(11.2, 11.5, 0.5) + disc(12.9, 11.7, 0.5) + disc(12, 13.1, 0.5), fill: 'var(--with-kawaii-accent, #FF5C9A)', stroke: 'none', class: 'wm-s' }])
  out.push(['path', { d: sparkleD(20.8, 3.4, 1.6), fill: SPARKLE, stroke: 'none', class: 'wm-deco' }])
  return out
}
