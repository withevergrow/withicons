// forge/hand/liquid/avatar-cat.mjs — a liquid-glass cat face, hand-drawn. The first hand drawing was a small face on a
// heavy shoulder slab with stubby ears; here the face fills the grid, the ears are two clear pointed triangles with a
// violet inner ear, the eyes are tall deep (c3) glass beads, the nose a soft violet drop and four slim whiskers cross
// the cheeks and break the outline, so it reads as a cat at 16px. No slab. Three passes of the style pipeline
// (_liquid-core build: face, eyes, features), each region an exact fill, gradient ids renumbered, unused ones dropped.
// Motion: the eyes are wm-a (parts.A blinks them round 12 12.5); face, whiskers, ears and nose move with the body.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

const NAME = 'avatar-cat'
const fill = d => ({ subs: parsePath(d) })
// an anchor off the canvas: it paints nothing and makes every fill of its pass vote for its plate
const OFF = plate => ({ pts: [[-8, -8], [-7, -8]], closed: false, plate })
const r2 = v => Math.round(v * 100) / 100
// a round-ended bar from (x1, y1) to (x2, y2), half-width r
function bar(x1, y1, x2, y2, r) {
  const L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * r, ny = (x2 - x1) / L * r
  const P = (x, y) => `${r2(x)} ${r2(y)}`
  return `M${P(x1 + nx, y1 + ny)}L${P(x2 + nx, y2 + ny)}A${r} ${r} 0 0 0 ${P(x2 - nx, y2 - ny)}L${P(x1 - nx, y1 - ny)}A${r} ${r} 0 0 0 ${P(x1 + nx, y1 + ny)}Z`
}
const oval = (cx, cy, rx, ry) => `M${cx + rx} ${cy}A${rx} ${ry} 0 1 1 ${cx - rx} ${cy}A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}Z`

// the head: wide cheeks, two pointed ears leaning out
const FACE = 'M12 21 C7 21 3.6 18.2 3.6 13.9 C3.6 12.3 4 11 4.6 9.9 L4.4 3.9 C4.4 3.3 5 3 5.5 3.4 L9.8 6.5 C10.5 6.3 11.2 6.2 12 6.2 C12.8 6.2 13.5 6.3 14.2 6.5 L18.5 3.4 C19 3 19.6 3.3 19.6 3.9 L19.4 9.9 C20 11 20.4 12.3 20.4 13.9 C20.4 18.2 17 21 12 21 Z'
const EAR_L = 'M6.1 5.9 C6.1 5.5 6.4 5.4 6.7 5.6 L8.4 6.9 C8.7 7.1 8.6 7.4 8.4 7.6 L6.9 8.7 C6.5 9 6.1 8.8 6.1 8.4 Z'
const EAR_R = 'M17.9 5.9 C17.9 5.5 17.6 5.4 17.3 5.6 L15.6 6.9 C15.3 7.1 15.4 7.4 15.6 7.6 L17.1 8.7 C17.5 9 17.9 8.8 17.9 8.4 Z'
const NOSE = 'M10.9 15.1 H13.1 C13.5 15.1 13.7 15.5 13.4 15.8 L12.4 16.9 C12.2 17.1 11.8 17.1 11.6 16.9 L10.6 15.8 C10.3 15.5 10.5 15.1 10.9 15.1 Z'
const WHISKERS = [bar(2.3, 14.4, 6.6, 15.4, 0.75), bar(2.5, 18, 6.8, 17, 0.75), bar(21.7, 14.4, 17.4, 15.4, 0.75), bar(21.5, 18, 17.2, 17, 0.75)]

const FACE_GLASS = { name: NAME, paths: [], lines: [], fills: [fill(FACE)], cutouts: [] }
const EYES = { name: NAME, paths: [], lines: [OFF('A')], fills: [fill(oval(8.7, 12.4, 1.15, 1.5)), fill(oval(15.3, 12.4, 1.15, 1.5))], cutouts: [] }
const FEATURES = { name: NAME, paths: [], lines: [OFF('A')], fills: [fill(EAR_L), fill(EAR_R), fill(NOSE), ...WHISKERS.map(fill)], cutouts: [] }

// a deeper clear face (it washed out on white) and firmer coloured glass
const STOPS = { 0: [0.4, 0.64, 0.88], 1: [0.78, 1] }
function pass(nodes, off, cls, { pool = 1, deepRole } = {}) {
  const re = new RegExp(`wg-liquid-${NAME}-([0-9]+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = []
  const body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        let stops = STOPS[k] ? g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': STOPS[k][i] }]) : g[2]
        if (k === 1 && deepRole) stops = stops.map(s => ['stop', { ...s[1], 'stop-color': `var(--with-liquid-${deepRole}, #1C3F9E)` }])
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (a.stroke === 'currentColor' && a['stroke-opacity'] === 0.3) { a['stroke-opacity'] = 0.5; a['stroke-width'] = 0.28 }
    if (a.class !== 'wm-shadow' && !(a.class === 'wm-shine' && off === 0)) a.class = cls
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
  const face = pass(build(FACE_GLASS), 0, 'wm-k')
  const feat = pass(build(FEATURES), 12, 'wm-k', { pool: 0.45 })
  const eyes = pass(build(EYES), 6, 'wm-a', { pool: 0.3, deepRole: 'c3' })
  // the eyes sit inside the face: they cast no ground shadow of their own
  eyes.body = eyes.body.filter(n => n[1].class !== 'wm-shadow')
  return compose([face, feat, eyes])
}
