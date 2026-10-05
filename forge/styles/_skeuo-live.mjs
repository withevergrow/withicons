// SKEUO Live icons (forge/DYNAMIC.md): the value of a Live icon is lettered on the finished object, the way a
// maker would letter a real one, so it reads at 24px on every material and never melts into a groove or a rod.
//
//   stripText(icon, glyphs)      -> the prepared icon without these glyph paths, their lines and the cutouts that
//                                   knock them out (the object is built without its text)
//   letter(icon, T, M, inside, free) -> IconNodes drawn over the object:
//     on a pale surface (paper, kraft, porcelain, a clock face)   stamped ink: a deep ink of the material, with
//                                                                 the lit lower lip of a debossed print
//     on a saturated or dark surface (enamel, a badge, a screen,   raised white enamel: a soft drop shadow, a
//     a red calendar header)                                      dark wire edge, the white face
//     a file's printed type                                       printed in the file's colour
//     free text (no surface under it: "21°" under a cloud)        chrome lettering: a dark rim round a bright
//                                                                 polished face, legible on light and dark pages
//   Every lettering's outer edge is Line's 1.75u stroke, so letter counters stay as open as the reference drawing.
import { distToPolyline, pointInRing } from '../kernel/geom.mjs'
import { MAT } from './_skeuo-mat.mjs'
import { lumOf, v } from './_skeuo-paint.mjs'
import { shiftD } from './_live-text.mjs'

// Live generators that never write a value (every other one is lettered at every value, even an empty one)
export const LIVE_TEXTLESS = new Set(['alarm-clock-time', 'bar-values', 'battery-charging-level', 'battery-level', 'battery-vertical',
  'clock-time', 'dice', 'signal-bars', 'stopwatch', 'volume-level', 'watch-time', 'wifi-strength'])

export function stripText(icon, glyphs) {
  if (!glyphs.length) return icon
  const ids = new Set(glyphs.map(g => g.id))
  const gl = (icon.lines || []).filter(l => ids.has(l.pathId))
  const onGlyph = pts => pts.length && pts.every(p => gl.some(l => distToPolyline(p, l.pts, l.closed) < 0.3))
  const cutouts = []
  for (const c of icon.cutouts || []) {
    const subs = (c.subs || []).filter(s => !onGlyph(s.pts || []))
    if (subs.length === (c.subs || []).length) cutouts.push(c)
    else if (subs.length) cutouts.push({ ...c, subs })
  }
  return { ...icon, paths: (icon.paths || []).filter(p => !ids.has(p.id)), lines: (icon.lines || []).filter(l => !ids.has(l.pathId)), cutouts }
}

// A Live icon knocks out only what it draws: an open cutout with no line along it (a glyph's knock-out whose
// glyph is gone) is not debossed as a stray groove
export function dropOrphanCuts(icon) {
  if (!icon || !icon.params) return icon
  const ls = icon.lines || []
  const drawn = pts => pts.length && ls.some(l => pts.every(p => distToPolyline(p, l.pts, l.closed) < 0.3))
  let changed = false
  const cutouts = []
  for (const c of icon.cutouts || []) {
    const subs = (c.subs || []).filter(q => q.closed || drawn(q.pts || []))
    if (subs.length !== (c.subs || []).length) changed = true
    if (subs.length) cutouts.push(subs.length === (c.subs || []).length ? c : { ...c, subs })
  }
  return changed ? { ...icon, cutouts } : icon
}

// a hex colour mixed toward black (k = 0..1)
const deepen = (hex, k) => {
  const n = parseInt(String(hex).slice(1), 16)
  const c = s => Math.round((n >> s & 255) * (1 - k)).toString(16).padStart(2, '0')
  return '#' + c(16) + c(8) + c(0)
}
const PALE = 0.42 // a surface this light takes stamped ink; darker ones raised white enamel
const W = 1.75    // Line's stroke: the outer edge of every lettering
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
// the surface under a glyph: 'badge' | 'white' (a zone lettered in white) | 'screen' | a material
function surfaceOf(icon, T, M, g) {
  const c = [(g.box.x0 + g.box.x1) / 2, (g.box.y0 + g.box.y1) / 2]
  const inRing = r => r.length > 2 && pointInRing(c, r)
  const sig = (icon.lines || []).filter(l => l.plate === 'S' && l.closed && !String(l.pathId).startsWith('text:'))
  if (sig.some(l => inRing(l.pts))) return { kind: 'emboss', mat: M.sig }
  for (const z of T.zones || []) {
    if ((z.y0 == null || c[1] >= z.y0) && (z.y1 == null || c[1] <= z.y1)) return z.text === 'white' ? { kind: 'emboss', mat: MAT[z.mat] || M.sig } : { kind: 'auto', mat: MAT[z.mat] || M.sig }
  }
  if (T.print && g.plate !== 'S') return { kind: 'print', mat: MAT[T.print] || M.sig }
  if (T.inlay) return { kind: 'auto', mat: MAT[T.inlay.mat] || M.body }
  if (T.screen) return { kind: 'emboss', mat: M.screen || MAT.screen }
  return { kind: 'auto', mat: M.body }
}

export function letter(icon, T, M, inside, free) {
  const out = []
  const shadow = v('shadow', '#15110D'), shine = v('shine', '#FFFFFF')
  const groups = new Map()
  for (const g of inside) {
    const s = surfaceOf(icon, T, M, g)
    const kind = s.kind === 'auto' ? (lumOf(s.mat.c) >= PALE ? 'ink' : 'emboss') : s.kind
    const key = kind + '|' + s.mat.c
    if (!groups.has(key)) groups.set(key, { kind, mat: s.mat, d: [] })
    groups.get(key).d.push(g.d)
  }
  for (const { kind, mat, d } of groups.values()) {
    const D = d.join('')
    if (kind === 'ink' || kind === 'print') {
      // stamped / printed: the lit lower lip of the impression, then the ink
      out.push(['path', { d: d.map(x => shiftD(x, 0.08, 0.26)).join(''), stroke: shine, 'stroke-opacity': 0.55, 'stroke-width': W - 0.25, ...round }])
      out.push(['path', { d: D, stroke: kind === 'print' ? v('c3', deepen(mat.c, 0.28)) : v('ink', deepen(mat.ink, 0.45)), 'stroke-width': W - 0.2, ...round }])
    } else {
      // raised white enamel: a soft drop shadow, the white face (one tone, so a 1px stroke stays white at 24px)
      out.push(['path', { d: d.map(x => shiftD(x, 0.1, 0.32)).join(''), stroke: shadow, 'stroke-opacity': 0.3, 'stroke-width': W - 0.3, ...round }])
      out.push(['path', { d: D, stroke: v('tint', '#FFFFFF'), 'stroke-width': W - 0.3, ...round }])
    }
  }
  if (free.length) {
    // chrome lettering: a dark rim round a brushed-steel face (solid grey on a light page, bright on a dark one)
    const D = free.map(g => g.d).join('')
    out.push(['path', { d: free.map(g => shiftD(g.d, 0.1, 0.32)).join(''), stroke: shadow, 'stroke-opacity': 0.22, 'stroke-width': W - 0.25, ...round }])
    out.push(['path', { d: D, stroke: v('ink', '#2B3139'), 'stroke-width': W, ...round }])
    out.push(['path', { d: D, stroke: v('accent', '#AEB7C1'), 'stroke-width': W - 0.6, ...round }])
  }
  return out
}
