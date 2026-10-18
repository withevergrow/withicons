// forge/hand/christmas/plum-blossom.mjs — a dark bark branch carrying one big cranberry five-petal blossom with a gold
// heart and stamen dots, a smaller blossom and a bud, snow on the top petal and a gold sparkle.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), RED = V('c1', '#C8203A'), GOLD = V('c3', '#E2A93B'), ACC = V('accent', '#F4C24D')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const n = v => Math.round(v * 100) / 100
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

const pts = (cx, cy, d, k) => Array.from({ length: k }, (_, i) => {
  const a = (-90 + (360 / k) * i) * Math.PI / 180
  return [n(cx + d * Math.cos(a)), n(cy + d * Math.sin(a))]
})
const disc = (x, y, r) => `M${n(x - r)} ${y}A${r} ${r} 0 1 1 ${n(x + r)} ${y}A${r} ${r} 0 1 1 ${n(x - r)} ${y}Z`

export default function render(icon) {
  const id = k => `wg-christmas-${icon.name}-${k}`
  const big = pts(14.6, 9, 3.5, 5), small = pts(4.9, 13.6, 2.25, 5)
  const bark = 'M2.5 22C6 20.5 9.5 17.5 12.5 12.5'
  const twig = 'M5.65 20.24C5.4 18 5.2 16 4.9 14'
  const bud = 'M8.7 17.57L11.1 18.6'
  const bloom = (ps, r) => ps.map(([x, y]) => ['circle', { cx: x, cy: y, r, fill: RED, ...K, class: 'wm-k' }])
  const all = ps => ps.map(([x, y]) => disc(x, y, ps === big ? 3.1 : 2)).join('')
  const stamens = big.map(([x, y]) => [n(14.6 + (x - 14.6) * 0.72), n(9 + (y - 9) * 0.72)])
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.7, x2: 0, y2: 4.7, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: bark + twig, fill: 'none', stroke: INK, 'stroke-width': 2.3, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: bark + twig, fill: 'none', stroke: SHADOW, 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M3.4 21.2C6.6 19.8 9.4 17.2 11.8 13.4', fill: 'none', stroke: GOLD, 'stroke-width': 0.35, 'stroke-opacity': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: bud, fill: 'none', stroke: INK, 'stroke-width': 2.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: bud, fill: 'none', stroke: SHADOW, 'stroke-width': 1.1, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['circle', { cx: 12.1, cy: 19, r: 1.4, fill: RED, ...K, class: 'wm-k' }],
    ...bloom(small, 2),
    ['path', { d: all(small), fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['circle', { cx: 4.9, cy: 13.6, r: 1.05, fill: GOLD, stroke: INK, 'stroke-width': 0.4, class: 'wm-s' }],
    ...bloom(big, 3.1),
    ['path', { d: all(big), fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ...stamens.map(([x, y]) => ['circle', { cx: x, cy: y, r: 0.5, fill: GOLD, stroke: INK, 'stroke-width': 0.3, class: 'wm-s' }]),
    ['circle', { cx: 14.6, cy: 9, r: 1.7, fill: GOLD, stroke: INK, 'stroke-width': 0.5, class: 'wm-s' }],
    ['circle', { cx: 14.1, cy: 8.5, r: 0.5, fill: SHINE, 'fill-opacity': 0.7, class: 'wm-shine' }],
    ['path', { d: 'M12.3 3.5C12.9 2.2 13.7 1.9 14.6 1.9C15.5 1.9 16.3 2.2 16.9 3.5Q16.6 4.4 15.8 4.2Q15.2 5 14.6 4.4Q14 5 13.4 4.2Q12.6 4.4 12.3 3.5Z', fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M19.5 16.5Q19.85 18.2 21.7 18.6Q19.85 19 19.5 20.7Q19.15 19 17.3 18.6Q19.15 18.2 19.5 16.5Z', fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
