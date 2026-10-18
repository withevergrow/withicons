// forge/hand/christmas/chart-candlestick.mjs — three candles: solid green (up) and red (down) bodies on dark wicks, a dab of snow, snowy ground.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const f = n => +n.toFixed(2)
const grad = (id, y1, y2) => ['defs', {}, [
  ['linearGradient', { id, x1: 0, y1, x2: 0, y2, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
  ]],
]]
const spark = (x, y, r) => ['path', { d: `M${x} ${f(y - r)}Q${x} ${y} ${f(x + r)} ${y}Q${x} ${y} ${x} ${f(y + r)}Q${x} ${y} ${f(x - r)} ${y}Q${x} ${y} ${x} ${f(y - r)}Z`, fill: C3, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }]

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  // [centre x, wick top, wick bottom, body top, body bottom, colour]
  const candles = [
    [5.6, 9, 20, 12, 18, C2],
    [12, 2.6, 16.5, 5.8, 13, C1],
    [18.4, 5.4, 19, 8.4, 15.4, C2],
  ]
  const out = [grad(id(0), 2, 21)]
  for (const [cx, wt, wb] of candles) {
    out.push(['path', { d: `M${cx} ${wt}L${cx} ${wb}`, stroke: INK, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-k' }])
    out.push(['path', { d: `M${cx} ${wt}L${cx} ${wb}`, stroke: C4, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-k' }])
  }
  for (const [cx, , , bt, bb, col] of candles) {
    const x0 = f(cx - 2.3), x1 = f(cx + 2.3)
    const d = `M${x0} ${f(bt + 0.8)}Q${x0} ${bt} ${f(x0 + 0.8)} ${bt}L${f(x1 - 0.8)} ${bt}Q${x1} ${bt} ${x1} ${f(bt + 0.8)}L${x1} ${f(bb - 0.8)}Q${x1} ${bb} ${f(x1 - 0.8)} ${bb}L${f(x0 + 0.8)} ${bb}Q${x0} ${bb} ${x0} ${f(bb - 0.8)}Z`
    out.push(['path', { d, fill: col, ...K, class: 'wm-k' }])
    out.push(['path', { d, fill: `url(#${id(0)})`, class: 'wm-shine' }])
    out.push(['path', { d: `M${f(x0 + 0.9)} ${f(bt + 1.5)}L${f(x0 + 0.9)} ${f(bt + 2.8)}`, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }])
  }
  // snow dab on the red candle
  out.push(['path', { d: 'M9.7 6.3Q9.7 4.9 11 4.9L13 4.9Q14.3 4.9 14.3 6.3Q13.8 5.9 13.4 6.6Q12.7 5.9 12 6.6Q11.3 5.9 10.6 6.6Q10.1 5.9 9.7 6.3Z', fill: C4, ...K, class: 'wm-s' }])
  out.push(['path', { d: 'M2.6 20.9L21.4 20.9Q22.2 20.9 22.2 21.6L22.2 22Q22.2 22.8 21.4 22.8L2.6 22.8Q1.8 22.8 1.8 22L1.8 21.6Q1.8 20.9 2.6 20.9Z', fill: C4, ...K, class: 'wm-k' }])
  out.push(spark(20.2, 2.8, 1.5))
  return out
}
