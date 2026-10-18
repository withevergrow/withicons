// forge/hand/liquid/folder-search.mjs: glass folder with a contrasting lens ring and a clear diagonal handle.
const NAME = 'folder-search'
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
const glass = (fills, plate, cuts = []) => ({ name: NAME, paths: [], lines: plate ? [OFF(plate)] : [], fills: fills.map(fill), cutouts: cuts.map(fill) })

function pass(nodes, off, cls, { deepRole, shadow = true, pool = 1 } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
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

const FOLDER = ['M2.4 7.2C2.4 5.9 3.3 5 4.6 5H9L11 7H19.4C20.7 7 21.6 7.9 21.6 9.2V17.6C21.6 18.9 20.7 19.8 19.4 19.8H4.6C3.3 19.8 2.4 18.9 2.4 17.6Z']
const LENS = [oval(11, 12.6, 3.6)]
const LENSHOLE = [oval(11, 12.6, 2.1)]
const HANDLE = [bar(13.6, 15.2, 16.8, 18.4, 1.1)]
export default function render() {
  const body = pass(build(glass(FOLDER)), 0, 'wm-k')
  const lens = pass(build(glass([...LENS, ...HANDLE], 'A', LENSHOLE)), 6, 'wm-a', { deepRole: 'c4', shadow: false, pool: 0.3 })
  return compose([body, lens])
}
