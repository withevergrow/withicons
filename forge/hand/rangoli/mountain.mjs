// forge/hand/rangoli/mountain.mjs — a saffron front peak with a cream zigzag snow cap and a vermilion-shaded peak behind it,
// split by a clean gap, replacing the generated drawing whose marigold flower badge crowded the summit.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G0 = 'wg-rangoli-mountain-0'
const r2 = v => Math.round(v * 100) / 100
const y = (v, dy) => r2(v + dy)
// front peak: (2,20) (9.5,5) (17,20), apex and feet softened
const front = (dy = 0) => `M2.9 ${y(20.25, dy)}L9.05 ${y(5.9, dy)}Q9.5 ${y(4.9, dy)} 9.95 ${y(5.9, dy)}L16.1 ${y(20.25, dy)}Q16.3 ${y(20.75, dy)} 15.8 ${y(20.75, dy)}H3.2Q2.7 ${y(20.75, dy)} 2.9 ${y(20.25, dy)}Z`
// back peak: full triangle tucked behind the front peak, apex (16,9.5)
const back = (dy = 0) => `M10.5 ${y(20.75, dy)}L15.55 ${y(10.4, dy)}Q16 ${y(9.5, dy)} 16.45 ${y(10.4, dy)}L21.6 ${y(20.1, dy)}Q21.9 ${y(20.75, dy)} 21.2 ${y(20.75, dy)}Z`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 7.2, cy: 7.8, r: 18, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { d: back(0.55) + front(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: back(), fill: C2, class: 'wm-a' }],
    ['path', { d: front(), fill: `url(#${G0})`, class: 'wm-k' }],
    ['path', { d: 'M7.45 9.5L9.05 5.9Q9.5 4.9 9.95 5.9L11.55 9.5L10.55 10.8L9.5 9.6L8.45 10.8Z', fill: TINT, class: 'wm-k' }],
    ['circle', { cx: 19.5, cy: 5, r: 1.1, fill: C2, class: 'wm-deco' }],
    ['circle', { cx: 19.5, cy: 3.1, r: 0.75, fill: C1, class: 'wm-deco' }],
    ['circle', { cx: 21.4, cy: 5, r: 0.75, fill: C1, class: 'wm-deco' }],
    ['circle', { cx: 19.5, cy: 6.9, r: 0.75, fill: C1, class: 'wm-deco' }],
    ['circle', { cx: 17.6, cy: 5, r: 0.75, fill: C1, class: 'wm-deco' }],
    ['circle', { cx: 19.5, cy: 5, r: 0.45, fill: TINT, class: 'wm-deco' }],
    ['path', { d: 'M3.9 19.2L7.2 11.6', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.65, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
