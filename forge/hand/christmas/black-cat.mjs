// christmas black-cat: standing arched cat, tail up on the left, head right with two ears, gold slit eyes, red collar with gold bell, light rim for dark mode.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), C3 = V('c3', '#E2A93B')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716'), ACC = V('accent', '#F4C24D')
const defs = id => ['defs', {}, [
  ['linearGradient', { id: id(0), x1: 4, y1: 4, x2: 16, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
    ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.3 }],
    ['stop', { offset: 0.45, 'stop-color': SHINE, 'stop-opacity': 0 }],
    ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.35 }],
  ]],
]]
const BODY = 'M6 21C6 18 5.5 15 6 12.5C7 9 9 6.5 11.5 6.5C13 6.5 14 7.25 14.75 8C14.75 6.5 15 5.25 15.5 3.6L17.25 5.5H18.75L20.5 3.6C21 5.25 21.5 6.5 21.5 8.5C21.5 10.8 20 12.2 18 12.5C17.5 12.8 17.25 13.2 17.25 13.9L17.5 21H15.25L15 16.5C13.5 14.5 10 14.5 8.25 16.5L8 21Z'
const TAIL = 'M6.2 13.5C3.3 12.6 2.6 9.2 3.6 6.8C4.1 5.6 3.9 4.6 2.8 4'
const ST = 'M12 2.4Q12.3 3.5 13.4 3.8Q12.3 4.1 12 5.2Q11.7 4.1 10.6 3.8Q11.7 3.5 12 2.4z'
export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  return [defs(id),
    ['path', { d: TAIL, stroke: TINT, 'stroke-width': 3.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: TAIL, stroke: INK, 'stroke-width': 2.6, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: BODY, fill: INK, stroke: TINT, 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: BODY, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: 'M15.9 8.9a1.1 1.45 0 1 0 2.2 0a1.1 1.45 0 1 0 -2.2 0zM19.2 8.9a1.1 1.45 0 1 0 2.2 0a1.1 1.45 0 1 0 -2.2 0z', fill: C3, stroke: INK, 'stroke-width': 0.3, class: 'wm-k' }],
    ['path', { d: 'M17 8V9.8M20.3 8V9.8', stroke: INK, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }],
    ['path', { d: 'M14.6 11.6Q16.4 13.6 18.3 12.6', stroke: C1, 'stroke-width': 1.4, 'stroke-linecap': 'round', class: 'wm-deco' }],
    ['circle', { cx: 16.4, cy: 14.4, r: 0.95, fill: C3, stroke: INK, 'stroke-width': 0.3, class: 'wm-deco' }],
    ['path', { d: ST, fill: ACC, stroke: INK, 'stroke-width': 0.28, 'stroke-linejoin': 'round', class: 'wm-deco' }]]
}
