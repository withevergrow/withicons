// forge/hand/brutal/north-star.mjs — the Christmas guiding star: one yellow four-point concave sparkle with a long lower
// ray, a pink diamond set in its heart, a 2.2 ink outline and a single hard offset shadow. Replaces the generated drawing,
// whose four diagonal ticks each grew their own shadow and smeared the star into an overlapping ink mass.
// Roles: star c1, heart diamond c2, outline + shadow ink. Motion: the spec pulses the star about 12 11, so it is wm-a.
const INK = 'var(--with-brutal-ink, #16130F)'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = 1.9, OFF = 1.25
const f = n => +n.toFixed(2)
const line = w => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })

const CX = 11.4, CY = 10.4
const STAR = o => {
  const x = CX + o, y = CY + o
  const T = y - 8.3, B = y + 11.0, L = x - 8.2, R = x + 8.2, k = 0.55
  return `M${f(x)} ${f(T)}Q${f(x + k)} ${f(y - k)} ${f(R)} ${f(y)}Q${f(x + k)} ${f(y + k)} ${f(x)} ${f(B)}` +
    `Q${f(x - k)} ${f(y + k)} ${f(L)} ${f(y)}Q${f(x - k)} ${f(y - k)} ${f(x)} ${f(T)}Z`
}
const GEM = `M${CX} ${f(CY - 2.2)}L${f(CX + 1.3)} ${CY}L${CX} ${f(CY + 2.2)}L${f(CX - 1.3)} ${CY}Z`

// a thin light halo under the whole drawing (the shine role) so the dark ink keeps its edge on dark backgrounds
const SHINE_HALO = 'var(--with-brutal-shine, #FFFDF5)'
const halo = nodes => nodes
  .filter(([, a]) => a.class === 'wm-shadow' || (a.stroke === INK && a['stroke-width'] >= 1.7))
  .map(([t, a]) => [t, { ...a, fill: a.fill === 'none' ? 'none' : SHINE_HALO, stroke: SHINE_HALO, 'stroke-width': +((a['stroke-width'] || 0) + 1.8).toFixed(2), class: 'wm-shadow' }])

export default function render() {
  const nodes = [
    ['path', { d: STAR(OFF), fill: INK, ...line(W), class: 'wm-shadow' }],
    ['path', { d: STAR(0), fill: C1, ...line(W), class: 'wm-a' }],
    ['path', { d: GEM, fill: C2, ...line(1.1), class: 'wm-a' }],
  ]
  return [...halo(nodes), ...nodes]
}
