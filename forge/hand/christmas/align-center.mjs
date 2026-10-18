// forge/hand/christmas/align-center.mjs — four solid cranberry bars, centred, round-ended 2.5u weight with a soft
// top-light gradient; a single thin snow line sits on the top bar only, no holly, so the lines read cleanly at 16px.
const V = (r, h) => `var(--with-christmas-${r}, ${h})`
const INK = V('ink', '#3A0F17'), C1 = V('c1', '#C8203A'), SHINE = V('shine', '#FFFFFF')
const TINT = V('tint', '#C9DAEC'), SHADOW = V('shadow', '#4A0716')
const BARS = [[3,21],[6,18],[3,21],[6,18]]
const YS = [5, 10, 15, 20]
const bar = ([a, b], y) => `M${a + 1.25} ${y - 1.25}L${b - 1.25} ${y - 1.25}A1.25 1.25 0 0 1 ${b - 1.25} ${y + 1.25}L${a + 1.25} ${y + 1.25}A1.25 1.25 0 0 1 ${a + 1.25} ${y - 1.25}Z`

export default function render(icon) {
  const id = n => `wg-christmas-${icon.name}-${n}`
  const body = BARS.map((b, i) => bar(b, YS[i])).join('')
  const [sa, sb] = [8,16]
  const snow = `M${sa} 4.15Q${sa} 3.55 ${sa + 0.6} 3.55L${sb - 0.6} 3.55Q${sb} 3.55 ${sb} 4.15Q${sb - 0.5} 4.2 ${sb - 0.9} 4.6Q${sb - 1.6} 4.25 ${(sa + sb) / 2} 4.3Q${sa + 1.4} 4.8 ${sa + 0.9} 4.4Q${sa + 0.4} 4.2 ${sa} 4.15Z`
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3.75, x2: 0, y2: 21.25, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0, 'stop-color': SHINE, 'stop-opacity': 0.22 }],
        ['stop', { offset: 0.5, 'stop-color': SHINE, 'stop-opacity': 0 }],
        ['stop', { offset: 1, 'stop-color': SHADOW, 'stop-opacity': 0.3 }],
      ]],
      ['linearGradient', { id: id(1), x1: 0, y1: 3.5, x2: 0, y2: 4.7, gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: 0.25, 'stop-color': SHINE }],
        ['stop', { offset: 1, 'stop-color': TINT }],
      ]],
    ]],
    ['path', { d: body, fill: C1, stroke: INK, 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: body, fill: `url(#${id(0)})`, class: 'wm-shine' }],
    ['path', { d: snow, fill: `url(#${id(1)})`, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
  ]
}
