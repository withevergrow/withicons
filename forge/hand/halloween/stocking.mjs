// forge/hand/halloween/stocking.mjs — a clear L-shaped stocking: pumpkin leg and rounded foot pointing right, slime heel
// and toe patches, and a wide witch-purple cuff band on top, in the midnight outline on the warm halo. Replaces the
// generated muddle (curled toe merging into cuff and heel, a bat on the silhouette).
import { unionSets, differenceSets, intersectSets, translateSet, erode, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
import { area, setD, parsePath, circle } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

// --- the style's layer recipe (_halloween-core.mjs), drawn from hand-made region sets ---------------------------
const MAT = {
  pumpkin: { stops: [C.c1, C.c1, C.c2], shine: 0.55 },
  witch: { stops: [C.c3, C.c3, C.edge], shine: 0.45 },
  slime: { stops: [C.c4, C.c4, C.c4], shine: 0.5 },
  gold: { stops: [C.tint, C.accent, C.accent], shine: 0.6 },
  gem: { stops: [C.c1, C.c2, C.c2], shine: 0.6 },
  cream: { stops: [C.tint, C.tint, C.accent], shine: 0.5 },
}
const f2 = v => Math.round(v * 100) / 100
const bboxOf = set => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const r of set) for (const [x, y] of r) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  return [x0, y0, x1, y1]
}
const crescent = set => {
  const inner = erode(set, 0.62)
  return differenceSets(inner, translateSet(inner, 0.5, 0.62)).filter(r => Math.abs(area(r)) > 0.12)
}
const P = d => normalize(parsePath(d, 0.15)[0].pts)
const disc = (x, y, r) => normalize(circle(x, y, r, 0.15))
// bodies: [{ set, mat, cls, sw, noshine }] back to front
function paint(name, bodies) {
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const all = unionSets(bodies.map(b => b.set))
  const [x0, y0, x1, y1] = bboxOf(all)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const defs = [['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]]
  const gi = {}
  for (const m of new Set(bodies.map(b => b.mat))) {
    gi[m] = defs.length
    const s = MAT[m].stops
    defs.push(['radialGradient', { id: id(defs.length), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
      [st(0, s[0]), st(0.45, s[1]), st(1, s[2])]])
  }
  const out = [['defs', {}, defs]]
  out.push(['path', { d: 'M0 0H24V24H0Z', fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: setD(translateSet(all, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  for (const b of bodies) {
    out.push(['path', { d: setD(b.set), fill: url(gi[b.mat]), 'fill-rule': 'evenodd', stroke: C.ink, 'stroke-width': b.sw || 0.72, 'stroke-linejoin': 'round', class: b.cls || 'wm-k' }])
    if (!b.noshine) {
      const sh = crescent(b.set)
      if (sh.length) out.push(['path', { d: setD(sh), fill: C.shine, 'fill-opacity': MAT[b.mat].shine, class: 'wm-shine' }])
    }
  }
  return out
}
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'stocking'
  const sock = P('M6.5 6.5H14.5V12.5C14.5 14 15.2 14.7 16.6 15.2L19 16.1C20.4 16.6 21 17.7 21 18.9C21 20.2 20 21 18.8 21H9.6C7.8 21 6.5 19.7 6.5 18Z')
  const heel = intersectSets(sock, disc(8.3, 19.2, 3.4))
  const toe = intersectSets(sock, disc(20, 19, 3.4))
  const cuff = P(rr(5, 2.8, 16, 7.8, 1.4))
  return paint(name, [
    { set: sock, mat: 'pumpkin' },
    { set: heel, mat: 'slime', sw: 0.6, noshine: true },
    { set: toe, mat: 'slime', sw: 0.6, noshine: true },
    { set: cuff, mat: 'witch', cls: 'wm-a' },
  ])
}
