// forge/hand/soft3d/sky-lantern.mjs — a round-bellied paper sky lantern, glowing: a plump c1 barrel lit from inside (warm radial
// glow, a bright flame, curved ribs), gold top and bottom rims, a hook ring on top and one bold c4 tassel with two bead drops.
// Roles: paper c1, rims and hook c2, flame and beads c3, tassel c4. Motion: tassel and beads wm-a (they sway), glow wm-deco.
const N = 'sky-lantern'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const SH = v('shadow', '#1D2130'), SN = v('shine', '#FFFFFF')
const stop = (o, c, a) => ['stop', a == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
function rbox(x0, y0, x1, y1, r) {
  return `M${f(x0 + r)} ${y0}H${f(x1 - r)}Q${x1} ${y0} ${x1} ${f(y0 + r)}V${f(y1 - r)}Q${x1} ${y1} ${f(x1 - r)} ${y1}H${f(x0 + r)}Q${x0} ${y1} ${x0} ${f(y1 - r)}V${f(y0 + r)}Q${x0} ${y0} ${f(x0 + r)} ${y0}Z`
}
const shadow3 = (cx, cy, rx, ry) => [0, 1, 2].map(i => P(ell(cx, cy, rx * [1, 0.8, 0.58][i], ry * [1, 0.8, 0.58][i]), { fill: SH, 'fill-opacity': [0.06, 0.08, 0.11][i] }, 'wm-shadow'))
const C = { c1: v('c1', '#C8643B'), c2: v('c2', '#F5A524'), c3: v('c3', '#FFE066'), c4: v('c4', '#D9467A'), tint: v('tint', '#FFF1CF') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`

export default function render() {
  const n = [['defs', {}, [
    ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, SN, 0.34), stop(0.42, SN, 0), stop(0.62, SH, 0), stop(1, SH, 0.2)]],
    ['radialGradient', { id: id(1), cx: 0.5, cy: 0.5, r: 0.5 }, [stop(0, C.tint, 0.95), stop(0.45, C.c3, 0.7), stop(1, C.c3, 0)]],
    ['radialGradient', { id: id(2), cx: 0.32, cy: 0.28, r: 0.9 }, [stop(0, SN, 0.7), stop(0.5, SN, 0), stop(1, SH, 0.3)]],
  ]]]
  n.push(...shadow3(12, 22.5, 4.4, 0.7))
  const rim = (d, cls, o = 0.4, w = 0.5) => n.push(P(d, { fill: 'none', stroke: SH, 'stroke-opacity': o, 'stroke-width': w }, cls))
  const fill = (d, c, cls = 'wm-k', g = 0, outline = true) => { n.push(P(d, { fill: c }, cls), P(d, { fill: url(g) }, cls)); if (outline) rim(d, cls) }
  // hook ring and cord
  n.push(S('M12 4.1V5', C.c2, 0.9, {}, 'wm-k'))
  n.push(P(ell(12, 2.7, 1.25, 1.25), { fill: 'none', stroke: C.c2, 'stroke-width': 0.9 }, 'wm-k'))
  n.push(P(ell(12, 2.7, 1.7, 1.7), { fill: 'none', stroke: SH, 'stroke-opacity': 0.3, 'stroke-width': 0.4 }, 'wm-k'))
  // the paper barrel
  const body = 'M8.4 5.6H15.6C19.9 8.2 19.9 14 15.6 16.6H8.4C4.1 14 4.1 8.2 8.4 5.6Z'
  fill(body, C.c1)
  // inner glow and ribs
  n.push(P(ell(12, 11.1, 6, 5.6), { fill: url(1) }, 'wm-deco'))
  n.push(S('M10.2 5.8C7.9 8.5 7.9 13.7 10.2 16.4M13.8 5.8C16.1 8.5 16.1 13.7 13.8 16.4', SH, 0.5, { 'stroke-opacity': 0.3 }, 'wm-k'))
  n.push(S('M6.7 9.4C6.4 10.6 6.6 11.8 7.4 12.8', SN, 0.6, { 'stroke-opacity': 0.55 }, 'wm-shine'))
  // the flame
  const flame = 'M12 7.9C13.9 9.7 14.5 11.2 14.2 12.4C14 13.5 13.1 14.2 12 14.2C10.9 14.2 10 13.5 9.8 12.4C9.5 11.2 10.1 9.7 12 7.9Z'
  n.push(P(flame, { fill: C.c3 }, 'wm-k'), P(flame, { fill: 'none', stroke: SH, 'stroke-opacity': 0.25, 'stroke-width': 0.4 }, 'wm-k'))
  n.push(P(ell(12, 12.6, 1, 1.2), { fill: C.tint }, 'wm-k'))
  // gold rims
  fill(rbox(7.6, 4.2, 16.4, 6, 0.9), C.c2)
  fill(rbox(7.6, 16.2, 16.4, 18, 0.9), C.c2)
  n.push(S('M8.8 4.9H15', SN, 0.5, { 'stroke-opacity': 0.6 }, 'wm-shine'))
  // tassel and bead drops
  for (const x of [8.8, 15.2]) {
    n.push(S(`M${x} 18V18.7`, C.c2, 0.6, {}, 'wm-a'))
    n.push(P(ell(x, 19.5, 0.95, 1), { fill: C.c3 }, 'wm-a'), P(ell(x, 19.5, 0.95, 1), { fill: url(2) }, 'wm-a'), P(ell(x, 19.5, 0.95, 1), { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.4 }, 'wm-a'))
  }
  n.push(S('M12 18V19', C.c2, 0.8, {}, 'wm-a'))
  const skirt = 'M11 19.4H13L14.4 22.2Q14.4 22.5 14 22.5H10Q9.6 22.5 9.6 22.2Z'
  n.push(P(skirt, { fill: C.c4 }, 'wm-a'), P(skirt, { fill: url(0) }, 'wm-a'), P(skirt, { fill: 'none', stroke: SH, 'stroke-opacity': 0.4, 'stroke-width': 0.4 }, 'wm-a'))
  n.push(S('M11.4 20.2L10.9 22M12.6 20.2L13.1 22', SH, 0.35, { 'stroke-opacity': 0.3 }, 'wm-a'))
  n.push(P(ell(12, 19.2, 1.1, 0.9), { fill: C.c2 }, 'wm-a'), P(ell(12, 19.2, 1.1, 0.9), { fill: url(2) }, 'wm-a'))
  return n
}
