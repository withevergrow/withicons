// forge/hand/liquid/avatar-person-headphones.mjs — a liquid-glass person wearing headphones, hand-drawn. The generated
// one fused the band, the ear cups and the hair into one lilac mop, so the headphones (the whole point) vanished. Here
// the clear glass face sits under a violet hair cap, and the headphones are their own accent glass: a band arching
// clear of the hair by a hairline gap and two tall ear cups over the ears; violet shoulders. Three passes of the style
// pipeline (_liquid-core build: clear face, violet hair and shoulders, accent headphones), each region an exact fill,
// gradient ids renumbered per pass. Motion (nod, no parts): face wm-k, everything else wm-a.
import { parsePath } from '../../kernel/geom.mjs'
import { build } from '../../styles/_liquid-core.mjs'

// drawn on a 15/13 grid around the bust's centre, so its glass matches the stroke-grown generated siblings
const S = 1.15, OX = 12, OY = 12.3
const sp = pts => pts.map(([x, y]) => [Math.round((OX + (x - OX) * S) * 100) / 100, Math.round((OY + (y - OY) * S) * 100) / 100])
const subs = d => parsePath(d).map(s => ({ ...s, pts: sp(s.pts) }))
const NAME = 'avatar-person-headphones'
const fill = d => ({ subs: subs(d) })
const anchor = (pts, plate) => ({ pts: sp(pts), closed: false, plate })
const rr = (x0, y0, x1, y1, r) => `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`

// face: ellipse c 12 11.4, r 5.1 x 5.6, below the hair's swoop with a hairline gap
const FACE = 'M7.02 10.2 C7.6 9.4 7.9 8.9 8.1 8.6 C9.4 9.05 10.8 8.85 12 8.1 C13.2 8.85 14.6 9.05 15.9 8.6 C16.1 8.9 16.4 9.4 16.98 10.2 A5.1 5.6 0 1 1 7.02 10.2 Z'
const HAIR = 'M7 9.75 C6.6 6.6 8.9 4.4 12 4.4 C15.1 4.4 17.4 6.6 17 9.75 C16.6 9.1 16.3 8.5 16.1 8.1 C14.7 8.6 13.3 8.35 12 7.6 C10.7 8.35 9.3 8.6 7.9 8.1 C7.7 8.5 7.4 9.1 7 9.75 Z'
const BODY = 'M4.25 20.25 C4.25 18.6 6 17.5 8.25 17.5 C9.6 17.5 10.75 18.4 12 18.4 C13.25 18.4 14.4 17.5 15.75 17.5 C18 17.5 19.75 18.6 19.75 20.25 A1.25 1.25 0 0 1 18.5 21.5 H5.5 A1.25 1.25 0 0 1 4.25 20.25 Z'
// the band: the top half of a ring (c 12 10; outer r 7.5 x 7.85, inner r 5.9 x 6.2), ending in the cups
const BAND = 'M4.5 10 A7.5 7.85 0 0 1 19.5 10 H17.9 A5.9 6.2 0 0 0 6.1 10 Z'
const CUP_L = rr(3.9, 9.25, 7.1, 14.75, 1.6)
const CUP_R = rr(16.9, 9.25, 20.1, 14.75, 1.6)

const FACE_GLASS = {
  name: NAME, paths: [], lines: [],
  fills: [fill(FACE)],
  cutouts: [
    { subs: subs('M10.4 11.75 A0.8 1 0 1 1 8.8 11.75 A0.8 1 0 1 1 10.4 11.75 Z') },
    { subs: subs('M15.2 11.75 A0.8 1 0 1 1 13.6 11.75 A0.8 1 0 1 1 15.2 11.75 Z') },
    { subs: subs('M10.75 14.2 C11.5 14.95 12.5 14.95 13.25 14.2') },
  ],
}
const HAIR_GLASS = {
  name: NAME, paths: [], lines: [anchor([[11.5, 5.6], [12.5, 5.6]], 'A')],
  fills: [fill(HAIR), fill(BODY)], cutouts: [],
}
const PHONES = {
  name: NAME, paths: [], lines: [anchor([[5.5, 11.5], [5.5, 12.5]], 'S')],
  fills: [fill(BAND), fill(CUP_L), fill(CUP_R)], cutouts: [],
}

const DEEP = { 0: [0.2, 0.42, 0.66], 1: [0.56, 0.94] }
function pass(nodes, off, cls, pool, ink = 0.5) {
  const re = new RegExp(`wg-liquid-${NAME}-(\\d+)`, 'g')
  const ren = s => String(s).replace(re, (_, n) => `wg-liquid-${NAME}-${+n + off}`)
  const defs = []
  const body = []
  for (const n of nodes) {
    if (n[0] === 'defs') {
      for (const g of n[2]) {
        const k = +g[1].id.split('-').pop()
        const stops = DEEP[k] ? g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': DEEP[k][i] }]) : g[2]
        defs.push([g[0], { ...g[1], id: ren(g[1].id) }, stops])
      }
      continue
    }
    const a = { ...n[1] }
    if (a.fill) a.fill = ren(a.fill)
    if (a.stroke) a.stroke = ren(a.stroke)
    if (a.stroke === 'currentColor' && a['stroke-opacity'] === 0.3) { a['stroke-opacity'] = ink; a['stroke-width'] = 0.28 }
    if (a.fill && String(a.fill).includes('liquid-accent')) a['fill-opacity'] = 0.88
    if (a.class !== 'wm-shadow' && a.class !== 'wm-shine') a.class = cls
    if (a.class === 'wm-shine' && cls === 'wm-a') a.class = 'wm-a'
    if (cls === 'wm-a' && a.fill === `url(#wg-liquid-${NAME}-${4 + off})`) a['fill-opacity'] = pool
    body.push([n[0], a])
  }
  return { defs, body }
}

export default function render() {
  const k = pass(build(FACE_GLASS), 0, 'wm-k', 1)
  const h = pass(build(HAIR_GLASS), 6, 'wm-a', 0.5)
  const p = pass(build(PHONES), 12, 'wm-a', 0.45)
  const sh = n => n[1].class === 'wm-shadow'
  const body = [
    ...k.body.filter(sh), ...h.body.filter(sh), ...p.body.filter(sh),
    ...k.body.filter(n => !sh(n)), ...h.body.filter(n => !sh(n)), ...p.body.filter(n => !sh(n)),
  ]
  // only the gradients the passes actually paint with
  const used = new Set(body.flatMap(n => [n[1].fill, n[1].stroke]).map(v => (String(v).match(/#([^)]+)\)/) || [])[1]).filter(Boolean))
  return [['defs', {}, [...k.defs, ...h.defs, ...p.defs].filter(g => used.has(g[1].id))], ...body]
}
