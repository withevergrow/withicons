// PASTEL live compositions — Live icons (forge/dynamic) that are hand-composed from their params
// so they match their static siblings exactly. Same contract as a redraw:
//   (icon, p) => layers     icon.params holds the resolved params; p is the prim + kit vocabulary.
// Anything not listed here (or that throws) falls back to the automatic composer.
//
// Batteries follow the static battery (_pastel-redraw-1.mjs): a lavender shell and terminal, a
// paper well, the charge as a mint .flat level (blush when low), the warning "!" in blush, the
// charging bolt in butter centred over the well behind a moat.

const clamp01 = x => Math.max(0, Math.min(1, Number(x) || 0))
const warns = q => { const w = q.warnAt == null ? 15 : +q.warnAt; return w > 0 && Math.round(clamp01(q.level) * 100) <= w }
const lowHue = q => clamp01(q.level) <= 0.2 ? 'blush' : 'mint'

const shellH = p => [
  ['lavender@K', p.rr(2, 6.25, 19.25, 17.75, 3.25)],
  ['lavender.flat@K', p.rr(19.75, 9.75, 22.25, 14.25, [0, 1.1, 1.1, 0])],
  ['paper.well@K', p.rr(4.25, 8.5, 17, 15.5, 1.6)],
]
const shellV = p => [
  ['lavender@K', p.rr(5.75, 4.75, 18.25, 22, 3.25)],
  ['lavender.flat@K', p.rr(9.75, 2.25, 14.25, 4.75, [1.1, 1.1, 0, 0])],
  ['paper.well@K', p.rr(8, 7, 16, 19.75, 1.6)],
]
// a level bar: never thinner than a soft sliver
const levelH = (p, q, x0 = 5.5, x1 = 15.75) => {
  const l = clamp01(q.level)
  if (l <= 0) return []
  return [[`${lowHue(q)}.flat@A`, p.rr(x0, 9.75, Math.max(x0 + 1.75, x0 + l * (x1 - x0)), 14.25, 1.1)]]
}
const levelV = (p, q, y0 = 8.25, y1 = 18.5) => {
  const l = clamp01(q.level)
  if (l <= 0) return []
  return [[`${lowHue(q)}.flat@A`, p.rr(9.25, Math.min(y1 - 1.75, y1 - l * (y1 - y0)), 14.75, y1, 1.1)]]
}
const bang = (p, cx, top, bot) => [['blush.flat@S', p.pill(cx - 0.95, top, cx + 0.95, bot), p.circle(cx, bot + 1.85, 1)]]

export const LIVE = {
  'battery-level': (icon, p) => {
    const q = icon.params || {}
    return [...shellH(p), ...(warns(q) ? bang(p, 10.6, 9.25, 12.6) : levelH(p, q))]
  },
  'battery-vertical': (icon, p) => {
    const q = icon.params || {}
    return [...shellV(p), ...(warns(q) ? bang(p, 12, 9.75, 14.75) : levelV(p, q))]
  },
  // a full battery-percent shows the full mint level of battery-level; any number is auto-composed
  'battery-percent': (icon, p) => {
    const q = icon.params || {}
    return clamp01(q.level) >= 0.995 ? [...shellH(p), ...levelH(p, { level: 1 })] : []
  },
  'battery-charging-level': (icon, p) => {
    const q = icon.params || {}
    const bolt = [[12.6, 3.75], [7, 12.75], [10.4, 12.75], [9.6, 20.25], [15.25, 11.25], [11.85, 11.25]]
    return [
      ...shellH(p),
      ...levelH(p, q),
      ['cut', p.unite(p.poly(bolt, 0.8), p.bar(bolt, 2.4, true))],
      ['butter@S', p.poly(bolt, 0.8)],
    ]
  },
}
