// forge/hand/christmas/list-filter.mjs — three thick centred bars stepping down to a point (20, 14, 8.5 wide), each its
// own festive colour (cranberry, pine, gold) so the funnel reads at 16px. One clean snow mound with three small drips
// rests on the top bar; the bottom bar is wide enough to stay a bar, not a blob.
import { C } from '../../styles/_christmas-core.mjs'

const n = v => Math.round(v * 100) / 100
const INK = { stroke: C.ink, 'stroke-width': 0.6, 'stroke-linejoin': 'round' }
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
// a pill from x0 to x1 centred on y, half-height h
const pill = (x0, x1, y, h) => `M${n(x0 + h)} ${n(y - h)}H${n(x1 - h)}A${h} ${h} 0 0 1 ${n(x1 - h)} ${n(y + h)}H${n(x0 + h)}A${h} ${h} 0 0 1 ${n(x0 + h)} ${n(y - h)}Z`

export default function render(icon) {
  const name = icon.name || 'list-filter'
  const id = k => `wg-christmas-${name}-${k}`, url = k => `url(#${id(k)})`
  const H = 2.2
  const bars = [
    { d: pill(2, 22, 6.2, H), c: C.c1 },
    { d: pill(5, 19, 12, H), c: C.c2 },
    { d: pill(7.75, 16.25, 17.8, H), c: C.c3 },
  ]
  // snow mound on the top bar's flat: a round dome with three scalloped drips
  const SNOW = 'M5.2 4.9C5.2 3.4 6.6 2.4 8.5 2.4C10.4 2.4 11.8 3.4 11.8 4.9C11.3 5.6 10.5 5.6 10.1 4.9C9.6 5.7 8.8 5.7 8.5 4.9C8.1 5.6 7.3 5.6 6.9 4.9C6.4 5.6 5.6 5.5 5.2 4.9Z'
  const out = [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 3, y1: 3, x2: 13, y2: 21, gradientUnits: 'userSpaceOnUse' },
        [st(0, C.shine, 0.34), st(0.42, C.shine, 0), st(0.58, C.shadow, 0), st(1, C.shadow, 0.42)]],
      ['linearGradient', { id: id(1), x1: 0, y1: 2.2, x2: 0, y2: 5.6, gradientUnits: 'userSpaceOnUse' }, [st(0.2, C.shine), st(1, C.tint)]],
    ]],
  ]
  bars.forEach((b, i) => {
    const cls = i === 2 ? 'wm-a' : 'wm-k'
    out.push(['path', { d: b.d, fill: b.c, ...INK, class: cls }])
    out.push(['path', { d: b.d, fill: url(0), class: 'wm-shine' }])
  })
  out.push(['path', { d: SNOW, fill: url(1), stroke: C.ink, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-deco' }])
  return out
}
