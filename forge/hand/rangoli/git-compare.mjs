// forge/hand/rangoli/git-compare.mjs — two saffron nodes (top-left, bottom-right) joined by two violet arrow paths that point
// opposite ways, as in the line design; decoration cut down to one tiny kumkum spark.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G0 = 'wg-rangoli-git-compare-0', G1 = 'wg-rangoli-git-compare-1'
const y = (v, dy) => Math.round((v + dy) * 100) / 100
const arrows = dy => `M19 ${y(15, dy)}V${y(8, dy)}A2 2 0 0 0 17 ${y(6, dy)}H12M14.5 ${y(3.5, dy)}L12 ${y(6, dy)}L14.5 ${y(8.5, dy)}M5 ${y(9, dy)}V${y(16, dy)}A2 2 0 0 0 7 ${y(18, dy)}H12M9.5 ${y(15.5, dy)}L12 ${y(18, dy)}L9.5 ${y(20.5, dy)}`
const nodes = dy => `M2 ${y(6, dy)}a3 3 0 1 1 6 0a3 3 0 1 1-6 0ZM16 ${y(18, dy)}a3 3 0 1 1 6 0a3 3 0 1 1-6 0Z`
export default function render() {
  const arrowAttrs = { fill: 'none', 'stroke-width': 1.9, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 5, cy: 4, r: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
      ['linearGradient', { id: G1, x1: 4, y1: 3, x2: 20, y2: 21, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }],
        ['stop', { offset: 1, 'stop-color': C4 }],
      ]],
    ]],
    ['path', { d: arrows(0.55), ...arrowAttrs, stroke: SHADOW, 'stroke-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: nodes(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: arrows(0), ...arrowAttrs, stroke: `url(#${G1})`, class: 'wm-a' }],
    ['path', { d: nodes(0), fill: `url(#${G0})`, class: 'wm-k' }],
    ['circle', { cx: 5, cy: 6, r: 1.1, fill: TINT, class: 'wm-k' }],
    ['circle', { cx: 19, cy: 18, r: 1.1, fill: TINT, class: 'wm-k' }],
    ['path', { d: 'M3.5 5.2C3.8 4.3 4.4 3.7 5.3 3.4', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M21 2.2Q21.2 3.2 22.2 3.4Q21.2 3.6 21 4.6Q20.8 3.6 19.8 3.4Q20.8 3.2 21 2.2Z', fill: C3, class: 'wm-deco' }],
  ]
}
