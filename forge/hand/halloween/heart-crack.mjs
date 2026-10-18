// forge/hand/halloween/heart-crack.mjs — a witch-purple heart split clean in two by a jagged crack, with the candle light
// glowing orange through the break, in the midnight outline on the warm halo. The generated heart was bone-white on the
// cream halo (nearly invisible on white) with a hairline crack; purple halves round a lit zigzag read as heartbreak at 16px.
import { unionSets, differenceSets, translateSet, erode, strokeSet, normalize } from '../../kernel/bool.mjs'
import { area, setD, parsePath, circle } from '../../kernel/geom.mjs'
import { C } from '../../styles/_halloween-palettes.mjs'

// --- the style's layer recipe (_halloween-core.mjs), drawn from hand-made region sets ---------------------------
const MAT = {
  pumpkin: { stops: [C.c1, C.c1, C.c2], line: C.ink, shine: 0.55 },
  witch: { stops: [C.c3, C.c3, C.edge], line: C.ink, shine: 0.45 },
  midnight: { stops: [C.shadow, C.shadow, C.ink], line: C.edge, shine: 0.22 },
  slime: { stops: [C.c4, C.c4, C.c4], line: C.ink, shine: 0.5 },
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
// bodies: [{ set, mat, cls }] back to front; holes: carved details lit by the candle (outlined where they leave the body)
function paint(name, bodies, holes = null) {
  const id = n => `wg-halloween-${name}-${n}`, url = n => `url(#${id(n)})`
  const all = unionSets(bodies.map(b => b.set))
  const [x0, y0, x1, y1] = bboxOf(all)
  const w = x1 - x0, h = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = Math.max(w, h)
  const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
  const defs = [['radialGradient', { id: id(0), cx: 12, cy: f2(cy + 0.65), r: 12, gradientUnits: 'userSpaceOnUse' },
    [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]]]
  if (holes) defs.push(['radialGradient', { id: id(1), cx: f2(cx), cy: f2(cy + h * 0.1), r: f2(R * 0.62), gradientUnits: 'userSpaceOnUse' },
    [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]])
  const gi = {}
  for (const m of new Set(bodies.map(b => b.mat))) {
    gi[m] = defs.length
    const s = MAT[m].stops
    defs.push(['radialGradient', { id: id(defs.length), cx: f2(cx), cy: f2(cy + h * 0.08), r: f2(R * 0.66), fx: f2(cx - w * 0.16), fy: f2(cy - h * 0.18), gradientUnits: 'userSpaceOnUse' },
      [st(0, s[0]), st(0.45, s[1]), st(1, s[2])]])
  }
  const line = MAT[bodies[0].mat].line
  const out = [['defs', {}, defs]]
  out.push(['path', { d: 'M0 0H24V24H0Z', fill: url(0), class: 'wm-deco' }])
  out.push(['path', { d: setD(translateSet(all, 0.15, 0.85)), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }])
  if (holes) out.push(['path', { d: setD(all.filter(r => area(r) * area(all[0]) > 0)), fill: url(1), stroke: line, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  for (const b of bodies) {
    const set = holes ? differenceSets(b.set, holes) : b.set
    out.push(['path', { d: setD(set), fill: url(gi[b.mat]), 'fill-rule': 'evenodd', stroke: MAT[b.mat].line, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: b.cls || 'wm-k' }])
    const sh = crescent(set)
    if (sh.length) out.push(['path', { d: setD(sh), fill: C.shine, 'fill-opacity': MAT[b.mat].shine, class: 'wm-shine' }])
  }
  return out
}

// --- the drawing -------------------------------------------------------------------------------------------------
// a mitred stroke whose width changes vertex by vertex (one closed ring)
function taper(pts, ws) {
  const L = [], Rr = []
  pts.forEach((p, i) => {
    const a = pts[Math.max(i - 1, 0)], b = pts[Math.min(i + 1, pts.length - 1)]
    const seg = (u, v) => { const dx = v[0] - u[0], dy = v[1] - u[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l] }
    const n0 = seg(a, p[0] === a[0] && p[1] === a[1] ? b : p), n1 = seg(p[0] === b[0] && p[1] === b[1] ? a : p, b)
    let nx = n0[0] + n1[0], ny = n0[1] + n1[1]; const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl
    const m = (ws[i] / 2) / Math.max(0.35, nx * n1[0] + ny * n1[1])
    L.push([p[0] + nx * m, p[1] + ny * m]); Rr.push([p[0] - nx * m, p[1] - ny * m])
  })
  return normalize([...L, ...Rr.reverse()])
}

export default function render(icon) {
  const name = (icon && icon.name) || 'heart-crack'
  const heart = normalize(parsePath('M12 20.75C12 20.75 2.75 15.35 2.75 8.9C2.75 6.05 4.95 3.75 7.8 3.75C9.6 3.75 11.1 4.7 12 6.2C12.9 4.7 14.4 3.75 16.2 3.75C19.05 3.75 21.25 6.05 21.25 8.9C21.25 15.35 12 20.75 12 20.75Z', 0.15)[0].pts)
  // the crack: a bold zigzag from the notch to the tip, sharp at its turns, narrowing to nothing at the tip
  const crack = taper([[12, 4.6], [12, 6.6], [10.1, 10.2], [13.7, 13.2], [11.1, 16.9], [12, 19.2], [12, 20.9]], [1.7, 1.6, 1.6, 1.55, 1.45, 0.9, 0])
  return paint(name, [{ set: heart, mat: 'witch' }], crack)
}
