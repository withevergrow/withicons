// forge/hand/liquid/ticket.mjs — an admission ticket as two glass pieces: a clear glass body and a violet-glass stub,
// torn apart along a clean vertical tear line, with a round notch bitten out of each end. The generated ticket was a
// clear slab with three tiny ringed dots and barely-there side notches, so it read as a coupon or a switch plate;
// here the stub and the tear line make "ticket" the first read at 16px. Painted with the style's own glass recipe
// (_liquid-core build); only the geometry is drawn here, at the size the recipe grows a skeleton to.
import { parsePath } from '../../kernel/geom.mjs'
import { build, col } from '../../styles/_liquid-core.mjs'

const linesOf = (d, plate) => parsePath(d).map(s => ({ pts: s.pts, closed: s.closed, plate }))

// finished glass outlines (the recipe grows the skeleton's 2..22 x 5..19 ticket to 0.7..23.3 x 3.7..20.3)
// body: rounded outer corners, a 2.2u notch on the left, softened corners at the tear
const BODY = 'M4 3.7H14A0.8 0.8 0 0 1 14.8 4.5V19.5A0.8 0.8 0 0 1 14 20.3H4A3.3 3.3 0 0 1 0.7 17V14.2A2.2 2.2 0 0 0 0.7 9.8V7A3.3 3.3 0 0 1 4 3.7Z'
// stub: the same on the right, parted from the body by a 1.4u tear line
const STUB = 'M17 3.7H20A3.3 3.3 0 0 1 23.3 7V9.8A2.2 2.2 0 0 0 23.3 14.2V17A3.3 3.3 0 0 1 20 20.3H17A0.8 0.8 0 0 1 16.2 19.5V4.5A0.8 0.8 0 0 1 17 3.7Z'
// centre lines that mark each piece's plate; their strokes (2.6u K, 2.3u A) stay inside the outlines
const KCORE = 'M4.5 5.1H13.5V18.9H4.5Z'
const ACORE = 'M19 5V19'

export default function render(icon) {
  const name = (icon && icon.name) || 'ticket'
  const nodes = build({
    name, cutouts: [],
    paths: [{ id: 'p0', d: KCORE, plate: 'K' }, { id: 'p1', d: ACORE, plate: 'A' }],
    lines: [...linesOf(KCORE, 'K'), ...linesOf(ACORE, 'A')],
    fills: [{ d: BODY, subs: parsePath(BODY) }, { d: STUB, subs: parsePath(STUB) }],
  })
  if (!nodes) return null
  const g0 = `wg-liquid-${name}-0`, g1 = `wg-liquid-${name}-1`
  const deeper = { [g0]: [0.2, 0.44, 0.7], [g1]: [0.42, 0.85] }
  const out = nodes.map(n => {
    if (n[0] === 'defs') {
      return ['defs', {}, n[2].map(g => deeper[g[1].id]
        ? [g[0], g[1], g[2].map((s, i) => ['stop', { ...s[1], 'stop-opacity': deeper[g[1].id][i] }])]
        : g)]
    }
    const a = n[1]
    if (a['stroke-width'] === 0.22) return [n[0], { ...a, 'stroke-opacity': 0.45, 'stroke-width': 0.26 }]
    return n
  })
  // ticket cues: a bold star on the body, a perforation row beside the tear, a crisp rim for dark backgrounds
  // (all in the style's own colours: a violet-glass star, c3 perforation dots and a tinted edge, no black ink)
  out.push(['path', { class: 'wm-deco', d: 'M8 8.2L9.1 10.6L11.7 10.9L9.8 12.7L10.3 15.3L8 14L5.7 15.3L6.2 12.7L4.3 10.9L6.9 10.6Z', fill: col('c2'), 'fill-opacity': 0.85, stroke: col('c3'), 'stroke-opacity': 0.55, 'stroke-width': 0.3, 'stroke-linejoin': 'round' }])
  for (const y of [6, 8.4, 10.8, 13.2, 15.6, 18]) out.push(['circle', { class: 'wm-deco', cx: 13.2, cy: y, r: 0.5, fill: col('c3'), 'fill-opacity': 0.55 }])
  out.push(['path', { class: 'wm-shine', d: BODY, fill: 'none', stroke: col('edge'), 'stroke-width': 0.45, 'stroke-opacity': 0.9 }])
  return out
}
