// forge/hand/liquid/avatar-dog.mjs: round head with two dark floppy ears hanging at the sides, a pale snout with a dark nose and two separate eyes.
const NAME = 'avatar-dog'
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const fill = d => ({ subs: parsePath(d) })
const OFF = plate => ({ pts: [[-8, -8], [-7, -8]], closed: false, plate })
const oval = (cx, cy, rx, ry = rx) => `M${r2(cx + rx)} ${r2(cy)}A${rx} ${ry} 0 1 1 ${r2(cx - rx)} ${r2(cy)}A${rx} ${ry} 0 1 1 ${r2(cx + rx)} ${r2(cy)}Z`
const glass = (fills, plate) => ({ name: NAME, paths: [], lines: plate ? [OFF(plate)] : [], fills: fills.map(fill), cutouts: [] })

function pass(nodes, off, cls, { deepRole, shadow = true, pool = 1 } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, ${deepRole === 'c4' ? '#FF7EC1' : '#1C3F9E'})`, 'stop-opacity': 1 }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    const a = { ...n[1] }
    if (a.class === 'wm-shadow' && !shadow) continue
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
    if (off && a.fill === `url(#wg-liquid-${NAME}-${4 + off})`) a['fill-opacity'] = pool
    body.push([n[0], a])
  }
  return { defs, body }
}
function compose(passes) {
  const sh = n => n[1].class === 'wm-shadow'
  const body = [...passes.flatMap(p => p.body.filter(sh)), ...passes.flatMap(p => p.body.filter(n => !sh(n)))]
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  return [['defs', {}, passes.flatMap(p => p.defs).filter(g => used.has(g[1].id))], ...body]
}

const EAR_L = 'M7.2 5.2C4.6 4.9 2.6 6.6 2.4 9.6C2.2 12.3 3 14.6 4.4 15.1C5.6 15.5 6.4 14.2 6.9 12.4L8.4 6.8C8.6 6 8.1 5.3 7.2 5.2Z'
const EAR_R = 'M16.8 5.2C19.4 4.9 21.4 6.6 21.6 9.6C21.8 12.3 21 14.6 19.6 15.1C18.4 15.5 17.6 14.2 17.1 12.4L15.6 6.8C15.4 6 15.9 5.3 16.8 5.2Z'
export default function render() {
  const head = pass(build(glass([oval(12, 12.8, 6.6, 7.2)])), 0, 'wm-k')
  const ears = pass(build(glass([EAR_L, EAR_R], 'A')), 6, 'wm-k', { deepRole: 'c3', pool: 0.4 })
  const snout = pass(build(glass([oval(12, 16.2, 3.4, 2.7)], 'A')), 12, 'wm-k', { deepRole: 'c4', shadow: false, pool: 0.6 })
  const face = pass(build(glass([oval(9.4, 11.4, 0.95, 1.1), oval(14.6, 11.4, 0.95, 1.1), 'M10.6 14.6H13.4C14 14.6 14.1 15.1 13.8 15.5L12.6 16.6C12.25 16.95 11.75 16.95 11.4 16.6L10.2 15.5C9.9 15.1 10 14.6 10.6 14.6Z'], 'A')), 18, 'wm-a', { deepRole: 'c3', shadow: false, pool: 0.3 })
  return compose([head, ears, snout, face])
}
