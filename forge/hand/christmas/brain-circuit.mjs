// forge/hand/christmas/brain-circuit.mjs — red two-lobed brain with a centre fissure and gyri, gold circuit traces ending in clean dots below.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C3 = V('c3', '#E2A93B')
const SHINE = V('shine', '#FFFFFF'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const brain = 'M12 4C9.5 2.5 6 3.2 5.5 5.8C3.3 6.3 2.6 9 3.8 10.6C2.8 12.6 4.3 15.3 7 15C8.2 16.3 10.8 16.4 12 15C13.2 16.4 15.8 16.3 17 15C19.7 15.3 21.2 12.6 20.2 10.6C21.4 9 20.7 6.3 18.5 5.8C18 3.2 14.5 2.5 12 4Z'
  const G = { stroke: INK, 'stroke-width': 0.7, 'stroke-linecap': 'round', fill: 'none' }
  const T = { stroke: C3, 'stroke-width': 1.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: 'wm-a' }
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3, x2: 0, y2: 16, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
        ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
      ]],
    ]],
    ['path', { d: 'M8.5 15.6L8.5 17.5L6 19.5', ...T }],
    ['path', { d: 'M12 15.6L12 20', ...T }],
    ['path', { d: 'M15.5 15.6L15.5 17.5L18 19.5', ...T }],
    ['path', { d: brain, fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: brain, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M12 4.3L12 14.8', ...G }],
    ['path', { d: 'M6.5 7.6Q9 7.4 9.2 10M17.5 7.6Q15 7.4 14.8 10M5.6 12.4Q7.4 11.4 9.4 12.6M18.4 12.4Q16.6 11.4 14.6 12.6M8.6 4.8Q9.6 5.6 9.4 6.8M15.4 4.8Q14.4 5.6 14.6 6.8', ...G }],
    ['circle', { cx: 6, cy: 19.5, r: 1.3, fill: C3, ...K, class: 'wm-s' }],
    ['circle', { cx: 12, cy: 20.6, r: 1.3, fill: C3, ...K, class: 'wm-s' }],
    ['circle', { cx: 18, cy: 19.5, r: 1.3, fill: C3, ...K, class: 'wm-s' }],
  ]
}
