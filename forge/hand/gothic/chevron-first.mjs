// forge/hand/gothic/chevron-first.mjs — the exact mirror of chevron-last: the chevron family's gilded spear (ruby trefoil
// stud, enamel inlay) run back against a stop bar at the chevron's own weight, a gilded column with square capitals,
// enamelled to match; x positions mirror chevron-last (24 - x) so the swap pair centres alike. The generated stop was a
// pale stone pier with a spire and sword finial that competed with the point and thinned to a sliver at 16px.
import { G as g } from '../../styles/_gothic-kit.mjs'
import { paint } from '../../styles/_gothic-paint.mjs'
import { enamel } from '../../styles/_gothic-render.mjs'

const f1 = v => Math.round(v * 100) / 100
const RAD = Math.PI / 180
const place = (pts, ox, oy, a) => {
  const c = Math.cos(a * RAD), s = Math.sin(a * RAD)
  return pts.map(([x, y]) => [f1(ox + x * c - y * s), f1(oy + x * s + y * c)])
}
// a spear chevron: two arms of width w meeting in a mitred point at (ax, ay) pointing a, each arm d back and d out
function spearPts(ax, ay, a, d, w, tip) {
  const h = w / 2, L = Math.hypot(d, d), o = h * d / L, m = h * L / d
  return place([[-d + o, -d - o], [m + tip, 0], [-d + o, d + o], [-d - o, d - o], [-m, 0], [-d - o, -d + o]], ax, ay, a)
}
// the sibling chevrons' build: gilt spear with ball terminals, a ruby glass trefoil stud in the point
function chevron(ax, ay, a, d, w = 2.6) {
  const ends = place([[-d, -d], [-d, d]], ax, ay, a)
  const [k] = place([[-1.2, 0]], ax, ay, a)
  return [
    g.gilt(g.union(g.poly(spearPts(ax, ay, a, d, w, 1.3)), ...ends.map(([x, y]) => g.circle(x, y, w * 0.6)))),
    g.glass(g.foil(k[0], k[1], 1.6, 3, a), 'c1', { outline: 0.24, glint: false, glow: 0.34 }),
  ]
}
// the stop bar (the part A): a gilded column, shaft as wide as the chevron's arms, a square capital and base
function column(cx, top, bottom, w = 2.8) {
  const cw = w / 2 + 0.75
  return g.gilt(g.union(
    g.rr(cx - w / 2, top + 0.6, cx + w / 2, bottom - 0.6, 0.3),
    g.rr(cx - cw, top, cx + cw, top + 1.6, 0.45),
    g.rr(cx - cw, bottom - 1.6, cx + cw, bottom, 0.45),
  ), { plate: 'A' })
}

export default function render(icon) {
  return paint(enamel([column(5.8, 4.6, 19.4), ...chevron(12.6, 12, 180, 5.8)].flat(Infinity).filter(Boolean), icon))
}
