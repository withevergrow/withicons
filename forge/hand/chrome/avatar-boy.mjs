// forge/hand/chrome/avatar-boy.mjs: a boy: a chrome head with a lit face (two eyes, a grin), crowned by a gunmetal cap of hair with a
// side-swept fringe and a spiky tuft, over chrome shoulders. Hair is a second metal drawn over the head so head, hair and face read apart.
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

const HAIR = 'M5.9 11 C5 6.6 8 4.3 12 4.3 C16 4.3 19 6.6 18.1 11 C17.8 9.5 17.1 8.7 16.1 8.2 C14.4 9 10.6 8.6 8.5 7.6 C7 8.5 6.2 9.6 5.9 11 Z'
const TUFT = 'M7.8 6.2 L8.6 2.6 L10.8 4.3 L12.4 1.4 L14 4.2 L16.2 2.8 L16.4 6.4 Z'
const HEAD = oval(12, 11.2, 5.9, 5.8)
const FACE = oval(12, 12.3, 4.2, 4.1)
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-boy'
  const out = paint(name, [{ d: SH, fill: true }, { d: HEAD, fill: true }], [FACE])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(FACE), fill: col('tint'), class: 'wm-k' }])
  over(out, name, [{ d: HAIR, fill: true, plate: 'A' }, { d: TUFT, fill: true, plate: 'A' }])
  dot(out, 10.2, 12.8, 0.62, 'ink'); dot(out, 13.8, 12.8, 0.62, 'ink')
  line(out, 'M10.4 14.7 Q12 16.2 13.6 14.7', 'ink', 0.65)
  if (glint) out.push(glint)
  return out
}
