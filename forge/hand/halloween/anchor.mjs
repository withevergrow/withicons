// forge/hand/halloween/anchor.mjs — a bold pumpkin-orange anchor: ring, shank, stock bar and a deep curved
// crown ending in two arrowhead flukes. Replaces the generated cream-on-cream anchor (very low contrast, faint glow):
// now it is solid orange with a thick ink outline built as one merged silhouette (outline pass under a colour pass).
// Roles: body c1 -> c2 (accent lift), outline ink, sheen shine, halo accent, drop shadow shadow.
// Motion: body wm-k, ring wm-a (rocks about the shank).
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-anchor-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

const SHANK = 'M12 8.4V19'
const STOCK = 'M8 10H16'
const CROWN = 'M4.4 13.6C4.9 17.7 8 20.2 12 20.2C16 20.2 19.1 17.7 19.6 13.6'
const FLUKES = 'M4.4 10.6L1.9 14.6H6.9ZM19.6 10.6L17.1 14.6H22.1Z'
const RING = 'M14.1 5.2A2.1 2.1 0 1 1 9.9 5.2A2.1 2.1 0 1 1 14.1 5.2Z'

export default function render() {
  const out = w => ({ ...ROUND, stroke: INK, 'stroke-width': w })
  const col = w => ({ ...ROUND, stroke: `url(#${id(0)})`, 'stroke-width': w })
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 4, y1: 2, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT), st(0.4, C1), st(1, C2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.85, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: SHANK + STOCK + CROWN, ...ROUND, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 3.6, class: 'wm-shadow' }],
    // outline pass: every part fattened in ink so the silhouette merges into one shape
    ['path', { d: SHANK + STOCK + CROWN, ...out(3.64), class: 'wm-k' }],
    ['path', { d: FLUKES, fill: INK, stroke: INK, 'stroke-width': 1.44, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: RING, ...out(3.14), class: 'wm-a' }],
    // colour pass
    ['path', { d: CROWN, ...col(2.2), class: 'wm-k' }],
    ['path', { d: FLUKES, fill: `url(#${id(0)})`, class: 'wm-k' }],
    ['path', { d: SHANK, ...col(2.2), class: 'wm-k' }],
    ['path', { d: STOCK, ...col(1.8), class: 'wm-k' }],
    ['path', { d: RING, ...col(1.7), class: 'wm-a' }],
    // lit edges
    ['path', { d: 'M11.2 9.2V18.2', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M5.2 14.6C5.8 16.6 6.9 18 8.5 18.9', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M10.1 4.2C10.4 3.5 11 3.1 11.7 3', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.45, class: 'wm-shine' }],
    ['path', { d: 'M8.5 9.4H11', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.45, class: 'wm-shine' }],
  ]
}
