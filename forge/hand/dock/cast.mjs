// forge/hand/dock/cast.mjs — cast as a dock tile: a light rounded screen frame open at the lower left, with three
// warm broadcast arcs rising from the corner (the moving part), on the red squircle tile.
const N = 'cast'
const id = n => `wg-dock-${N}-${n}`, url = n => `url(#${id(n)})`
const v = (r, h) => `var(--with-dock-${r}, ${h})`
const SH = v('shadow', '#AE1A1D'), SHINE = v('shine', '#FFFFFF')
const TILE = 'M14.64 2c2.58 0 3.86 0 4.85.5a4.6 4.6 0 0 1 2.01 2.01c.5.98.5 2.27.5 4.85L22 14.64c0 2.58 0 3.86-.5 4.85a4.6 4.6 0 0 1-2.01 2.01c-.98.5-2.27.5-4.85.5L9.36 22c-2.58 0-3.86 0-4.85-.5a4.6 4.6 0 0 1-2.01-2.01c-.5-.98-.5-2.27-.5-4.85L2 9.36c0-2.58 0-3.86.5-4.85a4.6 4.6 0 0 1 2.01-2.01c.98-.5 2.27-.5 4.85-.5Z'
const TILE_S = 'M14.44 2.5c2.58 0 3.86 0 4.85.5a4.6 4.6 0 0 1 2.01 2.01c.5.98.5 2.27.5 4.85L21.8 15.14c0 2.58 0 3.86-.5 4.85a4.6 4.6 0 0 1-2.01 2.01c-.98.5-2.27.5-4.85.5L9.56 22.5c-2.58 0-3.86 0-4.85-.5a4.6 4.6 0 0 1-2.01-2.01c-.5-.98-.5-2.27-.5-4.85L2.2 9.86c0-2.58 0-3.86.5-4.85a4.6 4.6 0 0 1 2.01-2.01c.98-.5 2.27-.5 4.85-.5Z'
const FRAME = 'M5.6 9.6V8.2a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v7.6a2 2 0 0 1-2 2h-3.4'
const ARCS = 'M5.6 11.6a5.4 5.4 0 0 1 5.4 5.4M5.6 14.2a2.8 2.8 0 0 1 2.8 2.8'
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 12, y1: 3, x2: 12, y2: 33, gradientUnits: 'userSpaceOnUse' }, [stop(0, v('c1', '#F5483F')), stop(1, SH)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, SHINE, 0.42), stop(0.55, SHINE, 0.1), stop(1, SHINE, 0)]],
      ['linearGradient', { id: id(2), x1: 12, y1: 6, x2: 12, y2: 18, gradientUnits: 'userSpaceOnUse' }, [stop(0, SHINE), stop(1, v('tint', '#FFE1DE'))]],
    ]],
    ['path', { d: TILE_S, fill: SH, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: TILE, fill: url(0), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(1), class: 'wm-deco' }],
    ['path', { d: FRAME, stroke: SH, 'stroke-opacity': 0.35, 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: FRAME, stroke: url(2), 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: ARCS, stroke: v('c2', '#FFD166'), 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['circle', { cx: 5.9, cy: 17.1, r: 1.05, fill: v('c2', '#FFD166'), class: 'wm-a' }],
  ]
}
