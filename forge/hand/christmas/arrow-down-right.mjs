// forge/hand/christmas/arrow-down-right.mjs — a cranberry diagonal arrow in the round-ended 2.5u weight of the hand-drawn
// arrow-down: one piece, shaft and open chevron head, with a thin snow line lying on the head's bottom arm where it
// meets the shaft; the generated version ended in a filled right triangle with snow on its slope, a box corner more
// than an arrowhead.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'

// a snow band lying on a straight top edge P0 -> P1 (n = outward normal); thickest near P0, soft drips
function band(P0, P1, n, up, dn, drips, shadow = false) {
  const top = [], bot = [], N = 22
  for (let i = 0; i <= N; i++) {
    const s = i / N
    const w = Math.pow(Math.max(0, Math.min(1, s / 0.14, (1 - s) / 0.3)), 0.55)
    let d = 0
    for (const [ds, len, wid] of drips) { const t = (s - ds) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const bx = P0[0] + (P1[0] - P0[0]) * s, by = P0[1] + (P1[1] - P0[1]) * s
    const o = shadow ? -(dn * w + d) : up * w
    const iN = shadow ? -(dn * w + d + 0.45 * w) : -(dn * w + d)
    top.push([bx + n[0] * o, by + n[1] * o]); bot.push([bx + n[0] * iN, by + n[1] * iN])
  }
  return pd(top.concat(bot.reverse()))
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  // tail (6, 6), head corner (18, 18), arms to (18, 8) and (8, 18)
  const body = 'M8 19.25L18 19.25A1.25 1.25 0 0 0 19.25 18L19.25 8A1.25 1.25 0 0 0 16.75 8L16.75 14.99L6.88 5.12' +
    'A1.25 1.25 0 0 0 5.12 6.88L14.99 16.75L8 16.75A1.25 1.25 0 0 0 8 19.25Z'
  const dr = [[0.4, 0.38, 0.13]]
  const snow = sh => band([14.75, 16.75], [8.4, 16.75], [0, -1], 0.8, 0.55, dr, sh)
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4.75, y1: 4.75, x2: 12.73, y2: 19.25, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 15.9, x2: 0, y2: 17.9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: body, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow(true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow(false), fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
