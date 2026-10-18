// forge/hand/rangoli/motorcycle.mjs — a side-view motorbike: two equal violet wheels with cream hubs, a raked fork and handlebar,
// a magenta engine block and swingarm tying the wheels together, and a saffron tank-and-seat on top (matches the line drawing).
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF'), ACC = V('accent', '#FFC21A')
const G0 = 'wg-rangoli-motorcycle-0'
const y = (v, dy) => Math.round((v + dy) * 100) / 100
const wheel = (cx, dy = 0) => `M${y(cx - 3.4, 0)} ${y(16.8, dy)}a3.4 3.4 0 1 1 6.8 0a3.4 3.4 0 1 1-6.8 0Z`
const body = (dy = 0) => `M3.2 ${y(10.8, dy)}C3.2 ${y(9.9, dy)} 3.9 ${y(9.5, dy)} 4.8 ${y(9.5, dy)}H8.4Q9.6 ${y(9.5, dy)} 10.3 ${y(8.4, dy)}H14.3C15.4 ${y(8.4, dy)} 15.9 ${y(9.5, dy)} 15.4 ${y(10.5, dy)}L14.3 ${y(12.9, dy)}H8.4L6.6 ${y(11.9, dy)}H4.2Q3.2 ${y(11.9, dy)} 3.2 ${y(10.8, dy)}Z`
const engine = (dy = 0) => `M9.4 ${y(12.6, dy)}H13.6Q14.6 ${y(12.6, dy)} 14.6 ${y(13.6, dy)}V${y(16.2, dy)}Q14.6 ${y(17.4, dy)} 13.4 ${y(17.4, dy)}H9.6Q8.4 ${y(17.4, dy)} 8.4 ${y(16.2, dy)}V${y(13.6, dy)}Q8.4 ${y(12.6, dy)} 9.4 ${y(12.6, dy)}Z`
const arm = dy => ({ d: `M5.2 ${y(16.8, dy)}L9 ${y(14.6, dy)}M14 ${y(14.6, dy)}L18.8 ${y(16.8, dy)}M18.8 ${y(16.8, dy)}L16 ${y(7.8, dy)}L14.3 ${y(6.5, dy)}H12.2`, fill: 'none', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 7.2, cy: 8.6, r: 10.4, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
    ['path', { ...arm(0.5), stroke: SHADOW, 'stroke-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: wheel(5.2, 0.5) + wheel(18.8, 0.5) + engine(0.5) + body(0.5), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { ...arm(0), stroke: C4, class: 'wm-a' }],
    ['path', { d: wheel(5.2) + wheel(18.8), fill: C4, class: 'wm-a' }],
    ['circle', { cx: 5.2, cy: 16.8, r: 1.3, fill: TINT, class: 'wm-a' }],
    ['circle', { cx: 18.8, cy: 16.8, r: 1.3, fill: TINT, class: 'wm-a' }],
    ['path', { d: engine(), fill: C3, class: 'wm-s' }],
    ['path', { d: body(), fill: `url(#${G0})`, class: 'wm-k' }],
    ['path', { d: 'M4.1 10.4C4.4 10.1 4.7 10 5.1 10H8.5C9.4 10 10.2 9.6 10.8 9', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M19.5 1.8Q19.8 3.6 21.6 3.9Q19.8 4.2 19.5 6Q19.2 4.2 17.4 3.9Q19.2 3.6 19.5 1.8Z', fill: ACC, class: 'wm-deco' }],
    ['path', { d: 'M4.5 3.8Q4.7 4.8 5.7 5Q4.7 5.2 4.5 6.2Q4.3 5.2 3.3 5Q4.3 4.8 4.5 3.8Z', fill: C3, class: 'wm-deco' }],
  ]
}
