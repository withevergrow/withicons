// forge/hand/christmas/arrow-right.mjs - the hand-drawn arrow-down turned to point right: a cranberry chevron-and-shaft arrow in
// the same round-ended 2.5u weight, ink outline and upper-left light as its siblings (head = wm-a, shaft = wm-k), with a
// soft snow cap along the outer edge of the upper arm (eased in and out, one drip), so it reads as an arrow at 16px.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
// rotate the down-pointing master: points (x, y) and unit directions
const T = ([x, y]) => [y, 24 - x]
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'

function band(P0, P1, n, up, dn, drips, shadow = false) {
  const top = [], bot = []
  const N = 40
  for (let i = 0; i <= N; i++) {
    const s = i / N
    const w = Math.sin(Math.max(0, Math.min(1, s / 0.1, (1 - s) / 0.1)) * Math.PI / 2)
    let d = 0
    for (const [ds, len, wid] of drips) { const t = (s - ds) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const bx = P0[0] + (P1[0] - P0[0]) * s, by = P0[1] + (P1[1] - P0[1]) * s
    const o = shadow ? -(dn * w + d) : up * w
    const iN = shadow ? -(dn * w + d + 0.45 * w) : -(dn * w + d)
    top.push(T([bx + n[0] * o, by + n[1] * o])); bot.push(T([bx + n[0] * iN, by + n[1] * iN]))
  }
  return pd(top.concat(bot.reverse()))
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const A = (r, sw, p) => { const q = T(p); return `A${r} ${r} 0 0 ${sw} ${r2(q[0])} ${r2(q[1])}` }
  const M = p => { const q = T(p); return `${r2(q[0])} ${r2(q[1])}` }
  const body = `M${M([10.75, 4.5])}${A(1.25, 1, [13.25, 4.5])}L${M([13.25, 16.99])}L${M([17.62, 12.62])}${A(1.25, 1, [19.38, 14.38])}L${M([12.88, 20.88])}${A(1.25, 1, [11.12, 20.88])}L${M([4.62, 14.38])}${A(1.25, 1, [6.38, 12.62])}L${M([10.75, 16.99])}Z`
  const head = `M${M([6.38, 12.62])}L${M([12, 18.24])}L${M([17.62, 12.62])}${A(1.25, 1, [19.38, 14.38])}L${M([12.88, 20.88])}${A(1.25, 1, [11.12, 20.88])}L${M([4.62, 14.38])}${A(1.25, 1, [6.38, 12.62])}Z`
  const shaft = `M${M([10.75, 4.5])}${A(1.25, 1, [13.25, 4.5])}L${M([13.25, 19])}L${M([10.75, 19])}Z`
  const edge = `M${M([10.75, 17.2])}L${M([10.75, 4.5])}${A(1.25, 1, [13.25, 4.5])}L${M([13.25, 17.2])}`
  const k = Math.SQRT1_2
  const E = [[19.38, 14.38], [13.1, 20.66], [k, k]]
  const drip = [[0.55, 0.3, 0.1]]
  const snow = sh => band(E[0], E[1], E[2], 0.7, 0.5, drip, sh)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3.25, y1: 4.25, x2: 21.25, y2: 12.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 4, x2: 0, y2: 9.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: head, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: shaft, fill: C1, class: 'wm-k' }],
    ['path', { d: edge, fill: 'none', stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow(true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: snow(false), fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
