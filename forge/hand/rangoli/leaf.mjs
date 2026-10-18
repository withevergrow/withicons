// forge/hand/rangoli/leaf.mjs — a clean saffron leaf with one centred kumkum-to-violet midrib running out into the stem,
// replacing the generated drawing whose purple plume at the base and offset rib made it read as a flame or rocket.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G0 = 'wg-rangoli-leaf-0', G1 = 'wg-rangoli-leaf-1'
const r2 = v => Math.round(v * 100) / 100
const leaf = (dy = 0) => `M5.5 ${r2(18.5 + dy)}C3.5 ${r2(10.5 + dy)} 9.5 ${r2(3.5 + dy)} 20.5 ${r2(3.5 + dy)}C20.5 ${r2(14.5 + dy)} 13.5 ${r2(20.5 + dy)} 5.5 ${r2(18.5 + dy)}Z`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 9.6, cy: 7, r: 18.8, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
      ['linearGradient', { id: G1, x1: 3, y1: 21, x2: 17, y2: 7, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C4 }],
        ['stop', { offset: 1, 'stop-color': C3 }],
      ]],
    ]],
    ['path', { d: leaf(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: leaf(), fill: `url(#${G0})`, class: 'wm-k' }],
    ['path', { d: 'M3.6 20.4L6.4 17.6', fill: 'none', stroke: `url(#${G1})`, 'stroke-width': 1.9, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M5.6 18.4Q10.3 14 15.4 8.6', fill: 'none', stroke: `url(#${G1})`, 'stroke-width': 1.25, 'stroke-linecap': 'round', class: 'wm-a' }],
    ['path', { d: 'M6.7 14.6C6.6 10.4 10.4 5.6 17 4.75', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
