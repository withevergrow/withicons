// SOFT 3D core: the geometry and light behind forge/styles/soft3d.mjs.
//
// Two ways to see an icon, chosen by meaning (_soft3d-tune.mjs modeOf):
//
//   OBJECT  a physical thing (camera, taxi, tent, toolbox, gift, house) becomes a real solid: the skeleton's drawing is
//           its FRONT face, extruded straight back by a depth that suits the object (_soft3d-tune.mjs depthOf), and the
//           solid is seen through a perspective camera turned a little to the left and raised above it (yaw 30, pitch 18,
//           focal distance F): the front face, the top and the right side are visible, with true foreshortening.
//           Parts sit on the right faces with their own depth: A parts on the front face protrude toward you (buttons,
//           lenses, ribbons), A parts outside the body stand on it (a handle, a bow, an antenna: centred on the top face) or
//           under it (wheels, feet: a front and a back pair), cutouts are recessed wells, big windows are inset glass,
//           S badges float in front.
//   FRONT   a sign or UI glyph (arrows, check, chart, heart, star, gear) stays face-on, undistorted: a soft slab lying on
//           the desk seen from above, the glyph is its rounded top face (a curvature gradient and a lit bevel), its lower
//           walls show as a thin shaded thickness, and a soft contact shadow sits under it.
//
// LIGHT    one studio light from the upper left and in front; every visible face is shaded by its real normal (Lambert,
//          quantised into a few tonal bands that read smooth at icon sizes), the rounded bevel between the front face
//          and the sides is a band shaded with the halfway normal (lit rim on the upper left, soft dark on the lower
//          right), ambient occlusion where parts meet, a soft elliptical contact shadow under the object.
// COLOUR   every paint is a role variable --with-soft3d-<role> (palette roles ink c1-c4 tint accent shadow shine edge),
//          shades are the same role under a shine / shadow overlay, so per-icon palettes recolour everything.
import { area, simplify, fmt, arclen, circle, pointInRing } from '../kernel/geom.mjs'
import { model, U, D_, I_, cleanSet, ringArea, bboxOf, depths, mapSet, insideFrac } from './_soft3d-model.mjs'
import { pathD } from './_soft3d-path.mjs'
import { modeOf, depthOf, paletteFor, capOf, isLens, tuneOf } from './_soft3d-tune.mjs'

export const V = {
  YAW: 30, PITCH: 18, F: 44,        // object camera: turn (degrees, right side shown), raise (top shown), focal distance (u)
  FT: 0.36,                         // front mode: screen drop per unit of depth (the slab's lower wall)
  DF: 2.3,                          // front mode slab depth
  W: 21.2, H: 20.6,                 // fitted size (incl. shadow)
  KMAX: 1.0,
  LIGHT: [-0.5, -0.72, -0.48],      // toward the light (camera space: x right, y down, z away)
  AMB: 0.36, DIF: 0.64,
  BEV: 0.62,                        // bevel band width (screen u)
  RAISE: 1.25,                      // A part protrusion (object mode)
  WELL: 1.3, GLASS: 0.5,
}
const L = (() => { const [x, y, z] = V.LIGHT, n = Math.hypot(x, y, z); return [x / n, y / n, z / n] })()
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const norm3 = a => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n] }

// ---------------------------------------------------------------------------
// CAMERAS
function objectCamera(zc) {
  const t = V.YAW * Math.PI / 180, f = V.PITCH * Math.PI / 180
  const ct = Math.cos(t), st = Math.sin(t), cf = Math.cos(f), sf = Math.sin(f)
  const rot = ([x, y, z]) => { const x1 = x * ct + z * st, z1 = -x * st + z * ct; return [x1, y * cf - z1 * sf, y * sf + z1 * cf] }
  const P = (x, y, z) => { const q = rot([x - 12, y - 12, z - zc]); const s = V.F / (V.F + q[2]); return [q[0] * s, q[1] * s] }
  return {
    P, N: rot,
    // a side face (normal n in object space) at object point p is seen when it faces the camera
    vis: (n, p) => { const q = rot([p[0] - 12, p[1] - 12, p[2] - zc]); const nc = rot(n); return dot3(nc, [-q[0], -q[1], -V.F - q[2]]) > 0.02 * V.F },
  }
}
function frontCamera() {
  return {
    P: (x, y, z) => [x - 12, y - 12 + z * V.FT],
    N: n => n,
    vis: n => n[1] > 0.06,
  }
}
const shadeOf = (cam, n) => V.AMB + V.DIF * Math.max(0, dot3(norm3(cam.N(n)), L))

