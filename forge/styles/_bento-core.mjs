// BENTO core: tile + glyph build. See bento.mjs for the look.
//
// Layers, back to front (all on the 24 grid):
//   tile      wm-deco    squircle in the palette tint, a c1 wash that deepens toward the bottom (gradient 0),
//                        a faint c1 edge, a hairline shine highlight inside the top edge (gradient 1)
//   shadow    wm-shadow  the glyph (masses + strokes) offset down, in the shadow role, low opacity, two widths
//   masses    by plate   the skeleton's fills in a c1 duotone tone (A parts a touch deeper)
//   strokes   by plate   K + A in the deep role, S (badges, modifiers) in the accent
// The glyph is the skeleton's own path data, uniformly scaled (_bento-path.mjs), so curves stay exact.
import { distToPolyline, pointInRing } from '../kernel/geom.mjs'
import { mapPath } from './_bento-path.mjs'
import { textInfo, hasText, glyphLines, isGlyphSub, glyphWeight } from './_live-text.mjs'
import { isPerson, tones, partAt, fillParts, ROLE_OF } from './_people.mjs'

// default palette: a calm indigo SaaS tile
export const DEF = {
  ink: '#1E1B4B', c1: '#6366F1', c2: '#8B5CF6', c3: '#22C3EE', c4: '#C7D2FE',
  tint: '#EEF0FF', accent: '#F43F75', shadow: '#312E81', shine: '#FFFFFF', edge: '#E0E3FF',
}
// people avatars swap in their own fallbacks for the call (OV, restored in finally; renders are synchronous)
let OV = null
export const col = r => `var(--with-bento-${r}, ${(OV && OV[r]) || DEF[r]})`

export const T = {
  X0: 2, Y0: 2, X1: 22, Y1: 22,
  P: 7.4, C: 0.74,          // squircle corner reach + control ratio (~5.5 optical radius, continuous curvature)
  S: 0.59,                  // glyph scale
  CY: 11.9,                 // glyph centre y (a hair high: the drop shadow sits below)
  SW: 1.1,                  // glyph stroke width (tile units)
  SW_P: 0.8,                // ... for people avatars (lighter, so the skin, hair and top read as parts)
}

// continuous-corner rounded square
export function squircle(x0, y0, x1, y1, p = T.P, c = T.C) {
  const q = p * (1 - c), n = v => +v.toFixed(2)
  return `M${n(x0 + p)} ${n(y0)}H${n(x1 - p)}C${n(x1 - q)} ${n(y0)} ${n(x1)} ${n(y0 + q)} ${n(x1)} ${n(y0 + p)}` +
    `V${n(y1 - p)}C${n(x1)} ${n(y1 - q)} ${n(x1 - q)} ${n(y1)} ${n(x1 - p)} ${n(y1)}` +
    `H${n(x0 + p)}C${n(x0 + q)} ${n(y1)} ${n(x0)} ${n(y1 - q)} ${n(x0)} ${n(y1 - p)}` +
    `V${n(y0 + p)}C${n(x0)} ${n(y0 + q)} ${n(x0 + q)} ${n(y0)} ${n(x0 + p)} ${n(y0)}Z`
}
// the top run of an inset squircle: from partway down the left corner, along the top, to the right corner
function topArc(i, p = T.P, c = T.C) {
  const x0 = T.X0 + i, y0 = T.Y0 + i, x1 = T.X1 - i
  const pp = p - i * 0.6, q = pp * (1 - c), n = v => +v.toFixed(2)
  return `M${n(x0)} ${n(y0 + pp)}C${n(x0)} ${n(y0 + q)} ${n(x0 + q)} ${n(y0)} ${n(x0 + pp)} ${n(y0)}` +
    `H${n(x1 - pp)}C${n(x1 - q)} ${n(y0)} ${n(x1)} ${n(y0 + q)} ${n(x1)} ${n(y0 + pp)}`
}

