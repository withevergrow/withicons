// forge/hand/rangoli/black-cat.mjs — an arched cat in one silhouette: pointed ears, almond eyes with slit pupils, a hump of a back
// with a gap under the belly and a curled tail, replacing the generated blob that had no readable head.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF'), ACC = V('accent', '#FFC21A')
const G0 = 'wg-rangoli-black-cat-0', G1 = 'wg-rangoli-black-cat-1'
const y = (v, dy) => Math.round((v + dy) * 100) / 100
const cat = (dy = 0) => `M6 ${y(20.6, dy)}C6 ${y(18, dy)} 5.5 ${y(15, dy)} 6 ${y(12.5, dy)}C7 ${y(9, dy)} 9 ${y(6.5, dy)} 11.5 ${y(6.5, dy)}C13 ${y(6.5, dy)} 14 ${y(7.25, dy)} 14.75 ${y(8, dy)}C14.8 ${y(6.5, dy)} 15 ${y(5.3, dy)} 15.4 ${y(4.2, dy)}Q15.7 ${y(3.6, dy)} 16.2 ${y(4.1, dy)}L17.25 ${y(5.5, dy)}H18.75L19.8 ${y(4.1, dy)}Q20.3 ${y(3.6, dy)} 20.6 ${y(4.2, dy)}C21 ${y(5.3, dy)} 21.25 ${y(6.5, dy)} 21.25 ${y(8, dy)}C21.25 ${y(10.5, dy)} 20 ${y(12, dy)} 18 ${y(12.25, dy)}C17.5 ${y(12.5, dy)} 17.25 ${y(13, dy)} 17.25 ${y(13.75, dy)}L17.4 ${y(20.6, dy)}Q17.4 ${y(21.2, dy)} 16.8 ${y(21.2, dy)}H15.9Q15.3 ${y(21.2, dy)} 15.3 ${y(20.6, dy)}L15 ${y(16.25, dy)}C13.5 ${y(14.25, dy)} 10 ${y(14.25, dy)} 8.25 ${y(16.25, dy)}L8.05 ${y(20.6, dy)}Q8.05 ${y(21.2, dy)} 7.45 ${y(21.2, dy)}H6.6Q6 ${y(21.2, dy)} 6 ${y(20.6, dy)}Z`
const tail = (dy = 0) => `M6.2 ${y(13.5, dy)}C3.4 ${y(12.5, dy)} 2.6 ${y(9, dy)} 3.5 ${y(6.5, dy)}C3.9 ${y(5.3, dy)} 3.7 ${y(4.2, dy)} 2.6 ${y(3.7, dy)}`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 9, cy: 6.5, r: 17, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C3 }],
      ]],
      ['linearGradient', { id: G1, x1: 2, y1: 14, x2: 4, y2: 3, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C4 }],
        ['stop', { offset: 1, 'stop-color': C3 }],
      ]],
    ]],
    ['path', { d: tail(0.55), fill: 'none', stroke: SHADOW, 'stroke-opacity': 0.45, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-shadow' }],
    ['path', { d: cat(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: tail(), fill: 'none', stroke: `url(#${G1})`, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: cat(), fill: `url(#${G0})`, class: 'wm-k' }],
    ['ellipse', { cx: 16.4, cy: 9, rx: 1.15, ry: 1.5, fill: TINT, class: 'wm-s' }],
    ['ellipse', { cx: 19.8, cy: 9, rx: 1.15, ry: 1.5, fill: TINT, class: 'wm-s' }],
    ['path', { d: 'M16.4 7.9V10.1M19.8 7.9V10.1', fill: 'none', stroke: SHADOW, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-s' }],
    ['path', { d: 'M7 12.6C7.6 10.2 9.2 8.2 11.2 7.6', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M20.4 15.6Q20.7 17.4 22.5 17.7Q20.7 18 20.4 19.8Q20.1 18 18.3 17.7Q20.1 17.4 20.4 15.6Z', fill: ACC, class: 'wm-deco' }],
  ]
}
