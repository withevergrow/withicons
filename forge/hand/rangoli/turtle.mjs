// forge/hand/rangoli/turtle.mjs — a saffron domed shell with a cream hex scute, set against violet head, neck, legs and tail
// so the shell reads as its own plated dome instead of one orange blob.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF'), ACC = V('accent', '#FFC21A')
const G0 = 'wg-rangoli-turtle-0', G1 = 'wg-rangoli-turtle-1'
const y = (v, dy) => Math.round((v + dy) * 100) / 100
const shell = (dy = 0) => `M2.9 ${y(13.4, dy)}C2.9 ${y(8.6, dy)} 6.1 ${y(5.2, dy)} 9.8 ${y(5.2, dy)}C13.5 ${y(5.2, dy)} 16.6 ${y(8.6, dy)} 16.6 ${y(13.4, dy)}Q16.6 ${y(14.1, dy)} 15.9 ${y(14.1, dy)}H3.6Q2.9 ${y(14.1, dy)} 2.9 ${y(13.4, dy)}Z`
const leg = (x, dy = 0) => `M${x} ${y(12.5, dy)}H${x + 2.4}V${y(16.4, dy)}A1.2 1.2 0 0 1 ${x} ${y(16.4, dy)}Z`
const limbs = (dy = 0) => leg(3.5, dy) + leg(6.9, dy) + leg(11, dy) + leg(14.3, dy)
  + `M1.5 ${y(13.4, dy)}L4 ${y(10.9, dy)}V${y(13.4, dy)}Z`
  + `M15 ${y(11.6, dy)}L17.4 ${y(9.2, dy)}L20.6 ${y(10.2, dy)}C20.1 ${y(12.2, dy)} 18.5 ${y(13.4, dy)} 16 ${y(13.4, dy)}Z`
  + `M16.6 ${y(7.6, dy)}a2.6 2.6 0 1 1 5.2 0a2.6 2.6 0 1 1-5.2 0Z`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 7.4, cy: 6.2, r: 11.6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
      ['linearGradient', { id: G1, x1: 22, y1: 5, x2: 3, y2: 17, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }],
        ['stop', { offset: 1, 'stop-color': C4 }],
      ]],
    ]],
    ['path', { d: limbs(0.55) + shell(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: limbs(), fill: `url(#${G1})`, class: 'wm-a' }],
    ['path', { d: shell(), fill: `url(#${G0})`, class: 'wm-k' }],
    ['path', { d: 'M8.5 7.2H11.1L12.4 9.5L11.1 11.8H8.5L7.2 9.5Z', fill: TINT, class: 'wm-k' }],
    ['path', { d: 'M4.4 11.4Q5.4 10.4 6.4 10.4L5.9 12.2ZM15.1 11.4Q14.1 10.4 13.1 10.4L13.6 12.2Z', fill: TINT, 'fill-opacity': 0.85, class: 'wm-k' }],
    ['circle', { cx: 20.1, cy: 7.1, r: 0.8, fill: TINT, class: 'wm-s' }],
    ['circle', { cx: 20.3, cy: 7.2, r: 0.4, fill: SHADOW, class: 'wm-s' }],
    ['path', { d: 'M4.6 11.4C5.3 8.9 7.2 7.1 9.4 6.6', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M4.5 1.9Q4.8 3.7 6.6 4Q4.8 4.3 4.5 6.1Q4.2 4.3 2.4 4Q4.2 3.7 4.5 1.9Z', fill: ACC, class: 'wm-deco' }],
    ['path', { d: 'M20 18.6Q20.2 19.6 21.2 19.8Q20.2 20 20 21Q19.8 20 18.8 19.8Q19.8 19.6 20 18.6Z', fill: C3, class: 'wm-deco' }],
  ]
}
