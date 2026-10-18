// forge/hand/chrome/shuffle.mjs — two crossing tracks, each a wide S that levels out into a straight shaft and a
// symmetric arrowhead on the right: the rising track is polished chrome in front, the falling track is a darker
// gunmetal rod that breaks either side of it, so the crossing reads as a deliberate over-and-under in two metals.
// The generated drawing let the inflated tubes swell across the skeleton's break into one muddy knot at 24 and 16px.
// Same model and paint as the generator (_chrome-core.mjs); only the geometry (and the gunmetal tone of the back
// track, remapped to darker role variables) is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col } from '../../styles/_chrome-core.mjs'

// the S runs from x 4 to 14, then a 3u straight shaft into the head (base at x 17)
const FC = [[4, 17.5], [7, 17.5], [11, 6.5], [14, 6.5]]
const BC = [[4, 6.5], [7, 6.5], [11, 17.5], [14, 17.5]]
const FRONT = 'M3 17.5H4C7 17.5 11 6.5 14 6.5H17.5'
const FRONT_HEAD = 'M17 3.5L21.5 6.5L17 9.5Z'
const BACK_HEAD = 'M17 14.5L21.5 17.5L17 20.5Z'
const GAP = 3.4 // centreline clearance of the back track from the front one (tube halves + ~1u of air at 24px scale)

const r = v => Math.round(v * 100) / 100
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]
const bez = (c, t) => { const a = lerp(c[0], c[1], t), b = lerp(c[1], c[2], t), d = lerp(c[2], c[3], t), e = lerp(a, b, t), f = lerp(b, d, t); return { p: lerp(e, f, t), left: [c[0], a, e, lerp(e, f, t)], right: [lerp(e, f, t), f, d, c[3]] } }
const FPTS = Array.from({ length: 201 }, (_, i) => bez(FC, i / 200).p)
const dist = p => Math.min(...FPTS.map(q => Math.hypot(p[0] - q[0], p[1] - q[1])))
// the parameters where the back curve comes within GAP of the front tube, either side of the crossing
function cut() {
  let t0 = 0.5, t1 = 0.5
  while (t0 > 0 && dist(bez(BC, t0).p) < GAP) t0 -= 0.002
  while (t1 < 1 && dist(bez(BC, t1).p) < GAP) t1 += 0.002
  return [t0, t1]
}
const cd = c => `C${c.slice(1).map(p => r(p[0]) + ' ' + r(p[1])).join(' ')}`
function backD() {
  const [t0, t1] = cut()
  const a = bez(BC, t0).left
  const b = bez(BC, t1).right
  return [`M3 6.5H4${cd(a)}`, `M${r(b[0][0])} ${r(b[0][1])}${cd(b)}H17.5`]
}

function skeleton(name) {
  const [B1, B2] = backD()
  const paths = [
    [B1, 'A'], [B2, 'A'], [BACK_HEAD, 'A'], [FRONT, 'K'], [FRONT_HEAD, 'K'],
  ].map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const fill = d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } }
  return {
    name, paths, fills: [fill(BACK_HEAD), fill(FRONT_HEAD)], cutouts: [],
    lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))),
  }
}

// the back track in gunmetal: its pieces drop one step down the role ladder (tint -> c1 -> c2 -> c3), so the
// whole rod, bevel included, reads darker than the chrome in front
const DOWN = { edge: 'c1', shine: 'c1', tint: 'c2', c1: 'c2', c2: 'c3', c4: 'c2' }
const down = v => { const m = /^var\(--with-chrome-(\w+),/.exec(v || ''); return m && DOWN[m[1]] ? col(DOWN[m[1]]) : v }

export default function render(icon) {
  const name = (icon && icon.name) || 'shuffle'
  const Ls = layers(model(skeleton(name)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  const defs = out[0][0] === 'defs' ? out[0][2] : []
  const byId = new Map(defs.map(g => [g[1].id, g]))
  const dark = new Map()
  for (const n of out) {
    if (n[0] !== 'path' || n[1].class !== 'wm-a') continue
    const m = /^url\(#(.+)\)$/.exec(n[1].fill)
    if (!m) { n[1].fill = down(n[1].fill); continue }
    if (!dark.has(m[1])) {
      const g = byId.get(m[1]), id = `wg-chrome-${name}-${defs.length}`
      defs.push([g[0], { ...g[1], id }, g[2].map(s => [s[0], { ...s[1], 'stop-color': down(s[1]['stop-color']) }])])
      dark.set(m[1], id)
    }
    n[1].fill = `url(#${dark.get(m[1])})`
  }
  // drop gradients nothing uses any more
  const used = new Set(out.filter(n => n[0] === 'path').map(n => (/^url\(#(.+)\)$/.exec(n[1].fill) || [])[1]))
  if (defs.length) out[0][2] = defs.filter(g => used.has(g[1].id))
  return out
}
