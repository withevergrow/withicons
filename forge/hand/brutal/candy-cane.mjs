// forge/hand/brutal/candy-cane.mjs — a neo-brutalist candy cane: one fat tube with a wide round hook, a flat body colour
// crossed by evenly spaced, evenly slanted stripes that follow the tube round the bend, ringed in thick ink with one hard
// ink shadow. Replaces the generated drawing, whose few stray stripes in three colours made the cane read as a P.
// Roles: cane c1, stripes c2, outline + shadow ink. Motion: the spec rocks the whole cane, so it is wm-k.
const INK = 'var(--with-brutal-ink, var(--with-brutal-ink, #16130F))'
const C1 = 'var(--with-brutal-c1, #FFD23F)', C2 = 'var(--with-brutal-c2, #FF6BA8)'
const W = 2.2, S = -0.6, O = 1.25
const f = n => +n.toFixed(2)
const LINE = { stroke: INK, 'stroke-width': W, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }

// centreline: up the shaft, over the hook (radius R about CX, CY), down the short end; tube half-width H
const X0 = 5.5, Y0 = 20, CX = 12, CY = 11, R = 6.5, Y1 = 13.5, H = 2.25
const L1 = Y0 - CY, LA = Math.PI * R, L2 = Y1 - CY, LEN = L1 + LA + L2
// point at arc length s along the centreline, offset v to the right of travel
function P(s, v) {
  let x, y, tx, ty
  if (s <= L1) { x = X0; y = Y0 - s; tx = 0; ty = -1 }
  else if (s <= L1 + LA) {
    const a = Math.PI - (s - L1) / R
    x = CX + R * Math.cos(a); y = CY - R * Math.sin(a); tx = Math.sin(a); ty = Math.cos(a)
  } else { x = CX + R; y = CY + (s - L1 - LA); tx = 0; ty = 1 }
  return [x - ty * v, y + tx * v]
}
const CANE = (dx, dy) => {
  const r = R + H, q = R - H, p = n => f(n)
  return `M${p(X0 - H + dx)} ${p(Y0 + dy)}V${p(CY + dy)}A${r} ${r} 0 0 1 ${p(CX + R + H + dx)} ${p(CY + dy)}` +
    `V${p(Y1 + dy)}A${H} ${H} 0 0 1 ${p(CX + R - H + dx)} ${p(Y1 + dy)}V${p(CY + dy)}A${q} ${q} 0 0 0 ${p(X0 + H + dx)} ${p(CY + dy)}` +
    `V${p(Y0 + dy)}A${H} ${H} 0 0 1 ${p(X0 - H + dx)} ${p(Y0 + dy)}Z`
}
// stripes: bands of width SW every PER along the tube, slanted by K (left edge ahead of the right)
const PER = 3.4, SW = 1.7, K = 0.9, STEPS = 4
function stripe(s0, dx, dy) {
  const pts = []
  const edge = (s, v) => { const [x, y] = P(s + K * (v / H), v); return `${f(x + dx)} ${f(y + dy)}` }
  for (let i = 0; i <= STEPS; i++) pts.push(edge(s0, -H + (2 * H * i) / STEPS))
  for (let i = STEPS; i >= 0; i--) pts.push(edge(s0 + SW, -H + (2 * H * i) / STEPS))
  return 'M' + pts.join('L') + 'Z'
}

export default function render() {
  const d = S, stripes = []
  for (let s = 1.3; s + SW + K < LEN - 0.4; s += PER) stripes.push(stripe(s, d, d))
  return [
    ['path', { d: CANE(S + O, S + O), fill: INK, ...LINE, class: 'wm-shadow' }],
    ['path', { d: CANE(d, d), fill: C1, class: 'wm-k' }],
    ['path', { d: stripes.join(''), fill: C2, class: 'wm-k' }],
    ['path', { d: CANE(d, d), fill: 'none', ...LINE, class: 'wm-k' }],
  ]
}
