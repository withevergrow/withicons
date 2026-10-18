// forge/hand/christmas/arrow-up-left.mjs — the mirror of the hand-drawn arrow-up-right: a cranberry diagonal arrow in the
// round-ended 2.5u weight of arrow-down, a shaft tucked into an open chevron head (its own wm-a part), a thin snow line on
// the head's top arm; the generated head was a filled right triangle with a snow-capped flat top that read as a box.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
const MX = true                        // mirror left-right (arrow-up-left)
const X = p => [MX ? 24 - p[0] : p[0], p[1]]
// a tiny path writer that can mirror: segments [cmd, point] or ['A', r, sweep, point]
const path = segs => segs.map(s => {
  if (s[0] === 'A') { const p = X(s[3]); return `A${s[1]} ${s[1]} 0 0 ${MX ? 1 - s[2] : s[2]} ${r2(p[0])} ${r2(p[1])}` }
  const p = X(s[1]); return `${s[0]}${r2(p[0])} ${r2(p[1])}`
}).join('') + (segs.closed === false ? '' : 'Z')

// a snow band lying on a straight top edge P0 -> P1 (n = outward normal); thickest near P0, two soft drips
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
    top.push(X([bx + n[0] * o, by + n[1] * o])); bot.push(X([bx + n[0] * iN, by + n[1] * iN]))
  }
  return pd(top.concat(bot.reverse()))
}

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  // the head: an open chevron, arms 2.5u wide with round ends, corner at (18, 6)
  const head = path([['M', [8, 4.75]], ['L', [18, 4.75]], ['A', 1.25, 1, [19.25, 6]], ['L', [19.25, 16]], ['A', 1.25, 1, [16.75, 16]],
    ['L', [16.75, 7.25]], ['L', [8, 7.25]], ['A', 1.25, 1, [8, 4.75]]])
  // the shaft: from the round tail (6, 18) into the head's corner; its fill hides the head's inner edges (one piece)
  const shaft = path([['M', [5.12, 17.12]], ['L', [16.41, 5.83]], ['A', 1.25, 1, [18.17, 7.59]], ['L', [6.88, 18.88]], ['A', 1.25, 1, [5.12, 17.12]]])
  const edge = path(Object.assign([['M', [14.99, 7.25]], ['L', [5.12, 17.12]], ['A', 1.25, 0, [6.88, 18.88]], ['L', [16.75, 9.01]]], { closed: false }))
  const top = [[18.2, 4.75], [8.4, 4.75], [0, -1]], dr = [[0.36, 0.4, 0.12], [0.7, 0.3, 0.1]]
  const snow = sh => band(top[0], top[1], top[2], 0.8, 0.55, dr, sh)
  const sx = MX ? [19.25, 4.75] : [4.75, 19.25]
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: sx[0], y1: 4.75, x2: r2(sx[0] + (sx[1] - sx[0]) * 0.55), y2: 19.25, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.9, x2: 0, y2: 5.9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: head, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: head, fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: shaft, fill: C1, class: 'wm-k' }],
    ['path', { d: shaft, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: edge, fill: 'none', stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: snow(true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-a' }],
    ['path', { d: snow(false), fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
  ]
}
