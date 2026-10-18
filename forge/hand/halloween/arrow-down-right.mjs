// forge/hand/halloween/arrow-down-right.mjs — the diagonal arrow in pumpkin orange like arrow-down (round-ended shaft,
// solid rounded head, ink rim, lit edges), replacing the generated midnight one that sank into dark backgrounds.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-arrow-down-right-${n}`

// the 2u shaft from 6.5,6.5 (round cap) into the head triangle 17.5,8 / 17.5,17.5 / 8,17.5 grown by 1u, round corners
const body = (dx = 0, dy = 0) => {
  const p = (x, y) => `${Math.round((x + dx) * 100) / 100} ${Math.round((y + dy) * 100) / 100}`
  return `M${p(5.79, 7.21)}A1 1 0 0 1 ${p(7.21, 5.79)}L${p(12.75, 11.33)}L${p(16.79, 7.29)}A1 1 0 0 1 ${p(18.5, 8)}L${p(18.5, 17.5)}` +
    `A1 1 0 0 1 ${p(17.5, 18.5)}L${p(8, 18.5)}A1 1 0 0 1 ${p(7.29, 16.79)}L${p(11.33, 12.75)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.04, r: 8.58, fx: 9.92, fy: 9.92, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.65, r: 10.56, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: body(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: body(), fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // lit edges: the shaft's upper side and the head's long upper-left edge
    ['path', { d: 'M7.67 7.13L11.6 11.06M13.9 11.06L16.6 8.36', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
