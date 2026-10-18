// forge/hand/halloween/italic.mjs — a bare slanted pumpkin-orange serif I with the style's ink rim, drop shadow and lit
// left edge, drawn without the warm glow blob that hazed the generated glyph; the serifs tilt as the A part.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-italic-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const stem = 'M15 4L9 20'
  const serifs = 'M11 4H19M5 20H13'
  const shStem = 'M15.15 4.85L9.15 20.85'
  const shSerifs = 'M11.15 4.85H19.15M5.15 20.85H13.15'
  const body = { ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2 }
  const ink = { ...round, stroke: INK, 'stroke-width': 2.72 }
  const shadow = { ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2 }
  const shine = { ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 11.9, fx: 9.4, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
    ]],
    ['path', { d: shStem, ...shadow, class: 'wm-shadow' }],
    ['path', { d: shSerifs, ...shadow, class: 'wm-shadow' }],
    ['path', { d: serifs, ...ink, class: 'wm-a' }],
    ['path', { d: stem, ...ink, class: 'wm-k' }],
    ['path', { d: stem, ...body, class: 'wm-k' }],
    ['path', { d: serifs, ...body, class: 'wm-a' }],
    // the lit upper-left edges: along the stem's left side and the tops of both serifs
    ['path', { d: 'M13.5 6.4L10.95 13.2', ...shine, class: 'wm-shine' }],
    ['path', { d: 'M11.7 3.4H17.6M5.7 19.4H7.7', ...shine, class: 'wm-shine' }],
  ]
}
