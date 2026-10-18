// forge/hand/christmas/rotate-cw.mjs — one pine ring (2.5u band, round tail) running clockwise into a broad rounded
// arrowhead laid along its tangent at the top right, with a snow cap resting on the ring's crown and nothing on the
// head; the generated drawing turned the head into a snow-capped box and sat the holly sprig on it, so the arrow
// stroke lost its point.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C2 = V('c2', '#1F6E46'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
const RAD = Math.PI / 180
const CX = 12, CY = 12, R = 7.5, H = 1.25           // ring centre (= the motion pivot [12, 12]), centreline radius, half band
const S = 10, E = 300                                 // band start (tail) and where the head's base sits (deg, clockwise)
const at = (a, r) => [CX + r * Math.cos(a * RAD), CY + r * Math.sin(a * RAD)]
const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k]
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }

// snow on the ring's crown: between angles a0 and a1, up above the outer edge, dn into the band, soft drips
function snow(a0, a1, up, dn, drips, shadow = false) {
  const top = [], bot = [], N = 26, ro = R + H
  for (let i = 0; i <= N; i++) {
    const s = i / N, a = a0 + (a1 - a0) * s
    const w = Math.pow(Math.max(0, Math.min(1, s / 0.22, (1 - s) / 0.12)), 0.55)
    let d = 0
    for (const [ds, len, wid] of drips) { const t = (s - ds) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const o = shadow ? -(dn * w + d) : up * w * (1 + 0.06 * Math.sin(s * 11))
    const iN = shadow ? -(dn * w + d + 0.45 * w) : -(dn * w + d)
    top.push(at(a, ro + o)); bot.push(at(a, ro + iN))
  }
  return 'M' + top.concat(bot.reverse()).map(P).join('L') + 'Z'
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const B = at(E, R), rad = [Math.cos(E * RAD), Math.sin(E * RAD)], tan = [-rad[1], rad[0]]
  const k = 12 * RAD, dir = [tan[0] * Math.cos(k) - rad[0] * Math.sin(k), tan[1] * Math.cos(k) - rad[1] * Math.sin(k)]
  const HO = add(B, rad, 3.4), HI = add(B, rad, -3.4), T = add(B, dir, 5.6)
  // round the head's three corners with short quadratics
  const cut = (c, to, r) => add(c, unit(c, to), r)
  const hc = [[HO, 0.7], [T, 0.6], [HI, 0.7]]
  const O = at(E, R + H), I = at(E, R - H)
  let d = `M${P(at(S, R + H))}A${R + H} ${R + H} 0 1 1 ${P(O)}`
  const seq = [O, HO, T, HI, I]
  for (let q = 0; q < 3; q++) {
    const [c, r] = hc[q], prev = seq[q], next = seq[q + 2]
    d += `L${P(cut(c, prev, r))}Q${P(c)} ${P(cut(c, next, r))}`
  }
  d += `L${P(I)}A${R - H} ${R - H} 0 1 0 ${P(at(S, R - H))}A${H} ${H} 0 0 1 ${P(at(S, R + H))}Z`
  const dr = [[0.42, 0.42, 0.09], [0.72, 0.32, 0.08]]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 2.5, x2: 14, y2: 23.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.64, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.22 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.5, x2: 0, y2: 6.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d, fill: C2, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow(212, 293, 0.95, 0.6, dr, true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow(212, 293, 0.95, 0.6, dr), fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
