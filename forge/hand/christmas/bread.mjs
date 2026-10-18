// forge/hand/christmas/bread.mjs — golden loaf with a domed crust, three cream scored slashes, a darker base band and a small snow tuft.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C3 = V('c3', '#E2A93B'), C4 = V('c4', '#FFF5E6')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const K = { stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const loaf = 'M4 15C2.4 14.2 2.4 9.6 6 8.4C8 6.4 16 6.4 18 8.4C21.6 9.6 21.6 14.2 20 15L20 18.5Q20 20 18.5 20L5.5 20Q4 20 4 18.5Z'
  const snow = 'M9.4 7.4Q12 5.9 14.6 7.4Q14.2 8.1 13.5 7.8Q12.8 8.4 12 7.9Q11.2 8.4 10.5 7.8Q9.8 8.1 9.4 7.4Z'
  const cuts = 'M7.2 13.4L9.4 10M11 13.4L13.2 10M14.8 13.4L17 10'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 6.9, x2: 0, y2: 20, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
        ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 0.6, 'stop-color': SHADOW, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.38 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 5.9, x2: 0, y2: 8.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: loaf, fill: C3, ...K, class: 'wm-k' }],
    ['path', { d: 'M4 16.6L20 16.6L20 18.5Q20 20 18.5 20L5.5 20Q4 20 4 18.5Z', fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-k' }],
    ['path', { d: loaf, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M4 16.6L20 16.6', stroke: INK, 'stroke-width': 0.5 }],
    ['path', { d: cuts, stroke: INK, 'stroke-width': 1.7, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: cuts, stroke: C4, 'stroke-width': 0.8, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['path', { d: snow, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
