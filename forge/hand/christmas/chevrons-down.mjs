// forge/hand/christmas/chevrons-down.mjs — two bold round-jointed chevrons drawn like the hand-drawn arrow-down: the upper
// one (K) in cranberry with snow lying on the two inner slopes of its V, the leading lower one (A) in pine, set 7.5 apart
// so the paper gap holds at 16px; the generated pair was snow cream and turned pale grey at small sizes.
import { C } from '../../styles/_christmas-core.mjs'

const N = 'chevrons-down'
const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
const S2 = Math.SQRT1_2
const id = n => `wg-christmas-${N}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
// local frame of a head: a runs along the axis towards the tip T, b across it
const frame = (T, u) => (a, b) => [T[0] + a * u[0] + b * u[1], T[1] + a * u[1] - b * u[0]]
const head = (T, u, L) => { const f = frame(T, u); return `M${P(f(-L, L))}L${P(T)}L${P(f(-L, -L))}` }


// a snow band lying on a straight upper edge P0 -> P1 (n = the edge's outward normal), as on the hand-drawn arrow-down
function band(P0, P1, n, up, dn, drips, shadow = false) {
  const top = [], bot = [], M = 22
  for (let i = 0; i <= M; i++) {
    const s = i / M
    const w = Math.pow(Math.max(0, Math.min(1, s / 0.14, (1 - s) / 0.3)), 0.55)
    let d = 0
    for (const [ds, len, wid] of drips) { const t = (s - ds) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const bx = P0[0] + (P1[0] - P0[0]) * s, by = P0[1] + (P1[1] - P0[1]) * s
    const o = shadow ? -(dn * w + d) : up * w
    const iN = shadow ? -(dn * w + d + 0.45 * w) : -(dn * w + d)
    top.push([bx + n[0] * o, by + n[1] * o]); bot.push([bx + n[0] * iN, by + n[1] * iN])
  }
  return 'M' + top.concat(bot.reverse()).map(P).join('L') + 'Z'
}

export default function render() {
  const TK = [12, 11.25], TA = [12, 18.75], U = [0, 1], L = 6, h = 1.25
  const K = head(TK, U, L), A = head(TA, U, L)
  // the two inner (upward-facing) edges of the upper V, from near the arm ends down to just short of the crease
  const ap = [12, TK[1] - h * Math.SQRT2]
  const edge = sx => {
    const e = [12 + sx * L - sx * h * S2, TK[1] - L - h * S2], dx = ap[0] - e[0], dy = ap[1] - e[1], l = Math.hypot(dx, dy)
    return [[e[0] - dx / l * 0.25, e[1] - dy / l * 0.25], [ap[0] - dx / l * 0.55, ap[1] - dy / l * 0.55], [sx * -S2, -S2]]
  }
  const El = edge(-1), Er = edge(1), dl = [[0.42, 0.38, 0.12]], dr = [[0.52, 0.4, 0.12]]
  const snow = (E, d, sh) => band(E[0], E[1], E[2], 0.8, 0.55, d, sh)
  const ink = (d, cls) => ['path', { d, stroke: C.ink, 'stroke-width': 3.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  const body = (d, c, cls) => ['path', { d, stroke: c, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: cls }]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 5, y1: 3.5, x2: 12.5, y2: 20.5, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4.2, x2: 0, y2: 10.2, gradientUnits: 'userSpaceOnUse' },
        [st(0.25, C.shine), st(1, C.tint)]],
    ]],
    ink(A, 'wm-a'),
    body(A, C.c2, 'wm-a'),
    ['path', { d: A, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a wm-shine' }],
    ink(K, 'wm-k'),
    body(K, C.c1, 'wm-k'),
    ['path', { d: K, stroke: url(0), 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: snow(El, dl, true) + snow(Er, dr, true), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow(El, dl) + snow(Er, dr), fill: url(1), stroke: C.ink, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
