// forge/hand/soft3d/panel-left-open.mjs — the window as one solid soft slab in its body colour (frame + left sidebar), the main
// area as a raised light content panel, and an outward (right-pointing) chevron in the body colour raised on that panel.
// The generated drawing knocked the main area through, so a small, low-contrast chevron floated over the page
// background and vanished at 16px. Built with the house soft3d front-slab recipe (forge/styles/_soft3d-core.mjs build).
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const FRAME = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
// the content panel: one A path of three overlapping closed bars (each small enough to be filled solid, plus the 2u
// stroke around it), so the union is one solid panel: visible x 10.5..19.5, y 4.5..19.5
const PANEL = 'M11.5 5.5 H18.5 V10.5 H11.5 Z M11.5 9.75 H18.5 V14.25 H11.5 Z M11.5 13.5 H18.5 V18.5 H11.5 Z'
const CHEVRON = 'M13 8 L17 12 L13 16'
const LIGHT = 'var(--with-soft3d-c4, #F4F6FA)'
const BODY = 'var(--with-soft3d-c1, #3D7EE0)'

export default function render(icon) {
  const nodes = build(skel(icon, { paths: [[PANEL, 'A'], [CHEVRON, 'A']], fills: [FRAME], cutouts: [] }))
  // the panel is built as c2 -> light (c4), part of the body for motion; the chevron (c3) -> body colour (c1), it moves
  let cur = null
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids]
    const b = { ...a }
    const m = /--with-soft3d-(c2|c3),/.exec(String(b.fill || b.stroke || ''))
    if (b.class === 'wm-a' || (b.class === 'wm-shine' && cur)) { if (m) cur = m[1] } else if (b.class !== 'wm-k') cur = null
    for (const k of ['fill', 'stroke']) { const r = /--with-soft3d-(c2|c3),/.exec(String(b[k] || '')); if (r) b[k] = r[1] === 'c2' ? LIGHT : BODY }
    if (cur === 'c2' && b.class === 'wm-a') b.class = 'wm-k'
    return [tag, b]
  })
}

function skel(icon, { paths, fills, cutouts }) {
  const P = paths.map(([d, plate], i) => ({ id: 'p' + i, d, plate, subs: parsePath(d) }))
  const F = fills.map(d => { const subs = parsePath(d); return { d, subs, set: setOf(subs.map(s => s.pts)) } })
  return {
    name: icon.name, category: icon.category, paths: P, fills: F, cutouts: cutouts.map(d => ({ d, subs: parsePath(d) })),
    lines: P.flatMap(p => p.subs.map(s => ({ pts: s.pts, closed: s.closed, plate: p.plate, pathId: p.id }))),
    fillSet: F.length ? unionSets(F.map(f => f.set)) : [],
  }
}
