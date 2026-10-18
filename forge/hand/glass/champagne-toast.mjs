// forge/hand/glass/champagne-toast.mjs — two glass champagne flutes raised so their rims clink, with bubbly colour
// inside and three accent sparks above the clink: the generated glass melted the tilted flutes, the liquid line and the
// clink rays into one tangled lilac shape that read as a pair of legs. Here each flute is a slim clear glass bowl on a
// stem and foot, the champagne is the deep colour body (accent glow, lit surface, rising bubbles), and the bowls stay apart.
// Roles: back/shadow champagne + stems, pane/frost glass, accent glow + sparks, shine rims and bubbles.
// Motion: glasses wm-k, champagne wm-a, sparks wm-s (twinkle about 12,3.5).
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, rect, simplify, area as ringArea } from '../../kernel/geom.mjs'
import { unionSets, intersectSets, differenceSets, translateSet, erode, dilate, setOf } from '../../kernel/bool.mjs'

const NAME = 'champagne-toast'
const f2 = v => +v.toFixed(2)
const tidy = set => set.map(r => simplify(r.map(([x, y]) => [Math.round(x * 1e3) / 1e3, Math.round(y * 1e3) / 1e3]), 0.01, true)).filter(r => r.length > 2 && Math.abs(ringArea(r)) > 0.04)
const D = (set, t = 0.03) => setD(tidy(set), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]
const rimOf = F => { const e = tidy(erode(F, 0.1)); return differenceSets(e, translateSet(e, 0.3, 0.45)) }

// one upright flute in local units: x across (0 = axis), y down from the rim
const BOWL = 'M-2.6 0 H2.6 C2.75 3.3 2.15 6.7 0.6 8.6 H-0.6 C-2.15 6.7 -2.75 3.3 -2.6 0 Z'
const STEM = 'M-0.5 8.3 H0.5 V12.6 H-0.5 Z'
const FOOT = 'M-2.05 12.15 H2.05 A0.65 0.65 0 0 1 2.05 13.45 H-2.05 A0.65 0.65 0 0 1 -2.05 12.15 Z'
const TH = 15 * Math.PI / 180

// lean the flute toward the middle: rim centre (cx, cy), side -1 = left glass (leans right), +1 = right glass
function placer(side) {
  const s = Math.sin(TH), c = Math.cos(TH)
  const cx = 12 + side * 2.75, cy = 8.4
  const nx = c, ny = -side * s          // across the rim (local +x)
  const dx = side * s, dy = c           // down the axis (local +y)
  return ([x, y]) => [cx + x * nx + y * dx, cy + x * ny + y * dy]
}
const local = (d, side) => { const P = placer(side); return unionSets(parsePath(d, 0.15).map(sub => setOf([sub.pts.map(p => P(side < 0 ? p : [-p[0], p[1]]))]))) }

