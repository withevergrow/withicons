// forge/hand/halloween/list-checks.mjs — three pumpkin-orange text lines (the align-* siblings' bars) with two witch-purple
// checks as the A part, ink-rimmed and shadowed; replaces the generated midnight version that vanished on dark and the bat.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const EDGE = V('edge', '#7344C9'), ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-list-checks-${n}`
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

export default function render() {
  const lines = 'M12 6H21M12 12H21M12 18H21'
  const checks = 'M2.5 6L4.5 8L8 4M2.5 18L4.5 20L8 16'
  const ink = { ...round, stroke: INK, 'stroke-width': 2.72 }
  const shadow = { ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': 2 }
  const shine = { ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.42 }
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.4, r: 13.2, fx: 8.8, fy: 8.9, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C1 }], ['stop', { offset: 0.45, 'stop-color': C1 }], ['stop', { offset: 1, 'stop-color': C2 }]]],
      ['radialGradient', { id: id(1), cx: 4.6, cy: 11, r: 10.5, fx: 3.6, fy: 6, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': C3 }], ['stop', { offset: 0.5, 'stop-color': C3 }], ['stop', { offset: 1, 'stop-color': EDGE }]]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.85, r: 12, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': ACCENT, 'stop-opacity': 0.36 }], ['stop', { offset: 0.55, 'stop-color': ACCENT, 'stop-opacity': 0.16 }],
        ['stop', { offset: 1, 'stop-color': ACCENT, 'stop-opacity': 0 }]]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(2)})`, class: 'wm-deco' }],
    ['path', { d: 'M12.15 6.85H21.15M12.15 12.85H21.15M12.15 18.85H21.15', ...shadow, class: 'wm-shadow' }],
    ['path', { d: 'M2.65 6.85L4.65 8.85L8.15 4.85M2.65 18.85L4.65 20.85L8.15 16.85', ...shadow, class: 'wm-shadow' }],
    ['path', { d: lines, ...ink, class: 'wm-k' }],
    ['path', { d: checks, ...ink, class: 'wm-a' }],
    ['path', { d: lines, ...round, stroke: `url(#${id(0)})`, 'stroke-width': 2, class: 'wm-k' }],
    ['path', { d: checks, ...round, stroke: `url(#${id(1)})`, 'stroke-width': 2, class: 'wm-a' }],
    // the lit top edges of the bars and the rising stroke of each check
    ['path', { d: 'M12.6 5.4H17.4M12.6 11.4H17.4M12.6 17.4H17.4', ...shine, class: 'wm-shine' }],
    ['path', { d: 'M4.95 6.6L7.1 4.15M4.95 18.6L7.1 16.15', ...shine, 'stroke-opacity': 0.45, class: 'wm-shine' }],
  ]
}
