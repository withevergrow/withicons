// forge/hand/chrome/avatar-monster.mjs — a chunky chrome one-eyed monster: a fat arch body, two gunmetal horn nubs,
// one big eye (gunmetal ring, bright white of the eye, dark pupil with a catch light) and a wide grin cut clean
// through. The generated eye was a grey ring on a grey body; the white and the pupil are what make it a face.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
const circ = (x, y, r) => { const [cx, cy] = tf(x, y), rr = r2(r * K.SCALE); return `M${r2(cx + rr)} ${cy}A${rr} ${rr} 0 1 1 ${r2(cx - rr)} ${cy}A${rr} ${rr} 0 1 1 ${r2(cx + rr)} ${cy}Z` }

const BODY = 'M12 3.5C16.25 3.5 19.25 6.75 19.25 11V18.5C19.25 19.75 18.5 20.5 17.25 20.5H6.75C5.5 20.5 4.75 19.75 4.75 18.5V11C4.75 6.75 7.75 3.5 12 3.5Z'
const EYE = 'M15.4 10.4A3.4 3.4 0 1 1 8.6 10.4A3.4 3.4 0 1 1 15.4 10.4Z'
const HORNL = 'M8.3 5.6L7 2.8'
const HORNR = 'M15.7 5.6L17 2.8'
const MOUTH = 'M8.2 16.2C9.6 18.6 14.4 18.6 15.8 16.2'

function skeleton(name) {
  const parts = [
    { d: BODY, plate: 'K', fill: true }, { d: HORNL, plate: 'A' }, { d: HORNR, plate: 'A' }, { d: EYE, plate: 'A' },
  ]
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate, subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = [{ d: MOUTH, subs: parsePath(MOUTH) }]
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-monster'
  const out = emit(layers(model(skeleton(name))), name, 0)
  const glint = out.pop()
  const [px, py] = tf(12.5, 11)
  out.push(['path', { d: circ(12, 10.4, 2.5), fill: col('edge'), class: 'wm-k' }])
  out.push(['path', { d: circ(12.4, 10.9, 1.5), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: circ(11.8, 10.2, 0.5), fill: col('shine'), class: 'wm-shine' }])
  out.push(glint)
  return out
}