export default function render(icon) {
  const name = (icon && icon.name) || NAME
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const id = `wg-glass-${name}-${n++}`; defs.push([tag, { id, ...a, gradientUnits: 'userSpaceOnUse' }, stops]); return `url(#${id})` }
  const gBody = grad('linearGradient', { x1: 5, y1: 9, x2: 19, y2: 22 }, [stop(0, V.c1), stop(1, V.shadow)])
  const gGlow = grad('radialGradient', { cx: 12, cy: 13.5, r: 6 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)])
  const gPane = grad('linearGradient', { x1: 4, y1: 6, x2: 18, y2: 18 }, [stop(0, V.frost, 0.58), stop(0.45, V.tint, 0.4), stop(1, V.tint, 0.26)])
  const gBase = grad('linearGradient', { x1: 4, y1: 15, x2: 18, y2: 22 }, [stop(0, V.frost, 0.5), stop(1, V.tint, 0.26)])

  const sides = [-1, 1]
  const bowls = sides.map(s => local(BOWL, s))
  const bases = sides.map(s => unionSets([local(STEM, s), local(FOOT, s)]))
  // champagne: the bowl below a level surface
  const LEVEL = 10.9
  const wines = bowls.map(b => intersectSets(erode(b, 0.15), setOf([rect(0, LEVEL, 24, 24)])))
  const out = []
  const all = unionSets([...bowls, ...bases])
  out.push(['path', { d: D(translateSet(dilate(all, 0.7), 0.3, 0.7), 0.08), fill: V.shadow, 'fill-opacity': 0.06, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  out.push(['path', { d: D(translateSet(dilate(all, 0.25), 0.3, 0.6), 0.06), fill: V.shadow, 'fill-opacity': 0.08, 'fill-rule': 'evenodd', class: 'wm-shadow' }])
  // colour bodies behind, shifted down-right: stems and feet, then the champagne with its glow
  const bodyBase = unionSets(bases.map(b => translateSet(b, 0.45, 0.4)))
  out.push(['path', { d: D(bodyBase), fill: gBody, 'fill-rule': 'evenodd', class: 'wm-k' }])
  const wd = D(unionSets(wines.map(w => translateSet(w, 0.5, 0.45))))
  out.push(['path', { d: wd, fill: gBody, 'fill-rule': 'evenodd', class: 'wm-a' }])
  out.push(['path', { d: wd, fill: gGlow, 'fill-rule': 'evenodd', class: 'wm-a' }])
  // the glass in front, a fine currentColor hairline on each pane
  const edge = { stroke: 'currentColor', 'stroke-opacity': 0.3, 'stroke-width': 0.5, 'stroke-linejoin': 'round', 'fill-rule': 'evenodd', class: 'wm-k' }
  const panesB = bases.map(b => translateSet(b, -0.25, -0.25))
  const panes = bowls.map(b => translateSet(b, -0.25, -0.25))
  out.push(['path', { d: D(unionSets(panesB)), fill: gBase, ...edge }])
  out.push(['path', { d: D(unionSets(panes)), fill: gPane, ...edge }])
  // the champagne surface: a lit line across each bowl at the level
  for (const w of wines) {
    let x0 = 99, x1 = -99
    for (const r of w) for (const [x, y] of r) if (Math.abs(y - LEVEL) < 0.05) { x0 = Math.min(x0, x); x1 = Math.max(x1, x) }
    if (x1 > x0) out.push(['path', { d: `M${f2(x0 + 0.45)} ${f2(LEVEL + 0.2)}H${f2(x1 + 0.05)}`, fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.55, 'stroke-linecap': 'round', class: 'wm-a' }])
  }
  // bubbles rising in the champagne
  for (const [x, y, r] of [[8.55, 13.0, 0.42], [9.2, 14.9, 0.32], [15.6, 12.9, 0.42], [14.95, 14.8, 0.32]]) {
    out.push(['circle', { cx: x, cy: y, r, fill: V.shine, 'fill-opacity': 0.88, class: 'wm-a' }])
  }
  // lit rims on the glass
  out.push(['path', { d: D(unionSets([...panes, ...panesB].map(rimOf))), fill: V.shine, 'fill-opacity': 0.85, class: 'wm-shine' }])
  // the clink: three accent sparks above where the rims meet
  const spark = { fill: 'none', stroke: V.accent, 'stroke-width': 1.3, 'stroke-linecap': 'round', class: 'wm-s' }
  out.push(['path', { d: 'M12 2.6V4.8M8.1 3.2L9.2 4.9M15.9 3.2L14.8 4.9', ...spark }])
  out.push(['path', { d: 'M11.85 2.9V3.6M8.25 3.55L8.55 4.0M15.75 3.55L15.45 4.0', fill: 'none', stroke: V.shine, 'stroke-opacity': 0.8, 'stroke-width': 0.4, 'stroke-linecap': 'round', class: 'wm-s' }])
  return [['defs', {}, defs], ...out]
}
