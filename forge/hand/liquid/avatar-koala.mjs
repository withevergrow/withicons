// forge/hand/liquid/avatar-koala.mjs: big round ears with pink inner glass, round head, a large dark oval nose and two small deep eyes.
const NAME = 'avatar-koala'
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

export default function render() {
  const ears = pass(build(glass([oval(5.2, 7.4, 4.2), oval(18.8, 7.4, 4.2)])), 0, 'wm-k')
  const inner = pass(build(glass([oval(5, 7.4, 2.3), oval(19, 7.4, 2.3)], 'A')), 6, 'wm-k', { deepRole: 'c4', shadow: false, pool: 1 })
  const head = pass(build(glass([oval(12, 13.4, 7.2, 7)])), 12, 'wm-k')
  const face = pass(build(glass([oval(8.7, 11.4, 1.3, 1.5), oval(15.3, 11.4, 1.3, 1.5), 'M12 11.9C13.7 11.9 14.1 13.4 14.1 14.7C14.1 16.3 13.1 17.2 12 17.2C10.9 17.2 9.9 16.3 9.9 14.7C9.9 13.4 10.3 11.9 12 11.9Z'], 'A')), 18, 'wm-a', { deepRole: 'c3', shadow: false, pool: 1 })
  const ink = { fill: 'var(--with-liquid-c3, #1C3F9E)', class: 'wm-a' }
  return [...compose([ears, inner, head]),
    ['ellipse', { cx: 8.7, cy: 11.4, rx: 1.2, ry: 1.4, ...ink }], ['ellipse', { cx: 15.3, cy: 11.4, rx: 1.2, ry: 1.4, ...ink }],
    ['ellipse', { cx: 12, cy: 14.6, rx: 2.2, ry: 2.7, ...ink }], ['ellipse', { cx: 11.3, cy: 13.5, rx: 0.6, ry: 0.8, fill: 'var(--with-liquid-shine, #FFFFFF)', 'fill-opacity': 0.55, class: 'wm-shine' }]]
}
