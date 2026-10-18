// forge/hand/dock/spider-web.mjs — the line design as a light glyph on the dark tile: the hexagonal web with sagging
// (scalloped) edges, six cut-out cells between the spokes, and the inner ring with three spokes drawn in the deep tone.
// The earlier glyph was too simplified to read as a web. Set a touch larger than the house scale: the threads are thin.
import { squircle, D } from '../../styles/_dock-core.mjs'
import { colourway } from '../../styles/_dock-tune.mjs'

const NAME = 'spider-web'
const S = 0.72, CY = D.CY
const r2 = n => +n.toFixed(2)
const fx = x => r2(12 + (x - 12) * S)
const fy = (y, dy = 0) => r2(CY + (y - 12) * S + dy)
// map absolute path data drawn on the 24 grid onto the tile (uniform scale, so arcs keep their shape)
function M(d, dy = 0) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g)
  let out = '', i = 0, c = ''
  const n = () => +t[i++]
  const pt = () => `${fx(n())} ${fy(n(), dy)} `
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) { c = t[i++]; out += c; if (c === 'Z') continue }
    if (c === 'M' || c === 'L') out += pt()
    else if (c === 'H') out += fx(n()) + ' '
    else if (c === 'V') out += fy(n(), dy) + ' '
    else if (c === 'Q') out += pt() + pt()
    else if (c === 'C') out += pt() + pt() + pt()
    else if (c === 'A') out += `${r2(n() * S)} ${r2(n() * S)} ${n()} ${n()} ${n()} ` + pt()
    else i++
  }
  return out.replace(/ ([A-Z])/g, '$1').trim()
}

// the web silhouette: six vertices joined by sagging edges
const WEB = 'M12 2Q15.25 6.25 20.5 7Q18.5 12 20.5 17Q15.25 17.75 12 22Q8.75 17.75 3.5 17Q5.5 12 3.5 7Q8.75 6.25 12 2Z'
// six cells between ring and rim, as in the line design (a little wider so they open at 16px)
const CELLS = [
  'M13 4.6Q14.9 7.1 18 7.4L16 8.8Q14 8.7 13 6.8Z',
  'M19 9Q18 12 19 15L17.3 14Q16.4 12 17.3 10Z',
  'M18 16.6Q14.9 16.9 13 19.4V17.2Q14 15.3 16 15.2Z',
  'M11 19.4Q9.1 16.9 6 16.6L8 15.2Q10 15.3 11 17.2Z',
  'M5 15Q6 12 5 9L6.7 10Q7.6 12 6.7 14Z',
  'M6 7.4Q9.1 7.1 11 4.6V6.8Q10 8.7 8 8.8Z',
].join('')
// the inner ring (sagging hexagon) and the three spokes inside it
const RING = 'M12 7Q13.5 9.5 16.5 9.5Q15 12 16.5 14.5Q13.5 14.5 12 17Q10.5 14.5 7.5 14.5Q9 12 7.5 9.5Q10.5 9.5 12 7Z'
const SPOKES = 'M12 7V17M7.7 9.5L16.3 14.5M16.3 9.5L7.7 14.5'

export default function render(icon) {
  const C = colourway(icon || { name: NAME, category: 'halloween' })
  const id = n => `wg-dock-${NAME}-${n}`
  const url = n => `url(#${id(n)})`
  const v = role => `var(--with-dock-${role}, ${C[role]})`
  const stop = (offset, role, op) => ['stop', op == null ? { offset, 'stop-color': v(role) } : { offset, 'stop-color': v(role), 'stop-opacity': op }]
  const lin = (n, x1, y1, x2, y2, stops) => ['linearGradient', { id: id(n), x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
  const tile = squircle(D.X0, D.Y0, D.X1, D.Y1, D.R, D.SMOOTH)
  const rim = squircle(D.X0 + 0.16, D.Y0 + 0.16, D.X1 - 0.16, D.Y1 - 0.16, D.R - 0.16, D.SMOOTH)
  const sh = v('shadow')
  return [
    ['defs', {}, [
      lin(0, 12, 3, 12, 33, [stop(0, 'c1'), stop(1, 'shadow')]),
      ['radialGradient', { id: id(1), cx: 12, cy: 1, r: 14, gradientUnits: 'userSpaceOnUse' }, [stop(0, 'shine', 0.42), stop(0.55, 'shine', 0.1), stop(1, 'shine', 0)]],
      lin(2, 12, 2, 12, 22, [stop(0, 'shine', 0.75), stop(0.3, 'shine', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.55)]),
      lin(3, 12, fy(2), 12, fy(22), [stop(0, 'shine'), stop(1, 'tint')]),
    ]],
    ['path', { d: squircle(D.X0 + 0.2, D.Y0 + 0.5, D.X1 - 0.2, D.Y1 + 0.5, D.R, D.SMOOTH), fill: sh, 'fill-opacity': 0.28, class: 'wm-shadow' }],
    ['path', { d: tile, fill: url(0), class: 'wm-deco' }],
    ['path', { d: tile, fill: url(1), class: 'wm-deco' }],
    ['path', { d: rim, stroke: url(2), 'stroke-width': 0.32, class: 'wm-deco' }],
    ['path', { d: M(WEB, D.DROP), fill: sh, 'fill-opacity': 0.4, stroke: sh, 'stroke-opacity': 0.3, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    ['path', { d: M(WEB), fill: url(3), 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: M(CELLS), fill: sh, class: 'wm-k' }],
    ['path', { d: M(RING + SPOKES), stroke: sh, 'stroke-opacity': 0.85, 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
  ]
}
