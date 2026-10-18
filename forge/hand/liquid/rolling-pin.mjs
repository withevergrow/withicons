// forge/hand/liquid/rolling-pin.mjs — a rolling pin on the 45° diagonal: a fat clear-glass barrel (7u across) and two
// separate coloured-glass handles (wm-a), each a neck running out of the barrel into a round grip. The generator grew the skeleton's
// slim barrel and hairline handles into one thin pale stick with tiny knobs, which lost its silhouette on white; a
// chunky barrel parted from distinctly coloured handles reads as a rolling pin at 16px. Same model and paint as the
// generator (_liquid-core.mjs build); only the geometry is drawn here.
import { build, L } from '../../styles/_liquid-core.mjs'

const r3 = v => Math.round(v * 1000) / 1000
// geometry is written in the style's frame (what is seen on the 24 grid); the core scales the skeleton into that frame,
// so every point is mapped back once here
const pre = p => [r3((p[0] - 12 - L.TX) / L.SCALE + 12), r3((p[1] - 12 - L.TY) / L.SCALE + 12)]
function skeleton(name, parts) {
  const ps = parts.map(p => ({ ...p, pts: p.pts.map(pre) }))
  return {
    name, paths: [], cutouts: [],
    lines: ps.map((p, i) => ({ pts: p.pts, closed: !p.open, plate: p.plate || 'K', pathId: 'p' + i })),
    fills: ps.filter(p => !p.open).map(p => ({ subs: [{ pts: p.pts, closed: true }], set: [p.pts] })),
  }
}

// u runs along the pin toward the top-right, v across it; centred on the frame's centre
const S = Math.SQRT1_2, C = [12 + L.TX, 12 + L.TY]
const pt = (u, v) => [C[0] + (u + v) * S, C[1] + (v - u) * S]
// every polygon is the drawn piece shrunk by its outline tube (K 1.3, A 1.15)
const box = (u0, u1, hw) => [pt(u0, -hw), pt(u1, -hw), pt(u1, hw), pt(u0, hw)]
const oval = (uc, a, b, n = 20) => Array.from({ length: n }, (_, i) => {
  const t = (i / n) * Math.PI * 2
  return pt(uc + a * Math.cos(t), b * Math.sin(t))
})
// a handle on side s (+1 top-right, -1 bottom-left): a 2.3u neck running out of the barrel's end into a round grip
// (4.4u long, 4u across, ending at u 12.2)
const handle = s => [
  { pts: [pt(s * 6.1, 0), pt(s * 10, 0)], open: true, plate: 'A' },
  { pts: oval(s * 10, 1.05, 0.85), plate: 'A' },
]

export default function render(icon) {
  const name = (icon && icon.name) || 'rolling-pin'
  return build(skeleton(name, [
    // barrel: u -6..6, 7.2u across
    { pts: box(-4.7, 4.7, 2.3) },
    ...handle(1),
    ...handle(-1),
  ]))
}