const stop = (offset, role, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': col(role) } : { offset, 'stop-color': col(role), 'stop-opacity': op }]
const lin = (id, x1, y1, x2, y2, stops) => ['linearGradient', { id, x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }, stops]

// the plate a fill belongs to (as duo): A or S when most of its outline runs along that plate's centrelines
function fillPlate(f, lines) {
  const pts = (f.subs || []).flatMap(s => s.pts)
  if (!pts.length) return 'K'
  const share = plate => {
    const ls = lines.filter(l => l.plate === plate && l.pts.length)
    if (!ls.length) return 0
    let n = 0
    for (let i = 0; i < pts.length; i += 2) if (ls.some(l => distToPolyline(pts[i], l.pts, l.closed) < 0.4)) n++
    return n / Math.ceil(pts.length / 2)
  }
  const k = share('K')
  let best = 'K', bs = 0.6
  for (const pl of ['A', 'S']) { const s = share(pl); if (s > bs && s > k) { best = pl; bs = s } }
  return best
}
const CLS = { K: null, A: 'wm-a', S: 'wm-s' }
const tag = (a, plate) => (CLS[plate] ? { ...a, class: CLS[plate] } : a)

// PEOPLE avatars (forge/styles/_people.mjs convention). The house glyph is a one-tone duotone (a pale c1 mass under
// deep strokes); a person drawn that way is a violet face. People keep the bento tile and line but get believable
// parts: the face in skin (c1, lit by tint, shaded by shadow), natural hair (c2), the top in the house indigo as a
// pale duotone mass (c4), headphone cups in the accent, eyes as ink dots with a catch-light, every line in the ink.
// The tile moves off c1/tint (those are the skin by the convention): edge ground with a c4 wash.
export function build(icon) {
  const t = !icon.params && isPerson(icon) ? tones(icon) : null
  if (!t) return build0(icon)
  OV = { c1: t.c1, tint: t.tint, shadow: t.shadow, c2: t.c2, c3: t.c3, c4: DEF.c1, edge: DEF.tint }
  try { return person(icon) } catch { return build0(icon) } finally { OV = null }
}

function person(icon) {
  const id = n => `wg-bento-${String(icon.name).replace(/[^a-z0-9-]/gi, '')}-${n}`, url = n => `url(#${id(n)})`
  const S = T.S, DY = T.CY - 12
  const M = (d, dx = 0, dy = 0) => mapPath(d, S, [12, 12], dx, DY + dy)
  const paths = (icon.paths || []).filter(p => p && p.d)
  const fills = (icon.fills || []).filter(f => f && f.d)
  const parts = fillParts(icon)
  const defs = ['defs', {}, [
    lin(id(0), 0, T.Y0, 0, T.Y1, [stop(0, 'c4', 0.04), stop(1, 'c4', 0.2)]),
    lin(id(1), T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    // the skin's soft light: lit from above, its shade toward the chin
    lin(id(2), 0, +(T.CY - 6 * S).toFixed(2), 0, +(T.CY + 2 * S).toFixed(2), [stop(0, 'tint', 0.55), stop(0.45, 'tint', 0), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.35)]),
  ]]
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [defs,
    ['path', { d: TILE, fill: col('edge'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: url(0), stroke: col('c4'), 'stroke-opacity': 0.16, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: topArc(0.55), stroke: url(1), 'stroke-width': 0.5, class: 'wm-deco' }],
  ]
  for (const [dy, w, op] of [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    out.push(['path', { d: fills.map(f => M(f.d, 0, dy)).join(''), fill: col('ink'), stroke: col('ink'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    out.push(['path', { d: paths.map(p => M(p.d, 0, dy)).join(''), stroke: col('ink'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }
  // the parts, in skeleton paint order (hair over the forehead, the top over the neck)
  fills.forEach((f, i) => {
    const part = parts[i] || 'skin', role = ROLE_OF[part] || 'c1', d = M(f.d)
    const cls = part === 'skin' ? undefined : 'wm-a'
    if (role === 'c4') {
      // the top: the house duotone, a pale indigo mass
      out.push(['path', tag({ d, fill: col('shine'), 'fill-rule': 'evenodd' }, cls ? 'A' : 'K')])
      out.push(['path', tag({ d, fill: col('c4'), 'fill-opacity': 0.6, 'fill-rule': 'evenodd' }, cls ? 'A' : 'K')])
      return
    }
    out.push(['path', tag({ d, fill: col(role), 'fill-rule': 'evenodd' }, cls ? 'A' : 'K')])
    if (role === 'c1') out.push(['path', { d, fill: url(2), 'fill-rule': 'evenodd', class: 'wm-shine' }])
  })
  // lines: everything in the ink (the person's outline, part borders, features); S details in the accent
  const K = paths.filter(p => p.plate !== 'S').map(p => M(p.d)).join(''), Sd = paths.filter(p => p.plate === 'S').map(p => M(p.d)).join('')
  if (K) out.push(['path', { d: K, stroke: col('ink'), 'stroke-width': T.SW_P }])
  if (Sd) out.push(['path', tag({ d: Sd, stroke: col('accent'), 'stroke-width': T.SW_P }, 'S')])
  // eyes: closed cutouts on the skin, ink dots with a catch-light
  let eyes = '', lights = ''
  for (const c of icon.cutouts || []) for (const sb of c.subs || []) {
    if (!sb.closed || !sb.pts || sb.pts.length < 3) continue
    const xs = sb.pts.map(p => p[0]), ys = sb.pts.map(p => p[1])
    const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys)
    if (w * h > 6 || w > 3 || h > 3) continue
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2
    if (partAt(icon, [cx, cy]) !== 'skin') continue
    const X = 12 + (cx - 12) * S, Y = T.CY + (cy - 12) * S, r = Math.max(0.42, Math.min(w, h) / 2 * S + 0.12), q = r * 0.4
    const n = v => +v.toFixed(2)
    eyes += `M${n(X - r)} ${n(Y)}a${n(r)} ${n(r)} 0 1 0 ${n(2 * r)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-2 * r)} 0z`
    lights += `M${n(X + r * 0.3 - q)} ${n(Y - r * 0.35)}a${n(q)} ${n(q)} 0 1 0 ${n(2 * q)} 0a${n(q)} ${n(q)} 0 1 0 ${n(-2 * q)} 0z`
  }
  if (eyes) out.push(['path', { d: eyes, fill: col('ink') }])
  if (lights) out.push(['path', { d: lights, fill: col('shine'), class: 'wm-shine' }])
  return out
}

function build0(icon) {
  const id = n => `wg-bento-${String(icon.name || 'icon').replace(/[^a-z0-9-]/gi, '')}-${n}`
  const S = T.S, C = [12, 12], DY = T.CY - 12
  const M = (d, dx = 0, dy = 0) => mapPath(d, S, C, dx, DY + dy)
  const paths = (icon.paths || []).filter(p => p && p.d)
  const fills = (icon.fills || []).filter(f => f && f.d)
  const lines = icon.lines || []
  const parted = paths.some(p => CLS[p.plate])
  // live-icon text (forge/DYNAMIC.md): drawn lighter than the glyph strokes, no drop shadow (it would fill counters)
  const isText = p => !!textInfo(p)
  const art = paths.filter(p => !isText(p)), text = paths.filter(isText)
  const textOnS = text.some(p => p.plate === 'S')

  const defs = ['defs', {}, [
    lin(id(0), 0, T.Y0, 0, T.Y1, [stop(0, 'c1', 0), stop(1, 'c1', 0.17)]),
    lin(id(1), T.X0, 0, T.X1, 0, [stop(0, 'shine', 0), stop(0.3, 'shine', 0.95), stop(0.7, 'shine', 0.95), stop(1, 'shine', 0)]),
    ...(fills.length ? [lin(id(2), 0, +(T.CY - 7 * T.S).toFixed(2), 0, +(T.CY + 9 * T.S).toFixed(2), [stop(0, 'c1', 0.3), stop(1, 'c1', 0.55)])] : []),
  ]]
  const TILE = squircle(T.X0, T.Y0, T.X1, T.Y1)
  const out = [defs,
    ['path', { d: TILE, fill: col('tint'), class: 'wm-deco' }],
    ['path', { d: TILE, fill: `url(#${id(0)})`, stroke: col('c1'), 'stroke-opacity': 0.14, 'stroke-width': 0.35, class: 'wm-deco' }],
    ['path', { d: topArc(0.55), stroke: `url(#${id(1)})`, 'stroke-width': 0.5, class: 'wm-deco' }],
  ]

  // glyph shadow: masses filled + every stroke, offset down: a soft wide pass and a tight contact pass
  // (a very dense glyph keeps only the soft pass, to stay small)
  const dense = art.reduce((n, p) => n + p.d.length, 0) + fills.reduce((n, f) => n + f.d.length, 0) > 2400
  for (const [dy, w, op] of dense ? [[0.45, 1.1, 0.1]] : [[0.55, 1.5, 0.07], [0.3, 0.45, 0.08]]) {
    const fd = fills.map(f => M(f.d, 0, dy)).join('')
    const sd = art.map(p => M(p.d, 0, dy)).join('')
    if (fd) out.push(['path', { d: fd, fill: col('shadow'), stroke: col('shadow'), 'stroke-width': T.SW + w, opacity: op, class: 'wm-shadow' }])
    if (sd) out.push(['path', { d: sd, stroke: col('shadow'), 'stroke-width': T.SW + w, 'stroke-opacity': op, class: 'wm-shadow' }])
  }

  // masses
  const byPlate = { K: [], A: [], S: [] }
  for (const f of fills) byPlate[parted ? fillPlate(f, lines) : 'K'].push(M(f.d))
  const massCol = { K: ['c1', 0.28], A: ['c1', 0.42], S: ['accent', 0.3] }
  for (const pl of ['K', 'A', 'S']) if (byPlate[pl].length) {
    const [r, op] = massCol[pl]
    const d = byPlate[pl].join('')
    if (pl === 'S' && textOnS) {
      // a count badge: a solid accent pill (over the ink, so a pale accent still holds white text)
      out.push(['path', tag({ d, fill: col('ink'), 'fill-rule': 'evenodd' }, pl)])
      out.push(['path', tag({ d, fill: col('accent'), 'fill-opacity': 0.85, 'fill-rule': 'evenodd' }, pl)])
      continue
    }
    out.push(['path', tag({ d, fill: col('shine'), 'fill-rule': 'evenodd' }, pl)])
    out.push(['path', tag({ d, fill: pl === 'K' ? `url(#${id(2)})` : col(r), 'fill-opacity': pl === 'K' ? undefined : op, 'fill-rule': 'evenodd' }, pl)])
  }

  // windows: closed cutouts (a screen, a lens, a door) are lit panes inside the mass
  const win = []
  const gl = text.length ? glyphLines(icon) : []
  for (const c of icon.cutouts || []) {
    if (!c || !c.d || !(c.subs || []).length || !c.subs.every(sb => sb.closed)) continue
    if (gl.length && c.subs.some(sb => isGlyphSub(sb, gl))) continue
    // only a pane that lies inside the mass (a cutout that carves the outline would paint outside it)
    // (inside any fill ring: a hole in the mass, like a laptop's screen, still counts)
    const rings = fills.flatMap(f => (f.subs || []).map(sb => sb.pts)).filter(r => r.length > 2)
    const pts = c.subs.flatMap(sb => sb.pts).filter((_, i) => i % 3 === 0)
    if (!pts.length || pts.filter(q => rings.some(r => pointInRing(q, r))).length < pts.length * 0.8) continue
    win.push(M(c.d))
  }
  if (win.length) out.push(['path', { d: win.join(''), fill: col('shine'), 'fill-opacity': 0.85, 'fill-rule': 'evenodd' }])

  // strokes, one node per plate. K in the deep shade; A and S are their colour laid over a dark
  // underline (the colour at UO opacity), so a pale c1 or accent still reads on the tint tile
  const UO = { A: ['shadow', 'c1', 0.72], S: ['ink', 'accent', 0.8] }
  for (const pl of ['K', 'A', 'S']) {
    const d = art.filter(p => (CLS[p.plate] ? p.plate : 'K') === pl).map(p => M(p.d)).join('')
    if (!d) continue
    if (pl === 'K') { out.push(['path', { d, stroke: col('shadow'), 'stroke-width': T.SW }]); continue }
    const [u, c, o] = UO[pl]
    out.push(['path', tag({ d, stroke: col(u), 'stroke-width': T.SW }, pl)])
    out.push(['path', tag({ d, stroke: col(c), 'stroke-opacity': o, 'stroke-width': T.SW }, pl)])
  }

  // text: K and A text in the deep shade, S text white on its badge (or accent-over-ink when free)
  const groups = new Map()
  for (const p of text) {
    const t = textInfo(p), pts = (p.subs || []).flatMap(sb => sb.pts)
    const box = pts.length ? { x0: Math.min(...pts.map(q => q[0])), x1: Math.max(...pts.map(q => q[0])), y0: Math.min(...pts.map(q => q[1])), y1: Math.max(...pts.map(q => q[1])) } : null
    const w = +(glyphWeight({ ch: t.ch, cap: t.cap, box }) * S * 0.85).toFixed(2)
    const pl = CLS[p.plate] ? p.plate : 'K'
    const stroke = pl === 'S' ? (textOnS && byPlate.S.length ? col('shine') : col('accent')) : col('shadow')
    const k = pl + stroke + w
    if (!groups.has(k)) groups.set(k, { pl, stroke, w, d: '' })
    groups.get(k).d += M(p.d)
  }
  for (const g of groups.values()) out.push(['path', tag({ d: g.d, stroke: g.stroke, 'stroke-width': g.w }, g.pl)])
  return out
}

export function fallback(icon) {
  return (icon.paths || []).filter(p => p && p.d).map(p => ['path', {
    d: p.d, stroke: 'currentColor', 'stroke-width': 1.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }])
}
