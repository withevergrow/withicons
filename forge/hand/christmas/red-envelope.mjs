// forge/hand/christmas/red-envelope.mjs — a tall cranberry hongbao with a curved flap edged in gold, a gold coin seal with a
// square hole where the flap points, a gold trim line near the base, a thin snow cap and a gold sparkle.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), RED = V('c1', '#C8203A'), GOLD = V('c3', '#E2A93B'), ACC = V('accent', '#F4C24D')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const id = k => `wg-christmas-${icon.name}-${k}`
  const body = 'M7 2.5H17A2 2 0 0 1 19 4.5V19.5A2 2 0 0 1 17 21.5H7A2 2 0 0 1 5 19.5V4.5A2 2 0 0 1 7 2.5Z'
  const flapLine = 'M5 6.2C8 11.6 10.4 13.4 12 13.4C13.6 13.4 16 11.6 19 6.2'
  const trim = 'M6.6 5.9C9 10.2 10.7 11.9 12 11.9C13.3 11.9 15 10.2 17.4 5.9'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.34 }],
        ['stop', { offset: 0.42, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.58, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.42 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 1.7, x2: 0, y2: 4.5, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: body, fill: RED, ...K, class: 'wm-k' }],
    ['path', { d: 'M5 5.4C5 4 5 3.4 5.6 3H18.4C19 3.4 19 4 19 5.4C16 11.2 13.6 13.4 12 13.4C10.4 13.4 8 11.2 5 5.4Z', fill: SHINE, 'fill-opacity': 0.16, class: 'wm-k' }],
    ['path', { d: flapLine, fill: 'none', stroke: INK, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: trim, fill: 'none', stroke: GOLD, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M7.5 18.6H16.5', fill: 'none', stroke: GOLD, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['circle', { cx: 12, cy: 12.4, r: 3.4, fill: GOLD, stroke: INK, 'stroke-width': 0.6, class: 'wm-s' }],
    ['circle', { cx: 12, cy: 12.4, r: 2.7, fill: 'none', stroke: INK, 'stroke-width': 0.3, 'stroke-opacity': 0.7, class: 'wm-s' }],
    ['path', { d: 'M10.8 11.2H13.2V13.6H10.8Z', fill: RED, stroke: INK, 'stroke-width': 0.45, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ['path', { d: 'M10.2 10.4A2.9 2.9 0 0 1 12.4 9.5', fill: 'none', stroke: SHINE, 'stroke-width': 0.5, 'stroke-opacity': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M9.4 3.6C9.9 2.5 10.7 2.1 12 2.1C13.3 2.1 14.1 2.5 14.6 3.6Q14.4 4.4 13.7 4.2Q13 4.8 12.4 4.3Q11.7 4.8 11 4.2Q9.6 4.4 9.4 3.6Z', fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: 'M21.2 3.6Q21.5 5 23 5.3Q21.5 5.6 21.2 7Q20.9 5.6 19.4 5.3Q20.9 5 21.2 3.6Z', fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
