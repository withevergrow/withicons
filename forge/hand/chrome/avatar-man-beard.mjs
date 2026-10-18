// forge/hand/chrome/avatar-man-beard.mjs: a bearded man: a chrome head with a lit face and two eyes, a swept gunmetal haircut and a full gunmetal
// beard (with a lit smile) drawn over it, on chrome shoulders. Hair and beard are a second metal so the face stays clean.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate || 'K', pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
const TD = d => d.replace(/(-?\d*\.?\d+) (-?\d*\.?\d+)/g, (_, x, y) => `${f(+x, 0)} ${f(+y, 1)}`)
const n2 = v => +v.toFixed(2)
const oval = (x, y, rx, ry, k = 48) => 'M' + Array.from({ length: k }, (_, i) => { const a = i / k * Math.PI * 2; return `${n2(x + rx * Math.cos(a))} ${n2(y + ry * Math.sin(a))}` }).join(' L') + ' Z'
function paint(name, parts, cuts) {
  const Ls = layers(model(skeleton(name, parts, cuts)))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  return emit(Ls, name, 0)
}
function glintLast(out) {
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}
const SH = 'M4.5 22 C4.5 18.8 7.8 17.2 12 17.2 C16.2 17.2 19.5 18.8 19.5 22 Z'
const dot = (out, x, y, r, c, cls = 'wm-k') => out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col(c), class: cls }])
const line = (out, d, c, w, cls = 'wm-k') => out.push(['path', { d: TD(d), stroke: col(c), 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', fill: 'none', class: cls }])
// a second pass for the hair: its own pieces drawn over the body (shadow and glint left to the body), gradient ids renumbered
function over(out, name, parts, cuts = []) {
  const H = paint(name + 'h', parts, cuts)
  const defs = out.find(n => n[0] === 'defs'), hd = H.find(n => n[0] === 'defs')
  const base = defs ? defs[2].length : 0
  const rn = s => typeof s === 'string' ? s.replace(new RegExp('wg-chrome-' + name + 'h-([0-9]+)', 'g'), (_, i) => `wg-chrome-${name}-${base + +i}`) : s
  const body = H.filter(n => n[0] !== 'defs' && n[1].class !== 'wm-shadow' && !(n[1].class === 'wm-shine' && /Q/.test(n[1].d)))
  if (hd) {
    const mapped = hd[2].map(g => [g[0], { ...g[1], id: rn(g[1].id) }, g[2]])
    if (defs) defs[2].push(...mapped); else out.unshift(['defs', {}, mapped])
  }
  for (const n of body) out.push([n[0], { ...n[1], fill: rn(n[1].fill) }])
  return out
}

const HAIR = 'M6.4 9.2 C5.6 5.8 7.9 3.2 11.5 3 C13.5 2.4 16.1 2.4 17 3.8 C17.8 5.2 18 7.4 17.6 9.2 C17.3 8.4 16.9 7.7 16.1 7.2 C13.6 7.3 11.1 6.6 9.6 5.2 C8.6 6.4 7.2 7.6 6.4 9.2 Z'
const BEARD = 'M6.9 12.3 C7.3 14.9 9 16.6 12 16.6 C15 16.6 16.7 14.9 17.1 12.3 C16.3 13.3 15.5 13.6 14.4 13.6 C13.5 13.6 12.7 13.3 12 13 C11.3 13.3 10.5 13.6 9.6 13.6 C8.5 13.6 7.7 13.3 6.9 12.3 Z'
const HEAD = oval(12, 10.6, 5.8, 5.9)
const FACE = oval(12, 10.8, 4.7, 4.9)
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-man-beard'
  const out = paint(name, [{ d: SH, fill: true }, { d: HEAD, fill: true }], [FACE])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  over(out, name, [{ d: HAIR, fill: true, plate: 'A' }, { d: BEARD, fill: true, plate: 'A' }])
  dot(out, 9.7, 10, 0.65, 'ink'); dot(out, 14.3, 10, 0.65, 'ink')
  line(out, 'M10.7 14.9 Q12 15.8 13.3 14.9', 'tint', 0.7)
  if (glint) out.push(glint)
  return out
}
