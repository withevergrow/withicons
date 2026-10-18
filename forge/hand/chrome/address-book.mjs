// forge/hand/chrome/address-book.mjs — a chrome contacts book with three index tabs, the contact set into the cover as
// a flat gunmetal head and shoulders: the person's shape is cut from the cover (so the cover's light bevel rings it and
// its horizon stops short of it) and filled with one flat dark inlay, no tube, rim, horizon or sheen of its own. The
// generator ringed the person with a dark chrome tube that blurred into the cover at 16px. The inlay is the nodding
// part (wm-a, origin [11, 12]). The book is trimmed to the optical size of mail and inbox. Chrome model and paint
// from _chrome-core.mjs; only the geometry is drawn here.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.d); return { d: p.d, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}

const BOOK = 'M6 3 H16 A2 2 0 0 1 18 5 V19 A2 2 0 0 1 16 21 H6 A2 2 0 0 1 4 19 V5 A2 2 0 0 1 6 3 Z'
const TABS = 'M18 7.5 H20 M18 12 H20 M18 16.5 H20'
// the contact, on the 24 grid: head r 2 at (11, 9), shoulders 7.5-14.5 x 13.5-17.5
const HX = 11, HY = 9, HR = 2
const BUST = [7.5, 13.5, 14.5, 17.5, 2.5] // x0 y0 x1 y1 corner radius
const bustD = ([x0, y0, x1, y1, r], f = v => v, s = 1) =>
  `M${f(x0, 0)} ${f(y1, 1)} V${f(y0 + r, 1)} A${r * s} ${r * s} 0 0 1 ${f(x0 + r, 0)} ${f(y0, 1)} H${f(x1 - r, 0)} A${r * s} ${r * s} 0 0 1 ${f(x1, 0)} ${f(y0 + r, 1)} V${f(y1, 1)} Z`
const headD = (x, y, r) => `M${x + r} ${y} A${r} ${r} 0 1 1 ${x - r} ${y} A${r} ${r} 0 1 1 ${x + r} ${y} Z`

export default function render(icon) {
  const name = (icon && icon.name) || 'address-book'
  const Ls = layers(model(skeleton(name, [
    { d: BOOK, plate: 'K', fill: true },
    { d: TABS, plate: 'K' },
  ], [headD(HX, HY, HR), bustD(BUST)])))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  // the inlay, in the model's placement (scale about the centre, lifted for the shadow)
  const r2 = v => Math.round(v * 100) / 100
  const f = (v, axis) => r2((v - 12) * K.SCALE + 12 + (axis ? K.TY : K.TX))
  const ink = col('c3')
  out.push(['circle', { cx: f(HX, 0), cy: f(HY, 1), r: r2(HR * K.SCALE), fill: ink, class: 'wm-a' }])
  out.push(['path', { d: bustD(BUST, f, K.SCALE).replace(/(\d+\.\d{3,})/g, m => String(r2(+m))), fill: ink, class: 'wm-a' }])
  // keep the glint last, on top
  const gi = out.findIndex(n => n[0] === 'path' && n[1].class === 'wm-shine' && /Q/.test(n[1].d))
  if (gi >= 0) out.push(out.splice(gi, 1)[0])
  return out
}
