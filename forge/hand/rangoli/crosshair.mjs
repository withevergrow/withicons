// forge/hand/rangoli/crosshair.mjs — a saffron reticle ring with four round ticks, a cream sight and a deep indigo
// centre dot, replacing the generated drawing whose marigold badge bit into the ring and crowded the sight at 16px.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), INK = V('ink', '#2B1660'), TINT = V('tint', '#FFF3D8')
const SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G = 'wg-rangoli-crosshair-0'
const r2 = v => Math.round(v * 100) / 100
const ring = (dy = 0) => {
  const c = r2(12 + dy)
  return `M3.5 ${c}A8.5 8.5 0 1 1 20.5 ${c}A8.5 8.5 0 1 1 3.5 ${c}ZM5.75 ${c}A6.25 6.25 0 1 0 18.25 ${c}A6.25 6.25 0 1 0 5.75 ${c}Z`
}
const ticks = (dy = 0) => {
  const c = r2(12 + dy)
  return `M12 ${r2(1.9 + dy)}V${r2(7 + dy)}M12 ${r2(17 + dy)}V${r2(22.1 + dy)}M1.9 ${c}H7M17 ${c}H22.1`
}
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G, cx: 7.2, cy: 6, r: 24, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { d: ring(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: ticks(0.55), fill: 'none', stroke: SHADOW, 'stroke-opacity': 0.45, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['circle', { cx: 12, cy: 12, r: 6.4, fill: TINT, class: 'wm-k' }],
    ['path', { d: ring(), fill: `url(#${G})`, class: 'wm-k' }],
    ['path', { d: ticks(), fill: 'none', stroke: `url(#${G})`, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M4.6 10.2A7.6 7.6 0 0 1 10.2 4.6', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 12, r: 1.6, fill: INK, class: 'wm-a' }],
  ]
}
