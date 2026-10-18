// forge/hand/brutal/broom.mjs — a neo-brutalist witch's broom on the diagonal: a fat ink handle with a coloured core, a
// chunky binding band, then a wide flat bristle fan that flares out to a broad rounded end, with two ink bristle
// strands, every part ringed in thick ink with one hard ink shadow. Replaces the generated drawing, whose narrow fan
// melted into the handle and the binding at 16px.
// Roles: bristles c1, handle core c2, binding accent, outline + strands + shadow ink.
// Motion: the spec rocks the whole broom about its handle top (21 3), so every part is wm-k.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)', ACC = 'var(--with-brutal-accent, #FF8A3D)'
const W = 2.2, IN = 1.25, S = -0.6, O = 1.25
const f = n => +n.toFixed(2)
const LINE = w => ({ stroke: INK, 'stroke-width': w, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' })

// a local frame: a along the broom from the handle top (21 3) down-left, b across it
const OX = 20.75, OY = 3.25, U = [-Math.SQRT1_2, Math.SQRT1_2], N = [Math.SQRT1_2, Math.SQRT1_2]
const p = (a, b, d) => `${f(OX + U[0] * a + N[0] * b + d)} ${f(OY + U[1] * a + N[1] * b + d)}`
const HANDLE = d => `M${p(0, 0, d)}L${p(9, 0, d)}`
const BIND = d => `M${p(8.5, -2.5, d)}L${p(12, -2.75, d)}L${p(12, 2.75, d)}L${p(8.5, 2.5, d)}Z`
// fan: straight flaring sides, a convex rounded end (quadratic bulge)
const FAN = d => `M${p(11.75, -2.5, d)}L${p(18.75, -5.75, d)}Q${p(21.75, 0, d)} ${p(18.75, 5.75, d)}L${p(11.75, 2.5, d)}Z`
const STRANDS = d => `M${p(13.75, -1.1, d)}L${p(18, -2.6, d)}M${p(13.75, 1.1, d)}L${p(18, 2.6, d)}`

export default function render() {
  const s = S, o = S + O
  return [
    ['path', { d: HANDLE(o), fill: 'none', ...LINE(4.2), class: 'wm-shadow' }],
    ['path', { d: FAN(o) + BIND(o), fill: INK, ...LINE(W), class: 'wm-shadow' }],
    ['path', { d: HANDLE(s), fill: 'none', ...LINE(4.2), class: 'wm-k' }],
    ['path', { d: HANDLE(s), fill: 'none', stroke: C2, 'stroke-width': 1.6, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: FAN(s), fill: C1, ...LINE(W), class: 'wm-k' }],
    ['path', { d: STRANDS(s), fill: 'none', ...LINE(IN), class: 'wm-k' }],
    ['path', { d: BIND(s), fill: ACC, ...LINE(W), class: 'wm-k' }],
  ]
}
