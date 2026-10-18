// forge/hand/halloween/arrow-down.mjs — a clean pumpkin arrow (round-ended shaft, solid rounded head) at the chevrons'
// weight, with only the style's glow, shadow and lit edge: the generated one hung a spider in the corner beside it.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-arrow-down-${n}`

// the outline of the 2u shaft (round top cap) and the head triangle 5.5,13.5 / 18.5,13.5 / 12,20 grown by 1u, round corners
const body = (dx = 0, dy = 0) => {
  const p = (x, y) => `${Math.round((x + dx) * 100) / 100} ${Math.round((y + dy) * 100) / 100}`
  return `M${p(11, 4)}A1 1 0 0 1 ${p(13, 4)}L${p(13, 12.5)}L${p(18.5, 12.5)}A1 1 0 0 1 ${p(19.21, 14.21)}L${p(12.71, 20.71)}` +
    `A1 1 0 0 1 ${p(11.29, 20.71)}L${p(4.79, 14.21)}A1 1 0 0 1 ${p(5.5, 12.5)}L${p(11, 12.5)}Z`
}

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.44, r: 11.88, fx: 9.6, fy: 8.76, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.9, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: body(0.15, 0.85), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: body(), fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }],
    // lit edges: the shaft's left side and the head's upper edge
    ['path', { d: 'M11.62 4.5L11.62 11.75M6.1 13.1L10.4 13.1M13.6 13.1L16.6 13.1', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42, 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
}
