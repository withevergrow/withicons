// forge/hand/chrome/newspaper.mjs — a polished chrome broadsheet with its folded back page tucked behind on the left:
// a square gunmetal headline bar across the top, one solid gunmetal photo block in the left column, two lines of
// print beside it and one across the full measure below (the mirror horizon steps out from under the print, as it
// does for the style's Live text). The generated drawing cut a framed window round a gunmetal block (a building or a
// card), cut grooves for the text read as a keypad, and a long fold groove ran into the back page as a hook. Same
// model and paint as the generator (_chrome-core.mjs); the headline and photo are laid over their gunmetal pieces as
// flat type-like blocks (no rim), so they read as print, not as a slot and a window.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf } from '../../kernel/bool.mjs'
import { model, layers, emit, col, K } from '../../styles/_chrome-core.mjs'

// a skeleton in the shape model() expects: parts [{ d, plate, fill }], cutouts [d]
function skeleton(name, parts, cuts = []) {
  const paths = parts.map((p, i) => ({ id: 'p' + i, d: p.d, plate: p.plate || 'K', subs: parsePath(p.d) }))
  const fills = parts.filter(p => p.fill).map(p => { const subs = parsePath(p.fill); return { d: p.fill, subs, set: setOf(subs.map(s => s.pts)) } })
  const cutouts = cuts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths, fills, cutouts, lines: paths.flatMap(p => p.subs.map(x => ({ pts: x.pts, closed: x.closed, plate: p.plate, pathId: p.id }))) }
}
const r2 = v => Math.round(v * 100) / 100
const X = x => r2((x - 12) * K.SCALE + 12 + K.TX)
const Y = y => r2((y - 12) * K.SCALE + 12 + K.TY)
const S = v => r2(v * K.SCALE)

const SHEET = 'M4.5 20H19A2 2 0 0 0 21 18V6A2 2 0 0 0 19 4H9A2 2 0 0 0 7 6V17.5A2.5 2.5 0 0 1 4.5 20Z'
const BACK = 'M7 9H4.5A1.5 1.5 0 0 0 3 10.5V18.5A1.5 1.5 0 0 0 4.5 20'
const MASS = 'M4.5 20H19A2 2 0 0 0 21 18V6A2 2 0 0 0 19 4H9A2 2 0 0 0 7 6V9H4.5A1.5 1.5 0 0 0 3 10.5V18.5A1.5 1.5 0 0 0 4.5 20Z'
// the fold between the back page and the front sheet: stops short of the bottom curve, so it never hooks
const FOLD = 'M7 10.5V16.75'
// gunmetal pieces (their tubes give the parting seam); flat blocks are laid over them
const HEADLINE = 'M10.5 7.25H18'
const PHOTO = 'M11.25 12.25H12.25V13.25H11.25Z'
// blocks drawn over the pieces [x0, y0, x1, y1, r]
const HEAD_BOX = [9.35, 6, 19.15, 8.5, 0.45]
const PHOTO_BOX = [10, 11, 13.5, 14.5, 0.5]
// print: two lines beside the photo, one across the full measure below
const PRINT = [[15.25, 18.75, 11.75], [15.25, 18.75, 13.75], [10.25, 18.75, 17]]

const box = ([x0, y0, x1, y1, r]) => ({ x: X(x0), y: Y(y0), width: S(x1 - x0), height: S(y1 - y0), rx: S(r) })
// a flat gunmetal block with a soft lit top: reads as solid type, not a framed window
function block(b) {
  const B = box(b), top = { ...B, height: r2(B.height * 0.42) }
  return [
    ['rect', { ...B, fill: col('c3'), class: 'wm-a' }],
    ['rect', { ...top, fill: col('c2'), class: 'wm-a' }],
    ['rect', { x: r2(B.x + B.rx), y: r2(B.y + 0.2), width: r2(B.width - 2 * B.rx), height: 0.35, rx: 0.17, fill: col('tint'), 'fill-opacity': 0.55, class: 'wm-shine' }],
  ]
}

export default function render(icon) {
  const name = (icon && icon.name) || 'newspaper'
  const glyphs = PRINT.map(([a, b, y]) => ({ pts: [[a, y], [b, y]], closed: false }))
  const Ls = layers(model(skeleton(name, [
    { d: SHEET, plate: 'K', fill: MASS },
    { d: BACK, plate: 'K' },
    { d: HEADLINE, plate: 'A' },
    { d: PHOTO, plate: 'A', fill: PHOTO },
  ], [FOLD]), { glyphs }))
  for (const L of Ls.list) if (!L.cls) L.cls = 'wm-k'
  const out = emit(Ls, name, 0)
  out.push(...block(HEAD_BOX), ...block(PHOTO_BOX))
  const d = PRINT.map(([a, b, y]) => `M${X(a)} ${Y(y)}H${X(b)}`).join('')
  const base = { d, fill: 'none', 'stroke-linecap': 'round', class: 'wm-k' }
  out.push(['path', { ...base, stroke: col('edge'), 'stroke-width': 1.8 }])
  out.push(['path', { ...base, stroke: col('ink'), 'stroke-width': 1 }])
  return out
}
