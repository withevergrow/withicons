// forge/hand/christmas/angry.mjs — a cranberry face like the smile sibling, with bold dark ink features: slanted brows,
// round eyes and a thick frown; a small snow cap on the crown only, so it never reads as a blank snowball.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const face = 'M12 2.5A9.5 9.5 0 1 1 12 21.5A9.5 9.5 0 1 1 12 2.5Z'
  const snow = 'M7.6 4.1Q12 1.7 16.4 4.1Q16.1 4.75 15.5 4.6Q15 5.5 14.3 4.75Q13 4.45 12 4.6Q11.2 5.6 10.4 4.7' +
    'Q9.2 4.6 8.5 5Q8 4.9 7.6 4.1Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2.5, y1: 2.5, x2: 14, y2: 21.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.4, x2: 0, y2: 5.3, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: face, fill: C1, stroke: INK, 'stroke-width': 0.6, class: 'wm-k' }],
    ['path', { d: face, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M7.4 8L10.4 9.6M16.6 8L13.6 9.6', stroke: INK, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M8.9 12.2A1.15 1.35 0 1 1 8.9 14.9A1.15 1.35 0 1 1 8.9 12.2ZM15.1 12.2A1.15 1.35 0 1 1 15.1 14.9A1.15 1.35 0 1 1 15.1 12.2Z', fill: INK, class: 'wm-a' }],
    ['path', { d: 'M8.5 18.3Q12 15.4 15.5 18.3', stroke: INK, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-a' }],
  ]
}
