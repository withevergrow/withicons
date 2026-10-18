// forge/hand/soft3d/wreath.mjs — an upright Christmas wreath: a ring of twelve puffy green foliage lobes around a clear
// round hole, three berries, and a big light bow with two visible loops, a knot and two tails at the bottom. Replaces the
// generated tilted ring whose hole filled in and whose bow became a dark smudge. Same studio recipe as the other hand-drawn
// soft3d icons: tonal lobes, soft top-left light, thin dark underside.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'wreath'
const f = x => +x.toFixed(2)
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const C = (cx, cy, r, a, cls) => ['circle', { cx: f(cx), cy: f(cy), r, ...a, class: cls }]
const S = (d, stroke, w, op, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cls)

export default function render() {
  const LEAF = v('c1', '#2F8F5B'), BOW = v('c2', '#E0524A'), BERRY = v('c3', '#F2C14E'), LIGHT = v('c4', '#7FC79A')
  const g = `url(#wg-soft3d-${N}-0)`
  const CX = 12, CY = 10, RM = 6.6, RL = 2.4, N_LOBES = 12
  const lobe = i => {
    const a = (Math.PI * 2 * i) / N_LOBES - Math.PI / 2
    return [CX + RM * Math.cos(a), CY + RM * Math.sin(a)]
  }
  // paint from the back (upper left lit) round to the front so the overlap order stays consistent
  const order = [...Array(N_LOBES).keys()].map(i => (i + 6) % N_LOBES)
  const out = [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.32, cy: 0.25, r: 0.9 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.32)]]]],
    ['ellipse', { cx: 12, cy: 21.7, rx: 9, ry: 1.1, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.7, rx: 7, ry: 0.85, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.7, rx: 5, ry: 0.6, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
  ]
  // underside of the whole ring
  for (let i = 0; i < N_LOBES; i++) { const [x, y] = lobe(i); out.push(C(x + 0.3, y + 0.7, RL, { fill: SH, 'fill-opacity': 0.3 }, 'wm-k')) }
  for (const i of order) { const [x, y] = lobe(i); out.push(C(x, y, RL, { fill: LEAF }, 'wm-k')) }
  // light foliage tint on alternate lobes, then each lobe's own light
  for (const i of order) { if (i % 2 === 0) { const [x, y] = lobe(i); out.push(C(x, y, RL, { fill: LIGHT, 'fill-opacity': 0.28 }, 'wm-k')) } }
  for (const i of order) { const [x, y] = lobe(i); out.push(C(x, y, RL, { fill: g }, 'wm-k')) }
  // a soft shadow ring on the inner edge so the hole reads as a hole
  out.push(['circle', { cx: CX, cy: CY, r: 4.45, fill: 'none', stroke: SH, 'stroke-width': 0.5, 'stroke-opacity': 0.28, class: 'wm-k' }])
  for (const i of [9, 10, 11, 0]) { const [x, y] = lobe(i); out.push(C(x - 0.6, y - 0.7, 0.35, { fill: SN, 'fill-opacity': 0.8 }, 'wm-shine')) }
  // berries
  for (const [bx, by] of [[CX + 5.1, CY - 3.7], [CX - 6.2, CY + 1.3], [CX + 2.1, CY - 6.9]]) {
    out.push(C(bx + 0.2, by + 0.3, 1.1, { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'), C(bx, by, 1.05, { fill: BERRY }, 'wm-a'), C(bx, by, 1.05, { fill: g }, 'wm-a'), C(bx - 0.35, by - 0.35, 0.3, { fill: SN, 'fill-opacity': 0.85 }, 'wm-shine'))
  }
  // the bow: tails, two loops, knot
  const BX = 12, BY = 17.6
  const LL = `M${BX} ${BY}C${BX - 2} ${f(BY - 3)} ${BX - 6.2} ${f(BY - 2.4)} ${BX - 6.2} ${f(BY + 0.5)}C${BX - 6.2} ${f(BY + 2.6)} ${BX - 2.6} ${f(BY + 2)} ${BX} ${BY}Z`
  const LR = `M${BX} ${BY}C${BX + 2} ${f(BY - 3)} ${BX + 6.2} ${f(BY - 2.4)} ${BX + 6.2} ${f(BY + 0.5)}C${BX + 6.2} ${f(BY + 2.6)} ${BX + 2.6} ${f(BY + 2)} ${BX} ${BY}Z`
  const TL = `M${BX - 0.6} ${f(BY + 0.5)}L${BX - 3.4} ${f(BY + 4)}L${BX - 1.4} ${f(BY + 3.8)}L${BX} ${f(BY + 1.6)}Z`
  const TR = `M${BX + 0.6} ${f(BY + 0.5)}L${BX + 3.4} ${f(BY + 4)}L${BX + 1.4} ${f(BY + 3.8)}L${BX} ${f(BY + 1.6)}Z`
  for (const d of [TL, TR]) out.push(P(d, { fill: BOW, stroke: BOW, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-a'), P(d, { fill: SH, 'fill-opacity': 0.22 }, 'wm-a'))
  for (const d of [LL, LR]) {
    out.push(P(d, { fill: SH, 'fill-opacity': 0.3, stroke: SH, 'stroke-opacity': 0.3, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-a'),
      P(d, { fill: BOW }, 'wm-a'), P(d, { fill: g }, 'wm-a'))
  }
  out.push(
    // inner fold of each loop, and the knot
    S(`M${BX - 1.6} ${f(BY - 0.1)}C${BX - 3.2} ${f(BY - 1.5)} ${BX - 4.6} ${f(BY - 1)} ${BX - 4.6} ${f(BY + 0.4)}`, SH, 0.5, 0.3, 'wm-a'),
    S(`M${BX + 1.6} ${f(BY - 0.1)}C${BX + 3.2} ${f(BY - 1.5)} ${BX + 4.6} ${f(BY - 1)} ${BX + 4.6} ${f(BY + 0.4)}`, SH, 0.5, 0.3, 'wm-a'),
    C(BX, BY + 0.2, 1.35, { fill: SH, 'fill-opacity': 0.3 }, 'wm-a'), C(BX, BY, 1.3, { fill: BOW }, 'wm-a'), C(BX, BY, 1.3, { fill: g }, 'wm-a'),
    S(`M${BX - 5.2} ${f(BY - 1.3)}C${BX - 4 } ${f(BY - 2.1)} ${BX - 3} ${f(BY - 2)} ${BX - 2.2} ${f(BY - 1.5)}`, SN, 0.5, 0.75, 'wm-shine'),
  )
  return out
}
