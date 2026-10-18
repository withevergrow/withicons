// forge/hand/glass/hard-hat.mjs — a frosted glass hard hat in three clear pieces: a domed shell, a raised crest ridge of
// accent glass that rises above the crown, and a full-width brim slab set just below the shell. The generated drawing
// melted dome and brim into one rounded lump with two hairline etches for the ridge, so it read as a bell or a cloud;
// here the crest breaks the silhouette at the top and the brim is its own glass with a violet seam above it.
// Same Glass layers: soft shadow, colour body down-right with an accent orb, frosted pane up-left with a hairline edge.
import { V } from '../../styles/_glass-soft.mjs'

const S = 0.94, OFF = 1.1
const f = v => +v.toFixed(2)
// skeleton coords -> glass frame (scaled about the centre, front pane 0.5u up-left) + offset; absolute M L H V C A Z
function tf(d, dx = 0, dy = 0) {
  const t = d.match(/[MLHVCQAZ]|-?\d*\.?\d+/g), X = v => f(12 + (v - 12) * S - 0.5 + dx), Y = v => f(12 + (v - 12) * S - 0.5 + dy)
  let o = '', i = 0, c = ''
  const n = () => +t[i++]
  while (i < t.length) {
    if (/[A-Z]/.test(t[i])) { c = t[i++]; o += c; if (c === 'Z') continue }
    if (c === 'H') o += X(n()) + ' '
    else if (c === 'V') o += Y(n()) + ' '
    else if (c === 'A') { o += f(n() * S) + ' ' + f(n() * S) + ' ' + n() + ' ' + n() + ' ' + n() + ' '; o += X(n()) + ' ' + Y(n()) + ' ' }
    else { const k = c === 'C' ? 3 : c === 'Q' ? 2 : 1; for (let j = 0; j < k; j++) o += X(n()) + ' ' + Y(n()) + ' ' }
  }
  return o.trim()
}
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]
const rad = (id, cx, cy, r, stops) => ['radialGradient', { id, cx, cy, r, gradientUnits: 'userSpaceOnUse' }, stops]
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const EDGE = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }

// skeleton coords: the shell, the crest ridge riding over its crown, the brim slab
const DOME = 'M4 14.7 A0.6 0.6 0 0 1 3.4 14.1 C3.4 9 7.3 5.5 12 5.5 C16.7 5.5 20.6 9 20.6 14.1 A0.6 0.6 0 0 1 20 14.7 Z'
const RIDGE = 'M9.6 14.7 V7 C9.6 5.2 10.65 4.1 12 4.1 C13.35 4.1 14.4 5.2 14.4 7 V14.7 Z'
const BRIM = 'M3.9 15.7 H20.1 A1.75 1.75 0 0 1 20.1 19.2 H3.9 A1.75 1.75 0 0 1 3.9 15.7 Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'hard-hat'
  const id = n => `wg-glass-${name}-${n}`, url = n => `url(#${id(n)})`
  const defs = [
    lin(id(0), 3, 4, 23, 22, [stop(0, V.c1), stop(1, V.shadow)]),
    rad(id(1), 16.4, 17.2, 7.5, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]),
    lin(id(2), 2, 3, 21, 19, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    lin(id(3), 10, 3, 14, 12.5, [stop(0, V.shine, 0.55), stop(0.5, V.shine, 0.1), stop(1, V.shadow, 0.25)]),
  ]
  const back = d => [['path', { d: tf(d, OFF, OFF), fill: url(0), class: 'wm-k' }], ['path', { d: tf(d, OFF, OFF), fill: url(1), class: 'wm-k' }]]
  const pane = (d, cls = 'wm-k') => ['path', { d: tf(d), fill: url(2), ...EDGE, class: cls }]
  const shine = (d, cls, w = 0.7) => ['path', { d: tf(d), fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': w, 'stroke-linecap': 'round', class: cls }]
  return [['defs', {}, defs],
    // soft diffuse shadow under the whole hat
    ['path', { d: tf(DOME + BRIM, 0.4, 1.7), fill: V.shadow, 'fill-opacity': 0.05, stroke: V.shadow, 'stroke-opacity': 0.05, 'stroke-width': 1.6, 'stroke-linejoin': 'round', class: 'wm-shadow' }],
    // shell: colour body, frosted pane, lit rim along the upper-left curve
    ...back(DOME), pane(DOME),
    shine('M4.5 12.8 C4.9 9.8 6.8 7.5 9 6.6', 'wm-shine'),
    // crest ridge: a raised band of the same glass over the crown, its colour body showing on the shaded flank
    ['path', { d: tf(RIDGE, 0.6, 0.5), fill: url(0), class: 'wm-a' }],
    ['path', { d: tf(RIDGE), fill: url(2), ...EDGE, class: 'wm-a' }],
    ['path', { d: tf(RIDGE), fill: url(3), class: 'wm-a' }],
    shine('M10.45 13.4 V7.1 C10.45 5.95 11 5.15 11.85 4.95', 'wm-a wm-shine', 0.6),
    // brim: its own slab, the shell's colour body shows as a violet seam above it
    ...back(BRIM), pane(BRIM),
    shine('M3 17.1 A1.1 1.1 0 0 1 3.9 16.6 H12', 'wm-shine'),
  ]
}
