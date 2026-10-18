// forge/hand/liquid/turtle.mjs: side-profile glass turtle: domed shell with three plates, head with eye, two short legs.
const NAME = 'turtle'
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const fill = d => ({ subs: parsePath(d) })
const OFF = plate => ({ pts: [[-8, -8], [-7, -8]], closed: false, plate })
function bar(x1, y1, x2, y2, r) {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * r, ny = (x2 - x1) / L * r
  const P = (x, y) => `${r2(x)} ${r2(y)}`
  return `M${P(x1 + nx, y1 + ny)}L${P(x2 + nx, y2 + ny)}A${r} ${r} 0 0 0 ${P(x2 - nx, y2 - ny)}L${P(x1 - nx, y1 - ny)}A${r} ${r} 0 0 0 ${P(x1 + nx, y1 + ny)}Z`
}
const oval = (cx, cy, rx, ry = rx) => `M${r2(cx + rx)} ${r2(cy)}A${rx} ${ry} 0 1 1 ${r2(cx - rx)} ${r2(cy)}A${rx} ${ry} 0 1 1 ${r2(cx + rx)} ${r2(cy)}Z`
const rrect = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const glass = (fills, plate) => ({ name: NAME, paths: [], lines: plate ? [OFF(plate)] : [], fills: fills.map(fill), cutouts: [] })

function pass(nodes, off, cls, { deepRole, shadow = true, pool = 1 } = {}) {
  const re = new RegExp('wg-liquid-' + NAME + '-([0-9]+)', 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)` }])
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

const poly = pts => 'M' + pts.map(p => r2(p[0]) + ' ' + r2(p[1])).join('L') + 'Z'
function ring(cx, cy, n, f, rev) { const pts = []; for (let i = 0; i < 96; i++) { const t = i / 96 * Math.PI * 2; const r = f(t); pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]) } return poly(rev ? pts.reverse() : pts) }

const LIMBS = [rrect(4.4, 14, 3.2, 6, 1.5), rrect(13.4, 14, 3.2, 6, 1.5), bar(17, 15, 19.6, 12.4, 1.5), oval(20.2, 11.4, 2.6, 2.3), 'M2.8 14.4L0.9 16.6L3.6 16.6Z']
const SHELL = ['M2.4 15.4C2.4 9.6 6.2 5.6 11 5.6C15.8 5.6 19.4 9.6 19.4 15.4C19.4 16.4 18.8 16.8 18 16.8H3.8C3 16.8 2.4 16.4 2.4 15.4Z']
const PLATES = [oval(11, 10.6, 2.4, 2.1), oval(6.4, 13.2, 1.6, 1.5), oval(15.6, 13.2, 1.6, 1.5)]
export default function render() {
  const limbs = pass(build(glass(LIMBS)), 0, 'wm-k')
  const shell = pass(build(glass(SHELL, 'A')), 6, 'wm-k', { pool: 0.6 })
  const plates = pass(build(glass(PLATES, 'A')), 12, 'wm-k', { deepRole: 'c3', shadow: false, pool: 0.3 })
  const eye = pass(build(glass([oval(21, 10.8, 0.7)], 'A')), 18, 'wm-a', { deepRole: 'c3', shadow: false, pool: 0.3 })
  return compose([limbs, shell, plates, eye])
}
