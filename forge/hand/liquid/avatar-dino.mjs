// forge/hand/liquid/avatar-dino.mjs: a friendly dino head in profile facing right with a row of pink back spikes, a big deep eye, nostril and a smiling mouth.
const NAME = 'avatar-dino'
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

const HEAD = 'M5 21V12.5C5 7.4 8.4 4.2 12.6 4.2C15.6 4.2 17.6 5.6 18.6 7.6C20.6 7.8 21.6 9.2 21.6 11C21.6 13.4 20 14.8 17.6 14.8H14.6C13.4 14.8 12.8 15.5 12.8 16.6V21Z'
const SPIKES = ['M6.1 8.9L3.2 7.8L5.4 6.2Z', 'M7.6 5.9L5.9 3.4L8.8 3.8Z', 'M10.6 4.3L10.4 1.6L12.9 3.1Z', 'M14.6 4.3L15.9 2L17 4.9Z']
const MOUTH = 'M14.4 12.2C15.6 12.95 17.4 13.05 19.4 12.4C19.85 12.25 20.05 12.75 19.65 13.05C17.9 14.2 15.6 14.1 14.1 12.9C13.75 12.6 14 12 14.4 12.2Z'
export default function render() {
  const spikes = pass(build(glass(SPIKES, 'A')), 0, 'wm-deco', { deepRole: 'c4', pool: 0.5 })
  const head = pass(build(glass([HEAD])), 6, 'wm-k')
  const face = pass(build(glass([oval(12.6, 8.8, 1.4, 1.55), oval(19.4, 9.6, 0.5, 0.55), MOUTH], 'A')), 12, 'wm-a', { deepRole: 'c3', shadow: false, pool: 0.3 })
  return compose([spikes, head, face])
}
