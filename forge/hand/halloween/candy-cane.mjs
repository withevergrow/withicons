// forge/hand/halloween/candy-cane.mjs — a classic candy cane: a clean J (straight shank, round hook, rounded ends) in
// cream with bold slanted pumpkin-orange stripes that wrap round the hook. Replaces the generated drawing, where a green
// slime drip and a bat cluttered the cane so it read as a slimy hook; no drip, no bat, just the cane.
// Roles: candy tint -> accent, stripes c1 -> c2, outline ink, halo accent, sheen shine, drop shadow shadow.
// Motion: cane wm-k (rocks about its base).
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), TINT = V('tint', '#FFF1B8')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-candy-cane-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const f = v => Math.round(v * 100) / 100

// the cane: hook centre (12.5, 9), outer radius 6.1, inner 1.9, width 4.2
const CX = 12.5, CY = 9, RO = 6.1, RI = 1.9
const BODY = 'M6.4 19.9V9A6.1 6.1 0 0 1 18.6 9V11.4A2.1 2.1 0 0 1 14.4 11.4V9A1.9 1.9 0 0 0 10.6 9V19.9A2.1 2.1 0 0 1 6.4 19.9Z'

// stripes in the shank: slanted bands, the right edge lower than the left
const SL = 1.5, H = 1.7
const shankStripe = y => `M6.4 ${f(y)}L10.6 ${f(y + SL)}V${f(y + SL + H)}L6.4 ${f(y + H)}Z`
// stripes in the hook: slanted wedges, outer edge at angle a, inner edge turned back by D
const D = 0.5
const P = (r, a) => `${f(CX + r * Math.cos(a))} ${f(CY + r * Math.sin(a))}`
const hookStripe = (a0, a1) => `M${P(RO, a0)}A${RO} ${RO} 0 0 1 ${P(RO, a1)}L${P(RI, a1 - D)}A${RI} ${RI} 0 0 0 ${P(RI, a0 - D)}Z`
const HOOK_A = [0, 1, 2, 3, 4].map(k => [Math.PI + 0.35 + 0.54 * k, Math.PI + 0.66 + 0.54 * k])
const STRIPES = [shankStripe(10.5), shankStripe(13.8), shankStripe(17.1), ...HOOK_A.map(([a, b]) => hookStripe(a, b))].join('')

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12.5, cy: 10, r: 11, fx: 8, fy: 6, gradientUnits: 'userSpaceOnUse' }, [st(0, SHINE), st(0.5, TINT), st(1, ACCENT)]],
      ['linearGradient', { id: id(1), x1: 5, y1: 3, x2: 19, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(1, C2)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.9, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: 'M6.55 20.75V9.85A6.1 6.1 0 0 1 18.75 9.85V12.25A2.1 2.1 0 0 1 14.55 12.25V9.85A1.9 1.9 0 0 0 10.75 9.85V20.75A2.1 2.1 0 0 1 6.55 20.75Z', fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: STRIPES, fill: `url(#${id(1)})`, class: 'wm-k' }],
    ['path', { d: BODY, fill: 'none', stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // lit edge along the shank and over the crown
    ['path', { d: 'M7.4 19V10.2C7.4 6.9 9.5 4.4 12.5 4', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.55, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }],
  ]
}
