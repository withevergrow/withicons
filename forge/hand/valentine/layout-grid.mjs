// forge/hand/valentine/layout-grid.mjs — a plain 2x2 of rosy gradient tiles with the style's shade and shine and no
// heart ornaments; the generated cream tiles with hearts read as candy boxes rather than a grid.
const C1 = 'var(--with-valentine-c1, #FF6B8E)'
const C2 = 'var(--with-valentine-c2, #E8304F)'
const C4 = 'var(--with-valentine-c4, #FFF3E3)'
const INK = 'var(--with-valentine-ink, #6A1B3A)'
const SH = 'var(--with-valentine-shadow, #A3163F)'
const SHINE = 'var(--with-valentine-shine, #FFFFFF)'

const S = 7.25
const R = 1.75
const r2 = (n) => Math.round(n * 100) / 100
const tile = (x, y) => `M${r2(x + R)} ${y} H${r2(x + S - R)} A${R} ${R} 0 0 1 ${r2(x + S)} ${r2(y + R)} V${r2(y + S - R)} A${R} ${R} 0 0 1 ${r2(x + S - R)} ${r2(y + S)} H${r2(x + R)} A${R} ${R} 0 0 1 ${x} ${r2(y + S - R)} V${r2(y + R)} A${R} ${R} 0 0 1 ${r2(x + R)} ${y} Z`
const shade = (x, y) => `M${r2(x + S - 0.6)} ${r2(y + 2.2)} V${r2(y + S - R)} A${r2(R - 0.6)} ${r2(R - 0.6)} 0 0 1 ${r2(x + S - R)} ${r2(y + S - 0.6)} H${r2(x + 2.2)}`
const shine = (x, y) => `M${r2(x + 1.05)} ${r2(y + 3.4)} V${r2(y + 2.5)} A1.45 1.45 0 0 1 ${r2(x + 2.5)} ${r2(y + 1.05)}`
const POS = [[3, 3], [13.75, 3], [3, 13.75], [13.75, 13.75]]

export default function render() {
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: 'wg-valentine-layout-grid-0', x1: 0, y1: 0, x2: 0.3, y2: 1 }, [
        ['stop', { offset: 0, 'stop-color': C1 }],
        ['stop', { offset: 0.4, 'stop-color': C1 }],
        ['stop', { offset: 1, 'stop-color': C2 }],
      ]],
    ]],
  ]
  for (const [x, y] of POS) out.push(['path', { d: tile(x, y), fill: 'none', stroke: C4, 'stroke-width': 1.82, 'stroke-linejoin': 'round', class: 'wm-k' }])
  for (const [x, y] of POS) {
    out.push(['path', { d: tile(x, y), fill: 'url(#wg-valentine-layout-grid-0)', stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-k' }])
    out.push(['path', { d: shade(x, y), fill: 'none', stroke: SH, 'stroke-width': 0.9, 'stroke-linecap': 'round', 'stroke-opacity': 0.5, class: 'wm-shadow' }])
    out.push(['path', { d: shine(x, y), fill: 'none', stroke: SHINE, 'stroke-width': 0.8, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }])
  }
  return out
}
