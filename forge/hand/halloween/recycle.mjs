// forge/hand/halloween/recycle.mjs — three chunky slime-green arrows chasing each other round a rounded triangle, each a
// 2.6u band bent round one corner and ending in a broad filled head, with a clear gap before the next tail, in the
// midnight outline on the warm halo. The generated loop was bone-white with thin chevron heads (it faded on white).
import { unionSets, differenceSets, translateSet, erode, strokeSet, roundStrokeSet, normalize } from '../../kernel/bool.mjs'
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
const CX = 12, CY = 13.25, DC = 5.4, RC = 2.7, W = 2.6, TAIL = 1.6, EXT = 1.5, HL = 3.2, HW = 2.45
const P = (a, r, c = [CX, CY]) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] + r * Math.sin(a * Math.PI / 180)]
function arrow(th) {
  const c = P(th, DC), a0 = th - 60, a1 = th + 60
  const din = (th + 30) * Math.PI / 180, dout = (th + 150) * Math.PI / 180
  const s = P(a0, RC, c), e = P(a1, RC, c)
  const pts = [[s[0] - Math.cos(din) * TAIL, s[1] - Math.sin(din) * TAIL]]
  for (let a = a0; a <= a1 + 1e-6; a += 6) pts.push(P(a, RC, c))
  const u = [Math.cos(dout), Math.sin(dout)], n = [-u[1], u[0]]
  const B = [e[0] + u[0] * EXT, e[1] + u[1] * EXT]
  pts.push([B[0] + u[0] * 0.3, B[1] + u[1] * 0.3])
  const head = normalize([[B[0] + n[0] * HW, B[1] + n[1] * HW], [B[0] + u[0] * HL, B[1] + u[1] * HL], [B[0] - n[0] * HW, B[1] - n[1] * HW]])
  return unionSets([strokeSet(pts, W), head])
}
export default function render(icon) {
  const name = (icon && icon.name) || 'recycle'
  const set = unionSets([arrow(-90), arrow(30), arrow(150)])
  return paint(name, [{ set, mat: 'slime' }])
}
