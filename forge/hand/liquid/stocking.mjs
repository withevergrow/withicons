// forge/hand/liquid/stocking.mjs: L-shaped glass stocking: cuff band, leg and foot with tinted heel and toe.
const NAME = 'stocking'
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

const SOCK = ['M6.8 6H15.2V13.2C15.2 14.8 16.2 15.4 17.8 15.6C20.2 15.9 21.4 17.4 21.4 19.2C21.4 21 20 22 18.2 22H11.2C8.4 22 6.8 20 6.8 17.2Z']
const PATCH = ['M6.8 16.4C6.8 19.8 8.4 22 11.2 22C10.8 19.8 9.6 17.4 6.8 16.4Z', 'M18.2 22C20 22 21.4 21 21.4 19.2C21.4 17.6 20.4 16.2 18.6 15.8C17.8 17.8 17.8 19.8 18.2 22Z']
const CUFF = [rrect(5.4, 2, 11.2, 4.4, 1.6)]
export default function render() {
  const sock = pass(build(glass(SOCK)), 0, 'wm-k')
  const patch = pass(build(glass(PATCH, 'A')), 6, 'wm-k', { deepRole: 'c4', shadow: false, pool: 0.3 })
  const cuff = pass(build(glass(CUFF, 'A')), 12, 'wm-a', { deepRole: 'c2', pool: 0.6 })
  return compose([sock, patch, cuff])
}
