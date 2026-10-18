// forge/hand/chrome/avatar-unicorn.mjs — a chrome unicorn head in profile: a long bright chrome face and neck with a
// pointed ear, a hot-pink flowing mane laid behind the neck (own outline, bevel and strand highlights) and a slim
// spiral horn standing on the forehead in its own warm gold-and-white bands, so the horn and mane are bright separate
// parts. The eye is a big dark almond with a catch light, the nostril an ink dot. The generated drawing was one dark
// silhouette where horn, mane and eye were lost.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
// transform every "x y" pair of a polyline/curve path written with absolute M L C Z commands
const T = d => d.replace(/(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (_, x, y) => tf(+x, +y).join(' '))
const ell = (x, y, rx, ry) => {
  const [cx, cy] = tf(x, y), a = r2(rx * K.SCALE), b = r2(ry * K.SCALE)
  return `M${r2(cx + a)} ${cy}A${a} ${b} 0 1 1 ${r2(cx - a)} ${cy}A${a} ${b} 0 1 1 ${r2(cx + a)} ${cy}Z`
}

const HEAD = 'M10.4 21.6C10.2 19.6 9.8 18.4 8.8 17.6C7.4 18.4 5.4 18.7 4.3 17.8C3.2 16.9 3.2 15.6 3.9 14.5L8.6 7.4C9.6 6 11.4 5.4 13 5.9C15 6.7 15.9 9 15.7 12C15.5 15.5 14.8 18.6 15.2 21.6Z'
const EAR = 'M10.6 6.6L11.9 2.3L14.4 7.2Z'
const MANE = 'M12.9 4.7C16.6 3.9 20.6 5.5 21 9C21.2 10.7 19.9 11.6 20.3 12.8C20.6 13.9 21.8 14.6 21.7 16.6C21.6 18.3 20.5 19.2 20.4 20.4C20.3 21.1 19.9 21.6 19.4 21.9L14.5 21.9L14.5 8Z'
const HORN = 'M7.1 8.2L10 6.6L5.5 0.9Z'
const STRANDS = ['M16.1 6.8C18.4 6.6 20 7.8 20.1 9.8', 'M16.6 12.4C18.6 12.4 20.1 13.4 20.3 15.4', 'M16.4 17.2C18.2 17.4 19.2 18.4 19.1 20']

function skeleton(name) {
  const parts = [{ d: HEAD, plate: 'K', fill: true }, { d: EAR, plate: 'K', fill: true }]
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = parts.map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  return { name, paths, fills, cutouts: [], lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-unicorn'
  // the mirror horizon would run through the face like a moustache: the head keeps the sky and the ground ramps only
  const out = emit(layers(model(skeleton(name))), name, 0).filter(n => !(n[0] === 'path' && n[1].fill === col('ink')))
  const glint = out.pop()
  const at = out[0] && out[0][0] === 'defs' ? 1 : 0
  const behind = [
    ['path', { d: T(MANE), fill: col('accent'), stroke: col('shadow'), 'stroke-width': 0.9, 'stroke-linejoin': 'round', class: 'wm-s' }],
    ...STRANDS.map(d => ['path', { d: T(d), fill: 'none', stroke: col('shine'), 'stroke-width': 0.7, 'stroke-linecap': 'round', 'stroke-opacity': 0.85, class: 'wm-s' }]),
  ]
  out.splice(at, 0, ...behind)
  // the horn: dark edge, bright warm metal body, two bright spiral bands
  out.push(['path', { d: T(HORN), fill: col('c4'), stroke: col('shadow'), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-a' }])
  const P = (t, k) => tf(8.55 - 2.95 * t + 0.91 * k * 1.5 * (1 - t), 7.4 - 6.5 * t - 0.41 * k * 1.5 * (1 - t)).join(' ')
  for (const [a, b] of [[0.26, 0.4], [0.56, 0.68]]) out.push(['path', { d: `M${P(a, -0.8)}L${P(a, 0.8)}L${P(b, 0.8)}L${P(b, -0.8)}Z`, fill: col('shine'), class: 'wm-a' }])
  out.push(['path', { d: ell(10.3, 10.6, 1.25, 1.75), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: ell(9.85, 9.9, 0.45, 0.55), fill: col('shine'), class: 'wm-shine' }])
  out.push(['path', { d: ell(4.9, 14.7, 0.55, 0.55), fill: col('ink'), class: 'wm-k' }])
  out.push(glint)
  return out
}
