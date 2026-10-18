// forge/hand/gloss/cloud-sun.mjs — a glossy cloud in front of a round sun lens with five slim tapered rays.
// The generated drawing inflated each short ray into a 2.7u pill with its own bean and glint, so the rays read as
// paw-print toes; here the rays are crisp wedges (fills, no tube, too small for a bean) fanned evenly round the disc,
// and a parting groove keeps the sun clear of the cloud.
// Same inflated vinyl recipe as the generator (forge/styles/gloss.mjs models and lights it); only the skeleton is redrawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets, differenceSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, paths, fills = [], cutouts = []) {
  const P = paths.map((p, i) => ({ id: `p${i}`, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return {
    name, paths: P, fills: F, cutouts: C,
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}

const f2 = v => Math.round(v * 100) / 100
const ringD = r => 'M' + r.map(q => f2(q[0]) + ' ' + f2(q[1])).join('L') + 'Z'
const arc = (cx, cy, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] })

const CLOUD = 'M11.06 20.5 A3.24 3.24 0 0 1 10.48 14.09 A4.46 4.46 0 0 1 19.05 14.45 A3.06 3.06 0 0 1 18.44 20.5 Z'
// the sun: a disc behind the cloud, minus the cloud's two upper-left lobes grown past the tube (1.35u) by a 0.9u
// parting gap, so it reads as peeking out from behind while staying its own glossy part
const SX = 9.25, SY = 9.25, SR = 4.1
const SUN = differenceSets(setOf([arc(SX, SY, SR, 0, 360, 72).slice(0, -1)]),
  setOf([arc(11.14, 17.26, 3.24 + 2.25, 0, 360, 72).slice(0, -1), arc(14.71, 15.49, 4.46 + 2.25, 0, 360, 72).slice(0, -1)]))
// five rays fanned evenly round the upper-left of the disc: tapered capsules, 2.3u at the root to 0.9u at the tip
const R0 = 6.4, R1 = 8.75, W0 = 1.15, W1 = 0.45
const RAYS = [-90, -45, -135, 180, 135].map(a => {
  const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
  return ringD([...arc(SX + c * R0, SY + s * R0, W0, a + 90, a + 270, 12), ...arc(SX + c * R1, SY + s * R1, W1, a - 90, a + 90, 8)])
})
const inSun = (x, y) => Math.hypot(x - SX, y - SY) < SR + 0.6
const inRays = (x, y) => !inSun(x, y) && Math.hypot(x - SX, y - SY) < R1 + 1

const subsOf = sk => gloss.render(sk).flatMap(([, a]) => String(a.d).split(/(?=M)/))
const box = p => {
  const pts = parsePath(p).flatMap(s => s.pts)
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1])
  return { x: xs[0], y: ys[0], span: Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) }
}

// the family's disc bean (as forge/hand/gloss/sun-moon.mjs): a tapered crescent hugging the upper-left rim, 1.5u in,
// with its glint dot past the lower tip
function bean() {
  const n = 24, a0 = 196, a1 = 262, r = SR - 1.45, out = [], back = []
  for (let i = 0; i <= n; i++) {
    const u = i / n, a = (a0 + (a1 - a0) * u) * Math.PI / 180
    const w = 0.12 + (0.48 - 0.12) * Math.pow(Math.sin(Math.PI * u), 0.45)
    out.push([SX + Math.cos(a) * (r + w), SY + Math.sin(a) * (r + w)])
    back.push([SX + Math.cos(a) * (r - w), SY + Math.sin(a) * (r - w)])
  }
  const a = 183 * Math.PI / 180, dx = SX + Math.cos(a) * r, dy = SY + Math.sin(a) * r + 0.35, dr = 0.3
  return ringD([...out, ...back.reverse()]) +
    `M${f2(dx + dr)} ${f2(dy)}A${dr} ${dr} 0 1 0 ${f2(dx - dr)} ${f2(dy)}A${dr} ${dr} 0 1 0 ${f2(dx + dr)} ${f2(dy)}Z`
}

export default function render(icon) {
  const name = (icon && icon.name) || 'cloud-sun'
  const cloud = subsOf(prep(name, [{ d: CLOUD, plate: 'K' }], [CLOUD]))
  // the rays are fills too small for a bean: drop every highlight the field leaves in them; the sun's own highlights
  // (a bean squeezed by the bite and a rim streak along the bite) are replaced by the family's disc bean
  const sun = subsOf(prep(name, [], [SUN.map(ringD).join(''), ...RAYS])).filter(p => {
    const b = box(p)
    return !((inRays(b.x, b.y) && b.span < 2.4) || (inSun(b.x, b.y) && b.span < 6))
  })
  sun.push(bean())
  return [
    ['path', { d: cloud.join(''), 'fill-rule': 'evenodd', class: 'wm-k' }],
    ['path', { d: sun.join(''), 'fill-rule': 'evenodd', class: 'wm-a' }],
  ]
}
