// forge/hand/brutal/sun-moon.mjs — the theme-toggle disc: one round ink-ringed disc split by a shallow curved seam into a
// yellow sun half (left) and a blue crescent moon (right), with six fat round-capped ink rays fanned round the sun side
// only, fused into one sticker outline with the disc. Replaces the earlier two-object drawing (a separate sun and a big crescent), which did
// not match the line design. Roles: sun c1, moon c3, outline, rays and hard shadow ink. Rays cast no shadow (as on sun).
// Motion: the spec rocks the icon about 13 12, so the disc is wm-k and the rays wm-a.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C3 = 'var(--with-brutal-c3, #4D7CFE)'
const W = 2.2, OFF = 1.25
const f = n => +n.toFixed(2)
const line = w => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })

const CX = 14.3, CY = 11.6, R = 6.2
const circ = o => ({ cx: f(CX + o), cy: f(CY + o), r: R })
// sun half: the left semicircle closed by the seam, which bulges right a little
const SUN = `M${CX} ${f(CY - R)}A${R} ${R} 0 0 0 ${CX} ${f(CY + R)}A16.4 16.4 0 0 0 ${CX} ${f(CY - R)}Z`
const RW = 2.9   // ray weight: fat solid ink, so the rays hold their shape at 16px
const rays = () => [125, 147, 169, 191, 213, 235].map(a => {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  return `M${f(CX + c * 9.2)} ${f(CY + s * 9.2)}L${f(CX + c * 10.6)} ${f(CY + s * 10.6)}`
}).join('')

// one light halo (the shine role) under the whole drawing: the disc, its shadow and the rays all share the one flat
// colour, so it reads as a single sticker outline round the silhouette (no hollow pills) and keeps the dark ink's edge on dark
const SHINE_HALO = 'var(--with-brutal-shine, #FFFDF5)'
const HALO = 1.9
const halo = [
  ['circle', { ...circ(OFF), fill: SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': W + HALO, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
  ['circle', { ...circ(0), fill: SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': W + HALO, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
]

export default function render() {
  const nodes = [
    ['circle', { ...circ(OFF), fill: INK, ...line(W), class: 'wm-shadow' }],
    ['circle', { ...circ(0), fill: C3, ...line(W), class: 'wm-k' }],
    ['path', { d: SUN, fill: C1, ...line(W), class: 'wm-k' }],
    ['path', { d: rays(), fill: 'none', ...line(RW), class: 'wm-a' }],
  ]
  const rayHalo = ['path', { d: rays(), fill: 'none', stroke: SHINE_HALO, 'stroke-width': RW + HALO, 'stroke-linecap': 'round', class: 'wm-a' }]
  return [...halo, rayHalo, ...nodes]
}
