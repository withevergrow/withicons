// forge/hand/clay/avatar-monster-horns.mjs — a friendly horned monster in clay: a round green face, two pointed golden
// horns curving up and out, two dark dot eyes and a wide open grin with two white teeth. The generator painted the
// horns pink like cat ears and filled the mouth with a pink blob; here the horns are real thorns, the mouth is dark
// with teeth. Face, horns and eyes are the generator's clay model (_clay-core.mjs); the mouth is laid on the face
// through the model's transform.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { build } from '../../styles/_clay-core.mjs'
import { K } from '../../styles/_clay-model.mjs'

function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
// horns in a warm gold so they read as horns, not ears (the roles still come from the palette)
const HORN = { c2: '#FFC247', c3: '#E8803A' }
function recolor(n) {
  if (!Array.isArray(n)) return n
  const [tag, a, kids] = n, b = {}
  for (const k in a) b[k] = typeof a[k] === 'string' ? a[k].replace(/var\(--with-clay-(c2|c3), #[0-9A-Fa-f]+\)/g, (m, r) => `var(--with-clay-${r}, ${HORN[r]})`) : a[k]
  return kids ? [tag, b, kids.map(recolor)] : [tag, b]
}
const r2 = n => Math.round(n * 100) / 100
const tfD = d => d.replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g, (m, x, y) => `${r2((x - 12) * K.SCALE + 12 + K.TX)} ${r2((y - 12) * K.SCALE + 12 + K.TY)}`)

const FACE = 'M19.5 14A7.5 7.5 0 1 1 4.5 14A7.5 7.5 0 1 1 19.5 14Z'
// each horn: a thorn from the crown out to a sharp tip
const HORN_L = 'M7.2 9.6C5.2 8 4.2 5 4.4 1.7C6.6 3 8.6 4.7 10 7.2Z'
const HORN_R = 'M16.8 9.6C18.8 8 19.8 5 19.6 1.7C17.4 3 15.4 4.7 14 7.2Z'
const SH_L = 'M10 7.2C8.6 4.7 6.6 3 4.4 1.7C6.4 4.6 7.8 7.4 8.2 9.2Z'
const SH_R = 'M14 7.2C15.4 4.7 17.4 3 19.6 1.7C17.6 4.6 16.2 7.4 15.8 9.2Z'
const LI_L = 'M5.4 3.6C5.7 5.8 6.5 7.4 7.6 8.5'
const LI_R = 'M18.6 3.6C18.3 5.8 17.5 7.4 16.4 8.5'
const EYES = ['M10.3 12.6A0.9 1.15 0 1 1 8.5 12.6A0.9 1.15 0 1 1 10.3 12.6Z', 'M15.5 12.6A0.9 1.15 0 1 1 13.7 12.6A0.9 1.15 0 1 1 15.5 12.6Z']
const MOUTH = 'M8.2 15.3C8.2 15 8.4 14.9 8.7 14.9L15.3 14.9C15.6 14.9 15.8 15 15.8 15.3C15.4 18 13.9 19.3 12 19.3C10.1 19.3 8.6 18 8.2 15.3Z'
const TOOTH_L = 'M9.3 15.1L10.2 16.9L11.1 15.1Z'
const TOOTH_R = 'M12.9 15.1L13.8 16.9L14.7 15.1Z'
const TONGUE = 'M10.2 18.3C10.6 17.5 13.4 17.5 13.8 18.3C13.2 19 10.8 19 10.2 18.3Z'

export default function render(icon) {
  const name = (icon && icon.name) || 'avatar-monster-horns'
  const nodes = (build(skeleton(name, [
    { d: FACE, plate: 'K', fill: true },
  ], EYES)) || []).map(recolor)
  // horns sit behind the face: a gold thorn, a shaded flank on its inner side, a lit stripe up its outer edge
  const at = nodes.findIndex(n => n[1] && n[1].class === 'wm-k')
  const horns = []
  for (const [h, sh, li] of [[HORN_L, SH_L, LI_L], [HORN_R, SH_R, LI_R]]) {
    horns.push(['path', { d: tfD(h), fill: 'var(--with-clay-c2, #FFC247)', stroke: 'var(--with-clay-shadow, #164A2A)', 'stroke-opacity': 0.12, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-a' }])
    horns.push(['path', { d: tfD(sh), fill: 'var(--with-clay-c3, #E8803A)', 'fill-opacity': 0.4, class: 'wm-a' }])
    horns.push(['path', { d: tfD(li), stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-opacity': 0.65, 'stroke-width': 0.45, 'stroke-linecap': 'round', fill: 'none', class: 'wm-shine' }])
  }
  nodes.splice(at < 0 ? nodes.length : at, 0, ...horns)
  // the grin: a dark open mouth, a warm tongue at its floor, two white teeth hanging from the top lip, a lit rim
  nodes.push(['path', { d: tfD(MOUTH), fill: 'var(--with-clay-ink, #2A1D5C)', class: 'wm-k' }])
  nodes.push(['path', { d: tfD(TONGUE), fill: 'var(--with-clay-c3, #FF5C97)', 'fill-opacity': 0.85, class: 'wm-k' }])
  for (const t of [TOOTH_L, TOOTH_R]) nodes.push(['path', { d: tfD(t), fill: 'var(--with-clay-shine, #FFFFFF)', stroke: 'var(--with-clay-shine, #FFFFFF)', 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-shine' }])
  return nodes
}
