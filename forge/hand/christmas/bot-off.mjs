// forge/hand/christmas/bot-off.mjs — green robot head with antenna and eyes, crossed by a thin red slash with a cream gap; no snow cap.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C2 = V('c2', '#1F6E46'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const head = 'M7 8L17 8Q19.5 8 19.5 10.5L19.5 17.5Q19.5 20 17 20L7 20Q4.5 20 4.5 17.5L4.5 10.5Q4.5 8 7 8Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 8, x2: 0, y2: 20, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
        ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
      ]],
    ]],
    ['line', { x1: 12, y1: 4.5, x2: 12, y2: 8, stroke: INK, 'stroke-width': 1.2, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M2.5 12.5L4.5 12.5L4.5 16L2.5 16ZM19.5 12.5L21.5 12.5L21.5 16L19.5 16Z', fill: C3, ...K, class: 'wm-k' }],
    ['path', { d: head, fill: C2, ...K, class: 'wm-k' }],
    ['path', { d: head, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M8 10L16 10Q17.5 10 17.5 11.5L17.5 16.5Q17.5 18 16 18L8 18Q6.5 18 6.5 16.5L6.5 11.5Q6.5 10 8 10Z', fill: C4, ...K, class: 'wm-k' }],
    ['circle', { cx: 9.3, cy: 13, r: 1.2, fill: INK }],
    ['circle', { cx: 14.7, cy: 13, r: 1.2, fill: INK }],
    ['path', { d: 'M10 16L14 16', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round' }],
    ['circle', { cx: 12, cy: 3.4, r: 1.8, fill: C3, ...K, class: 'wm-a' }],
    ['circle', { cx: 11.4, cy: 2.8, r: 0.5, fill: SHINE, class: 'wm-shine' }],
    ['line', { x1: 3.5, y1: 3.5, x2: 20.5, y2: 20.5, stroke: C4, 'stroke-width': 2.8, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['line', { x1: 3.5, y1: 3.5, x2: 20.5, y2: 20.5, stroke: C1, 'stroke-width': 1, 'stroke-linecap': 'round', class: 'wm-s' }],
  ]
}
