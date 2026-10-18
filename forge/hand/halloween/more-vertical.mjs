// forge/hand/halloween/more-vertical.mjs — three equal pumpkin dots, each lit from the upper left with its own shine,
// on the clean vertical rhythm the generated one lost to the bat perched beside the top dot.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-more-vertical-${n}`
const R = 1.95, YS = [5, 12, 19]

export default function render() {
  const out = [
    ['defs', {}, [
      // one body gradient in each dot's own box, so all three are lit alike
      ['radialGradient', { id: id(0), cx: 0.5, cy: 0.56, r: 0.62, fx: 0.36, fy: 0.32 }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.5, r: 11, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
  ]
  for (const y of YS) out.push(['circle', { cx: 12.15, cy: y + 0.85, r: R, fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  for (const y of YS) out.push(['circle', { cx: 12, cy: y, r: R, fill: `url(#${id(0)})`, stroke: INK, 'stroke-width': 0.72, class: 'wm-k' }])
  // a short crescent of light on each dot's upper-left shoulder
  const shine = YS.map(y => `M10.85 ${y - 0.31}A1.2 1.2 0 0 1 11.9 ${y - 1.2}`).join('')
  out.push(['path', { d: shine, fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return out
}
