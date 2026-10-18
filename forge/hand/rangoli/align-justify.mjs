// forge/hand/rangoli/align-justify.mjs — four full-width marigold bars on a deeper saffron-to-vermilion ramp with a
// plum ground shadow and a thin shine, replacing the generated pale yellow bars that washed out on light backgrounds.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF')
const G = 'wg-rangoli-align-justify-0'
const ys = [4.5, 9.5, 14.5, 19.5]
const r2 = v => Math.round(v * 100) / 100
const bar = (y, dy = 0) => `M4.25 ${r2(y - 1.25 + dy)}H19.75A1.25 1.25 0 0 1 19.75 ${r2(y + 1.25 + dy)}H4.25A1.25 1.25 0 0 1 4.25 ${r2(y - 1.25 + dy)}Z`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G, cx: 3, cy: 3, r: 24, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.15, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { d: ys.map(y => bar(y, 0.55)).join(''), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: ys.map(y => bar(y)).join(''), fill: `url(#${G})`, class: 'wm-k' }],
    ['path', { d: ys.map(y => `M4.4 ${r2(y - 0.55)}H12`).join(''), fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
