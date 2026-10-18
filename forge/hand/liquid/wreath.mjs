// forge/hand/liquid/wreath.mjs: glass wreath: scalloped leafy ring with an open centre, three berries and a bow at the bottom.
const NAME = 'wreath'
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

const RING = [ring(12, 10.6, 0, t => 8.6 + 0.6 * Math.cos(t * 12)) + ring(12, 10.6, 0, t => 4.3 + 0.3 * Math.cos(t * 12 + Math.PI), true)]
const BERRIES = [oval(6.4, 6.4, 1.1), oval(17.6, 6.4, 1.1), oval(12, 2.9, 1.1), oval(19.4, 12.6, 1), oval(4.6, 12.6, 1)]
const BOW = ['M12 19.6L8.2 17.4C7 16.8 6.2 17.6 6.2 18.8V20.4C6.2 21.6 7 22.4 8.2 21.8Z', 'M12 19.6L15.8 17.4C17 16.8 17.8 17.6 17.8 18.8V20.4C17.8 21.6 17 22.4 15.8 21.8Z', oval(12, 19.6, 1.5, 1.4)]
export default function render() {
  const wreath = pass(build(glass(RING)), 0, 'wm-k')
  const berries = pass(build(glass(BERRIES, 'A')), 6, 'wm-deco', { deepRole: 'c4', shadow: false, pool: 0.3 })
  const bow = pass(build(glass(BOW, 'A')), 12, 'wm-a', { deepRole: 'c4', pool: 0.4 })
  return compose([wreath, berries, bow])
}
