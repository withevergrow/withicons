// forge/hand/chrome/avatar-person-glasses.mjs: a person in rectangular glasses: a chrome head with a lit face, a gunmetal cap of hair, and bold dark-framed
// glasses with glassy lenses and two eyes drawn over it, on chrome shoulders.
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

const HAIR = 'M6.3 10 C5.6 5.6 8.4 2.9 12 2.9 C15.6 2.9 18.4 5.6 17.7 10 C17 8.6 15.8 7.8 14.3 7.6 C12.8 7.4 11.3 7.6 9.8 6.9 C8.5 7.5 7.2 8.6 6.3 10 Z'
const HEAD = oval(12, 10.6, 5.8, 5.9)
const FACE = oval(12, 11.2, 4.7, 4.8)
const lens = (x0, x1) => `M${x0 + 1} 9.6 L${x1 - 1} 9.6 Q${x1} 9.6 ${x1} 10.6 L${x1} 12 Q${x1} 13 ${x1 - 1} 13 L${x0 + 1} 13 Q${x0} 13 ${x0} 12 L${x0} 10.6 Q${x0} 9.6 ${x0 + 1} 9.6 Z`
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-person-glasses'
  const out = paint(name, [{ d: SH, fill: true }, { d: HEAD, fill: true }], [FACE])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  over(out, name, [{ d: HAIR, fill: true, plate: 'A' }])
  for (const [a, b] of [[6.6, 11.2], [12.8, 17.4]]) {
    out.push(['path', { d: TD(lens(a, b)), fill: col('shine'), stroke: col('c3'), 'stroke-width': 1, 'stroke-linejoin': 'round', class: 'wm-k' }])
  }
  line(out, 'M11.2 10.7 L12.8 10.7', 'c3', 0.9)
  dot(out, 8.9, 11.3, 0.6, 'ink'); dot(out, 15.1, 11.3, 0.6, 'ink')
  line(out, 'M10.8 15 Q12 15.9 13.2 15', 'ink', 0.65)
  if (glint) out.push(glint)
  return out
}
