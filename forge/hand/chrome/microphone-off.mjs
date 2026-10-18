// forge/hand/chrome/microphone-off.mjs: a plump chrome microphone capsule on its gunmetal cradle, muted by one slim slash.
// The old drawing laid a fat pink jewel with a dark outline over the capsule, so at 16-24px the mic turned into a grey smudge.
// Now the mic is drawn whole and the slash is a thin gunmetal stroke inside a wide pale gap, so the capsule, arc and stand
// stay readable on light and dark (the same recipe as bell-off and camera-off).
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const CAP = 'M8.7 5.6 A3.3 3.3 0 0 1 15.3 5.6 V10.2 A3.3 3.3 0 0 1 8.7 10.2 Z'

function skeleton(name) {
  const defs = [
    { d: CAP, plate: 'K' },
    { d: 'M5.2 10.6 A6.8 6.8 0 0 0 18.8 10.6', plate: 'A' },
    { d: 'M12 17.4 V21 M8.4 21 H15.6', plate: 'A' },
  ]
  const paths = defs.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const subs = parsePath(CAP)
  return { name, paths, fills: [{ d: CAP, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))) }
}

const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'microphone-off'
  const out = emit(layers(model(skeleton(name))), name, 0)
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = gi >= 0 ? out.splice(gi, 1)[0] : null
  const s = 'M4 4 L20 20'
  out.push(['path', { d: TD(s), stroke: col('edge'), 'stroke-width': r2(3 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(s), stroke: col('c3'), 'stroke-width': r2(1.3 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  if (glint) out.push(glint)
  return out
}
