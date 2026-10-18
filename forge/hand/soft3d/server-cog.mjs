// forge/hand/soft3d/server-cog.mjs — two stacked server slabs (top with a slot and status light, bottom with a light and a
// vent) and a chunky orange gear sitting on the bottom slab's lower right, replacing the generated single dark block with a
// gear tucked under it. Same studio recipe as the hand-drawn monitor / hard-drive: tonal face, thin dark underside, soft light.
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const N = 'server-cog'
const f = x => +x.toFixed(2)
const RR = (x, y, w, h, r) => `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${r} ${r} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${r} ${r} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${r} ${r} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${r} ${r} 0 0 1 ${f(x + r)} ${f(y)}Z`
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const C = (cx, cy, r, a, cls) => ['circle', { cx: f(cx), cy: f(cy), r, ...a, class: cls }]
const S = (d, stroke, w, op, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-opacity': op, 'stroke-linecap': 'round' }, cls)

// an 8-tooth gear outline, blunt teeth, root arcs between them
function gear(cx, cy, ro, ri, n, ho, hb) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2
    const pt = (r, da) => `${f(cx + r * Math.cos(a + da))} ${f(cy + r * Math.sin(a + da))}`
    d += (i ? `A${ri} ${ri} 0 0 1 ${pt(ri, -hb)}` : `M${pt(ri, -hb)}`) + `L${pt(ro, -ho)}L${pt(ro, ho)}L${pt(ri, hb)}`
  }
  const a0 = -Math.PI / 2
  return d + `A${ri} ${ri} 0 0 1 ${f(cx + ri * Math.cos(a0 - hb))} ${f(cy + ri * Math.sin(a0 - hb))}Z`
}

export default function render() {
  const SLAB = v('c1', '#3A404C'), EDGE = v('ink', '#232733'), LED = v('c4', '#4ADE80'), GEAR = v('accent', '#FF6A4D')
  const g = `url(#wg-soft3d-${N}-0)`
  const GX = 17.5, GY = 16.5
  const GEARD = gear(GX, GY, 4.4, 3.3, 8, 0.15, 0.24)
  const slab = (y) => [
    P(RR(2.5, y + 0.8, 19, 6.8, 2.2), { fill: EDGE }, 'wm-k'),
    P(RR(2.5, y, 19, 6.8, 2.2), { fill: SLAB }, 'wm-k'),
    P(RR(2.5, y, 19, 6.8, 2.2), { fill: g }, 'wm-k'),
    S(`M5 ${f(y + 0.85)}H19`, SN, 0.6, 0.45, 'wm-shine'),
  ]
  return [
    ['defs', {}, [['radialGradient', { id: `wg-soft3d-${N}-0`, cx: 0.3, cy: 0.2, r: 1 }, [stop(0, SN, 0.5), stop(0.4, SN, 0.05), stop(0.7, SH, 0), stop(1, SH, 0.3)]]]],
    ['ellipse', { cx: 12, cy: 21.3, rx: 10.2, ry: 1.3, fill: SH, 'fill-opacity': 0.06, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 8.2, ry: 1, fill: SH, 'fill-opacity': 0.08, class: 'wm-shadow' }],
    ['ellipse', { cx: 12, cy: 21.3, rx: 6, ry: 0.7, fill: SH, 'fill-opacity': 0.11, class: 'wm-shadow' }],
    // top slab: slot + light
    ...slab(2.6),
    P(RR(10, 4.9, 8.5, 2.0, 1), { fill: SH, 'fill-opacity': 0.6 }, 'wm-k'),
    S('M11 7.25H17.5', SN, 0.4, 0.3, 'wm-shine'),
    C(6, 5.9, 1.7, { fill: LED, 'fill-opacity': 0.3 }, 'wm-k'),
    C(6, 5.9, 0.95, { fill: LED }, 'wm-k'),
    C(5.7, 5.6, 0.3, { fill: SN, 'fill-opacity': 0.8 }, 'wm-shine'),
    // bottom slab: light + vent
    ...slab(12),
    P(RR(9, 14.5, 2.4, 2.0, 1), { fill: SH, 'fill-opacity': 0.6 }, 'wm-k'),
    C(6, 15.3, 1.7, { fill: LED, 'fill-opacity': 0.3 }, 'wm-k'),
    C(6, 15.3, 0.95, { fill: LED }, 'wm-k'),
    C(5.7, 15, 0.3, { fill: SN, 'fill-opacity': 0.8 }, 'wm-shine'),
    // the gear: cast shadow on the slab, underside, orange body, dark hub
    P(gear(GX + 0.3, GY + 0.9, 4.4, 3.3, 8, 0.15, 0.24), { fill: SH, 'fill-opacity': 0.4, stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-s'),
    P(gear(GX, GY + 0.6, 4.4, 3.3, 8, 0.15, 0.24), { fill: SH, 'fill-opacity': 0.35, stroke: GEAR, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-s'),
    P(GEARD, { fill: GEAR, stroke: GEAR, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }, 'wm-s'),
    P(GEARD, { fill: g, stroke: 'none' }, 'wm-s'),
    C(GX, GY, 1.75, { fill: SH, 'fill-opacity': 0.55 }, 'wm-s'),
    C(GX, GY + 0.15, 1.4, { fill: EDGE }, 'wm-s'),
    S(`M${f(GX - 2.2)} ${f(GY + 0.2)}A2.2 2.2 0 0 1 ${f(GX - 0.3)} ${f(GY - 2.15)}`, SN, 0.5, 0.55, 'wm-shine'),
    S(`M${f(GX - 3.4)} ${f(GY - 1.6)}A3.8 3.8 0 0 1 ${f(GX - 1.4)} ${f(GY - 3.4)}`, SN, 0.6, 0.75, 'wm-shine'),
  ]
}
