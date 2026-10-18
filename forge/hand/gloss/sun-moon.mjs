// forge/hand/gloss/sun-moon.mjs — a glossy disc split by a wide curved gap into a sun lens (left, with five ray pills
// standing clear of it) and a dominant fat crescent moon (right), each lit by its own tapered shine bean. The generated
// drawing inflated the outline, the inner arc and the half fill into one solid ball, so the crescent vanished.
// Same inflated vinyl recipe as the generator (forge/styles/gloss.mjs models the rays and the two masses); the
// generator's own highlights inside the disc are replaced by the family's rim beans.
import { parsePath, circle } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets, intersectSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

// fills may be path data or ready region sets ({ set })
function prep(name, paths, fills = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(f => {
    if (typeof f !== 'string') return { d: '', subs: f.set.map(r => ({ pts: r, closed: true })), set: f.set }
    const subs = parsePath(f); return { d: f, subs, set: setOf(subs.map(s => s.pts)) }
  })
  return {
    name, paths: P, fills: F, cutouts: [],
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const f2 = v => Math.round(v * 100) / 100
const CX = 14, CY = 12, RD = 6.1                 // the disc
// the terminator: an arc of a smaller circle bulging to x = 14.5, opened into a 1.3u gap, so the crescent is about
// 4.95u at its waist (the lens about 5.95u) and the split survives at 16px
const TX = 9, TR = 5.5, GAP = 0.65
const RAY_A = [125, 152.5, 180, 207.5, 235]
const RAY_SEG = RAY_A.map(a => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); return [CX + c * 8.85, CY + s * 8.85, CX + c * 10.1, CY + s * 10.1] })
const nearRay = (x, y) => RAY_SEG.some(([ax, ay, bx, by]) => { const ex = bx - ax, ey = by - ay, t = Math.max(0, Math.min(1, ((x - ax) * ex + (y - ay) * ey) / (ex * ex + ey * ey))); return Math.hypot(x - ax - ex * t, y - ay - ey * t) < 0.95 })
const RAYS = RAY_A.map(a => {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  return `M${f2(CX + c * 8.85)} ${f2(CY + s * 8.85)} L${f2(CX + c * 10.1)} ${f2(CY + s * 10.1)}`
}).join(' ')

// a tapered shine bean hugging the disc rim r from the centre, from angle a0 to a1 (degrees), half-width up to w
function bean(r, a0, a1, w1, w0 = 0.12) {
  const n = 24, out = [], back = []
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = (a0 + (a1 - a0) * u) * Math.PI / 180
    const w = w0 + (w1 - w0) * Math.pow(Math.sin(Math.PI * u), 0.45)
    out.push([CX + Math.cos(a) * (r + w), CY + Math.sin(a) * (r + w)])
    back.push([CX + Math.cos(a) * (r - w), CY + Math.sin(a) * (r - w)])
  }
  return 'M' + [...out, ...back.reverse()].map(p => `${f2(p[0])} ${f2(p[1])}`).join('L') + 'Z'
}
function dot(a, r, dr) {
  const t = a * Math.PI / 180, x = CX + Math.cos(t) * r, y = CY + Math.sin(t) * r
  return `M${f2(x + dr)} ${f2(y)}A${dr} ${dr} 0 1 0 ${f2(x - dr)} ${f2(y)}A${dr} ${dr} 0 1 0 ${f2(x + dr)} ${f2(y)}Z`
}
// sun lens: the family's disc bean on its upper-left rim (1.8u in) with the glint dot past its lower tip;
// crescent: its own bean along the upper-right rim, 1.8u in, no dot
const SHINE = bean(4.3, 199, 234, 0.5) + dot(189, 4.3, 0.3) + bean(4.3, 286, 330, 0.48)
const inDisc = (x, y) => Math.hypot(x - CX, y - CY) < RD - 0.2

export default function render(icon) {
  const disc = setOf([circle(CX, CY, RD, 0.1)])
  const lens = intersectSets(disc, setOf([circle(TX, CY, TR - GAP, 0.1)]))
  const moon = differenceSets(disc, setOf([circle(TX, CY, TR + GAP, 0.1)]))
  const sk = prep((icon && icon.name) || 'sun-moon', [{ d: RAYS, plate: 'A' }], [{ set: lens }, { set: moon }])
  const out = []
  for (const [t, a] of gloss.render(sk)) {
    if (a.class === 'wm-a') { out.push([t, a]); continue }
    // drop the generated highlight holes inside the disc (their subpaths start inside it), carve the two beans
    const subs = String(a.d).split(/(?=M)/).filter(s => {
      const m = /^M\s*(-?[\d.]+)[\s,]+(-?[\d.]+)/.exec(s)
      if (!m) return true
      const x = +m[1], y = +m[2]
      // keep the outlines (their first point lies on the rim or the gap edge), drop holes well inside a mass
      const inLens = Math.hypot(x - CX, y - CY) < RD - 0.3 && Math.hypot(x - TX, y - CY) < TR - GAP - 0.3
      const inMoon = Math.hypot(x - CX, y - CY) < RD - 0.3 && Math.hypot(x - TX, y - CY) > TR + GAP + 0.3
      // and the generated glints on the ray pills (the sun lens and the crescent carry the only light)
      return !nearRay(x, y) && (!(inLens || inMoon) || !inDisc(x, y))
    })
    out.push([t, { ...a, d: subs.join('') + SHINE, 'fill-rule': 'evenodd', class: 'wm-k' }])
  }
  return out
}
