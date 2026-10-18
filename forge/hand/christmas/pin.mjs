// forge/hand/christmas/pin.mjs — a bold cranberry pushpin tilted 45° (broad cap, short neck, wide flared collar) on a
// sturdy gold needle with a clear point, a snow cap on the cap's top edge; the generated pin was a lumpy blob on a
// hair-thin candy-striped needle, so at 16px it read as a red smudge rather than a pin.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C3 = V('c3', '#E2A93B'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const P = p => `${r2(p[0])} ${r2(p[1])}`
const add = (a, b, k) => [a[0] + b[0] * k, a[1] + b[1] * k]
const unit = (a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy); return [dx / l, dy / l] }

// drawn upright (head up, needle down, collar base on y = 0), then turned 45° clockwise and placed: needle tip lower left
const K = Math.SQRT1_2 * 1.08, OX = 9.36, OY = 14.64
const W = ([x, y]) => [x * K - y * K + OX, x * K + y * K + OY]

// a polygon in the upright frame, each corner rounded by a quadratic of radius r, written in icon space
function rpoly(pts) {
  const k = pts.length, a = [], b = []
  for (let i = 0; i < k; i++) {
    const [c, r] = pts[i], pv = pts[(i + k - 1) % k][0], nx = pts[(i + 1) % k][0]
    a.push(add(c, unit(c, pv), r)); b.push(add(c, unit(c, nx), r))
  }
  let d = `M${P(W(a[0]))}`
  for (let i = 0; i < k; i++) d += `Q${P(W(pts[i][0]))} ${P(W(b[i]))}L${P(W(a[(i + 1) % k]))}`
  return d + 'Z'
}

// snow lying on the cap's top edge (upright frame): thickest at the high end, soft drips
function snow(shadow) {
  const top = [], bot = [], N = 20, x0 = -3.05, x1 = 2.9, y = -10.6
  for (let i = 0; i <= N; i++) {
    const s = i / N, x = x0 + (x1 - x0) * s
    const w = Math.pow(Math.max(0, Math.min(1, s / 0.16, (1 - s) / 0.32)), 0.55)
    let d = 0
    for (const [ds, len, wid] of [[0.38, 0.5, 0.13], [0.7, 0.35, 0.11]]) { const t = (s - ds) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const up = shadow ? 0 : 0.95 * w * (1 + 0.06 * Math.sin(s * 10)), dn = 0.6 * w + d + (shadow ? 0.45 * w : 0)
    top.push(W([x, y - up])); bot.push(W([x, y + dn]))
  }
  return 'M' + top.concat(bot.reverse()).map(P).join('L') + 'Z'
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const head = rpoly([
    [[-3.9, -10.6], 1.2], [[3.9, -10.6], 1.2], [[3.9, -7.5], 0.65], [[2.3, -7.0], 0.45], [[2.3, -4.4], 0.8],
    [[5.4, -1.3], 0.6], [[5.4, 0.4], 0.8], [[-5.4, 0.4], 0.8], [[-5.4, -1.3], 0.6], [[-2.3, -4.4], 0.8],
    [[-2.3, -7.0], 0.45], [[-3.9, -7.5], 0.65],
  ])
  const needle = rpoly([[[-1, -0.2], 0.2], [[1, -0.2], 0.2], [[0.32, 7.2], 0.28], [[-0.32, 7.2], 0.28]])
  const sg = [W([-3.4, -11.7]), W([-3.4, -9.4])]
  const light = (n, a, b) => ['linearGradient', { id: id(n), x1: a[0], y1: a[1], x2: b[0], y2: b[1], gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
    ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
  ]]
  return [
    ['defs', {}, [
      light(0, [5, 2.5], [14, 20.5]),
      ['linearGradient', { id: id(1), x1: 0, y1: r2(Math.min(sg[0][1], sg[1][1]) - 1), x2: 0, y2: r2(Math.max(sg[0][1], sg[1][1]) + 1.5), gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: needle, fill: C3, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: needle, fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: head, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: head, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow(true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow(false), fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
