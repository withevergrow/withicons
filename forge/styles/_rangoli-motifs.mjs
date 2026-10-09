// RANGOLI motif library: Indian festival motifs as compact closed path data (our own geometry).
// Each function returns a path `d` string in icon units (24 grid). Colours are applied by the core.
//
//   petal       teardrop petal (round inner end, pointed outer tip): the unit of rangoli rings and lotus bases
//   petalRing   rangoli ring: n long petals with n short ones between (two paths: long, short)
//   marigold    genda phool: scalloped ruffle rings round a heart (three paths: outer, inner, heart)
//   flame       diya flame: teardrop with an inner core (two paths)
//   sparkle     four-point twinkle (Diwali night)
//   leaf        toran mango leaf hanging from a string
//   lotus       lotus base: five petals fanned upward from a point (two paths: outer pair + centre trio)
//   paisley     boteh / kairi: teardrop with a curled tip, and its eye
//   disc        a bindu dot

export const num = v => {
  let s = String(Math.round(v * 100) / 100)
  if (s === '-0') s = '0'
  if (s.startsWith('0.')) s = s.slice(1)
  else if (s.startsWith('-0.')) s = '-' + s.slice(2)
  return s
}
const P = p => num(p[0]) + (p[1] < 0 ? '' : ' ') + num(p[1])
const add = (a, u, k) => [a[0] + u[0] * k, a[1] + u[1] * k]
const at = (c, u, n, a, b) => [c[0] + u[0] * a + n[0] * b, c[1] + u[1] * a + n[1] * b]

export const disc = (x, y, r) => `M${num(x - r)} ${num(y)}a${num(r)} ${num(r)} 0 1 0 ${num(2 * r)} 0a${num(r)} ${num(r)} 0 1 0 ${num(-2 * r)} 0z`

// teardrop from a round base at distance r0 from c to a tip at r1, along angle ang, half-width w
export function petal(cx, cy, ang, r0, r1, w) {
  const u = [Math.cos(ang), Math.sin(ang)], n = [-u[1], u[0]], c = [cx, cy], L = r1 - r0
  const tip = add(c, u, r1)
  const base = add(c, u, r0)
  const a1 = at(c, u, n, r0 + 0.62 * L, w * 0.95), b1 = at(c, u, n, r0 + 0.02 * L, w * 1.3)
  const b2 = at(c, u, n, r0 + 0.02 * L, -w * 1.3), a2 = at(c, u, n, r0 + 0.62 * L, -w * 0.95)
  return `M${P(tip)}C${P(a1)} ${P(b1)} ${P(base)}C${P(b2)} ${P(a2)} ${P(tip)}z`
}

// rangoli ring round (cx, cy): n broad petals (round tips, like a kolam flower) with a bindu dot between each pair.
// Returns [petals, dots].
export function petalRing(cx, cy, rIn, rOut, n, rot = -Math.PI / 2) {
  let petals = '', dots = ''
  const span = Math.PI * 2 / n
  const w = Math.min(1.5, rIn * Math.sin(span / 2) * 1.05)
  for (let i = 0; i < n; i++) {
    const a = rot + i * span, b = a + span / 2
    petals += budPetal(cx, cy, a, rIn - 0.4, rOut, w)
    const rd = rIn + (rOut - rIn) * 0.62, dr = Math.min(0.62, (rOut - rIn) * 0.2)
    dots += disc(cx + rd * Math.cos(b), cy + rd * Math.sin(b), dr)
  }
  return [petals, dots]
}
// a broad petal with a rounded outer end (bud), from r0 to r1 along ang
export function budPetal(cx, cy, ang, r0, r1, w) {
  const u = [Math.cos(ang), Math.sin(ang)], n = [-u[1], u[0]], c = [cx, cy], L = r1 - r0
  const q = (a, k) => at(c, u, n, r0 + a * L, k * w)
  return `M${P(q(0, 0))}C${P(q(0.1, 0.9))} ${P(q(0.45, 1.05))} ${P(q(0.78, 0.8))}C${P(q(0.95, 0.62))} ${P(q(1.04, 0.3))} ${P(q(1, 0))}` +
    `C${P(q(1.04, -0.3))} ${P(q(0.95, -0.62))} ${P(q(0.78, -0.8))}C${P(q(0.45, -1.05))} ${P(q(0.1, -0.9))} ${P(q(0, 0))}z`
}

// scalloped ring: k bumps, points on radius r0, bumps reach r
function scallop(cx, cy, r, k, rot) {
  const r0 = r * 0.8, rc = r * 1.2
  let d = ''
  for (let i = 0; i <= k; i++) {
    const a = rot + i * Math.PI * 2 / k
    const p = [cx + r0 * Math.cos(a), cy + r0 * Math.sin(a)]
    if (i === 0) { d += 'M' + P(p); continue }
    const m = a - Math.PI / k
    d += 'Q' + P([cx + rc * Math.cos(m), cy + rc * Math.sin(m)]) + ' ' + P(p)
  }
  return d + 'z'
}
export function marigold(cx, cy, r) {
  return [scallop(cx, cy, r, 10, -Math.PI / 2), scallop(cx, cy, r * 0.6, 8, -Math.PI / 2 + Math.PI / 8), disc(cx, cy, r * 0.22)]
}

