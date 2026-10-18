// forge/hand/gloss/bike.mjs — a glossy bicycle: big open tyre rings with a small free hub dot, a slim frame whose
// main triangle stays an open hole (top tube dropped to y 10, saddle and handlebar standing clear above it), and
// the family's light carved in: a tapered upper-left shine bean on each tyre and a streak along the top tube.
// The generated drawing inflated every frame stroke by a 2.7u tube and filled the wheels as discs with small holes.
// Same vinyl recipe as the generator (forge/styles/gloss.mjs models the masses); only the skeleton and the shine are drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, roundStrokeSet } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

// fills may be path data or ready region sets ({ set })
function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(f => {
    if (typeof f !== 'string') return { d: '', subs: f.set.map(r => ({ pts: r, closed: true })), set: f.set }
    const subs = parsePath(f); return { d: f, subs, set: setOf(subs.map(s => s.pts)) }
  })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const f2 = v => Math.round(v * 100) / 100
const circ = (cx, cy, r) => `M${f2(cx + r)} ${f2(cy)}A${r} ${r} 0 1 1 ${f2(cx - r)} ${f2(cy)}A${r} ${r} 0 1 1 ${f2(cx + r)} ${f2(cy)}Z`
// tyre 1.65u, 1.75u of white between the 0.6 hub dot and the tyre
const WR = [5.25, 16.5], WF = [18.75, 16.5], RO = 4, RI = 2.35, HUB = 0.6, RM = (RO + RI) / 2
const S = [8.75, 10], H = [15.25, 10], BB = [12, 17.25]
const FW = 1.75
const toward = (a, b, d) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [f2(a[0] + dx / l * d), f2(a[1] + dy / l * d)] }
// every member is its own round-capped segment; the chainstay and the fork stop mid-tyre, so each wheel keeps a whole
// round opening with a free hub dot in it. Seat post and stem continue the seat tube and the head tube; the saddle
// and the bar sit 3.25u above the top tube (1.5u of white between them)
const FORK_END = toward(WF, H, RM)
const POST = [7.13, 6.75], STEM = [13.63, 6.75]
const FRAME = [
  [S, H], [toward(WR, BB, RM), BB], [BB, H], [S, BB], [H, FORK_END],
  [H, STEM], [[13.5, 6.75], [16.5, 6.75]],
  [S, POST], [[5.5, 6.75], [8.75, 6.75]],
]

// a tapered shine bean along an arc (centre c, radius r, angles a0..a1 in degrees, half-width up to w)
function arcBean(c, r, a0, a1, w, w0 = 0.06) {
  const n = 20, out = [], back = []
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = (a0 + (a1 - a0) * u) * Math.PI / 180
    const ww = w0 + (w - w0) * Math.pow(Math.sin(Math.PI * u), 0.5)
    out.push([c[0] + Math.cos(a) * (r + ww), c[1] + Math.sin(a) * (r + ww)])
    back.push([c[0] + Math.cos(a) * (r - ww), c[1] + Math.sin(a) * (r - ww)])
  }
  return 'M' + [...out, ...back.reverse()].map(p => `${f2(p[0])} ${f2(p[1])}`).join('L') + 'Z'
}
// a tapered streak along a straight member, from p to q, lifted toward the light by `lift`
function streak(p, q, w, lift, w0 = 0.06) {
  const n = 16, out = [], back = []
  for (let i = 0; i <= n; i++) {
    const u = i / n, ww = w0 + (w - w0) * Math.pow(Math.sin(Math.PI * u), 0.5)
    const x = p[0] + (q[0] - p[0]) * u, y = p[1] + (q[1] - p[1]) * u - lift
    out.push([x, y - ww]); back.push([x, y + ww])
  }
  return 'M' + [...out, ...back.reverse()].map(v => `${f2(v[0])} ${f2(v[1])}`).join('L') + 'Z'
}
// the light comes from the upper left: a bean on each tyre around 200-250 degrees (0.4u wide), a streak on the top tube
const SHINE = arcBean(WR, RM, 198, 252, 0.2) + arcBean(WF, RM, 198, 252, 0.2) + streak([10.25, 10], [13.75, 10], 0.2, 0.12)

export default function render(icon) {
  const name = (icon && icon.name) || 'bike'
  const frame = unionSets(FRAME.map(pts => roundStrokeSet(pts, FW)))
  const tyre = c => circ(c[0], c[1], RO) + circ(c[0], c[1], RI)
  const sk = prep(name, [], [tyre(WR), tyre(WF), { set: frame }, circ(WR[0], WR[1], HUB), circ(WF[0], WF[1], HUB)])
  const nodes = gloss.render(sk)
  return nodes.map(([t, a], i) => [t, {
    ...a,
    // the generator lights only the saddle; the tyre beans and the top-tube streak are carved into the main mass
    ...(i === 0 ? { d: a.d + SHINE, 'fill-rule': 'evenodd' } : {}),
    class: a.class || 'wm-k',
  }])
}
