// forge/hand/chrome/dragon-head.mjs: a front-facing Chinese dragon head in liquid chrome, built in chrome pieces: two thick
// swept horns and wavy whiskers behind, the wide chrome head, a paler broad snout with two big nostril holes, and angry
// slanted eyes (pale ring, pink iris, ink pupil) under heavy ink brows so the face stays legible at 16-24px.
import { parsePath } from '../../kernel/geom.mjs'
import * as F from '../../styles/_chrome-field.mjs'
import { layers, emit, col } from '../../styles/_chrome-core.mjs'

const S = 0.88, OX = -0.2, OY = -0.55
const tf = p => [(p[0] - 12) * S + 12 + OX, (p[1] - 12) * S + 12 + OY]
const rings = d => parsePath(d).filter(s => s.pts && s.pts.length).map(s => s.pts.map(tf))
const subs = d => parsePath(d).filter(s => s.pts && s.pts.length).map(s => ({ pts: s.pts.map(tf), closed: s.closed }))
const M0 = 0.7, f = v => Math.round(v * 100) / 100
const ell = (x, y, rx, ry) => `M${x + rx} ${y}A${rx} ${ry} 0 1 1 ${x - rx} ${y}A${rx} ${ry} 0 1 1 ${x + rx} ${y}Z`
const poly = pts => 'M' + pts.map(p => tf(p).map(f).join(' ')).join('L') + 'Z'

const HEAD = 'M12 8.4 C16.6 8.4 19.5 10.8 19.5 14 C19.5 15.4 19.1 16.3 19.6 17.5 C20.1 19.7 17.4 21.9 12 21.9 C6.6 21.9 3.9 19.7 4.4 17.5 C4.9 16.3 4.5 15.4 4.5 14 C4.5 10.8 7.4 8.4 12 8.4 Z'
const SNOUT = 'M12 15.4 C14 15.4 15.2 15.9 16.2 15.9 C18.4 15.9 19 17.6 18.7 19 C18.2 21 15.6 21.8 12 21.8 C8.4 21.8 5.8 21 5.3 19 C5 17.6 5.6 15.9 7.8 15.9 C8.8 15.9 10 15.4 12 15.4 Z'
const HORN_L = 'M6.6 10.8 C5.6 8.6 5.9 6.6 3.4 3.0 C7.2 3.6 10.0 6 11.0 9.6 Z M6.0 8.4 C4.8 7.4 3.6 7.6 2.2 8.4 C3.2 9.4 4.6 10 6.0 9.8 Z'
const HORN_R = 'M17.4 10.8 C18.4 8.6 18.1 6.6 20.6 3.0 C16.8 3.6 14.0 6 13.0 9.6 Z M18.0 8.4 C19.2 7.4 20.4 7.6 21.8 8.4 C20.8 9.4 19.4 10 18.0 9.8 Z'
const WHISK = [[[4.7, 17.4], [2.8, 18.4], [3.6, 21.2], [1.4, 21.6]], [[19.3, 17.4], [21.2, 18.4], [20.4, 21.2], [22.6, 21.6]]]

function piece(name, field, base, glint) {
  const K = F.open(field, 0.32)
  const Ls = layers({ T: {}, K, Af: null, Ab: null, S: null, sil: F.copy(K), txt: null, seam: null })
  for (const l of Ls.list) if (!l.cls) l.cls = 'wm-k'
  const g = Ls.glint
  Ls.glint = null
  const out = emit(Ls, name, 0)
  const defs = out[0] && out[0][0] === 'defs' ? out.shift()[2] : []
  const re = s => typeof s === 'string' ? s.replace(/(wg-chrome-.+?-)(\d+)/g, (m, a, k) => a + (+k + base)) : s
  for (const gr of defs) gr[1].id = re(gr[1].id)
  for (const n of out) if (n[1] && n[1].fill) n[1].fill = re(n[1].fill)
  return { defs, out, glint: glint ? g : null }
}

export default function render(icon) {
  const name = (icon && icon.name) || 'dragon-head'
  const defs = [], nodes = []
  const add = p => { defs.push(...p.defs); nodes.push(...p.out) }
  const reg = d => F.region(rings(d), M0)
  for (const h of [HORN_L, HORN_R]) {
    const d = rings(h).map(r => 'M' + r.map(q => q.map(f).join(' ')).join('L') + 'Z').join('')
    nodes.push(['path', { d, fill: col('c3'), stroke: col('ink'), 'stroke-width': 0.8, 'stroke-linejoin': 'round', class: 'wm-k' }])
  }
  for (const w of WHISK) { const q = w.map(a => tf(a).map(f).join(' ')), d = 'M' + q[0] + ' C' + q.slice(1).join(' '); nodes.push(['path', { d, fill: 'none', stroke: col('ink'), 'stroke-width': 1.5, 'stroke-linecap': 'round', class: 'wm-a' }]) }
  const head = piece(name, reg(HEAD), defs.length, true)
  add(head)
  add(piece(name, reg(SNOUT), defs.length))
  // nostrils on the flared snout, then a toothy mouth line with two fangs
  for (const x of [9.6, 14.4]) {
    const [nx, ny] = tf([x, 17.4])
    nodes.push(['ellipse', { cx: f(nx), cy: f(ny), rx: f(1.0 * S), ry: f(0.75 * S), fill: col('ink'), class: 'wm-k' }])
  }
  nodes.push(['path', { d: poly([[7.4, 19.0], [12, 19.9], [16.6, 19.0], [16.6, 19.9], [12, 20.8], [7.4, 19.9]]), fill: col('ink'), class: 'wm-k' }])
  nodes.push(['path', { d: poly([[9.0, 19.5], [10.8, 19.9], [9.9, 21.4]]), fill: col('shine'), class: 'wm-k' }])
  nodes.push(['path', { d: poly([[15.0, 19.5], [13.2, 19.9], [14.1, 21.4]]), fill: col('shine'), class: 'wm-k' }])
  // eyes: pale ring, pink iris, ink pupil
  for (const [x, y] of [[8.5, 13.7], [15.5, 13.7]]) {
    const [ex, ey] = tf([x, y])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 1.75, fill: col('ink'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex), cy: f(ey), r: 1.5, fill: col('edge'), class: 'wm-a' }])
    nodes.push(['circle', { cx: f(ex), cy: f(ey + 0.15), r: 1.0, fill: col('accent'), class: 'wm-s' }])
    nodes.push(['circle', { cx: f(ex), cy: f(ey + 0.15), r: 0.5, fill: col('ink'), class: 'wm-s' }])
    nodes.push(['circle', { cx: f(ex - 0.35), cy: f(ey - 0.3), r: 0.28, fill: col('shine'), class: 'wm-shine' }])
  }
  // heavy angry brows
  nodes.push(['path', { d: poly([[5.6, 10.6], [10.9, 12.6], [10.9, 13.5], [5.9, 11.8]]), fill: col('ink'), class: 'wm-k' }])
  nodes.push(['path', { d: poly([[18.4, 10.6], [13.1, 12.6], [13.1, 13.5], [18.1, 11.8]]), fill: col('ink'), class: 'wm-k' }])
  if (head.glint) nodes.push(head.glint)
  return [['defs', {}, defs], ...nodes]
}
