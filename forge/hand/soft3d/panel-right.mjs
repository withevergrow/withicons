// forge/hand/soft3d/panel-right.mjs — the window as one solid soft slab in its body colour, a raised light content area on
// the left and, past a visible frame-coloured divider, a narrow raised side pane on the right (a deeper tone, so it reads
// as its own panel with a few raised rows). The generated drawing knocked a faint notch through one window. Built with the
// house soft3d front-slab recipe (forge/styles/_soft3d-core.mjs build) from a hand-made skeleton.
import { build } from '../../styles/_soft3d-core.mjs'
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'

const FRAME = 'M5 3 H19 A2 2 0 0 1 21 5 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'
// main area: three overlapping closed bars (each small enough to be filled solid, plus the 2u stroke): visible x 4.5..13.5, y 7.25..19.5 under a body-colour title band
const MAIN = 'M5.5 8.25 H12.5 V11.75 H5.5 Z M5.5 11 H12.5 V15 H5.5 Z M5.5 14.25 H12.5 V18.5 H5.5 Z'
// side pane: visible x 15.25..19.5 (the ~1.75u divider between it and the main area is the frame)
const PANE = 'M16.25 8.25 H18.5 V11.75 H16.25 Z M16.25 11 H18.5 V15 H16.25 Z M16.25 14.25 H18.5 V18.5 H16.25 Z'
const LIGHT = 'var(--with-soft3d-c4, #F4F6FA)'
const DEEP = 'var(--with-soft3d-c3, #1C7B6F)'

export default function render(icon) {
  const nodes = build(skel(icon, { paths: [[MAIN, 'A'], [PANE, 'A']], fills: [FRAME], cutouts: [] }))
  // the main area is built as c2 -> light (c4), part of the body for motion; the pane (c3) keeps its own deeper tone
  let cur = null
  return nodes.map(([tag, a, kids]) => {
    if (tag === 'defs') return [tag, a, kids]
    const b = { ...a }
    const m = /--with-soft3d-(c2|c3),/.exec(String(b.fill || b.stroke || ''))
    if (b.class === 'wm-a' || (b.class === 'wm-shine' && cur)) { if (m) cur = m[1] } else if (b.class !== 'wm-k') cur = null
    for (const k of ['fill', 'stroke']) { const r = /--with-soft3d-(c2|c3),/.exec(String(b[k] || '')); if (r) b[k] = r[1] === 'c2' ? LIGHT : DEEP }
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
