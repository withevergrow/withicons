// forge/hand/christmas/bus.mjs — red front-view bus: cream sign strip, tinted windshield, gold headlights, ink wheels, thin snow line on the roof.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const body = 'M7 3L17 3Q20 3 20 6L20 17.5Q20 19 18.5 19L5.5 19Q4 19 4 17.5L4 6Q4 3 7 3Z'
  const snow = 'M6.2 3.2Q7 2.4 8 2.4L16 2.4Q17 2.4 17.8 3.2Q17 3.9 16.2 3.5Q15.2 4.1 14.2 3.6Q13 4.1 12 3.6Q11 4.1 9.8 3.6Q8.8 4.1 7.8 3.5Q7 3.9 6.2 3.2Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3, x2: 0, y2: 19, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
        ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.4, x2: 0, y2: 4.1, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: 'M5.5 18.5L8.5 18.5L8.5 20.8Q8.5 21.6 7.7 21.6L6.3 21.6Q5.5 21.6 5.5 20.8ZM15.5 18.5L18.5 18.5L18.5 20.8Q18.5 21.6 17.7 21.6L16.3 21.6Q15.5 21.6 15.5 20.8Z', fill: INK, class: 'wm-k' }],
    ['path', { d: body, fill: C1, ...K, class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M8 4.6L16 4.6Q16.6 4.6 16.6 5.2L16.6 5.8Q16.6 6.4 16 6.4L8 6.4Q7.4 6.4 7.4 5.8L7.4 5.2Q7.4 4.6 8 4.6Z', fill: C4, ...K, class: 'wm-k' }],
    ['path', { d: 'M6.6 7.8L17.4 7.8Q18.4 7.8 18.4 8.8L18.4 12.4Q18.4 13.4 17.4 13.4L6.6 13.4Q5.6 13.4 5.6 12.4L5.6 8.8Q5.6 7.8 6.6 7.8Z', fill: TINT, ...K, class: 'wm-k' }],
    ['path', { d: 'M7 12L10 8.6M9.4 12.4L11.8 9.8', stroke: SHINE, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['circle', { cx: 7.6, cy: 16, r: 1.25, fill: C3, ...K, class: 'wm-s' }],
    ['circle', { cx: 16.4, cy: 16, r: 1.25, fill: C3, ...K, class: 'wm-s' }],
    ['path', { d: 'M10.2 16L13.8 16', stroke: INK, 'stroke-width': 0.8, 'stroke-linecap': 'round' }],
    ['path', { d: snow, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
