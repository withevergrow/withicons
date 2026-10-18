// forge/hand/halloween/stop.mjs — the media stop glyph: a candle-lit pumpkin rounded tile with a raised witch-purple stop square
// inset (the media glyph) over faint pumpkin ribs, in the midnight outline. Differs from the plain purple square and the
// square-x so it reads as stop at 16px. Roles: tile c1->c2, glyph c3->edge, ribs c2, outline ink, halo accent.
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
  const name = (icon && icon.name) || 'stop'
  const out = paint(name, [{ set: P(rr(4.5, 4.5, 19.5, 19.5, 3.4)), mat: 'pumpkin' }])
  // a raised witch-purple stop square on the pumpkin tile (the media glyph), over faint pumpkin ribs
  const gid = `wg-halloween-${name}-2`
  out[0][2].push(['radialGradient', { id: gid, cx: 12, cy: 13.4, r: 7.2, fx: 9.8, fy: 10.2, gradientUnits: 'userSpaceOnUse' },
    [['stop', { offset: 0, 'stop-color': C.c3 }], ['stop', { offset: 0.5, 'stop-color': C.c3 }], ['stop', { offset: 1, 'stop-color': C.edge }]]])
  const rib = { fill: 'none', stroke: C.c2, 'stroke-opacity': 0.55, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-deco' }
  out.push(['path', { d: 'M8.4 5.6C6.4 9 6.4 15 8.4 18.4', ...rib }])
  out.push(['path', { d: 'M15.6 5.6C17.6 9 17.6 15 15.6 18.4', ...rib }])
  out.push(['path', { d: rr(8.35, 9, 15.65, 16.3, 1.7), fill: C.shadow, 'fill-opacity': 0.32, class: 'wm-shadow' }])
  out.push(['path', { d: rr(8.2, 8.2, 15.8, 15.8, 1.7), fill: `url(#${gid})`, stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: 'M9.4 12.6V10.1A0.8 0.8 0 0 1 10.2 9.4H12.8', fill: 'none', stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return out
}
