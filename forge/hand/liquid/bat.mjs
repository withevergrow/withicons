// forge/hand/liquid/bat.mjs — a bat in liquid glass: two clear wings spread wide with a swept leading edge and three
// sharp points separated by deep scallops, a gap, then a violet head and body with two tall pointed ears and two deep
// glass eyes. The wings, the body and the eyes are drawn as exact shapes (fills only, no outline stroke) so the
// scallops and ears keep their points; the body sits clear of the wings so the silhouette reads as a bat at 16px.
// Three passes of the style pipeline (_liquid-core build: wings, body, eyes), gradient ids renumbered.
// Motion: wings wm-k, body and eyes wm-a (the spec has only the float loop and a hover jelly).
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'bat'
const r2 = v => Math.round(v * 100) / 100
const mirror = d => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (_, x, y) => `${r2(24 - x)} ${y}`)
const oval = (cx, cy, rx, ry) => `M${r2(cx + rx)} ${cy}A${rx} ${ry} 0 1 1 ${r2(cx - rx)} ${cy}A${rx} ${ry} 0 1 1 ${r2(cx + rx)} ${cy}Z`

// left wing: shoulder, a swept leading edge up to the tip, the outer edge down to the first point, then two deep scallops
const WING_L = 'M9 10.2C7.2 7.2 4.4 5.2 1 4.4C.8 7.4 1 10.6 1.8 13.4C2.4 11.4 3.6 10.9 3.9 10.9C4.8 11.4 5.6 13 5.7 15.6C6 13.4 7 12.4 7.4 12.4C8.2 12.7 8.7 13.6 8.9 14.6Z'
const WING_R = mirror(WING_L)
// head and body, ears first: two tall pointed ears, a broad head, a plump body tapering to a point
const BODY = 'M8.5 2.4C9.8 3.4 10.9 4.6 11.5 6C11.8 6.3 12.2 6.3 12.5 6C13.1 4.6 14.2 3.4 15.5 2.4C15.9 4.8 15.8 6.8 15.2 8.3C14.7 9.4 14.1 10 13.8 10.6C14.4 11.6 14.4 13 14 14.4C13.5 16 12.8 17.6 12 18.4C11.2 17.6 10.5 16 10 14.4C9.6 13 9.6 11.6 10.2 10.6C9.9 10 9.3 9.4 8.8 8.3C8.2 6.8 8.1 4.8 8.5 2.4Z'

// a skeleton of fills only; `plate` is the plate the pass's fills vote for (an off-canvas anchor line votes A, none votes K)
function sk(ds, plate) {
  const fills = ds.map(d => ({ subs: parsePath(d) }))
  return { name: NAME, paths: [], cutouts: [], fills,
    lines: plate === 'A' ? [{ pts: [[-8, -8], [-7, -8]], closed: false, plate: 'A' }] : [] }
}

function pass(nodes, off, { deepRole, cls, pool, keepShadow = true } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)`, ...(s[1]['stop-opacity'] != null ? { 'stop-opacity': r2(0.78 + 0.22 * +s[1].offset) } : {}) }])
        else if (k === 1) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.5, 0.95][i] }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    if (!keepShadow && n[1].class === 'wm-shadow') continue
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (cls && a.class !== 'wm-shadow') a.class = cls
    if (pool != null && a.fill === `url(#wg-liquid-${NAME}-${4 + off})`) a['fill-opacity'] = pool
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
  const wings = pass(build(sk([WING_L, WING_R], 'K')), 0, { cls: 'wm-k' })
  const head = pass(build(sk([BODY], 'A')), 6, { cls: 'wm-a' })
  const eyes = pass(build(sk([oval(10.5, 8.7, 0.95, 1.3), oval(13.5, 8.7, 0.95, 1.3)], 'A')), 12, { deepRole: 'c3', pool: 0.3, cls: 'wm-a', keepShadow: false })
  return compose([wings, head, eyes])
}
