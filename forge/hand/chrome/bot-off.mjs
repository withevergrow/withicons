// forge/hand/chrome/bot-off.mjs: the chrome robot head reduced to its few big marks (a roomy square head, a ball on a
// short stem, chunky ear pods and two round eye ports, no mouth bar) muted by one slim mid-tone slash set in a pale gap.
// The old drawing packed eyes, a mouth, hairline nubs and a heavy dark slash into 14 units and turned to mush at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const HEAD = 'M8 8.2H16A3 3 0 0 1 19 11.2V17.5A3 3 0 0 1 16 20.5H8A3 3 0 0 1 5 17.5V11.2A3 3 0 0 1 8 8.2Z'
const circ = (x, y, r) => `M${x + r} ${y}A${r} ${r} 0 1 1 ${x - r} ${y}A${r} ${r} 0 1 1 ${x + r} ${y}Z`
const EARL = 'M1.9 12.1A1.1 1.1 0 0 1 4.1 12.1V16A1.1 1.1 0 0 1 1.9 16Z'
const EARR = 'M19.9 12.1A1.1 1.1 0 0 1 22.1 12.1V16A1.1 1.1 0 0 1 19.9 16Z'
const CUTS = [circ(8.3, 13.9, 1.3), circ(15.7, 13.9, 1.3)]

function skeleton(name) {
  const defs = [
    { d: HEAD, plate: 'K' },
    { d: 'M12 8.2V5.4', plate: 'A' },
    { d: circ(12, 3.9, 1.8), plate: 'A' },
    { d: EARL, plate: 'A' },
    { d: EARR, plate: 'A' },
  ]
  const paths = defs.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const subs = parsePath(HEAD)
  return { name, paths, fills: [{ d: HEAD, subs, set: setOf(subs.map(s => s.pts)) }],
    cutouts: CUTS.map(d => ({ d, subs: parsePath(d) })),
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}

const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'bot-off'
  const out = emit(layers(model(skeleton(name))), name, 0)
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = gi >= 0 ? out.splice(gi, 1)[0] : null
  const s = 'M3.8 3.4 L17.6 21.2'
  out.push(['path', { d: TD(s), stroke: col('edge'), 'stroke-width': r2(2.7 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(s), stroke: col('c2'), 'stroke-width': r2(1 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  if (glint) out.push(glint)
  return out
}
