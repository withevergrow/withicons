// forge/hand/chrome/avatar-dog.mjs: a dog: a chrome head with a lit muzzle, ink nose and eyes, an open smile with a tongue, a gunmetal eye patch
// and two floppy gunmetal ears hanging over the cheeks. The ears and patch are a second metal drawn over the head.
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

const HEAD = 'M12 5.8 C16 5.8 18.4 8.4 18.4 12 L18.4 14.6 C18.4 18.4 15.8 20.7 12 20.7 C8.2 20.7 5.6 18.4 5.6 14.6 L5.6 12 C5.6 8.4 8 5.8 12 5.8 Z'
const MUZZLE = oval(12, 16.6, 3.7, 3)
const EAR_L = 'M8.6 6.8 C6.6 5.4 3.4 6 2.9 9.2 C2.5 12 2.8 14.6 4.2 15.6 C5.4 16.4 6.5 15.4 6.8 13.8 L7 9.4 Z'
const EAR_R = 'M15.4 6.8 C17.4 5.4 20.6 6 21.1 9.2 C21.5 12 21.2 14.6 19.8 15.6 C18.6 16.4 17.5 15.4 17.2 13.8 L17 9.4 Z'
const PATCH = oval(14.9, 11.9, 2.2, 2.4, 32)
export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-dog'
  const out = paint(name, [{ d: HEAD, fill: true }], [MUZZLE])
  const g = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  const glint = g >= 0 ? out.splice(g, 1)[0] : null
  out.push(['path', { d: TD(MUZZLE), fill: col('tint'), class: 'wm-k' }])
  over(out, name, [{ d: EAR_L, fill: true, plate: 'A' }, { d: EAR_R, fill: true, plate: 'A' }])
  out.push(['path', { d: TD(PATCH), fill: col('c3'), class: 'wm-a' }])
  dot(out, 9.4, 12.2, 0.85, 'ink'); dot(out, 14.9, 12.2, 0.85, 'ink')
  dot(out, 9.7, 11.9, 0.28, 'shine', 'wm-shine'); dot(out, 15.2, 11.9, 0.28, 'shine', 'wm-shine')
  out.push(['path', { d: TD('M10.4 14.5 Q12 13.8 13.6 14.5 Q13.2 16 12 16.3 Q10.8 16 10.4 14.5 Z'), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: TD('M10.2 17.4 L13.8 17.4 Q13.6 19.6 12 19.6 Q10.4 19.6 10.2 17.4 Z'), fill: col('ink'), class: 'wm-k' }])
  out.push(['path', { d: TD('M11 18.6 Q12 17.8 13 18.6 Q12.6 19.4 12 19.4 Q11.4 19.4 11 18.6 Z'), fill: col('accent'), class: 'wm-k' }])
  if (glint) out.push(glint)
  return out
}
