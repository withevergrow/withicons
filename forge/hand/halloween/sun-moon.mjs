// hand-drawn halloween sun-moon: one round disc split by a curved seam, a pumpkin-orange sun on the left with five
// rays fanned round its left side and a pale gold crescent moon on the right, plus a spark of starlight.
// Sun wm-k, moon wm-a, rays wm-deco, spark wm-s.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'sun-moon'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100

const CX = 13.2, CY = 12, R = 5.8, A = 10.83
const top = `${CX} ${CY - R}`, bot = `${CX} ${CY + R}`
const SUN = `M${top}A${A} ${A} 0 0 1 ${bot}A${R} ${R} 0 0 1 ${top}Z`      // left half plus the bulge of the seam
const MOON = `M${top}A${A} ${A} 0 0 1 ${bot}A${R} ${R} 0 0 0 ${top}Z`     // the sliver that is left on the right
const WHOLE = `M${top}A${R} ${R} 0 0 1 ${bot}A${R} ${R} 0 0 1 ${top}Z`
const rays = [240, 210, 180, 150, 120].map(a => {
  const t = a * Math.PI / 180, c = Math.cos(t), s = Math.sin(t)
  return `M${r2(CX + 8.1 * c)} ${r2(CY + 8.1 * s)}L${r2(CX + 10.1 * c)} ${r2(CY + 10.1 * s)}`
}).join('')
const disc = (x, y, r) => `M${r2(x - r)} ${y}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`
const star = (x, y, r, k) => `M${x} ${r2(y - r)}L${r2(x + k)} ${r2(y - k)}L${r2(x + r)} ${y}L${r2(x + k)} ${r2(y + k)}L${x} ${r2(y + r)}L${r2(x - k)} ${r2(y + k)}L${r2(x - r)} ${y}L${r2(x - k)} ${r2(y - k)}Z`

export default function render() {
  const shadow = setD(translateSet(setOf(parsePath(WHOLE, 0.1).map(s => s.pts)), 0.15, 0.85))
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 11, cy: 12.8, r: 6.4, fx: 9.4, fy: 9.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent), st(0.4, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 16, cy: 12, r: 6.5, fx: 14.6, fy: 8.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine), st(0.5, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(2), cx: 12.5, cy: 12, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    // rays: midnight rim under a warm core
    ['path', { d: rays, fill: 'none', stroke: C.ink, 'stroke-width': 2.1, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: rays, fill: 'none', stroke: C.accent, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: MOON, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: SUN, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: `M${r2(CX - 4.3)} ${r2(CY - 0.6)}A4.5 4.5 0 0 1 ${r2(CX - 1.2)} ${r2(CY - 4)}`, fill: 'none', stroke: C.shine, 'stroke-opacity': 0.65, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: disc(17.1, 12.6, 0.55) + disc(16.4, 15.3, 0.4), fill: C.accent, 'fill-opacity': 0.75, class: 'wm-a' }],
    ['path', { d: star(20.2, 4.6, 2.1, 0.6), fill: C.tint, stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-s' }],
  ]
}
