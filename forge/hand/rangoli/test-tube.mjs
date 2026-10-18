// forge/hand/rangoli/test-tube.mjs — a tilted test tube: violet glass wall with a flared rim lip, cream glass interior and
// saffron liquid with bubbles in the lower half, replacing the generated blob; sparkles stay small accents.
const V = (r, h) => `var(--with-rangoli-${r}, ${h})`
const C1 = V('c1', '#FFB21F'), C2 = V('c2', '#F2462C'), C3 = V('c3', '#E81F7A'), C4 = V('c4', '#7B2FE0')
const TINT = V('tint', '#FFF3D8'), SHADOW = V('shadow', '#5A1240'), SHINE = V('shine', '#FFFFFF'), ACC = V('accent', '#FFC21A')
const G0 = 'wg-rangoli-test-tube-0', G1 = 'wg-rangoli-test-tube-1'
const r2 = v => Math.round(v * 100) / 100
const S = Math.SQRT1_2
// tube frame: origin at the mouth centre, u runs down the tube axis (toward the bottom-left), v across it
const P = (u, v, dy = 0) => `${r2(18 - u * S + v * S)} ${r2(6 + u * S + v * S + dy)}`
const tube = (u0, u1, r, dy = 0) => `M${P(u0, -r, dy)}L${P(u1, -r, dy)}A${r} ${r} 0 0 0 ${P(u1, r, dy)}L${P(u0, r, dy)}Z`
const rim = (dy = 0) => `M${P(-0.7, -3.7, dy)}L${P(0.9, -3.7, dy)}L${P(0.9, 3.7, dy)}L${P(-0.7, 3.7, dy)}Z`
const liquid = `M${P(8.6, -1.75)}L${P(14, -1.75)}A1.75 1.75 0 0 0 ${P(14, 1.75)}L${P(8.6, 1.75)}Z`
export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: G0, cx: 9, cy: 10, r: 11, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.3, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
      ['linearGradient', { id: G1, x1: 21, y1: 3, x2: 5, y2: 19, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }],
        ['stop', { offset: 1, 'stop-color': C4 }],
      ]],
    ]],
    ['path', { d: tube(0.9, 14, 3, 0.55) + rim(0.55), fill: SHADOW, 'fill-opacity': 0.45, class: 'wm-shadow' }],
    ['path', { d: tube(0.9, 14, 3), fill: `url(#${G1})`, class: 'wm-k' }],
    ['path', { d: rim(), fill: `url(#${G1})`, class: 'wm-k' }],
    ['path', { d: tube(0.9, 14, 1.75), fill: TINT, class: 'wm-k' }],
    ['path', { d: liquid, fill: `url(#${G0})`, class: 'wm-a' }],
    ['circle', { cx: 8.7, cy: 13.7, r: 0.55, fill: TINT, 'fill-opacity': 0.9, class: 'wm-a' }],
    ['circle', { cx: 10.6, cy: 11.5, r: 0.4, fill: TINT, 'fill-opacity': 0.9, class: 'wm-a' }],
    ['path', { d: `M${P(2.2, -2.4)}L${P(11, -2.4)}`, fill: 'none', stroke: SHINE, 'stroke-opacity': 0.7, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M5 2.4Q5.3 4.2 7.1 4.5Q5.3 4.8 5 6.6Q4.7 4.8 2.9 4.5Q4.7 4.2 5 2.4Z', fill: ACC, class: 'wm-deco' }],
    ['path', { d: 'M20.4 17.6Q20.6 18.6 21.6 18.8Q20.6 19 20.4 20Q20.2 19 19.2 18.8Q20.2 18.6 20.4 17.6Z', fill: C3, class: 'wm-deco' }],
  ]
}
