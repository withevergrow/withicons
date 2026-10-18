// forge/hand/gloss/printer.mjs — a glossy inkjet: a fat body with a white paper window that runs down past its
// base (the sheet coming out), a separate framed sheet standing up behind it, and a tiny status glint.
// The generated drawing fused the tray, body and sheet into one near-black mass. Here the sheet is its own part
// (wm-a) with a moat, and the paper is a real white window, so the silhouette reads as a printer at 16px.
// Same vinyl recipe as the generator (forge/styles/gloss.mjs models the masses); only the skeleton is drawn.
import { parsePath } from '../../kernel/geom.mjs'
import { setOf, unionSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

function prep(name, fills = [], cutouts = []) {
  const F = fills.map(f => { const subs = parsePath(f); return { d: f, subs, set: setOf(subs.map(s => s.pts)) } })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths: [], fills: F, cutouts: C, lines: [], fillSet: F.length ? unionSets(F.map(f => f.set)) : [] }
}
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const circ = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const tag = (nodes, cls) => gloss.render(nodes).map(([t, a]) => [t, { ...a, class: cls }])

export default function render(icon) {
  const name = (icon && icon.name) || 'printer'
  // body (with the sheet's lower end hanging below it) and the white window, plus a status dot
  const body = prep(name,
    [rr(2.5, 9.5, 19, 9, 2.75), rr(6.5, 14, 11, 7.75, 1.25)],
    [rr(8.5, 14, 7, 6, 0.9), circ(19, 12.25, 0.7)])
  // the sheet standing behind: a framed page, separated from the body by a moat
  const sheet = prep(name, [rr(6.5, 2, 11, 6.25, 1.5)], [rr(8.5, 3.75, 7, 2.5, 0.5)])
  return [...tag(body, 'wm-k'), ...tag(sheet, 'wm-a')]
}
