// forge/hand/christmas/recycle.mjs — three bold pine-green chasing arrows with big pointed heads, a clear gap between
// each, and a snow cap on the top arrow. No extra sparkle.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), GREEN = V('c2', '#1F6E46')
const SHINE = V('shine', '#FFFFFF'), TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const n = v => Math.round(v * 100) / 100
const CX = 12, CY = 12.2

const P = (r, deg) => { const a = deg * Math.PI / 180; return `${n(CX + r * Math.cos(a))} ${n(CY + r * Math.sin(a))}` }
const arrow = s => {
  const R = 6.5, Ro = 8.1, Ri = 4.9, Rh = 10.3, Rhi = 2.7, e = s + 64, tip = e + 32
  return `M${P(Ro, s)}A${Ro} ${Ro} 0 0 1 ${P(Ro, e)}L${P(Rh, e)}L${P(R, tip)}L${P(Rhi, e)}L${P(Ri, e)}A${Ri} ${Ri} 0 0 0 ${P(Ri, s)}Z`
}

export default function render(icon) {
  const id = k => `wg-christmas-${icon.name}-${k}`
  const d = [-100, 20, 140].map(arrow).join('')
  const snowD = `M${P(8.35, -92)}A8.35 8.35 0 0 1 ${P(8.35, -66)}Q${P(7.5, -64)} ${P(7.1, -70)}Q${P(6.5, -75)} ${P(7.2, -79)}Q${P(6.6, -84)} ${P(7.3, -87)}Q${P(7.8, -90)} ${P(8.35, -92)}Z`
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 2, y1: 2, x2: 14, y2: 22, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.36 }],
        ['stop', { offset: 0.5, 'stop-color': SHINE, 'stop-opacity': 0.12 }],
        ['stop', { offset: 1, 'stop-color': SHINE, 'stop-opacity': 0.02 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.6, x2: 0, y2: 7.2, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d, fill: 'none', stroke: TINT, 'stroke-width': 1.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d, fill: GREEN, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: `M${P(6.5, -44)}A6.5 6.5 0 0 0 ${P(6.5, -92)}`, fill: 'none', stroke: SHINE, 'stroke-width': 0.5, 'stroke-opacity': 0.55, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: snowD, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
