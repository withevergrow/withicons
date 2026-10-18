// forge/hand/christmas/map-pin.mjs — a cranberry map pin with a crisp see-through ring, a snow cap on its dome and a
// holly sprig, replacing the generated cream pin whose pale body and ring vanished at 16px on a light page.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'

// a snow cap lying on a circular top edge: thick at the crown, thinning to nothing on the sides, with soft drips
function cap(cx, cy, R, half, up, dn, drips, shadow = false) {
  const top = [], bot = []
  const N = 28
  for (let i = 0; i <= N; i++) {
    const a = -90 - half + (2 * half * i) / N
    const w = Math.pow(Math.cos((Math.PI / 2) * Math.abs(a + 90) / half), 0.6)
    let d = 0
    for (const [da, len, wid] of drips) { const t = (a - da) / wid; if (Math.abs(t) < 1) d += len * Math.pow(1 - t * t, 1.5) }
    const rad = (a * Math.PI) / 180, c = Math.cos(rad), s = Math.sin(rad)
    const ro = shadow ? R - dn * w - d : R + up * w
    const ri = shadow ? R - dn * w - d - 0.5 * w : R - dn * w - d
    top.push([cx + ro * c, cy + ro * s]); bot.push([cx + ri * c, cy + ri * s])
  }
  return pd(top.concat(bot.reverse()))
}

export default function render() {
  const body = 'M19.5 10C19.5 14.5 15.5 18.5 12 21.5C8.5 18.5 4.5 14.5 4.5 10A7.5 7.5 0 0 1 19.5 10ZM15 10A3 3 0 1 0 9 10A3 3 0 1 0 15 10Z'
  const drips = [[-118, 0.55, 9], [-72, 0.75, 8], [-46, 0.4, 7]]
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-christmas-map-pin-0', x1: 4.5, y1: 2.5, x2: 12.75, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: 'wg-christmas-map-pin-1', x1: 0, y1: 1.1, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: body, fill: C1, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: 'url(#wg-christmas-map-pin-0)', 'fill-rule': 'evenodd', class: 'wm-shine' }],
    ['path', { d: cap(12, 10, 7.5, 62, 1.35, 0.95, drips, true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: cap(12, 10, 7.5, 62, 1.35, 0.95, drips), fill: 'url(#wg-christmas-map-pin-1)', stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    // holly: two pine leaves and three cranberry berries resting on the snow, right of the crown
    ['path', { d: 'M15.35 2.05Q16.1 1.35 17.15 1.5Q16.95 2.15 17.3 2.7Q16.3 2.95 15.35 2.05ZM15.05 2.05Q14.3 1.35 13.25 1.5Q13.45 2.15 13.1 2.7Q14.1 2.95 15.05 2.05Z', fill: C2, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M14.15 2.3a.55 .55 0 1 0 1.1 0a.55 .55 0 1 0 -1.1 0ZM15.15 2.3a.55 .55 0 1 0 1.1 0a.55 .55 0 1 0 -1.1 0ZM14.65 1.55a.55 .55 0 1 0 1.1 0a.55 .55 0 1 0 -1.1 0Z', fill: C1, stroke: INK, 'stroke-width': 0.28, class: 'wm-deco' }],
    ['circle', { cx: 15.05, cy: 1.38, r: 0.16, fill: SHINE, class: 'wm-deco' }],
  ]
}
