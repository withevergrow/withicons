// forge/hand/christmas/search.mjs — a plain magnifier: a cranberry lens ring over clear frosted glass with a glint, a gold
// collar and a cranberry handle, a thin snow cap on the rim; replaces the generated cream bauble with holly on top.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C3 = V('c3', '#E2A93B'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const r2 = v => Math.round(v * 100) / 100
const pd = pts => 'M' + pts.map(p => `${r2(p[0])} ${r2(p[1])}`).join('L') + 'Z'
const disc = (cx, cy, r) => `M${r2(cx - r)} ${cy}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0Z`

// a snow cap lying on a circular top edge (or the faint shadow band under it)
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
    const ri = shadow ? R - dn * w - d - 0.45 * w : R - dn * w - d
    top.push([cx + ro * c, cy + ro * s]); bot.push([cx + ri * c, cy + ri * s])
  }
  return pd(top.concat(bot.reverse()))
}

export default function render() {
  const cx = 10.5, cy = 10.5, RO = 7.25, RI = 4.6
  const ring = disc(cx, cy, RO) + disc(cx, cy, RI)
  // handle along the 45deg axis, round far end; it starts under the ring
  const handle = 'M14.14 16.26L16.26 14.14L21.26 19.14A1.5 1.5 0 0 1 19.14 21.26Z'
  // gold collar where the handle meets the rim
  const collar = 'M14.03 16.66L16.66 14.03L18.03 15.4L15.4 18.03Z'
  const drips = [[-112, 0.45, 9], [-74, 0.55, 8]]
  return [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-christmas-search-0', x1: 3.25, y1: 3.25, x2: 12.25, y2: 21.25, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: 'wg-christmas-search-1', x1: 0, y1: 1.9, x2: 0, y2: 5.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
      ['linearGradient', { id: 'wg-christmas-search-2', x1: 6.5, y1: 6.5, x2: 14.5, y2: 14.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': TINT, 'stop-opacity': 0.55 }],
        ['stop', { offset: 1, 'stop-color': TINT, 'stop-opacity': 0.12 }],
      ]],
    ]],
    // handle and collar (the moving part), under the ring
    ['path', { d: handle, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: handle, fill: 'url(#wg-christmas-search-0)', class: 'wm-shine' }],
    ['path', { d: collar, fill: C3, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: collar, fill: 'url(#wg-christmas-search-0)', class: 'wm-shine' }],
    // frosted glass and its glint
    ['path', { d: disc(cx, cy, RI), fill: 'url(#wg-christmas-search-2)', class: 'wm-k' }],
    ['path', { d: 'M7.4 10.5A3.1 3.1 0 0 1 10.5 7.4', stroke: SHINE, 'stroke-width': 1.1, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // the lens ring
    ['path', { d: ring, fill: C1, 'fill-rule': 'evenodd', stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: ring, fill: 'url(#wg-christmas-search-0)', 'fill-rule': 'evenodd', class: 'wm-shine' }],
    // snow on the rim
    ['path', { d: cap(cx, cy, RO, 58, 1.3, 0.95, drips, true), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-deco' }],
    ['path', { d: cap(cx, cy, RO, 58, 1.3, 0.95, drips), fill: 'url(#wg-christmas-search-1)', stroke: INK, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
