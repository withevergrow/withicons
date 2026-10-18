// forge/hand/chrome/bell-off.mjs: the whole chrome bell (crown, flared lip, hanging clapper: the same drawing as bell)
// crossed by one slim gunmetal slash with a clean pale gap either side, the way cloud-off and eye-off do it. The generated
// version split the bell with a fat pink enamel jewel and its moat, which hid half the bell and haloed the slash.
import { col, K } from '../../styles/_chrome-core.mjs'
import bell from './bell.mjs'

const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)

export default function render(icon) {
  const name = (icon && icon.name) || 'bell-off'
  const out = bell({ name })
  const s = 'M3.5 3.5 20.5 20.5'
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = gi >= 0 ? out.splice(gi, 1)[0] : null
  out.push(['path', { d: TD(s), stroke: col('edge'), 'stroke-width': r2(2.5 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  out.push(['path', { d: TD(s), stroke: col('c3'), 'stroke-width': r2(1.25 * K.SCALE), 'stroke-linecap': 'round', fill: 'none', class: 'wm-s' }])
  if (glint) out.push(glint)
  return out
}