// flame standing on (x, y), height h
export function flame(x, y, h) {
  const one = (hh, sc) => {
    const r = hh * 0.34 * sc, tip = [x, y - hh], b = [x, y]
    return `M${P(tip)}C${P([x + r * 0.35, y - hh * 0.72])} ${P([x + r * 1.45, y - hh * 0.42])} ${P([x + r * 0.98, y - r * 0.5])}` +
      `C${P([x + r * 0.7, y - r * 0.02])} ${P([x + r * 0.25, y])} ${P(b)}` +
      `C${P([x - r * 0.25, y])} ${P([x - r * 0.7, y - r * 0.02])} ${P([x - r * 0.98, y - r * 0.5])}` +
      `C${P([x - r * 1.45, y - hh * 0.42])} ${P([x - r * 0.35, y - hh * 0.72])} ${P(tip)}z`
  }
  return [one(h, 1), one(h * 0.5, 1.15)]
}

export function sparkle(x, y, r) {
  const k = r * 0.16
  return `M${P([x, y - r])}Q${P([x + k, y - k])} ${P([x + r, y])}Q${P([x + k, y + k])} ${P([x, y + r])}` +
    `Q${P([x - k, y + k])} ${P([x - r, y])}Q${P([x - k, y - k])} ${P([x, y - r])}z`
}

// toran leaf hanging from (x, y), length L, half-width w
export function leaf(x, y, L, w) {
  return `M${P([x, y])}C${P([x + w * 1.35, y + L * 0.22])} ${P([x + w * 0.9, y + L * 0.72])} ${P([x, y + L])}` +
    `C${P([x - w * 0.9, y + L * 0.72])} ${P([x - w * 1.35, y + L * 0.22])} ${P([x, y])}z`
}

// lotus base: five pointed petals fanned upward from a base at (x, y); s = scale (1 = 7u centre petal).
// Returns [outer pair, centre trio] so the core can colour the back pair deeper.
function lotusPetal(bx, by, ang, L, w) {
  const u = [Math.cos(ang), Math.sin(ang)], n = [-u[1], u[0]], b = [bx, by]
  const q = (a, k) => at(b, u, n, a * L, k * w)
  return `M${P(b)}C${P(q(0.22, 1.25))} ${P(q(0.68, 0.95))} ${P(q(1, 0))}C${P(q(0.68, -0.95))} ${P(q(0.22, -1.25))} ${P(b)}z`
}
export function lotus(x, y, s = 1) {
  const up = -Math.PI / 2, d = Math.PI / 180
  const outer = lotusPetal(x - 1.6 * s, y, up - 70 * d, 5.4 * s, 1.5 * s) + lotusPetal(x + 1.6 * s, y, up + 70 * d, 5.4 * s, 1.5 * s)
  const mid = lotusPetal(x - 1.1 * s, y, up - 38 * d, 6.6 * s, 1.75 * s) + lotusPetal(x + 1.1 * s, y, up + 38 * d, 6.6 * s, 1.75 * s) +
    lotusPetal(x, y, up, 7.2 * s, 1.9 * s)
  return [outer, mid]
}

// paisley (boteh / kairi) centred on its round end (x, y), radius r, rotated by rot (0 = tip up and hooking right);
// returns [body, eye]
export function paisley(x, y, r, rot = 0, flip = false) {
  const c = Math.cos(rot), s = Math.sin(rot), f = flip ? -1 : 1
  const p = (a, b) => [x + (a * f * c - b * s) * r, y + (a * f * s + b * c) * r]
  const pts = [[0, 1], [-0.75, 1], [-1.05, 0.5], [-1.05, 0], [-1.05, -0.85], [-0.9, -1.4], [-0.4, -1.95], [0.05, -2.4], [0.9, -2.55], [1.35, -2.15],
    [1.6, -1.9], [1.55, -1.6], [1.4, -1.5], [1.2, -1.75], [0.85, -1.75], [0.8, -1.35], [0.85, -0.9], [1.05, -0.5], [1.05, 0], [1.05, 0.55], [0.6, 1], [0, 1]]
  let d = 'M' + P(p(...pts[0]))
  for (let i = 1; i < pts.length; i += 3) d += 'C' + P(p(...pts[i])) + ' ' + P(p(...pts[i + 1])) + ' ' + P(p(...pts[i + 2]))
  return [d + 'z', disc(x, y, r * 0.42)]
}
