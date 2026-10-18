// forge/hand/halloween/reindeer.mjs — a reindeer head: two thick witch-purple branched antlers, a rounded pumpkin head
// with leaf ears, dark eyes, a cream muzzle and a big deep-orange nose, in the midnight outline on the warm halo.
// Replaces the generated thin tangled antlers and the small blob face.
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
  const name = (icon && icon.name) || 'reindeer'
  const ant = sx => {
    const X = v => 12 + sx * v
    return unionSets([
      roundStrokeSet([[X(2.8), 9.5], [X(4), 6.2], [X(4.4), 2.9]], 2.6),
      roundStrokeSet([[X(3.9), 6.4], [X(7.8), 5.2]], 2.2),
      roundStrokeSet([[X(4.2), 4.4], [X(1.4), 3.4]], 2),
    ])
  }
  const antlers = unionSets([ant(-1), ant(1)])
  const ear = sx => P(`M${12 + sx * 6} 10.4C${12 + sx * 8.2} 9.4 ${12 + sx * 10} 9.8 ${12 + sx * 10.1} 10.9C${12 + sx * 9.8} 12.6 ${12 + sx * 8} 13.1 ${12 + sx * 5.8} 12.8Z`)
  const head = P('M12 8.2C15.2 8.2 17.4 9.2 17.9 11.6C18.3 13.8 17 16.8 15.8 18.8C15 20.3 13.7 21.2 12 21.2C10.3 21.2 9 20.3 8.2 18.8C7 16.8 5.7 13.8 6.1 11.6C6.6 9.2 8.8 8.2 12 8.2Z')
    const muzzle = P('M12 15.6C14.4 15.6 15.8 16.9 15.8 18.4C15.8 20 14.2 21 12 21C9.8 21 8.2 20 8.2 18.4C8.2 16.9 9.6 15.6 12 15.6Z')
  const eyes = unionSets([disc(9.2, 13, 1.05), disc(14.8, 13, 1.05)])
  const out = paint(name, [
    { set: antlers, mat: 'witch', cls: 'wm-a' },
    { set: ear(-1), mat: 'pumpkin', noshine: true },
    { set: ear(1), mat: 'pumpkin', noshine: true },
    { set: head, mat: 'pumpkin' },
    { set: intersectSets(muzzle, head), mat: 'cream', sw: 0.5, noshine: true },
    { set: disc(12, 18.1, 2.3), mat: 'gem', sw: 0.6, cls: 'wm-s' },
  ])
  out.push(['path', { d: setD(eyes), fill: C.ink, class: 'wm-a' }])
  out.push(['path', { d: setD(unionSets([disc(9.55, 12.6, 0.35), disc(15.15, 12.6, 0.35)])), fill: C.shine, class: 'wm-a' }])
  return out
}
