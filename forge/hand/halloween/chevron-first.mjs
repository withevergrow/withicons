// forge/hand/halloween/chevron-first.mjs — a pumpkin-orange chevron and wall bar with the ink rim, drop shadow and lit
// upper-left edge of chevron-last and the chevron set, replacing the pale cream one whose bat crowded the bar.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-chevron-first-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const chev = 'M17.5 6L11.5 12L17.5 18', bar = 'M7 6V18'
  const chevSh = 'M17.65 6.85L11.65 12.85L17.65 18.85', barSh = 'M7.15 6.85V18.85'
  const body = { ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2 }
  const rim = { ...round, stroke: INK, 'stroke-width': 2.72 }
  const sh = { ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2 }
  const lit = { ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12.25, cy: 13.12, r: 9.24, fx: 10.25, fy: 9.48, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12.25, cy: 12.7, r: 11.18, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: chevSh, ...sh, class: 'wm-shadow' }],
    ['path', { d: barSh, ...sh, class: 'wm-shadow' }],
    // the chevron (K) and the wall it bumps (A)
    ['path', { d: chev, ...rim, class: 'wm-k' }],
    ['path', { d: chev, ...body, class: 'wm-k' }],
    ['path', { d: bar, ...rim, class: 'wm-a' }],
    ['path', { d: bar, ...body, class: 'wm-a' }],
    // lit edges: the chevron's outer edge round the point, the bar's left side
    ['path', { d: 'M16.01 6.95L11.23 11.73Q10.96 12 11.23 12.27L12.31 13.35', ...lit, class: 'wm-shine' }],
    ['path', { d: 'M6.46 6.55V15.9', ...lit, class: 'wm-shine' }],
  ]
}
