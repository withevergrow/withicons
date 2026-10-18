// forge/hand/halloween/cast.mjs — cast-to-screen: a witch-purple screen with its bottom-left corner opened up, and two
// bold pumpkin-orange signal arcs and a dot radiating into the gap, each ringed in ink so they pop on the cream page.
// Replaces the generated drawing, where a heavy near-black frame swallowed the thin pale arcs; now the frame is a lighter
// purple with a dark glass panel and the arcs are thick, saturated and the focus.
// Roles: frame c3 -> edge, glass shadow -> ink, arcs c1 (accent lift), outline ink, halo accent, shine shine.
// Motion: screen wm-k, arcs + dot wm-a (pulse about 4.2,19.8).
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C3 = V('c3', '#8B55E0'), EDGE = V('edge', '#7344C9')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-cast-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// screen body: a rounded rectangle with a quarter-disc bite out of the bottom-left (circle r10.8 about 4.2,19.8)
const BODY = 'M5 4H19A2.5 2.5 0 0 1 21.5 6.5V17.5A2.5 2.5 0 0 1 19 20H15A10.8 10.8 0 0 0 2.5 9.14V6.5A2.5 2.5 0 0 1 5 4Z'
// dark glass panel inset 1.6 inside the frame
const GLASS = 'M5.3 5.7H18.7A1.2 1.2 0 0 1 19.9 6.9V17.1A1.2 1.2 0 0 1 18.7 18.3H16.4A12.4 12.4 0 0 0 4.1 7.4V6.9A1.2 1.2 0 0 1 5.3 5.7Z'
const ARC1 = 'M4.2 15.8A4 4 0 0 1 8.2 19.8'
const ARC2 = 'M4.2 12.2A7.6 7.6 0 0 1 11.8 19.8'

export default function render() {
  const rim = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
  const arcOut = { ...ROUND, stroke: INK, 'stroke-width': 3.5 }
  const arcCol = { ...ROUND, stroke: `url(#${id(1)})`, 'stroke-width': 2 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12, r: 14, fx: 8.5, fy: 7, gradientUnits: 'userSpaceOnUse' }, [st(0, C3), st(0.45, C3), st(1, EDGE)]],
      ['linearGradient', { id: id(1), x1: 3, y1: 12, x2: 12, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT), st(1, C1)]],
      ['linearGradient', { id: id(2), x1: 5, y1: 6, x2: 19, y2: 18, gradientUnits: 'userSpaceOnUse' }, [st(0, SHADOW), st(1, INK)]],
      ['radialGradient', { id: id(3), cx: 12, cy: 12.9, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(3)})`, class: 'wm-deco' }],
    ['path', { d: BODY, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: BODY, fill: `url(#${id(0)})`, ...rim, class: 'wm-k' }],
    ['path', { d: GLASS, fill: `url(#${id(2)})`, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // glass sheen
    ['path', { d: 'M7.2 7.5H11.5', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.5, 'stroke-width': 0.6, class: 'wm-shine' }],
    // frame lit edge
    ['path', { d: 'M3.1 8.2V6.7C3.1 5.4 4 4.6 5.2 4.6H12', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.4, 'stroke-width': 0.5, class: 'wm-shine' }],
    // signal: arcs and dot, ink ring first then colour
    ['path', { d: ARC1 + ARC2, ...arcOut, class: 'wm-a' }],
    ['circle', { cx: 4.2, cy: 19.8, r: 2, fill: INK, class: 'wm-a' }],
    ['path', { d: ARC1 + ARC2, ...arcCol, class: 'wm-a' }],
    ['circle', { cx: 4.2, cy: 19.8, r: 1.25, fill: `url(#${id(1)})`, class: 'wm-a' }],
    ['path', { d: 'M4.6 12.9A6.7 6.7 0 0 1 9 14.9M4.5 16.5A3.2 3.2 0 0 1 6.4 17.4', ...ROUND, stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.45, class: 'wm-shine' }],
  ]
}
