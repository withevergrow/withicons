// forge/hand/chrome/avatar-teen.mjs: a teen: a chrome head in a gunmetal hoodie (hood pulled up around the head, shoulders below), a
// pale lit face with ink eyes and a smile, a long side-swept gunmetal fringe over the brow and two light drawstrings. The pale face
// against the dark hood and fringe keeps the features legible at 16-24px; fringe and cords are drawn over the body.
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

const HOOD = 'M3.8 21.8C3.8 19.6 4.6 18.3 6 17.6C4.4 15.9 3.6 13.8 3.6 11.5C3.6 6.8 7.2 3.2 12 2.4C16.8 3.2 20.4 6.8 20.4 11.5C20.4 13.8 19.6 15.9 18 17.6C19.4 18.3 20.2 19.6 20.2 21.8Z'
const HEAD = oval(12, 11.4, 5.3, 5.6)
const FACE = oval(12, 12.6, 4.2, 4.0)
const FRINGE = 'M6.6 10.4 C6.2 6.2 8.6 3.9 12 3.9 C15.4 3.9 17.8 6.2 17.4 10.4 C16.6 9 15.6 8.2 14.4 7.8 C12.2 9.4 9.4 9.8 7.6 9.4 C7.1 9.7 6.8 10 6.6 10.4 Z'
const COLLAR = 'M8.2 17.2 C9.4 18.6 14.6 18.6 15.8 17.2 C14.6 16.6 9.4 16.6 8.2 17.2 Z'
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-teen'
  const out = paint(name, [{ d: HOOD, fill: true, plate: 'A' }, { d: HEAD, fill: true }], [FACE])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  over(out, name, [{ d: FRINGE, fill: true, plate: 'A' }, { d: COLLAR, fill: true, plate: 'A' }])
  dot(out, 10.3, 12.9, 0.7, 'ink'); dot(out, 13.7, 12.9, 0.7, 'ink')
  line(out, 'M10.3 14.8 Q12 16.3 13.7 14.8', 'ink', 0.7)
  line(out, 'M10 18.8 V20.8', 'tint', 0.6); line(out, 'M14 18.8 V20.8', 'tint', 0.6)
  if (glint) out.push(glint)
  return out
}
