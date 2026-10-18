// forge/hand/chrome/spider-web.mjs: a round spider web in chrome wire: six spokes, a sagging outer ring and a sagging
// inner ring, with a small gunmetal bead at the hub. The generated drawing fused the web into one bulging hexagon
// blob; here the threads stay thin and the windows between them stay open, so it reads as a web at 16px.
// Same layer recipe as the generator (_chrome-core.mjs); only the geometry is drawn here.
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, K } from '../../styles/_chrome-core.mjs'

const tf = p => [(p[0] - 12) * K.SCALE + 12 + K.TX, (p[1] - 12) * K.SCALE + 12 + K.TY]
const M0 = 0.7
const minus = (A, B) => F.subtract(F.copy(A), B)
const circle = (cx, cy, r, n = 28) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2; return tf([cx + r * Math.cos(a), cy + r * Math.sin(a)]) })
const polar = (r, deg) => { const a = deg * Math.PI / 180; return [12 + r * Math.cos(a), 12 + r * Math.sin(a)] }
// a thread from a to b sagging toward the hub by `sag` of its length
function thread(a, b, sag, n = 14) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = 12 - mx, dy = 12 - my, L = Math.hypot(dx, dy) || 1
  const c = [mx + dx / L * sag, my + dy / L * sag]
  return Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return tf([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]) })
}
const ring = (R, sag) => {
  const lines = []
  for (let k = 0; k < 6; k++) lines.push({ pts: thread(polar(R, -90 + 60 * k), polar(R, -90 + 60 * (k + 1)), sag), closed: false })
  return lines
}

export default function render(icon) {
  const name = (icon && icon.name) || 'spider-web'
  const spokes = []
  for (let k = 0; k < 6; k++) spokes.push({ pts: [tf(polar(10, -90 + 60 * k)), tf([12, 12])], closed: false })
  const outer = F.strokes(ring(10, 2.4), 1.7, M0)
  const mid = F.strokes(ring(5.6, 1.5), 1.2, M0)
  const sp = F.strokes(spokes, 1.25, M0)
  const web = F.copy(outer); F.union(web, mid); F.union(web, sp)
  const hub = F.region([circle(12, 12, 1.3)], M0)
  F.union(web, hub)
  const Ls = layers({ T: {}, K: F.open(web, 0.2), Af: null, Ab: null, S: null, sil: F.copy(web), txt: null, seam: null })
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
