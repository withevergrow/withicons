// forge/hand/luxe/avatar-tiger.mjs — an amber enamel tiger face with pointed ears, dark engraved forehead and cheek stripes, a cream
// muzzle, a ruby nose and dark eyes (the generated drawing was a blue blob whose stripes and gold features lost the tiger).
// The head is Luxe enamel (tone: amber), the cream muzzle and the features are laid over it.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build, K } from '../../styles/_luxe-core.mjs'
import { TUNE } from '../../styles/_luxe-tune.mjs'

// amber enamel with a burnt-orange side wall (every colour is still the c1 / c3 / edge role variable)
TUNE['avatar-tiger'] = { tone: { c1: '#F29A2E', c3: '#9A4A12', shadow: '#4A1F08', edge: '#FFE3B0' }, recFloor: 'shadow' }

const HEAD = 'M19.75 14 A7.75 6.5 0 1 1 4.25 14 A7.75 6.5 0 1 1 19.75 14 Z'
const EAR_L = 'M4.1 11.6 L3.8 6 Q3.8 4.8 4.9 5.3 L10.1 7.9 Z'
const EAR_R = 'M19.9 11.6 L20.2 6 Q20.2 4.8 19.1 5.3 L13.9 7.9 Z'
const G = {
  paths: [
    { d: HEAD, plate: 'K' },
    { d: EAR_L, plate: 'K' },
    { d: EAR_R, plate: 'K' },
  ],
  fills: [HEAD, EAR_L, EAR_R],
  cutouts: [
    // forehead: a centre bar and two angled marks
    'M11.3 8 H12.7 L12 10.7 Z',
    'M8.5 8.6 L10.1 9.2 L9.1 10.9 Z',
    'M15.5 8.6 L13.9 9.2 L14.9 10.9 Z',
    // cheek stripes, pointing in
    'M5.2 13.3 L7.8 14.4 L5.4 15.3 Z',
    'M6.1 16.8 L7.9 17.3 L6.8 18.2 Z',
    'M18.8 13.3 L16.2 14.4 L18.6 15.3 Z',
    'M17.9 16.8 L16.1 17.3 L17.2 18.2 Z',
    // inner ears
    'M5.2 9.9 L5 7.2 L7.6 8.5 Z',
    'M18.8 9.9 L19 7.2 L16.4 8.5 Z',
  ],
}

function prep(name) {
  const paths = G.paths.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = G.fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(x => x.pts)) } })
  const cutouts = G.cutouts.map(d => ({ d, subs: parsePath(d) }))
  const lines = paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id })))
  return { name, paths, fills, cutouts, lines }
}

// the drawing sits scaled and nudged inside the Luxe frame; the laid-over features follow it
const s = K.SCALE, n = v => +v.toFixed(2)
const X = x => n((x - 12) * s + 12 + K.TX), Y = y => n((y - 12) * s + 12 + K.TY)
const col = r => `var(--with-luxe-${r}, ${{ ink: '#0B1033', c2: '#C0174F', tint: '#FFEFC4', shadow: '#4A1F08', shine: '#FFFFFF' }[r]})`
const ell = (cx, cy, rx, ry, fill, op, cls) => ['ellipse', { cx: X(cx), cy: Y(cy), rx: n(rx * s), ry: n(ry * s), fill: col(fill), ...(op < 1 ? { 'fill-opacity': op } : {}), class: cls }]

export default function render(icon) {
  const nodes = build(prep(icon.name))
  const L = 10.7, R = 13.3, MY = 16.8
  const nose = `M${X(10.8)} ${Y(14.9)} H${X(13.2)} Q${X(13.2)} ${Y(15.6)} ${X(12)} ${Y(16.4)} Q${X(10.8)} ${Y(15.6)} ${X(10.8)} ${Y(14.9)} Z`
  const mouth = `M${X(12)} ${Y(16.4)} V${Y(17.3)} M${X(10.5)} ${Y(17.7)} Q${X(12)} ${Y(18.5)} ${X(12)} ${Y(17.3)} Q${X(12)} ${Y(18.5)} ${X(13.5)} ${Y(17.7)}`
  return [
    ...nodes,
    // cream muzzle: two puffs with a soft lower shade and a highlight
    ell(L, MY + 0.35, 2.15, 1.8, 'shadow', 0.3, 'wm-k'), ell(R, MY + 0.35, 2.15, 1.8, 'shadow', 0.3, 'wm-k'),
    ell(L, MY, 2.1, 1.75, 'tint', 1, 'wm-k'), ell(R, MY, 2.1, 1.75, 'tint', 1, 'wm-k'),
    ell(L - 0.5, MY - 0.7, 0.9, 0.5, 'shine', 0.75, 'wm-shine'), ell(R - 0.5, MY - 0.7, 0.9, 0.5, 'shine', 0.75, 'wm-shine'),
    ['path', { d: nose, fill: col('c2'), class: 'wm-k' }],
    ['path', { d: mouth, fill: 'none', stroke: col('ink'), 'stroke-width': n(0.5 * s), 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // eyes (the blink part)
    ell(8.3, 12.3, 0.85, 1.1, 'ink', 1, 'wm-a'), ell(15.7, 12.3, 0.85, 1.1, 'ink', 1, 'wm-a'),
    ell(8.0, 11.9, 0.28, 0.32, 'shine', 0.95, 'wm-a'), ell(15.4, 11.9, 0.28, 0.32, 'shine', 0.95, 'wm-a'),
  ]
}
