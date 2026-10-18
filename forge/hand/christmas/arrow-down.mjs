// forge/hand/christmas/arrow-down.mjs — a cranberry arrow with the same round-ended weight as the chevrons and a light
// snow line on the two head arms only, replacing the generated cream arrow whose lumpy snow-capped shaft muddied it.
// Each snow line runs the full top edge of its arm (round cap -> shaft), eased in and out over ~10%, with one small
// mirrored drip, and stays about 0.8u thick, like chevron-down's snow.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'

// a snow band lying on a straight top edge P0 (outer cap) -> P1 (shaft junction); n = the edge's outward normal
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
    top.push([bx + n[0] * o, by + n[1] * o]); bot.push([bx + n[0] * iN, by + n[1] * iN])
  }
  return pd(top.concat(bot.reverse()))
}

export default function render() {
  const body = 'M10.75 4.5A1.25 1.25 0 0 1 13.25 4.5L13.25 16.99L17.62 12.62A1.25 1.25 0 0 1 19.38 14.38L12.88 20.88A1.25 1.25 0 0 1 11.12 20.88L4.62 14.38A1.25 1.25 0 0 1 6.38 12.62L10.75 16.99Z'
  const k = Math.SQRT1_2
  const L = [[6.2, 12.44], [10.75, 16.99], [k, -k]]
  const Rt = [[17.8, 12.44], [13.25, 16.99], [-k, -k]]
  const drip = [[0.48, 0.25, 0.1]]
  const dl = drip, dr = drip
  const snow = (S, dr0, sh) => band(S[0], S[1], S[2], 0.5, 0.3, dr0, sh)
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-christmas-arrow-down-0', x1: 4.25, y1: 3.25, x2: 12.5, y2: 21.25, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: 'wg-christmas-arrow-down-1', x1: 0, y1: 11.4, x2: 0, y2: 17.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: body, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: 'url(#wg-christmas-arrow-down-0)', class: 'wm-shine' }],
    ['path', { d: snow(L, dl, true) + snow(Rt, dr, true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: snow(L, dl) + snow(Rt, dr), fill: 'url(#wg-christmas-arrow-down-1)', stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