// ---------------------------------------------------------------------------
// helpers
// path tolerance: LITE > 0 trades a little smoothness for size on very detailed drawings (set per build)
let LITE = 0
const MODELS = new WeakMap() // one model per icon object across the lite passes
const TOL = () => [0.06, 0.1, 0.16, 0.24][LITE], PRE = () => [0.03, 0.05, 0.08, 0.12][LITE]
const dOf = set => pathD(cleanSet(set), { tol: TOL(), pre: PRE() })
const dRaw = polys => pathD(polys.filter(p => p.length > 2 && Math.abs(area(p)) > 0.004 * (1 + 4 * LITE)), { tol: TOL(), pre: PRE() })
const dOpen = chains => pathD(chains.filter(c => c.length > 1 && arclen(c) > 0.3 + LITE * 0.4), { closed: false, tol: TOL(), pre: PRE() })
// outward (away from material) unit normals per edge of a ring of a set (y down)
function edgeNormals(ring, hole) {
  const s = (area(ring) > 0 ? 1 : -1) * (hole ? -1 : 1), n = ring.length, out = []
  for (let i = 0; i < n; i++) {
    const a = ring[i], b = ring[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
    out.push([s * dy / l, -s * dx / l])
  }
  return out
}
// split a set into solids: each outer ring with the holes directly inside it
function components(set) {
  const dep = depths(set), outs = []
  set.forEach((r, i) => { if (dep[i] % 2 === 0) outs.push({ ring: r, d: dep[i], holes: [] }) })
  set.forEach((r, i) => {
    if (dep[i] % 2 === 0) return
    const host = outs.filter(o => o.d === dep[i] - 1 && pointInRing(r[0], o.ring))[0]
    if (host) host.holes.push(r)
  })
  return outs.map(o => [o.ring, ...o.holes])
}
const centroid = set => { const b = bboxOf([set]); return b ? [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2] : [12, 12] }
const roundness = ring => { const a = Math.abs(area(ring)), p = arclen(ring, true); return p > 0 ? 4 * Math.PI * a / (p * p) : 0 }

// ---------------------------------------------------------------------------
export function build(icon, lite = 0) {
  LITE = lite
  const mode = modeOf(icon) === 'object' ? 'object' : 'front'
  const T = tuneOf(icon)
  let M0 = MODELS.get(icon)
  if (!M0) { M0 = model(icon, T); MODELS.set(icon, M0) }
  const M = { ...M0 }
  if (!M.mass.length && !M.S.length && !M.ground.length && !M.parts.length) return null
  const pal = paletteFor(icon, mode)
  const lens = isLens(icon)
  const col = r => `var(--with-soft3d-${r}, ${pal[r]})`
  const id = n => `wg-soft3d-${icon.name || 'icon'}-${n}`

  // ---- solids (object space: skeleton x, y; depth z away from the viewer)
  const mb = bboxOf([M.mass]) || bboxOf([M.ground]) || [6, 6, 18, 18]
  const mw = mb[2] - mb[0], mh = mb[3] - mb[1]
  const dk = depthOf(icon)
  const D = mode === 'object' ? Math.max(dk < 0.2 ? 0.9 : 1.4, Math.min(dk * mw, 1.25 * Math.max(mw, mh), 14)) : V.DF
  const solids = []
  let mass = M.mass
  // front mode: big windows are knocked through (a chart's gaps, a frame's opening), not glass
  if (mode === 'front' && (M.screen.length || M.closed.length)) {
    const kn = U([M.screen, M.closed]), m2 = D_(mass, kn)
    if (m2.length) { mass = m2; M.screen = []; M.wells = M.wells.length ? D_(M.wells, kn) : [] }
  }
  // a cap: the part of the body above capY in its second colour (a roof, an awning, a lid)
  const capY = capOf(icon)
  // wheels: small round rings at the bottom of the body are their own short cylinders, a front and a back pair
  const wheels = []
  if (mode === 'object' && D > 3) {
    for (const f of icon.fills || []) for (const s of f.subs || []) {
      if (!s.closed || s.pts.length < 8) continue
      const a = Math.abs(area(s.pts)), b = bboxOf([[s.pts]])
      if (a > 3 && a < 40 && roundness(s.pts) > 0.86 && (b[1] + b[3]) / 2 > mb[1] + mh * 0.62) wheels.push(simplify(s.pts, 0.03, true))
    }
    if (wheels.length && wheels.length <= 4) {
      const ws = U(wheels.map(w => [w]))
      const rest = D_(mass, U(wheels.map(w => [w.map(p => p)]))) // body without the wheel discs
      if (rest.length) mass = rest
      const t = Math.min(1.6, D * 0.3)
      solids.push({ set: ws, z0: -0.25, z1: t - 0.25, role: 'ink', cls: 'wm-k', wheel: true, order: 3 })
    } else wheels.length = 0
  }
  if (mass.length && capY != null && mode === 'object') {
    const top = I_(mass, [[[0, -2], [24, -2], [24, capY], [0, capY]]]), rest = D_(mass, top)
    if (top.length && rest.length) {
      solids.push({ set: rest, z0: 0, z1: D, role: 'c1', cls: 'wm-k', body: true, order: 1, wells: M.wells, screen: M.screen })
      solids.push({ set: top, z0: -0.15, z1: D + 0.15, role: 'c2', cls: 'wm-k', order: 1.5 })
      mass = []
    }
  }
  if (mass.length && T.baseY != null && mode === 'object') {
    const low = I_(mass, [[[0, T.baseY], [24, T.baseY], [24, 26], [0, 26]]]), rest = D_(mass, low)
    if (low.length && rest.length) {
      solids.push({ set: rest, z0: T.inset || 0, z1: D - (T.inset || 0), role: 'c1', cls: 'wm-k', body: true, order: 1, wells: M.wells, screen: M.screen })
      solids.push({ set: low, z0: 0, z1: D, role: 'c2', cls: 'wm-k', body: true, order: 1.5, wells: [], screen: [] })
      mass = []
    }
  }
  if (mass.length) solids.push({ set: mass, z0: 0, z1: D, role: 'c1', cls: 'wm-k', body: true, order: 1, wells: M.wells, screen: M.screen })
  // ground parts (A outside the body)
  const wheelSet = solids.find(s => s.wheel)?.set
  for (const comp of components(M.ground)) {
    const c = centroid(comp), b = bboxOf([comp])
    if (wheelSet && insideFrac(comp[0].filter((_, i) => i % 3 === 0), wheelSet.map(r => r)) > 0.3) continue // drawn as a wheel
    if (wheelSet && I_(comp, wheelSet).length) continue
    const t = mode === 'object' ? Math.min(2, Math.max(1.1, D * 0.4)) : V.DF
    let z0 = 0, z1 = t, order = 2
    if (mode === 'front' && b[1] >= mb[3] - 1.6 && b[2] - b[0] > mw * 0.6) { const th = U([comp, comp.map(r => r.map(p => [p[0], p[1] + 0.7]))]); if (th.length) comp.splice(0, comp.length, ...th) }
    // a thin rod (handle, antenna, pole) is metal; a wide piece under the body is the ground it stands on (water, grass)

    let role = 'c2'
    if (mode === 'object') {
      if (b[3] <= mb[1] + 1.2 || c[1] < mb[1]) { z0 = D / 2 - t / 2; z1 = D / 2 + t / 2 } // stands on the top
      else if (b[1] >= mb[3] - 1.2 && b[2] - b[0] > mw * 0.5) { z0 = -0.6; z1 = D + 0.6; role = 'tint'; order = 0.5 } // the ground
      else if (b[1] >= mb[3] - 1.2) { z0 = 0; z1 = t } // under the body (feet, small wheels): at the front
    }
    solids.push({ set: comp, z0, z1, role, cls: 'wm-a', order })
  }
  // raised parts (A on the body): protrude toward the viewer
  const roles = T.roles || ['c2', 'c3', 'c4']
  let ri = 0
  const byRole = {}, seams = []
  for (const pt of M.parts) {
    if (pt.text) { solids.push({ set: pt.set, z0: -0.7, z1: 0.05, role: M.textInside ? 'ink' : 'c2', cls: 'wm-a', raised: true, order: 4, text: true, lines: pt.lines }); continue }
    const b = bboxOf([pt.set])
    // a long horizontal line across an object's face is a seam (a lid line, a window sill), not a raised bar
    if (mode === 'object' && b && b[3] - b[1] < 2.6 && b[2] - b[0] > mw * 0.55) { seams.push(pt.set); continue }
    const round = pt.set.length <= 2 && ringArea(pt.set[0]) > 7 && roundness(pt.set[0]) > 0.82
    if (round) { solids.push({ set: pt.set, z0: mode === 'object' ? -V.RAISE : -0.9, z1: 0.05, role: roles[ri++ % roles.length], cls: 'wm-a', raised: true, round: true, order: 4 }); continue }
    const r = roles[ri++ % roles.length]; (byRole[r] = byRole[r] || []).push(pt.set)
  }
  for (const r of Object.keys(byRole)) solids.push({ set: U(byRole[r]), z0: mode === 'object' ? -V.RAISE : -0.9, z1: 0.05, role: r, cls: 'wm-a', raised: true, order: 4 })
  if (seams.length) { const sm = I_(U(seams.map(s => shrinkY(s))), M.mass); const body = solids.find(s => s.body); if (body && sm.length) body.wells = U([body.wells || [], sm]) }
  if (M.S.length) {
    const sz = mode === 'object' ? -2.6 : -1.9
    solids.push({ set: M.S, z0: sz, z1: sz + (mode === 'object' ? 1.2 : 1.1), role: 'accent', cls: 'wm-s', badge: true, order: 6 })
  }
  solids.sort((a, b) => a.order - b.order)

  // ---- camera + fit
  const cam = mode === 'object' ? objectCamera(D / 2) : frontCamera()
  const sample = []
  for (const s of solids) for (const r of s.set) for (let i = 0; i < r.length; i++) { sample.push(cam.P(r[i][0], r[i][1], s.z0)); sample.push(cam.P(r[i][0], r[i][1], s.z1)) }
  // the floor: the lowest point of the body (or of anything), the contact shadow lies on it
  const all = bboxOf(solids.map(s => s.set)) || mb
  const floorY = all[3]
  const shadowPts = mode === 'object'
    ? [[all[0], 0], [all[2], 0], [all[0], D], [all[2], D]].map(([x, z]) => cam.P(x, floorY, z))
    : [[all[0], 0], [all[2], 0], [all[0], V.DF], [all[2], V.DF]].map(([x, z]) => cam.P(x, floorY, z))
  const sb = bboxOf([[shadowPts]])
  const sh = { cx: (sb[0] + sb[2]) / 2, cy: (sb[1] + sb[3]) / 2, rx: (sb[2] - sb[0]) / 2 * 0.98 + 0.3, ry: Math.max((sb[3] - sb[1]) / 2, 0.7) * 1.05 + 0.25 }
  if (mode === 'front') { sh.cy += 0.55; sh.ry = Math.max(0.9, (all[2] - all[0]) * 0.09); sh.rx = (all[2] - all[0]) * 0.5 }
  sample.push([sh.cx - sh.rx, sh.cy - sh.ry], [sh.cx + sh.rx, sh.cy + sh.ry])
  const fb = bboxOf([[sample]])
  const k = Math.min(V.KMAX, V.W / Math.max(fb[2] - fb[0], 0.01), V.H / Math.max(fb[3] - fb[1], 0.01))
  const ox = 12 - (fb[0] + fb[2]) / 2 * k, oy = 12 - (fb[1] + fb[3]) / 2 * k
  const P = (x, y, z) => { const q = cam.P(x, y, z); return [q[0] * k + ox, q[1] * k + oy] }
  const proj = (set, z) => set.map(r => r.map(p => P(p[0], p[1], z)))

  // ---- paint
  const defs = [], out = []
  let gi = 0
  const memo = {}
  const grad = (key, make) => memo[key] || (memo[key] = (() => { const n = gi++; defs.push(make(id(n))); return `url(#${id(n)})` })())
  const stop = (o, r, op = 1) => ['stop', op === 1 ? { offset: o, 'stop-color': col(r) } : { offset: o, 'stop-color': col(r), 'stop-opacity': op }]
  // the face's soft curvature (shared, bounding-box units: one gradient serves every face)
  const faceShade = () => mode === 'object'
    ? grad('fo', i => ['linearGradient', { id: i, x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, 'shine', 0.34), stop(0.42, 'shine', 0), stop(0.62, 'shadow', 0), stop(1, 'shadow', 0.2)]])
    : grad('ff', i => ['radialGradient', { id: i, cx: 0.34, cy: 0.26, r: 0.92 }, [stop(0, 'shine', 0.58), stop(0.38, 'shine', 0.06), stop(0.7, 'shadow', 0), stop(1, 'shadow', 0.26)]])
  const glass = () => grad('gl', i => ['linearGradient', { id: i, x1: 0, y1: 0, x2: 0.4, y2: 1 }, [stop(0, 'tint'), stop(1, 'ink')]])
  const P_ = (d, a, cls) => { if (d && /[lhvcaLHVCA]/.test(d)) out.push(['path', { d, ...a, class: cls }]) }

  // contact shadow: three soft nested ellipses on the floor, pushed a little away from the light
  {
    const cx = sh.cx * k + ox + 0.35, cy = sh.cy * k + oy + 0.1, rx = sh.rx * k, ry = sh.ry * k
    const ell = (s, op) => P_(arcEll(cx, cy, rx * s, ry * s), { fill: col('shadow'), 'fill-opacity': op }, 'wm-shadow')
    ell(1, 0.06); ell(0.8, 0.08); ell(0.58, 0.11)
  }

  const sFront = shadeOf(cam, [0, 0, -1])
  const lstep = [0.09, 0.12, 0.16, 0.22][LITE], level = s => Math.max(-5, Math.min(5, Math.round((s - sFront) / lstep)))
  const overlay = (lv, d, cls, gain = 1) => {
    if (!lv || !d) return
    P_(d, lv > 0 ? { fill: col('shine'), 'fill-opacity': fmt(Math.min(0.72, lv * lstep * 1.55 * gain)) } : { fill: col('shadow'), 'fill-opacity': fmt(Math.min(0.68, -lv * lstep * 1.2 * gain)) }, cls)
  }

  for (const so of solids) {
    // raised letters (live icons): stroked, not extruded as areas, so every counter stays open. The wall is a stack of
    // copies stepping back to the face in the letter's shaded colour, the front copy on top.
    if (so.text && so.lines && so.lines.length) {
      const sc = Math.hypot(...[0, 1].map(i => P(13, 12, so.z0)[i] - P(12, 12, so.z0)[i]))
      const dl = (ls, z) => ls.map(l => l.pts.length === 1 ? (() => { const q = P(l.pts[0][0], l.pts[0][1], z); return 'M' + fmt(q[0]) + ' ' + fmt(q[1]) + 'h0' })()
        : 'M' + l.pts.map(p => P(p[0], p[1], z)).map(q => fmt(q[0]) + ' ' + fmt(q[1])).join('L')).join('')
      const groups = {}
      for (const l of so.lines) (groups[l.w] = groups[l.w] || []).push(l)
      const N = 7, fronts = []
      for (const [wk, ls] of Object.entries(groups)) {
        const st = { fill: 'none', 'stroke-width': fmt(+wk * sc), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
        const bd = Array.from({ length: N }, (_, i) => dl(ls, so.z1 + (so.z0 - so.z1) * i / N)).join('')
        out.push(['path', { d: bd, ...st, stroke: col(so.role), class: so.cls }])
        out.push(['path', { d: bd, ...st, stroke: col('shadow'), 'stroke-opacity': 0.5, class: so.cls }])
        fronts.push(['path', { d: dl(ls, so.z0), ...st, stroke: col(so.role), class: so.cls }])
      }
      out.push(...fronts)
      continue
    }
    const set = cleanSet(so.set)
    if (!set.length) continue
    const role = so.role, cls = so.cls
    const dep = depths(set)
    // side walls: runs of visible edges, banded by shade
    const strips = [], bands = {}
    set.forEach((ring, ix) => {
      const hole = dep[ix] % 2 === 1
      const ns = edgeNormals(ring, hole), n = ring.length
      const lv = [], vis = []
      for (let i = 0; i < n; i++) {
        const a = ring[i], b = ring[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (so.z0 + so.z1) / 2]
        const n3 = [ns[i][0], ns[i][1], 0]
        vis.push(cam.vis(n3, m))
        lv.push(level(shadeOf(cam, n3)))
      }
      let st = 0
      for (let i = 0; i < n; i++) if (vis[i] !== vis[(i + n - 1) % n] || lv[i] !== lv[(i + n - 1) % n]) { st = i; break }
      let cur = null
      for (let q = 0; q < n; q++) {
        const i = (st + q) % n
        if (!vis[i]) { cur = null; continue }
        if (!cur || cur.lv !== lv[i]) { cur = { lv: lv[i], pts: [ring[i]] }; strips.push(cur) }
        cur.pts.push(ring[(i + 1) % n])
      }
    })
    const polys = []
    for (const s of strips) {
      if (s.pts.length < 2 || arclen(s.pts) < 0.25) continue
      const f = s.pts.map(p => P(p[0], p[1], so.z0)), b = s.pts.map(p => P(p[0], p[1], so.z1)).reverse()
      const poly = [...f, ...b]
      polys.push(poly);
      (bands[s.lv] = bands[s.lv] || []).push(poly)
    }
    const wallRole = so.wheel ? 'ink' : role
    if (polys.length) {
      P_(dRaw(polys), { fill: col(wallRole) }, cls)
      for (const lv of Object.keys(bands).map(Number).sort((a, b) => a - b)) overlay(lv, dRaw(bands[lv]), cls)
    }
    // AO where a raised part meets the face
    const face = proj(set, so.z0)
    if (so.raised && !so.text) P_(dOf(proj(set, 0.05).map(r => r.map(p => [p[0] + 0.12, p[1] + 0.22]))), { fill: col('shadow'), 'fill-opacity': 0.26 }, 'wm-k')
    // the face
    const fd = dOf(face)
    P_(fd, { fill: col(role), 'fill-rule': 'evenodd' }, cls)
    if (!so.text) P_(fd, { fill: faceShade(), 'fill-rule': 'evenodd' }, cls)
    // the bevel: a band just inside the face's rim, shaded with the halfway normal
    if (!so.text && (LITE < 2 || so.body)) bevel(set, dep, so, cls)
    // a round raised part: a dish (speaker, dial, button) or, on a camera, a glass lens
    if (so.round) {
      const r0 = set[0], a = ringArea(r0), bx = bboxOf([[r0]])
      const cx = (bx[0] + bx[2]) / 2, cy = (bx[1] + bx[3]) / 2, rr = Math.sqrt(a / Math.PI)
      const ring = [circle(cx, cy, rr * 0.66, 0.3)]
      const h0 = proj(ring, so.z0), h1 = proj(ring, so.z0 + (lens ? 1.6 : 1.1) + (so.z1 - so.z0))
      P_(dRaw(h0), { fill: col('shadow'), 'fill-opacity': 0.62 }, cls)   // the inner walls
      const fl = I_(h0, h1)
      if (fl.length) {
        if (lens) {
          P_(dOf(fl), { fill: glass() }, cls)
          P_(dRaw([circle(cx - rr * 0.2, cy - rr * 0.2, rr * 0.16, 0.3).map(p => P(p[0], p[1], so.z0 + 1.2))]), { fill: col('shine'), 'fill-opacity': 0.85 }, 'wm-shine')
        } else P_(dOf(fl), { fill: col(role), 'fill-opacity': 0.5 }, cls)
      }
    }
    // wells and screens into the body's face
    if (so.body) {
      if (so.wells && so.wells.length) {
        const w0 = proj(so.wells, so.z0), w1 = proj(so.wells, so.z0 + V.WELL)
        P_(dOf(w0), { fill: col('shadow'), 'fill-opacity': 0.55, 'fill-rule': 'evenodd' }, cls)
        const fl = I_(w0, w1)
        if (fl.length) P_(dOf(fl), { fill: col(role), 'fill-opacity': 0.6, 'fill-rule': 'evenodd' }, cls)
      }
      if (so.screen && so.screen.length) {
        const g0 = proj(so.screen, so.z0), g1 = proj(so.screen, so.z0 + V.GLASS)
        P_(dOf(g0), { fill: col('ink'), 'fill-rule': 'evenodd' }, cls)
        const fl = I_(g0, g1)
        if (fl.length) {
          P_(dOf(fl), { fill: glass(), 'fill-rule': 'evenodd' }, cls)
          const gb = bboxOf([fl])
          if (gb) { // a diagonal studio reflection across the glass
            const w = gb[2] - gb[0], h = gb[3] - gb[1], x = gb[0] + w * 0.18
            const band = [[x, gb[3] + 0.1], [x + h * 0.5, gb[1] - 0.1], [x + h * 0.5 + w * 0.22, gb[1] - 0.1], [x + w * 0.22, gb[3] + 0.1]]
            const rf = I_(fl, [band])
            if (rf.length) P_(dOf(rf), { fill: col('shine'), 'fill-opacity': 0.28 }, 'wm-shine')
          }
        }
      }
    }
  }

  function bevel(set, dep, so, cls) {
    const nf = [0, 0, -1], bw = (so.body ? V.BEV : so.badge ? 0.45 : 0.4) * Math.min(1, k * 1.05)
    const chains = {}
    set.forEach((ring, ix) => {
      const hole = dep[ix] % 2 === 1
      if (ringArea(ring) < 0.6) return
      const ns = edgeNormals(ring, hole), n = ring.length
      const pr = ring.map(p => P(p[0], p[1], so.z0))
      let cur = null, prevLv = null
      for (let i = 0; i < n; i++) {
        const nb = norm3([ns[i][0] + nf[0], ns[i][1] + nf[1], nf[2]])
        const lv = level(shadeOf(cam, nb))
        // inset the edge into the face by half the band (screen normal of the projected edge)
        const a = pr[i], b = pr[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1
        const sgn = (area(pr[0] ? pr : ring) > 0 ? 1 : -1) * (hole ? -1 : 1)
        const ix_ = -sgn * dy / l * bw / 2, iy = sgn * dx / l * bw / 2
        if (lv !== prevLv || !cur) { cur = { lv, pts: [[a[0] + ix_, a[1] + iy]] }; (chains[lv] = chains[lv] || []).push(cur.pts); prevLv = lv }
        cur.pts.push([b[0] + ix_, b[1] + iy])
      }
    })
    for (const lv of Object.keys(chains).map(Number)) {
      if (!lv) continue
      const d = dOpen(chains[lv])
      if (!d) continue
      const lit = lv > 0
      out.push(['path', { d, fill: 'none', stroke: col(lit ? 'shine' : 'shadow'), 'stroke-width': fmt(bw), 'stroke-opacity': fmt(Math.min(lit ? 0.85 : 0.6, Math.abs(lv) * lstep * (lit ? 2.1 : 1.5))), 'stroke-linejoin': 'round', class: lit && so.body ? 'wm-shine' : cls }])
    }
  }

  const refs = new Set()
  for (const [, a] of out) for (const v of [a.fill, a.stroke]) { const m = /^url\(#(.+)\)$/.exec(String(v || '')); if (m) refs.add(m[1]) }
  return [['defs', {}, defs.filter(g => refs.has(g[1].id))], ...mergeRuns(out)]
}

const arcEll = (cx, cy, rx, ry) => `M${fmt(cx - rx)} ${fmt(cy)}a${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(2 * rx)} 0a${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(-2 * rx)} 0z`
// a seam: a stroke set thinned vertically (a 2u line becomes a 1.1u groove)
function shrinkY(set) { const b = bboxOf([set]); if (!b) return set; const cy = (b[1] + b[3]) / 2; return set.map(r => r.map(p => [p[0], cy + (p[1] - cy) * 0.55])) }
// adjacent paths with identical paint (no bounding-box gradient) become one path: same picture, fewer bytes
function mergeRuns(nodes) {
  const out = []
  const key = a => { const { d, ...rest } = a; return JSON.stringify(rest) }
  for (const nd of nodes) {
    const last = out[out.length - 1], a = nd[1]
    const flat = !/^url/.test(String(a.fill || '')) && !/^url/.test(String(a.stroke || '')) && !a['fill-rule']
    if (last && flat && last[1].__k === key(a)) { last[1].d += a.d; continue }
    out.push(['path', { ...a, __k: flat ? key(a) : null }])
  }
  for (const nd of out) delete nd[1].__k
  return out
}
export function ellipse(cx, cy, rx, ry, n = 28) {
  const out = []
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]) }
  return out
}
export { circle }
