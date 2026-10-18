// forge/hand/gloss/brain-circuit.mjs — a glossy half brain (a lobed cloud with a flat cut face) with two carved fold
// grooves, and three circuit traces ending in round nodes held clear of it by a moat. The traces are the moving part (wm-a).
// The generated drawing closed brain, traces and nodes into one black lump with the folds lost. Same vinyl recipe as
// the generator (forge/styles/gloss.mjs models the masses); only the skeleton is drawn.
import { parsePath, circle, rect } from '../../kernel/geom.mjs'
import { setOf, unionSets, intersectSets } from '../../kernel/bool.mjs'
import gloss from '../../styles/gloss.mjs'

// fills may be path data or ready region sets
function prep(name, fills = [], cutouts = []) {
  const F = fills.map(f => {
    if (typeof f !== 'string') return { d: '', subs: f.map(r => ({ pts: r, closed: true })), set: f }
    const subs = parsePath(f); return { d: f, subs, set: setOf(subs.map(s => s.pts)) }
  })
  const C = cutouts.map(d => ({ d, subs: parsePath(d) }))
  return { name, paths: [], fills: F, cutouts: C, lines: [], fillSet: F.length ? unionSets(F.map(f => f.set)) : [] }
}
const rr = (x, y, w, h, r) => `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`
const circ = (cx, cy, r) => `M${cx + r} ${cy}A${r} ${r} 0 1 1 ${cx - r} ${cy}A${r} ${r} 0 1 1 ${cx + r} ${cy}Z`
const tag = (nodes, cls) => gloss.render(nodes).map(([t, a]) => [t, { ...a, class: cls }])

export default function render(icon) {
  const name = (icon && icon.name) || 'brain-circuit'
  // the brain: overlapping lobes, flat on the right where the circuits leave
  const lobes = unionSets([
    setOf([circle(6.6, 7.5, 3.8)]), setOf([circle(10.6, 6.4, 3.1)]), setOf([circle(4.8, 11.6, 3.2)]),
    setOf([circle(5.9, 15.9, 3.4)]), setOf([circle(10.3, 16.4, 3.1)]), setOf([rect(4.6, 7, 13, 16.2)]),
  ])
  const half = intersectSets(lobes, setOf([rect(0, 0, 13, 24)]))
  const brain = prep(name, [half], ['M8.7 3.6C8.5 5.8 9 7.4 10.6 9.4', 'M2.4 9.6C4.6 9.7 6.2 10.7 6.7 12.8', 'M2.6 14.3C4.8 14 7 14.7 8.3 17.2'])
  // circuits: three traces, each ending in a round node
  const rows = prep(name, [
    rr(14.4, 5.7, 5, 1.8, 0.9), circ(19.4, 6.6, 1.95),
    rr(14.4, 11.1, 6.2, 1.8, 0.9), circ(20.6, 12, 1.95),
    rr(14.4, 16.5, 5, 1.8, 0.9), circ(19.4, 17.4, 1.95),
  ])
  return [...tag(brain, 'wm-k'), ...tag(rows, 'wm-a')]
}
