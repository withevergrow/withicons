// forge/hand/chrome/avatar-woman-braids.mjs: a woman with a dark gunmetal centre-parted dome of hair over a chrome head, a lit face (two eyes, a smile)
// and two hanging braids of beads over chrome shoulders. The hair is a flat second metal so the face stays readable.
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

const HAIR = 'M5.7 13 C4.9 6.6 8 2.9 12 2.9 C16 2.9 19.1 6.6 18.3 13 L16.9 13 C16.8 10 14.9 8 12 7.5 C9.1 8 7.2 10 7.1 13 Z'
const DOME = 'M5.7 13 C4.9 6.6 8 2.9 12 2.9 C16 2.9 19.1 6.6 18.3 13 Z'
const HEAD = oval(12, 11, 5.7, 5.9)
const FACE = oval(12, 12.3, 4.5, 4.4)
const bead = (out, x, y, r) => out.push(['circle', { cx: f(x, 0), cy: f(y, 1), r: r2(r * K.SCALE), fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.4, class: 'wm-a' }])
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-woman-braids'
  const out = paint(name, [{ d: SH, fill: true }, { d: HEAD, fill: true }], [])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(DOME), fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.4, 'stroke-linejoin': 'round', class: 'wm-a' }])
  out.push(['path', { d: TD(FACE), fill: col('tint'), stroke: col('edge'), 'stroke-width': 0.4, class: 'wm-k' }])
  line(out, 'M7.6 12.6 C7.6 9.6 9.4 8 12 7.6 C14.6 8 16.4 9.6 16.4 12.6', 'c3', 0.5, 'wm-a')
  line(out, 'M12 3.8 L12 7.4', 'tint', 0.45, 'wm-a')
  line(out, 'M7.6 8 Q8.8 5.2 11 4.2', 'tint', 0.5, 'wm-shine')
  dot(out, 10.2, 12.6, 0.62, 'ink'); dot(out, 13.8, 12.6, 0.62, 'ink')
  line(out, 'M10.5 14.6 Q12 16 13.5 14.6', 'ink', 0.65)
  for (const x of [5, 19]) {
    line(out, 'M' + x + ' 11 L' + x + ' 17', 'c3', 1.3, 'wm-a')
    for (const y of [12, 14.1, 16.2]) bead(out, x, y, 1.2)
    out.push(['path', { d: TD(`M${n2(x - 1)} 17.3 L${x} 20 L${n2(x + 1)} 17.3 Z`), fill: col('c3'), stroke: col('edge'), 'stroke-width': 0.35, 'stroke-linejoin': 'round', class: 'wm-a' }])
  }
  if (glint) out.push(glint)
  return out
}
