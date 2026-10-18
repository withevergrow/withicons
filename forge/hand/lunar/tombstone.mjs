// forge/hand/lunar/tombstone.mjs — a round-topped red lacquer headstone with a paper-cut gold border and a gold-foil
// cross, standing on a jade grass mound with tufts at both ends; the generated drawing's two carved bars read as an
// equals sign and its ground was a thin rim line with two stray nubs.
import { C } from '../../styles/_lunar-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const P = (x, y) => `${r2(x)} ${r2(y)}`
const glint = (x, y, r) => {
  const w = r * 0.09
  return `M${P(x, y - r)}Q${P(x + w, y - w)} ${P(x + r, y)}Q${P(x + w, y + w)} ${P(x, y + r)}` +
    `Q${P(x - w, y + w)} ${P(x - r, y)}Q${P(x - w, y - w)} ${P(x, y - r)}z`
}

export default function render(icon) {
  const id = n => `wg-lunar-${icon.name}-${n}`, url = n => `url(#${id(n)})`
  const st = (o, c) => ['stop', { offset: o, 'stop-color': c }]
  const stone = 'M5.25 20.5V9.75A6.75 6.75 0 0 1 18.75 9.75V20.5Z'
  const border = 'M6.3 20V9.75A5.7 5.7 0 0 1 17.7 9.75V20'
  // a cross with softly rounded arm ends
  const cross = 'M11.35 6.5H12.65Q13.1 6.5 13.1 6.95V9.05H15.05Q15.5 9.05 15.5 9.5V10.8Q15.5 11.25 15.05 11.25H13.1V15.55' +
    'Q13.1 16 12.65 16H11.35Q10.9 16 10.9 15.55V11.25H8.95Q8.5 11.25 8.5 10.8V9.5Q8.5 9.05 8.95 9.05H10.9V6.95Q10.9 6.5 11.35 6.5Z'
  // grass mound with a tuft of blades at each end
  const ground = 'M3.5 21.9Q2.5 21.9 2.6 20.9Q2.75 19.4 4.2 19.2L3.6 16.9L5.05 18.75L5.5 17.1L6.15 19H17.85L18.5 17.1L18.95 18.75' +
    'L20.4 16.9L19.8 19.2Q21.25 19.4 21.4 20.9Q21.5 21.9 20.5 21.9Z'
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 3, x2: 0, y2: 21, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 2.5, y1: 3, x2: 21.5, y2: 22, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.accent), st(0.28, C.shine), st(0.5, C.accent), st(0.78, C.edge), st(1, C.accent)]],
    ]],
    ['path', { d: stone, fill: url(0), stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: border, fill: 'none', stroke: C.accent, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-shine' }],
    ['path', { d: cross, fill: url(1), stroke: C.c2, 'stroke-width': 0.42, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: ground, fill: C.c3, stroke: url(1), 'stroke-width': 0.6, 'stroke-linejoin': 'round', class: 'wm-a' }],
    ['path', { d: glint(6.6, 6.0, 0.95), fill: C.shine, class: 'wm-shine' }],
  ]
}
