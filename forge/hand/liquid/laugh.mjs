// forge/hand/liquid/laugh.mjs: a glossy blue liquid-glass sphere (the style's own optics, a stronger tint) with the
// laugh set on it in deep navy glass: two crisp arched "^ ^" eyes and one wide open D-shaped grin, so the face stays
// high-contrast at 16px. The generated eyes and grin were pale translucent violet blobs that muddied the blue.
// Two passes of the style pipeline: the sphere, then the features laid over it. Motion: sphere wm-k, features wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const NAME = 'laugh'
const lines = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))
const rings = d => parsePath(d).map(s => s.pts)

const RING = 'M21.5 12A9.5 9.5 0 1 1 2.5 12A9.5 9.5 0 1 1 21.5 12Z'
const EYES = ['M6.9 10.1Q8.4 6.6 9.9 10.1', 'M14.1 10.1Q15.6 6.6 17.1 10.1']
const GRIN = 'M8.9 13.7H15.1A3.1 3.1 0 0 1 8.9 13.7Z'

const FACE = { name: NAME, paths: [], cutouts: [], lines: lines(RING, 'K'), fills: [{ set: rings(RING) }] }
const FEATURES = {
  name: NAME, paths: [], cutouts: [],
  lines: [...EYES.flatMap(d => lines(d, 'A')), ...lines(GRIN, 'A')],
  fills: [{ set: rings(GRIN) }],
}

// a second pass is renumbered (gradient ids) and retagged; `deep` makes the coloured glass a step denser
function pass(nodes, off, { cls, deep = false, tint, keepShadow = true, deepRole } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = [], body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)`, ...(s[1]['stop-opacity'] != null ? { 'stop-opacity': r2(0.8 + 0.2 * +s[1].offset) } : {}) }])
        else if (k === 0 && tint) stops = stops.map((s, i) => ["stop", { ...s[1], "stop-opacity": tint[i] }])
        else if (k === 1 && deep) stops = stops.map((s, i) => ['stop', { ...s[1], 'stop-opacity': [0.55, 0.97][i] }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    if (!keepShadow && n[1].class === 'wm-shadow') continue
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (cls && a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
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
  const face = pass(build(FACE), 0, { cls: 'wm-k', tint: [0.2, 0.44, 0.7] })
  for (const n of face.body) if (n[1]['stroke-opacity'] === 0.3) n[1]['stroke-opacity'] = 0.42
  const feat = pass(build(FEATURES), 6, { cls: 'wm-a', deepRole: 'c3', keepShadow: false })
  return compose([face, feat])
}
