// forge/hand/chrome/cookie.mjs — a chrome cookie with a deep three-scallop bite taken out of the upper right (the
// generated notch was filled in by the chrome tube and the cookie read as a coin) and dark ink chocolate chunks
// set on the face, each with a tiny highlight, so the bright disc reads as a baked cookie at 16px.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

const r2 = v => Math.round(v * 100) / 100
const tf = (x, y) => [r2((x - 12) * K.SCALE + 12 + K.TX), r2((y - 12) * K.SCALE + 12 + K.TY)]
const num = (x, y) => tf(x, y).join(' ')

// the disc, bitten: a big arc round the cookie, then three round scallops back across the bite
const BODY = 'M13.2 2.55 A9.5 9.5 0 1 0 21.45 12.2 A2.9 2.9 0 0 1 18.2 9.2 A2.9 2.9 0 0 1 16.9 5.2 A2.9 2.9 0 0 1 13.2 2.55 Z'

function skeleton(name) {
  const subs = parsePath(BODY)
  return {
    name, paths: [{ id: 'p0', d: BODY, plate: 'K', subs }],
    fills: [{ d: BODY, subs, set: setOf(subs.map(s => s.pts)) }], cutouts: [],
    lines: subs.map(x => ({ pts: x.pts, closed: x.closed, plate: 'K', pathId: 'p0' })),
  }
}

// a rounded, slightly lopsided chocolate chunk: four corner points pulled by r, rotated by a
function chunk(cx, cy, rx, ry, a) {
  const c = Math.cos(a), s = Math.sin(a)
  const P = [[rx, -ry * 0.8], [rx * 0.9, ry], [-rx, ry * 0.85], [-rx * 0.95, -ry]]
    .map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c])
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  let d = ''
  for (let i = 0; i < 4; i++) {
    const p = P[i], q = P[(i + 1) % 4], m0 = mid(P[(i + 3) % 4], p), m1 = mid(p, q)
    d += (i ? 'Q' : `M${num(...m0)}Q`) + `${num(...p)} ${num(...m1)}`
  }
  return d + 'Z'
}
const CHUNKS = [[8.0, 8.6, 2.0, 1.6, 0.4], [13.4, 12.6, 1.9, 1.5, -0.3], [8.2, 15.8, 1.85, 1.5, -0.5], [15.6, 17.4, 1.8, 1.45, 0.3]]

export default function render(icon) {
  const name = (icon && icon.name) || 'cookie'
  const Ls = layers(model(skeleton(name)))
  // no mirror horizon across the face: a bright, warm disc reads as a cookie, a dark band as a metal ball
  Ls.list = Ls.list.filter(L => !(Array.isArray(L.fill) && L.fill[0] === 'ground') && L.fill !== col('ink'))
  const out = emit(Ls, name, 0)
  const glint = out.pop()
  for (const [x, y, rx, ry, a] of CHUNKS) {
    out.push(['path', { d: chunk(x, y, rx + 0.35, ry + 0.35, a), fill: col('edge'), class: 'wm-shine' }])
    out.push(['path', { d: chunk(x, y, rx, ry, a), fill: col('ink'), class: 'wm-a' }])
    const [hx, hy] = tf(x - rx * 0.35, y - ry * 0.4)
    out.push(['path', { d: `M${r2(hx - 0.3)} ${hy}Q${hx} ${r2(hy - 0.35)} ${r2(hx + 0.35)} ${hy}Q${hx} ${r2(hy + 0.1)} ${r2(hx - 0.3)} ${hy}Z`, fill: col('shine'), 'fill-opacity': 0.7, class: 'wm-shine' }])
  }
  out.push(glint)
  return out
}
