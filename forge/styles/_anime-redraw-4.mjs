// ANIME redraws, chunk 4: hand-drawn icons for this chunk's batch (see forge/styles/ANIME-GUIDE.md).
// Each entry: name -> (icon, k) => ops, built with the frozen kit (k = prim + kit, see _anime-kit.mjs).
// The exemplars in _anime-render.mjs (EXEMPLAR) win over any entry here (rocket, search, settings).
//
// Families drawn here (local helpers below):
//   phones     one glossy sky handset; call waves / arrows / slash as S-plate badges in their own colour
//   panels     a cream window with a sky panel band (layout icons), a small sky chevron that moves
//   shields    the sky guardian shield with a gold rim band; glyph raised in cream or a coral/green badge
//   media      sakura transport glyphs (play, pause, rewind, skip)
//   arrows     glossy sky bent arrows (one united surface) with a speed tail
//   carts      sky wire carts with gold wheels

// ---------------------------------------------------------------------------
// local helpers

const rotPt = (x, y, deg, cx = 12, cy = 12) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy
  return [cx + dx * c - dy * s, cy + dx * s + dy * c]
}
// a raised cream glyph on a coloured surface
const raised = (k, shape, o = {}) => k.surf(shape, 'tint', { part: o.part || 'a', shine: 'none', ol: o.ol ?? 0.42, shade: o.shade ?? 0.7 })
// a glossy orb button
const orb = (k, role, glyph, o = {}) => [
  k.surf(k.circle(12, 12, o.r ?? 9.2), role, { shineSize: 1 }),
  ...(glyph ? [raised(k, glyph, o)] : []),
]
// slash for -off icons: moat + coral bar
const slash = (k, x0 = 3.6, y0 = 3.6, x1 = 20.4, y1 = 20.4) => [
  k.moat(k.seg(x0, y0, x1, y1, 2.2), 0.9),
  k.surf(k.seg(x0, y0, x1, y1, 2.1), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
]
// a round badge with a white glyph (S plate)
const badge = (k, cx, cy, r, role, lines, o = {}) => [
  k.moat(k.circle(cx, cy, r), o.gap ?? 0.75),
  k.surf(k.circle(cx, cy, r), role, { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
  k.ink(lines, { role: 'tint', w: o.w ?? 1.25, taper: false, shift: 0, part: 's' }),
]

// ---- phones
const HANDSET = 'M3 5 A2 2 0 0 1 5 3 H8 A1.5 1.5 0 0 1 9.5 4.5 V6 C9.5 7.25 8.5 7.25 8.5 8.5 A7 7 0 0 0 15.5 15.5 C16.75 15.5 16.75 14.5 18 14.5 H19.5 A1.5 1.5 0 0 1 21 16 V19 A2 2 0 0 1 19 21 A16 16 0 0 1 3 5 Z'
const handset = (k, s = 1) => {
  let sh = k.path(HANDSET)
  if (s !== 1) sh = k.scale(sh, s, s, 3, 21)
  return k.surf(sh, 'c1', { shineSize: 0.9 })
}

// ---- panels: cream window, sky panel band
const WIN = k => k.rr(3, 3, 21, 21, 2.4)
const panel = (k, band, extra = []) => [
  k.surf(WIN(k), 'tint', { shine: 'none' }),
  k.surf(k.clip(WIN(k), band), 'c1', { cast: false, shineSize: 0.7 }),
  ...extra,
]
const chevSmall = (k, pts) => k.surf(k.stroke(pts, 2), 'c1', { part: 'a', shine: 'none', ol: 0.38 })

// ---- shields
const SHIELD = 'M12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.5 L12 2.5 L19.5 5.5 V12 C19.5 16.5 16.5 19.8 12 21.5 Z'
const shieldShape = (k) => k.path(SHIELD)
const shieldInner = (k) => k.scale(k.path(SHIELD), 0.72, 0.72, 12, 11.6)
const shieldOps = (k, role = 'c1', o = {}) => [
  k.surf(shieldShape(k), role, { shineSize: 1, ...o }),
  k.surf(shieldInner(k), role, { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
]

// ---- arrows: a bent arrow built from a stroke path + a soft head
const head = (k, tip, deg, s = 1) => {
  const pts = [[-4.6, -4.8], [0.4, 0], [-4.6, 4.8]].map(([x, y]) => rotPt(tip[0] + x * s, tip[1] + y * s, deg, tip[0], tip[1]))
  return k.poly(pts, [0.9 * s, 1 * s, 0.9 * s])
}

// a soft triangular arrowhead tucked into a corner (rotate / refresh arrows): sx/sy flip it
const cornerHead = (k, x, y, sx = 1, s = 1, sy = 1) => k.poly([[x + 0.4 * sx * s, y - 5.4 * sy * s], [x + 0.7 * sx * s, y + 0.7 * sy * s], [x - 5.4 * sx * s, y + 0.4 * sy * s]], [0.7 * s, 0.9 * s, 0.7 * s])

// a sharp isosceles arrowhead riding an arc (rotate / refresh): the base sits across the arc at angle a,
// the tip runs ahead along the direction of travel (dir +1 = increasing angle, clockwise on screen)
const arcHead = (k, cx, cy, r, a, dir, base = 5.4, len = 4.4) => {
  const t = a * Math.PI / 180, nx = Math.cos(t), ny = Math.sin(t), tx = -ny * dir, ty = nx * dir
  const px = cx + r * nx, py = cy + r * ny, bx = px - tx * len * 0.3, by = py - ty * len * 0.3
  return k.poly([[bx + nx * base / 2, by + ny * base / 2], [px + tx * len * 0.7, py + ty * len * 0.7], [bx - nx * base / 2, by - ny * base / 2]], [0.45, 0.3, 0.45])
}
const arcArrowShape = (k, cx, cy, r, a0, a1, w, o = {}) => {
  const dir = Math.sign(a1 - a0)
  return k.unite(k.arc(cx, cy, r, a0, a1 - dir * 4, w), arcHead(k, cx, cy, r, a1, dir, o.base, o.len))
}

// ---- carts
const cartBasket = (k, top = 7) => k.path(`M4.9 ${top} H20.6 L18.4 13.9 A1.2 1.2 0 0 1 17.3 14.8 H7.8 A1.2 1.2 0 0 1 6.7 13.9 Z`)

// ---------------------------------------------------------------------------
export const R = {
  // ================================================================ batch 1
  // a cream notepad with a sakura header, sky spiral rings and brushed text lines
  'notepad-text': (icon, k) => {
    const body = k.rr(4, 4.2, 20, 21.4, 2.2)
    return [
      k.surf(body, 'tint', { shine: 'none' }),
      k.surf(k.clip(body, k.rect(3, 3, 21, 8)), 'c2', { cast: false, shine: 'none' }),
      k.ink([[[8, 11.6], [16, 11.6]], [[8, 14.8], [16, 14.8]], [[8, 18], [12.6, 18]]], { w: 0.85, part: 'a' }),
      k.surf(k.join(k.pill(7.1, 2.5, 8.9, 7), k.pill(11.1, 2.5, 12.9, 7), k.pill(15.1, 2.5, 16.9, 7)), 'c1', { part: 'a', shine: 'none', ol: 0.38 }),
    ]
  },
  // an open kraft-gold box with its flaps thrown back and a sparkle rising out
  'package-open': (icon, k) => [
    k.surf(k.poly([[4.2, 11], [12, 7.2], [19.8, 11], [12, 14.8]], 0.4), 'c3', { inset: true, shine: 'none', tone: ['accent', 0.45] }),
    k.surf(k.poly([[4.2, 11], [2.6, 6.8], [10, 3], [12, 7.2]], [0.6, 0.6, 0.6, 0.4]), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[19.8, 11], [21.4, 6.8], [14, 3], [12, 7.2]], [0.6, 0.6, 0.6, 0.4]), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[4.2, 11], [12, 14.8], [19.8, 11], [19.8, 17.4], [12, 21.4], [4.2, 17.4]], [0.5, 0.4, 0.5, 0.8, 0.8, 0.8]), 'c3', { shineSize: 0.8 }),
    k.ink([[12, 15.4], [12, 20.8]], { w: 0.8 }),
    k.sparkleAt(12, 2.6, 1.3, { mini: false }),
  ],
  // a closed gold parcel with a sakura tape strap; the right face sits in shadow
  package: (icon, k) => {
    const box = k.poly([[12, 2.6], [21, 7], [21, 17], [12, 21.4], [3, 17], [3, 7]], [0.8, 0.8, 0.8, 0.8, 0.8, 0.8])
    return [
      k.surf(box, 'c3', { shineSize: 0.85 }),
      k.paint(k.clip(box, k.poly([[12, 11.6], [22, 6.6], [22, 22], [12, 22]])), 'accent', { op: 0.22 }),
      k.ink([[[3.4, 7.2], [12, 11.5], [20.6, 7.2]], [[12, 11.5], [12, 20.9]]], { w: 0.8 }),
      k.surf(k.join(k.poly([[6.6, 5.2], [8.6, 4.2], [17.6, 8.7], [15.6, 9.7]], 0.2), k.poly([[15.6, 9.7], [17.6, 8.7], [17.6, 12.8], [15.6, 13.8]], 0.2)), 'c2', { part: 'a', shine: 'none', ol: 0.35, cast: false }),
    ]
  },
  // a sakura-handled brush, gold ferrule, sky paint-loaded bristles and a fresh stroke
  paintbrush: (icon, k) => [
    k.surf(k.seg(14.4, 9.6, 20.2, 3.8, 2.6), 'c2', { part: 'a', shineSize: 0.7 }),
    k.surf(k.path('M11.22 8.89 L15.11 12.78 A1.1 1.1 0 0 1 15.11 14.33 L12.78 16.67 L7.33 11.22 L9.67 8.89 A1.1 1.1 0 0 1 11.22 8.89 Z'), 'c3', { shine: 'dot', shineSize: 0.7 }),
    k.surf(k.path('M7.6 11.5 C4.9 14.2 4.3 17.4 2.9 21.1 C6.6 19.7 9.8 19.1 12.5 16.4 Z'), 'c1', { shineSize: 0.7 }),
    k.sparkleAt(5, 5, 1.9, { mx: 1, my: 1 }),
  ],
  // a gold wooden palette with four glossy paint blobs
  palette: (icon, k) => [
    k.surf(k.path('M12 2.6 A9.4 9.4 0 0 1 21.4 12 C21.4 14.5 20 15.5 18 15.5 C16.5 15.5 15.5 16.5 15.5 18 C15.5 20 14.5 21.4 12 21.4 A9.4 9.4 0 0 1 12 2.6 Z'), 'c3', { shine: 'none' }),
    k.surf(k.circle(8.1, 14.6, 1.7), 'c2', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.38 }),
    k.surf(k.circle(8.7, 8.8, 1.7), 'c1', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.38 }),
    k.surf(k.circle(14.4, 7.6, 1.7), 'c4', { part: 'a', shine: 'dot', shineSize: 0.55, ol: 0.38 }),
    k.surf(k.circle(18.1, 11.3, 1.45), 'accent', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.38 }),
  ],
  // a palm on a cream sand island: gold trunk with ink rings, four leaf-green fronds
  'palm-tree': (icon, k) => [
    k.surf(k.path('M4.4 21.6 C7.6 18.8 16.4 18.8 19.6 21.6 Z'), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.stroke('M12 7 C13 11.5 13 16 11.6 20', 2.3), 'c3', { shine: 'none' }),
    k.ink([[[11.6, 11], [13.5, 10.6]], [[11.8, 14.2], [13.7, 14]], [[11.4, 17.2], [13.3, 17.4]]], { w: 0.6, taper: false, shift: 0 }),
    k.surf(k.path('M12 7 C10.25 1.25 3.75 1.5 2.6 9 C7.25 6.5 7.75 6.75 12 7 Z M12 7 C16.25 6.75 16.75 6.5 21.4 9 C20.25 1.5 13.75 1.25 12 7 Z'), 'c4', { shineSize: 0.7 }),
    k.surf(k.path('M12 7 C8.5 4.25 4 7.25 5.5 13 C9 10.75 10.5 9.75 12 7 Z M12 7 C13.5 9.75 15 10.75 18.5 13 C20 7.25 15.5 4.25 12 7 Z'), 'c4', { shine: 'none' }),
    k.surf(k.join(k.circle(11, 8.1, 1), k.circle(13.1, 8.2, 1)), 'accent', { shine: 'none', ol: 0.3 }),
  ],
  'panel-bottom': (icon, k) => panel(k, k.rect(2, 15, 22, 22), [
    k.paint(k.join(k.circle(8.6, 18, 0.8), k.circle(12, 18, 0.8), k.circle(15.4, 18, 0.8)), 'tint', { part: 'a' }),
  ]),
  'panel-left-close': (icon, k) => panel(k, k.rect(2, 2, 9, 22), [chevSmall(k, [[16.4, 8.8], [13.4, 12], [16.4, 15.2]])]),
  'panel-left-open': (icon, k) => panel(k, k.rect(2, 2, 9, 22), [chevSmall(k, [[13.6, 8.8], [16.6, 12], [13.6, 15.2]])]),
  'panel-right': (icon, k) => panel(k, k.rect(15, 2, 22, 22), [
    k.ink([[[6.4, 8], [11.6, 8]], [[6.4, 11], [11.6, 11]], [[6.4, 14], [10, 14]]], { w: 0.8, part: 'a' }),
  ]),
  sidebar: (icon, k) => panel(k, k.rect(2, 2, 9, 22), [
    k.paint(k.join(k.pill(4.6, 6.6, 7.4, 7.8), k.pill(4.6, 9.6, 7.4, 10.8), k.pill(4.6, 12.6, 7.4, 13.8)), 'tint', { part: 'a' }),
  ]),
  // a glossy sakura-coated paperclip
  paperclip: (icon, k) => [
    k.surf(k.stroke('M9.25 13.5 L17.25 5.5 A2.12 2.12 0 0 1 20.25 8.5 L10.25 18.5 A4.24 4.24 0 0 1 4.25 12.5 L12.25 4.5', 2), 'c2', { shineSize: 0.75 }),
  ],
  // a sky parking sign with a raised cream P
  parking: (icon, k) => [
    k.surf(k.rr(3, 3, 21, 21, 3), 'c1', { shineSize: 1 }),
    raised(k, k.stroke('M9.6 17.2 V7 H13 A3 3 0 0 1 13 13 H9.6', 2.6)),
  ],
  // a gold party cone with sakura stripes, confetti streamers and dots bursting out
  'party-popper': (icon, k) => {
    const cone = k.poly([[3, 21], [7.6, 9.6], [14.4, 16.4]], [0.8, 0.8, 0.8])
    return [
      k.tube(['M10.8 6.6 C12.4 5.6 10.8 3.6 12.4 2.6'], 'c1', { part: 'a', w: 1.15, ol: 0.4 }),
      k.tube(['M17.4 13.2 C18.4 11.6 20 13.6 21.4 12.2'], 'c4', { part: 'a', w: 1.15, ol: 0.4 }),
      k.tube([[[15.2, 8.8], [18, 6]]], 'c2', { part: 'a', w: 1.15, ol: 0.4 }),
      k.surf(cone, 'c3', { shineSize: 0.75 }),
      k.surf(k.clip(cone, k.seg(4.6, 13.6, 10.6, 19.6, 1.9)), 'c2', { cast: false, shine: 'none', ol: 0 }),
      k.surf(k.rot(k.ellipse(11, 13, 4.8, 1.3), 45, 11, 13), 'accent', { shine: 'none', ol: 0.38 }),
      k.deco(k.join(k.circle(16.5, 2.9, 0.75)), 'accent', { ol: 0.25 }),
      k.deco(k.join(k.circle(20.9, 7.9, 0.75)), 'c3', { ol: 0.25 }),
    ]
  },
  // a sky passport with a gold globe crest and a gold name line
  passport: (icon, k) => [
    k.surf(k.rr(5, 2.6, 19, 21.4, [1.2, 2.2, 2.2, 1.2]), 'c1', { shineSize: 0.9 }),
    k.ink([[7.2, 3.2], [7.2, 20.8]], { w: 0.6, taper: false, shift: 0 }),
    k.surf(k.circle(12.6, 10, 3.6), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
    k.ink([[[9.2, 10], [16, 10]], 'M12.6 6.6 C11 8.4 11 11.6 12.6 13.4', 'M12.6 6.6 C14.2 8.4 14.2 11.6 12.6 13.4'], { w: 0.55, taper: false, shift: 0, part: 'a' }),
    k.surf(k.pill(9.8, 16.9, 15.4, 18.3), 'c3', { part: 'a', shine: 'none', ol: 0.32 }),
  ],
  // a sky clipboard with a gold clip, a cream page laid over it
  paste: (icon, k) => [
    k.surf(k.rr(3, 4.6, 17, 18.6, 2), 'c1', { shineSize: 0.8 }),
    k.surf(k.unite(k.rr(6.8, 3.4, 13.2, 7, 1.2), k.circle(10, 3.2, 1.3)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
    k.surf(k.rr(10.4, 10, 21, 21.4, 2), 'tint', { shine: 'none' }),
    k.ink([[[13, 13.8], [18.4, 13.8]], [[13, 16.4], [18.4, 16.4]], [[13, 19], [16, 19]]], { w: 0.75 }),
  ],
  // two glossy sakura bars
  pause: (icon, k) => [
    k.surf(k.rr(5.4, 3.8, 10, 20.2, 2), 'c2', { shineSize: 0.85 }),
    k.surf(k.rr(14, 3.8, 18.6, 20.2, 2), 'c2', { shine: 'dot', shineSize: 0.8 }),
  ],
  // sakura toe beans
  'paw-print': (icon, k) => [
    k.surf(k.path('M12 12.5 C14.5 12.5 15.75 14.5 17.5 16.5 C18.75 18 18 20.5 15.5 20.5 C14 20.5 13.25 19.5 12 19.5 C10.75 19.5 10 20.5 8.5 20.5 C6 20.5 5.25 18 6.5 16.5 C8.25 14.5 9.5 12.5 12 12.5 Z'), 'c2', { shineSize: 0.8 }),
    k.surf(k.join(k.ellipse(8.5, 5.6, 1.8, 2.3, -10), k.ellipse(15.5, 5.6, 1.8, 2.3, 10)), 'c2', { part: 'a', shine: 'dot', shineSize: 0.55 }),
    k.surf(k.join(k.ellipse(4.1, 11, 1.7, 2.2, -20), k.ellipse(19.9, 11, 1.7, 2.2, 20)), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5 }),
  ],
  // a gold fountain-pen nib on a sky grip block
  'pen-tool': (icon, k) => [
    k.surf(k.path('M11.04 5.83 L18.17 12.96 L20.15 10.98 A1.12 1.12 0 0 0 20.15 9.39 L14.61 3.85 A1.12 1.12 0 0 0 13.02 3.85 Z'), 'c1', { part: 'a', shineSize: 0.6 }),
    k.surf(k.path('M12.03 6.82 L6.49 8.01 C3.52 10.98 3.92 16.12 3.6 20.4 C7.88 20.08 13.02 20.48 15.99 17.51 L17.18 11.97 Z'), 'c3', { shineSize: 0.85 }),
    k.ink([[8.9, 15.1], [4.2, 19.8]], { w: 0.8 }),
    k.surf(k.circle(10.25, 13.75, 1.6), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
  ],
  // the classic gold pencil: cream wood tip, ink lead, sky ferrule, sakura eraser
  pencil: (icon, k) => {
    const R = s => k.rot(s, -45, 12, 12)
    return [
      k.surf(R(k.poly([[2.6, 12], [7.6, 9.3], [7.6, 14.7]], [0.5, 0, 0])), 'tint', { shine: 'none' }),
      k.surf(R(k.poly([[2.6, 12], [4.6, 10.9], [4.6, 13.1]], [0.4, 0, 0])), 'ink', { shine: 'none', shade: 0, ol: 0 }),
      k.surf(R(k.rect(7.4, 9.3, 16.4, 14.7)), 'c3', { shineSize: 0.75 }),
      k.ink(R([[8.4, 12], [15.6, 12]]), { w: 0.6, taper: false, shift: 0 }),
      k.surf(R(k.rect(16.2, 9.3, 18.2, 14.7)), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
      k.surf(R(k.rr(18, 9.3, 21.4, 14.7, [0, 2, 2, 0])), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    ]
  },
  // a sky slash between two glossy sakura rings
  percent: (icon, k) => [
    k.surf(k.seg(18.6, 5.4, 5.4, 18.6, 2.4), 'c1', { shine: 'none' }),
    k.surf(k.ring(7, 7, 3.1, 1.3), 'c2', { part: 'a', shine: 'dot', shineSize: 0.6 }),
    k.surf(k.ring(17, 17, 3.1, 1.3), 'c2', { part: 'a', shine: 'dot', shineSize: 0.6 }),
  ],
  // a sprinter: sky outfit (sleeves + legs), sakura shirt, cream face and hands, sky hair blown back
  'person-running': (icon, k) => [
    k.speed(5.2, 13.6, 180, { n: 3, len: 2.6, gap: 1.6, w: 0.6 }),
    k.tube(['M10.6 14 L8 18 L4.4 18.4', 'M10.6 14 L14 16.5 L12.6 20.6'], 'c1', { w: 1.8, ol: 0.42 }),
    k.tube(['M7.6 11.2 L9.6 8.6 H13 L15.4 12 L18 10.8'], 'c1', { part: 'a', w: 1.45, ol: 0.42 }),
    k.surf(k.join(k.circle(7.2, 11.7, 1), k.circle(18.7, 10.5, 1)), 'tint', { part: 'a', shine: 'none', ol: 0.4, shade: 0 }),
    k.surf(k.stroke([[13, 8.6], [10.6, 14]], 3), 'c2', { shine: 'none' }),
    k.surf(k.circle(15.8, 4.9, 2.3), 'tint', { shine: 'none', ol: 0.4 }),
    k.surf(k.unite(
      k.clip(k.circle(15.8, 4.9, 2.55), k.poly([[12.6, 1.2], [19.4, 1.2], [19.2, 3.3], [17.2, 3.5], [15.6, 4.2], [14.2, 5.4], [13.2, 6]])),
      k.poly([[14, 2.9], [11.6, 3.9], [13.8, 4.9]], 0.3),
    ), 'c1', { shine: 'dot', shineSize: 0.45, ol: 0.38 }),
    k.paint(k.ellipse(17.1, 5.2, 0.38, 0.55), 'ink', { part: 'a' }),
  ],
  phone: (icon, k) => [handset(k)],
  // golden call waves (S) beside the handset
  'phone-call': (icon, k) => [
    handset(k),
    k.tube(['M13.85 6.52 A4 4 0 0 1 17.48 10.15', 'M14.2 2.8 A8 8 0 0 1 21.2 9.8'], 'c3', { part: 's', w: 1.4, ol: 0.42 }),
  ],
  'phone-incoming': (icon, k) => [
    handset(k),
    k.surf(k.unite(k.seg(20, 4, 15, 9, 2), k.stroke([[14.6, 4.6], [14.6, 9.4], [19.4, 9.4]], 2)), 'c4', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  'phone-outgoing': (icon, k) => [
    handset(k),
    k.surf(k.unite(k.seg(14.6, 9.4, 19.6, 4.4, 2), k.stroke([[15, 4], [20, 4], [20, 9]], 2)), 'c2', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  'phone-missed': (icon, k) => [
    handset(k),
    k.surf(k.unite(k.stroke([[13.6, 7.6], [13.6, 3.6], [17.6, 7.6], [21.2, 4]], 1.9), k.seg(13.6, 3.6, 17.2, 3.6, 1.9)), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  'phone-off': (icon, k) => [handset(k), ...slash(k, 3.4, 20.6, 20.6, 3.4)],
  // a sky monitor frame, pale glass screen and a sakura floating window
  'picture-in-picture': (icon, k) => [
    k.surf(k.rr(2.6, 4.2, 21.4, 19.8, 2.2), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(4.4, 6, 19.6, 18, 1.2), 'edge', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.surf(k.rr(11, 10.8, 18, 16.2, 1.1), 'c2', { part: 'a', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
  ],
  // a sakura piggy bank in 3/4 view: round body, perky ear, an oval snout with two nostrils, a curly tail,
  // stubby legs, an eye with a catch-light, the coin slot, and a gold coin dropping in
  'piggy-bank': (icon, k) => [
    k.surf(k.join(k.rr(5.6, 16.6, 8.4, 21.5, 1.3), k.rr(13.6, 16.6, 16.4, 21.5, 1.3)), 'c2', { shine: 'none', ol: 0.4 }),
    k.tube(['M4.6 12.3 C2.9 12.4 2.2 11.2 2.8 10.2 C3.1 9.7 3.6 9.7 3.9 10'], 'c2', { w: 1.1, ol: 0.4 }),
    k.surf(k.path('M17.1 8 C17.8 7 18.6 6.3 19.6 5.9 C19.9 7.5 19.5 9 18.6 10.4 Z'), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.path('M13.6 9 C13.3 6.6 14.4 4.7 16.5 3.9 C17.4 5.8 17.7 8 16.9 10.1 Z'), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.ellipse(11.75, 14, 7.75, 5.75), 'c2', { shineSize: 0.9 }),
    k.surf(k.ellipse(19.75, 13.5, 1.9, 2.6), 'c2', { shine: 'none', ol: 0.4 }),
    k.paint(k.join(k.ellipse(19.2, 13.1, 0.38, 0.55), k.ellipse(20.4, 13.1, 0.38, 0.55)), 'ink'),
    k.paint(k.ellipse(15.6, 12.1, 0.75, 1), 'ink', { part: 'a' }),
    k.shine(k.circle(15.35, 11.7, 0.26)),
    k.ink([[8.5, 10.75], [11.5, 10.75]], { w: 0.95, taper: false, part: 'a' }),
    k.surf(k.circle(10, 3.9, 1.95), 'c3', { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.38 }),
  ],
  // a glossy sky pilcrow
  pilcrow: (icon, k) => [
    k.surf(k.unite(k.path('M13.6 3.4 H10.5 A4.3 4.3 0 0 0 10.5 12 H13.6 Z'), k.rr(12.3, 3.4, 14.7, 20.6, 1.2), k.rr(16.8, 3.4, 19.2, 20.6, 1.2), k.rr(12.3, 3.4, 19.2, 5.8, 1.2)), 'c1', { shineSize: 0.8 }),
  ],
  // a two-tone capsule: cream half and a glossy sakura half
  pill: (icon, k) => {
    const R = s => k.rot(s, -45, 12, 12)
    const cap = R(k.pill(1.2, 8.3, 22.8, 15.7))
    return [
      k.surf(cap, 'tint', { shine: 'none' }),
      k.surf(k.clip(cap, R(k.rect(12, 6, 24, 18))), 'c2', { part: 'a', cast: false, shineSize: 0.8 }),
      k.ink(R([[12, 8.6], [12, 15.4]]), { w: 0.8, taper: false }),
    ]
  },
  // a coral push-pin with a silver needle
  pin: (icon, k) => [
    k.surf(k.seg(8.6, 15.4, 3.6, 20.4, 1.1), 'edge', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.path('M14.93 3.88 L20.12 9.07 A1.58 1.58 0 0 1 20.12 11.3 A1.58 1.58 0 0 1 17.9 11.3 L14.93 14.27 L14.56 19.1 A1.05 1.05 0 0 1 13.26 19.28 L4.72 10.74 A1.05 1.05 0 0 1 4.9 9.44 L9.73 9.07 L12.7 6.1 A1.58 1.58 0 0 1 12.7 3.88 A1.58 1.58 0 0 1 14.93 3.88 Z'), 'accent', { shineSize: 0.85 }),
  ],
  // a margherita slice: cream cheese, gold crust, coral pepperoni, a basil leaf
  pizza: (icon, k) => {
    const slice = k.path('M3.2 20.8 L9 3.2 A13.4 13.4 0 0 1 20.8 15 Z')
    return [
      k.surf(slice, 'tint', { shine: 'none' }),
      k.surf(k.cut(slice, k.circle(8.29, 15.71, 8.25)), 'c3', { cast: false, shineSize: 0.75 }),
      k.surf(k.join(k.circle(8.4, 15.6, 1.3), k.circle(11.6, 12.2, 1.3)), 'accent', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.35 }),
      k.surf(k.lens(8.2, 11.4, 10.4, 9.4, 0.8), 'c4', { part: 'a', shine: 'none', ol: 0.32 }),
    ]
  },
  // sky jet descending to a gold runway
  'plane-landing': (icon, k) => [
    k.surf(k.path('M19.11 11.98 C20.43 12.45 20.93 13.41 20.82 14.3 C20.33 15.06 19.33 15.46 18.02 14.98 L14.26 13.62 L7.99 18.57 L6.67 18.09 L10.31 12.18 L6.74 10.88 L4.49 12.4 L3.92 12.2 L5.79 8.83 L6.52 5.05 L7.09 5.26 L7.84 7.87 L11.41 9.17 L12.42 2.6 L13.74 2.9 L15.35 10.61 Z'), 'c1', { shineSize: 0.8 }),
    k.surf(k.pill(2.6, 20.2, 21.4, 21.8), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
  ],
  'plane-takeoff': (icon, k) => [
    k.surf(k.path('M17.36 4.49 C18.62 3.75 19.74 3.99 20.38 4.68 C20.66 5.58 20.31 6.66 19.03 7.39 L15.4 9.5 L15.15 17.88 L13.88 18.62 L11.58 11.7 L8.12 13.7 L7.82 16.54 L7.28 16.85 L5.83 13.08 L3.29 9.94 L3.83 9.63 L6.44 10.79 L9.9 8.79 L5.06 3.34 L6.33 2.61 L13.72 6.59 Z'), 'c1', { shineSize: 0.8 }),
    k.surf(k.pill(2.6, 20.2, 21.4, 21.8), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
  ],
  // a glossy sky jet
  plane: (icon, k) => [
    k.surf(k.scale(k.path('M16.6 4.58 C17.83 3.34 19.18 3.27 20.13 3.87 C20.73 4.82 20.66 6.17 19.42 7.4 L15.89 10.94 L18.19 20.66 L16.95 21.9 L12.18 14.65 L8.82 18.01 L9.35 21.37 L8.82 21.9 L5.99 18.01 L2.1 15.18 L2.63 14.65 L5.99 15.18 L9.35 11.82 L2.1 7.05 L3.34 5.81 L13.06 8.11 Z'), 0.93, 0.93, 12, 12), 'c1', { shineSize: 0.8 }),
  ],
  // a glossy sakura play triangle
  play: (icon, k) => [
    k.surf(k.path('M6 6.53 A2 2 0 0 1 9.03 4.82 L18.14 10.29 A2 2 0 0 1 18.14 13.71 L9.03 19.18 A2 2 0 0 1 6 17.47 L6 6.53 Z'), 'c2', { shineSize: 1 }),
  ],
  // a sky plug with gold prongs and its cord
  plug: (icon, k) => [
    k.surf(k.join(k.rr(7.9, 2.6, 10.1, 8, 0.9), k.rr(13.9, 2.6, 16.1, 8, 0.9)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.38 }),
    k.surf(k.rr(10.8, 15, 13.2, 21.4, 1), 'c1', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.path('M5.5 7 H18.5 A1 1 0 0 1 19.5 8 V11 A5.5 5.5 0 0 1 14 16.5 H10 A5.5 5.5 0 0 1 4.5 11 V8 A1 1 0 0 1 5.5 7 Z'), 'c1', { shineSize: 0.9 }),
    k.paint(k.circle(16.2, 10, 0.75), 'c4'),
  ],
  'plus-circle': (icon, k) => orb(k, 'c4', k.unite(k.rr(10.7, 6.8, 13.3, 17.2, 1.2), k.rr(6.8, 10.7, 17.2, 13.3, 1.2))),
  // a fat glossy sky plus
  plus: (icon, k) => [
    k.surf(k.unite(k.rr(10.2, 4, 13.8, 20, 1.8), k.rr(4, 10.2, 20, 13.8, 1.8)), 'c1', { shineSize: 0.85 }),
  ],
  // a sakura mic bulb on its stand, sky broadcast rings around it
  podcast: (icon, k) => [
    k.tube(['M7.75 15 A5.5 5.5 0 1 1 16.25 15', 'M6.25 19 A9.4 9.4 0 1 1 17.75 19'], 'c1', { part: 'a', w: 1.45, ol: 0.42 }),
    k.surf(k.rr(10.8, 14, 13.2, 21.4, 1.2), 'c2', { shine: 'none', ol: 0.4 }),
    k.surf(k.circle(12, 11.4, 2.5), 'c2', { shine: 'dot', shineSize: 0.7 }),
  ],
  // a gold pound sign
  'pound-sterling': (icon, k) => [
    k.surf(k.unite(k.stroke('M16.8 7 C16.1 5.4 14.8 4.4 13 4.4 C10.4 4.4 8.6 6.4 8.6 9 V15.5 C8.6 17.3 7.7 18.7 6.2 19.6 H17.8', 2.6), k.seg(5.8, 12.6, 13.8, 12.6, 2.4)), 'c3', { shineSize: 0.8 }),
    k.sparkleAt(19.4, 13, 1.7, { mx: -1, my: 1 }),
  ],
  // a sky power orb with a raised cream power glyph
  power: (icon, k) => orb(k, 'c1', k.unite(k.arc(12, 12.8, 4.9, -48, 228, 2.2), k.seg(12, 6.2, 12, 11.4, 2.2))),
  // a sky easel board with a cream canvas, a sakura trend line and gold legs
  presentation: (icon, k) => [
    k.tube([[[8.6, 15], [6.8, 21.2]], [[15.4, 15], [17.2, 21.2]]], 'c3', { part: 'a', w: 1.3, ol: 0.4 }),
    k.surf(k.rr(2.6, 3.2, 21.4, 15.8, 2), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(4.4, 5, 19.6, 14, 1), 'tint', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.surf(k.stroke([[6.8, 11.6], [10.2, 8.6], [13.4, 10.6], [17, 7.4]], 1.5), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
  ],
  // a sky printer: cream sheet in, cream page out, ink slot, gold status light
  printer: (icon, k) => [
    k.surf(k.rr(6.6, 2.6, 17.4, 9.4, 1), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(2.6, 8, 21.4, 17.4, 2.2), 'c1', { shineSize: 0.85 }),
    k.surf(k.pill(5, 13.2, 19, 15), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.surf(k.rr(6.6, 14.1, 17.4, 21.4, [0, 0, 1.2, 1.2]), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[[8.8, 17], [15.2, 17]], [[8.8, 19.2], [12.8, 19.2]]], { w: 0.7, part: 'a' }),
    k.surf(k.circle(18.3, 10.7, 0.85), 'c3', { shine: 'none', ol: 0.3, shade: 0 }),
  ],
  // a sakura jigsaw piece
  'puzzle-piece': (icon, k) => [
    k.surf(k.path('M3 9 A2 2 0 0 1 5 7 H8.5 A2.5 2.5 0 1 1 11.5 7 H15 A2 2 0 0 1 17 9 V12.5 A2.5 2.5 0 1 1 17 15.5 V19 A2 2 0 0 1 15 21 H5 A2 2 0 0 1 3 19 Z'), 'c2', { shineSize: 0.95 }),
  ],
  // three sky finder squares with sakura cores and a few data bits
  'qr-code': (icon, k) => {
    const finder = (x, y) => k.cut(k.rr(x, y, x + 7, y + 7, 1.6), k.rr(x + 1.5, y + 1.5, x + 5.5, y + 5.5, 0.8))
    return [
      k.surf(k.join(finder(3, 3), finder(14, 3), finder(3, 14)), 'c1', { shine: 'none' }),
      k.surf(k.join(k.rr(5.3, 5.3, 7.7, 7.7, 0.5), k.rr(16.3, 5.3, 18.7, 7.7, 0.5), k.rr(5.3, 16.3, 7.7, 18.7, 0.5)), 'c2', { part: 'a', shine: 'none', ol: 0.3 }),
      k.surf(k.join(k.rr(14, 14, 16, 16, 0.5), k.rr(19, 14, 21, 16, 0.5), k.rr(16.5, 16.5, 18.5, 18.5, 0.5), k.rr(14, 19, 16, 21, 0.5), k.rr(19, 19, 21, 21, 0.5)), 'c3', { part: 'a', shine: 'none', ol: 0.3 }),
    ]
  },
  // two glossy sakura quote marks
  quote: (icon, k) => [
    k.surf(k.path('M5 4.6 H8 A2 2 0 0 1 10 6.6 V11 C10 15.25 8 18.25 4 19.4 C6 17.5 6.5 15.5 6.5 13 H5 A2 2 0 0 1 3 11 V6.6 A2 2 0 0 1 5 4.6 Z'), 'c2', { shineSize: 0.7 }),
    k.surf(k.path('M16 4.6 H19 A2 2 0 0 1 21 6.6 V11 C21 15.25 19 18.25 15 19.4 C17 17.5 17.5 15.5 17.5 13 H16 A2 2 0 0 1 14 11 V6.6 A2 2 0 0 1 16 4.6 Z'), 'c2', { shineSize: 0.7 }),
  ],
  // a cream bunny: sakura inner ears, sparkly eyes, pink nose and blush
  rabbit: (icon, k) => [
    k.surf(k.path('M8.5 11.5 C5.25 13.75 5.25 18 7.5 19.75 C8.75 20.75 10.25 21 12 21 C13.75 21 15.25 20.75 16.5 19.75 C18.75 18 18.75 13.75 15.5 11.5 C17.75 8 18.25 4.5 17.5 3 C16.25 1.6 13.25 4.5 12.5 10 C12.25 10 11.75 10 11.5 10 C10.75 4.5 7.75 1.6 6.5 3 C5.75 4.5 6.25 8 8.5 11.5 Z'), 'tint', { shine: 'none' }),
    k.surf(k.join(k.lens(7.3, 3.9, 10.2, 9.6, 0.75), k.lens(16.7, 3.9, 13.8, 9.6, 0.75)), 'c2', { shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
    k.paint(k.join(k.ellipse(8.4, 17.3, 1.1, 0.6), k.ellipse(15.6, 17.3, 1.1, 0.6)), 'c2', { op: 0.7 }),
    k.paint(k.join(k.ellipse(9.8, 15, 0.75, 1.05), k.ellipse(14.2, 15, 0.75, 1.05)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(9.6, 14.6, 0.3), k.circle(14, 14.6, 0.3))),
    k.paint(k.poly([[11.2, 17.4], [12.8, 17.4], [12, 18.3]], 0.3), 'c2', { part: 'a' }),
  ],

  // ================================================================ batch 2
  // a sakura retro radio: gold antenna, dark speaker with a glint, ink dial lines
  radio: (icon, k) => [
    k.surf(k.seg(7.4, 8.6, 17.8, 3.6, 1.3), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.circle(18, 3.6, 1.1), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.rr(2.6, 8.6, 21.4, 20.4, 2.4), 'c2', { shineSize: 0.85 }),
    k.surf(k.circle(8, 14.6, 3.3), 'ink', { inset: true, ol: 0.3, shine: 'glint', shineSize: 0.75, shade: 0 }),
    k.surf(k.circle(8, 14.6, 1.3), 'c1', { part: 'a', shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
    k.ink([[[13.8, 12.6], [18.4, 12.6]], [[13.8, 16.6], [18.4, 16.6]]], { w: 1, taper: false, part: 'a' }),
  ],
  // three cel bands (coral, gold, sky) landing on two cream clouds
  rainbow: (icon, k) => [
    k.surf(k.arc(12, 18, 8.3, 180, 360, 2.6), 'accent', { shine: 'none' }),
    k.surf(k.arc(12, 18, 5.6, 180, 360, 2.6), 'c3', { shine: 'none' }),
    k.surf(k.arc(12, 18, 2.9, 180, 360, 2.6), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.cloudShape(5.3, 18.2, 0.38), 'tint', { shine: 'none', shade: 0.75 }),
    k.surf(k.cloudShape(18.7, 18.2, 0.38), 'tint', { shine: 'none', shade: 0.75 }),
    k.sparkleAt(20, 4.6, 1.8, { mx: -1, my: 1 }),
  ],
  // a cream receipt with a torn zigzag foot, ink lines and a sakura total
  receipt: (icon, k) => [
    k.surf(k.path('M6.5 2.6 H17.5 A2 2 0 0 1 19.5 4.6 V21.4 L17 19.5 L14.5 21.4 L12 19.5 L9.5 21.4 L7 19.5 L4.5 21.4 V4.6 A2 2 0 0 1 6.5 2.6 Z'), 'tint', { shine: 'none' }),
    k.ink([[[8.4, 7.4], [15.6, 7.4]], [[8.4, 10.6], [15.6, 10.6]]], { w: 0.8, part: 'a' }),
    k.surf(k.pill(8.2, 13.4, 15.8, 15.8), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
  ],
  // glossy sky bent arrow
  redo: (icon, k) => [
    k.surf(k.unite(k.stroke('M18 9.5 H9 A5.4 5.4 0 0 0 9 20.3 H14.6', 2.8), head(k, [21, 9.5], 0)), 'c1', { shineSize: 0.8 }),
  ],
  // two sky arcs chasing each other, sharp matching heads moated off the opposite arc
  refresh: (icon, k) => [
    k.surf(arcArrowShape(k, 12, 12, 8, 194, 316, 2.4, { base: 5, len: 4.1 }), 'c1', { part: 'a', shine: 'dot', shineSize: 0.7 }),
    k.moat(arcHead(k, 12, 12, 8, 136, 1, 5, 4.1), 0.6),
    k.surf(arcArrowShape(k, 12, 12, 8, 14, 136, 2.4, { base: 5, len: 4.1 }), 'c1', { part: 'a', shine: 'none' }),
  ],
  // a mint-sky retro fridge with gold handles and a sakura heart magnet
  refrigerator: (icon, k) => [
    k.surf(k.rr(5, 2.6, 19, 21.4, 2.4), 'c1', { shineSize: 0.9 }),
    k.ink([[5.4, 9.5], [18.6, 9.5]], { w: 0.9, taper: false }),
    k.surf(k.join(k.pill(7.9, 4.6, 9.7, 7.6), k.pill(7.9, 12.2, 9.7, 16.8)), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.heartShape(15.4, 14.4, 0.17), 'c2', { shine: 'none', ol: 0.32, shade: 0 }),
  ],
  // a sky T and a coral x badge
  'remove-formatting': (icon, k) => [
    k.surf(k.unite(k.stroke([[3.6, 6.4], [3.6, 4], [16.4, 4], [16.4, 6.4]], 2.4), k.seg(10, 4, 10, 19.8, 2.6)), 'c1', { shineSize: 0.75 }),
    k.moat(k.circle(17.8, 17.8, 3.6), 0.5),
    k.surf(k.unite(k.seg(15.4, 15.4, 20.2, 20.2, 2), k.seg(20.2, 15.4, 15.4, 20.2, 2)), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  // two sakura loop arrows chasing each other, a gold 1 in the middle
  'repeat-1': (icon, k) => [
    k.surf(k.unite(k.stroke('M4 11 V9 A3.5 3.5 0 0 1 7.5 5.5 H18', 2.4), head(k, [21, 5.5], 0, 0.75)), 'c2', { part: 'a', shineSize: 0.7 }),
    k.surf(k.unite(k.stroke('M20 13 V15 A3.5 3.5 0 0 1 16.5 18.5 H6', 2.4), head(k, [3, 18.5], 180, 0.75)), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.stroke([[10.6, 10.6], [12.4, 9.6], [12.4, 14.4]], 1.6), 'c3', { part: 's', shine: 'none', ol: 0.35 }),
  ],
  repeat: (icon, k) => [
    k.surf(k.unite(k.stroke('M4 11.5 V10 A3.5 3.5 0 0 1 7.5 6.5 H18', 2.4), head(k, [21, 6.5], 0, 0.75)), 'c2', { part: 'a', shineSize: 0.7 }),
    k.surf(k.unite(k.stroke('M20 12.5 V14 A3.5 3.5 0 0 1 16.5 17.5 H6', 2.4), head(k, [3, 17.5], 180, 0.75)), 'c2', { part: 'a', shine: 'none' }),
  ],
  'reply-all': (icon, k) => [
    k.surf(k.stroke([[7.6, 4.6], [2.7, 9.5], [7.6, 14.4]], 2.2), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.unite(k.stroke('M9 9.5 H13.5 A7 7 0 0 1 20.4 16.5 V19.4', 2.6), head(k, [8.2, 9.5], 180, 1.02)), 'c1', { shineSize: 0.75 }),
  ],
  reply: (icon, k) => [
    k.surf(k.unite(k.stroke('M6.4 9.5 H13 A7 7 0 0 1 20 16.5 V19.4', 2.8), head(k, [2.8, 9.5], 180, 1.05)), 'c1', { shineSize: 0.8 }),
  ],
  // two sakura triangles
  rewind: (icon, k) => [
    k.surf(k.path('M12.9 13.01 A1.25 1.25 0 0 1 12.9 10.99 L18.52 6.93 A1.25 1.25 0 0 1 20.5 7.94 L20.5 16.06 A1.25 1.25 0 0 1 18.52 17.07 L12.9 13.01 Z'), 'c2', { shine: 'none' }),
    k.surf(k.path('M3.9 13.01 A1.25 1.25 0 0 1 3.9 10.99 L9.52 6.93 A1.25 1.25 0 0 1 11.5 7.94 L11.5 16.06 A1.25 1.25 0 0 1 9.52 17.07 L3.9 13.01 Z'), 'c2', { shineSize: 0.7 }),
  ],
  // one glossy sky ring with a sharp head; only a dot of shine so the head stays crisp
  'rotate-ccw': (icon, k) => [
    k.surf(arcArrowShape(k, 12, 12.4, 8.2, 168, -136, 2.6), 'c1', { shine: 'dot', shineSize: 0.8 }),
  ],
  'rotate-cw': (icon, k) => [
    k.surf(arcArrowShape(k, 12, 12.4, 8.2, 12, 316, 2.6), 'c1', { shine: 'dot', shineSize: 0.8 }),
  ],
  // a gold road winding from a green start pin to a coral goal
  route: (icon, k) => [
    k.tube(['M7.6 18.5 H15.25 A3.25 3.25 0 0 0 15.25 12 H8.75 A3.25 3.25 0 0 1 8.75 5.5 H16.4'], 'c3', { part: 'a', w: 1.6, ol: 0.42 }),
    k.surf(k.circle(5.5, 18.5, 2.5), 'c4', { shine: 'dot', shineSize: 0.6 }),
    k.surf(k.circle(18.5, 5.5, 2.5), 'accent', { shine: 'dot', shineSize: 0.6 }),
    k.paint(k.circle(18.5, 5.5, 0.9), 'tint'),
  ],
  // a sky router with antennas, green status lights and a gold signal
  router: (icon, k) => [
    k.surf(k.join(k.seg(6.6, 13, 5.2, 6.2, 1.4), k.seg(17.4, 13, 18.8, 6.2, 1.4)), 'c1', { part: 'a', shine: 'none', ol: 0.38 }),
    k.tube(['M10 9.6 A2.8 2.8 0 0 1 14 9.6', 'M8.4 7.6 A5 5 0 0 1 15.6 7.6'], 'c3', { part: 'deco', w: 1, ol: 0.38, shade: 0 }),
    k.surf(k.rr(2.6, 13, 21.4, 20.4, 2.2), 'c1', { shineSize: 0.85 }),
    k.surf(k.join(k.circle(6, 16.7, 1), k.circle(9, 16.7, 1)), 'c4', { part: 'a', shine: 'none', ol: 0.3, shade: 0 }),
    k.ink([[13, 16.7], [18, 16.7]], { w: 1, taper: false, part: 'a' }),
  ],
  // the gold feed tile with a raised cream broadcast glyph
  rss: (icon, k) => [
    k.surf(k.rr(3, 3, 21, 21, 4.4), 'c3', { shineSize: 1 }),
    raised(k, k.unite(k.circle(7.6, 16.4, 1.7), k.arc(7.2, 16.8, 5.2, 270, 360, 2.2), k.arc(7.2, 16.8, 9.2, 270, 360, 2.2))),
  ],
  // a gold ruler with ink ticks
  ruler: (icon, k) => [
    k.surf(k.path('M3 16 L16 3 A1.41 1.41 0 0 1 18 3 L21 6 A1.41 1.41 0 0 1 21 8 L8 21 A1.41 1.41 0 0 1 6 21 L3 18 A1.41 1.41 0 0 1 3 16 Z'), 'c3', { shineSize: 0.8 }),
    k.ink([[[5.2, 13.8], [7.4, 16]], [[8, 11], [9.2, 12.2]], [[10.8, 8.2], [13, 10.4]], [[13.6, 5.4], [14.8, 6.6]]], { w: 0.85, part: 'a' }),
  ],
  // a sky bowl with a green leaf and a coral tomato
  salad: (icon, k) => [
    k.surf(k.lens(12.4, 12.4, 5.4, 3.6, 2.2), 'c4', { part: 'a', shine: 'none' }),
    k.surf(k.lens(11.4, 12.4, 19.6, 9.2, 1.4), 'c4', { part: 'a', shine: 'none' }),
    k.surf(k.circle(17, 7.4, 2.5), 'accent', { part: 'a', shine: 'dot', shineSize: 0.6 }),
    k.surf(k.path('M2.6 12 H21.4 A9.4 9 0 0 1 2.6 12 Z'), 'c1', { shineSize: 0.85 }),
  ],
  // a sky floppy disk with a metal shutter and a cream label
  save: (icon, k) => [
    k.surf(k.path('M5 3 H16 L21 8 V19 A2 2 0 0 1 19 21 H5 A2 2 0 0 1 3 19 V5 A2 2 0 0 1 5 3 Z'), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(7.4, 3, 14.6, 8.2, [0, 0, 1.2, 1.2]), 'edge', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.rr(11.6, 4.2, 13.2, 7, 0.4), 'ink', { part: 'a', shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
    k.surf(k.rr(6.4, 13.4, 17.6, 21, [1.4, 1.4, 0, 0]), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[[8.6, 16.2], [15.4, 16.2]], [[8.6, 18.6], [13, 18.6]]], { w: 0.7, part: 'a' }),
  ],
  // golden scales of justice with sky pans
  scale: (icon, k) => [
    k.ink([[[5, 6.6], [2.8, 13.4]], [[5, 6.6], [7.2, 13.4]], [[19, 6.6], [16.8, 13.4]], [[19, 6.6], [21.2, 13.4]]], { w: 0.6, taper: false, shift: 0, part: 'a' }),
    k.surf(k.unite(k.rr(10.9, 3.4, 13.1, 20.6, 1), k.rr(4.4, 5.6, 19.6, 7.6, 1)), 'c3', { shineSize: 0.7 }),
    k.surf(k.circle(12, 3.6, 1.4), 'c3', { shine: 'none', ol: 0.38 }),
    k.surf(k.pill(7.2, 19.6, 16.8, 21.4), 'c3', { shine: 'none' }),
    k.surf(k.path('M2.4 13.4 H7.6 A2.6 2.6 0 0 1 2.4 13.4 Z'), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.path('M16.4 13.4 H21.6 A2.6 2.6 0 0 1 16.4 13.4 Z'), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  // sky scan corners around a sunny gold face with sparkly eyes and blush
  'scan-face': (icon, k) => [
    k.surf(k.join(
      k.stroke('M3.2 7.6 V5.2 A2 2 0 0 1 5.2 3.2 H7.6', 2), k.stroke('M16.4 3.2 H18.8 A2 2 0 0 1 20.8 5.2 V7.6', 2),
      k.stroke('M20.8 16.4 V18.8 A2 2 0 0 1 18.8 20.8 H16.4', 2), k.stroke('M7.6 20.8 H5.2 A2 2 0 0 1 3.2 18.8 V16.4', 2),
    ), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(k.circle(12, 12, 6.2), 'c3', { shineSize: 0.8 }),
    k.paint(k.join(k.ellipse(9.6, 11, 0.7, 1), k.ellipse(14.4, 11, 0.7, 1)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(9.4, 10.6, 0.27), k.circle(14.2, 10.6, 0.27))),
    k.paint(k.join(k.ellipse(8.4, 13.6, 1, 0.55), k.ellipse(15.6, 13.6, 1, 0.55)), 'c2', { op: 0.75 }),
    k.ink('M10.2 14.4 C11.2 15.6 12.8 15.6 13.8 14.4', { w: 0.85, part: 'a' }),
  ],
  // a cream schoolhouse: filled sky gable roof resting on the walls, eaves over the wings,
  // gold door and round gable window, coral flag on the ridge
  school: (icon, k) => [
    k.ink([[12, 7.4], [12, 2.6]], { w: 0.8, taper: false }),
    k.surf(k.poly([[12.2, 2.5], [16.6, 3.9], [12.2, 5.3]], [0.3, 0.4, 0.3]), 'accent', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.path('M3.4 21.2 V15.2 H7.2 V12.4 H16.8 V15.2 H20.6 V21.2 Z'), 'tint', { shine: 'none' }),
    k.surf(k.join(k.rr(2.4, 13.8, 8, 15.6, 0.7), k.rr(16, 13.8, 21.6, 15.6, 0.7)), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(k.poly([[5.4, 13.2], [12, 6.8], [18.6, 13.2]], [0.6, 0.9, 0.6]), 'c1', { shineSize: 0.7 }),
    k.surf(k.circle(12, 10.6, 1.2), 'c3', { part: 'a', inset: true, shine: 'glint', shineSize: 0.6, ol: 0.35 }),
    k.surf(k.arch(10.2, 16.4, 13.8, 21.2), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.join(k.rr(4.4, 16.8, 6.4, 19, 0.5), k.rr(17.6, 16.8, 19.6, 19, 0.5)), 'c1', { inset: true, shine: 'none', ol: 0.32, shade: 0 }),
  ],
  // tapered cream steel blades with sky cel shadow, small sakura finger rings, a big gold pivot
  scissors: (icon, k) => {
    const blade = (x0, y0, x1, y1, side) => {
      const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy * side, ny = ux * side
      const at = (t, w) => [x0 + ux * t + nx * w, y0 + uy * t + ny * w]
      return k.poly([at(0, -0.8), at(0, 0.8), at(L * 0.45, 2), at(L * 0.8, 1.3), at(L, 0), at(L * 0.45, -0.75)], [0.3, 0.3, 0.6, 0.6, 0.35, 0.3])
    }
    return [
      k.surf(blade(7.2, 7.6, 21, 17.4, 1), 'tint', { tone: ['c1', 0.45], shineSize: 0.6, ol: 0.42 }),
      k.surf(blade(7.2, 16.4, 21, 6.6, -1), 'tint', { part: 'a', tone: ['c1', 0.45], shineSize: 0.6, ol: 0.42 }),
      k.surf(k.ring(5.4, 6.2, 2.4, 1.15), 'c2', { shine: 'dot', shineSize: 0.45 }),
      k.surf(k.ring(5.4, 17.8, 2.4, 1.15), 'c2', { part: 'a', shine: 'dot', shineSize: 0.45 }),
      k.surf(k.circle(13.4, 12, 1.5), 'c3', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
      k.paint(k.circle(13.4, 12, 0.45), 'ink', { part: 'a' }),
    ]
  },
  // a cream scroll between two gold rollers, brushed text
  'scroll-text': (icon, k) => [
    k.surf(k.rect(5.8, 5, 18.2, 19), 'tint', { shine: 'none' }),
    k.ink([[[9, 10], [15, 10]], [[9, 13.6], [13, 13.6]]], { w: 0.85, part: 'a' }),
    k.surf(k.pill(3, 3, 21, 6.2), 'c3', { shineSize: 0.6 }),
    k.surf(k.pill(3, 17.8, 21, 21), 'c3', { shine: 'none' }),
  ],
  // a paper plane: cream top wing, sky underside fold, speed lines behind
  send: (icon, k) => [
    k.speed(5.6, 18.6, 135, { n: 3, len: 2.8, gap: 1.6, w: 0.6 }),
    k.surf(k.poly([[21, 3], [10.5, 13.5], [14, 21]], [0.6, 0.4, 0.8]), 'c1', { shine: 'none' }),
    k.surf(k.poly([[21, 3], [3, 10], [10.5, 13.5]], [0.6, 0.8, 0.4]), 'tint', { shine: 'none' }),
  ],
  // two sky server units with green status lights and ink vents
  server: (icon, k) => [
    k.surf(k.rr(3, 2.6, 21, 10, 2), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(3, 14, 21, 21.4, 2), 'c1', { shine: 'none' }),
    k.ink([[12, 10.6], [12, 13.4]], { w: 1.1, taper: false, shift: 0 }),
    k.surf(k.join(k.circle(7, 6.3, 1.1), k.circle(7, 17.7, 1.1)), 'c4', { part: 'a', shine: 'none', ol: 0.3, shade: 0 }),
    k.ink([[[11, 6.3], [17, 6.3]], [[11, 17.7], [17, 17.7]]], { w: 1, taper: false, part: 'a' }),
  ],
  // a sky tray with a gold arrow lifting out of it
  'share-2': (icon, k) => [
    k.surf(k.rr(4.8, 9.6, 19.2, 21.2, 2.2), 'c1', { shineSize: 0.8 }),
    k.surf(k.rr(8.4, 9.6, 15.6, 12.4, [0, 0, 1.2, 1.2]), 'c1', { inset: true, shine: 'none', ol: 0, shade: 0.8 }),
    k.surf(k.unite(k.rr(10.8, 5.6, 13.2, 15.4, 1.1), head(k, [12, 2.4], 270, 0.85)), 'c3', { part: 'a', shineSize: 0.6 }),
  ],
  // three glossy nodes joined by ink links
  share: (icon, k) => [
    k.ink([[[8.4, 10.6], [15.4, 6.8]], [[8.4, 13.4], [15.4, 17.2]]], { w: 1.2, taper: false }),
    k.surf(k.circle(6.4, 12, 3), 'c2', { shine: 'dot', shineSize: 0.7 }),
    k.surf(k.circle(17.6, 5.6, 2.9), 'c1', { part: 'a', shine: 'dot', shineSize: 0.7 }),
    k.surf(k.circle(17.6, 18.4, 2.9), 'c4', { part: 'a', shine: 'dot', shineSize: 0.7 }),
  ],
  // ---- shields
  shield: (icon, k) => shieldOps(k, 'c1'),
  'shield-alert': (icon, k) => [
    k.surf(shieldShape(k), 'accent', { shineSize: 1 }),
    k.ink([[12, 7.4], [12, 12.4]], { role: 'tint', w: 2.2, taper: false, shift: 0, part: 'a' }),
    k.paint(k.circle(12, 15.9, 1.2), 'tint', { part: 'a' }),
  ],
  'shield-check': (icon, k) => [
    k.surf(shieldShape(k), 'c4', { shineSize: 1 }),
    k.ink([[8.4, 12], [11, 14.6], [15.6, 9.4]], { role: 'tint', w: 2.2, taper: false, shift: 0, part: 'a' }),
  ],
  'shield-off': (icon, k) => [...shieldOps(k, 'c1'), ...slash(k)],
  'shield-user': (icon, k) => {
    const sh = shieldShape(k)
    return [
      k.surf(sh, 'c1', { shineSize: 1 }),
      k.surf(k.clip(k.path('M6.6 18.6 A5.4 5.6 0 0 1 17.4 18.6 L12 21.2 Z'), k.grow(sh, -0.9)), 'tint', { part: 'a', shine: 'none', ol: 0.38, cast: false }),
      k.surf(k.circle(12, 9.6, 2.7), 'tint', { part: 'a', shine: 'none', ol: 0.38 }),
    ]
  },
  // a coral-hulled steamer: cream cabin with portholes, gold funnel, sky waves
  ship: (icon, k) => [
    k.surf(k.rr(10, 3, 14, 8, [1, 1, 0, 0]), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(6.4, 7.4, 17.6, 12.4, [1.4, 1.4, 0, 0]), 'tint', { shine: 'none' }),
    k.paint(k.join(k.circle(9.4, 9.9, 0.75), k.circle(12, 9.9, 0.75), k.circle(14.6, 9.9, 0.75)), 'c1'),
    k.surf(k.poly([[2.6, 12], [21.4, 12], [19, 16.6], [5, 16.6]], [0.6, 0.6, 1, 1]), 'accent', { shineSize: 0.75 }),
    k.tube(['M2.6 20.2 Q4.3 18.8 6 20.2 T9.5 20.2 T13 20.2 T16.5 20.2 T20 20.2'], 'c1', { part: 'a', w: 1.2, ol: 0.4 }),
  ],
  // a sakura shopping bag with gold handles and a cream heart
  'shopping-bag': (icon, k) => [
    k.surf(k.stroke('M8.6 10.4 V6.6 A3.4 3.4 0 0 1 15.4 6.6 V10.4', 1.5), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.path('M6.5 7.5 H17.5 A1.5 1.5 0 0 1 19 8.9 L19.8 19.4 A2 2 0 0 1 17.8 21.4 H6.2 A2 2 0 0 1 4.2 19.4 L5 8.9 A1.5 1.5 0 0 1 6.5 7.5 Z'), 'c2', { shineSize: 0.9 }),
    k.surf(k.join(k.circle(8.6, 10.6, 0.8), k.circle(15.4, 10.6, 0.8)), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.surf(k.heartShape(12, 15.6, 0.19), 'tint', { shine: 'none', ol: 0.32, shade: 0 }),
  ],
  // a gold wicker basket with a sky handle and a green leaf peeking out
  'shopping-basket': (icon, k) => [
    k.surf(k.stroke('M6.6 10 A5.4 6.4 0 0 1 17.4 10', 1.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.lens(13.6, 9.6, 17.8, 5.6, 1), 'c4', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.path('M4.2 11 L5.5 19.3 A2 2 0 0 0 7.5 21 H16.5 A2 2 0 0 0 18.5 19.3 L19.8 11 Z'), 'c3', { shineSize: 0.8 }),
    k.ink([[[8, 13.6], [8.3, 18]], [[12, 13.6], [12, 18]], [[16, 13.6], [15.7, 18]]], { w: 0.9 }),
    k.surf(k.pill(2.6, 9, 21.4, 11.6), 'c3', { shine: 'none' }),
  ],
  // a sky wire cart with gold wheels and a raised cream plus
  'shopping-cart-plus': (icon, k) => [
    k.tube(['M2.6 2.6 H3.7 A1 1 0 0 1 4.68 3.3 L6.9 14.3 A1 1 0 0 0 7.88 15 H17.6'], 'c1', { w: 1.4, ol: 0.42 }),
    k.surf(k.path('M5.02 5 H20.6 L18.25 14.3 A1 1 0 0 1 17.3 15 H7.88 A1 1 0 0 1 6.9 14.3 Z'), 'c1', { shineSize: 0.75 }),
    raised(k, k.unite(k.rr(11.8, 7, 13.4, 13, 0.7), k.rr(9.6, 9.2, 15.6, 10.8, 0.7))),
    k.surf(k.join(k.circle(8.5, 19.6, 1.7), k.circle(17, 19.6, 1.7)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.38 }),
  ],
  'shopping-cart': (icon, k) => [
    k.tube(['M2.6 3.5 H3.7 A1 1 0 0 1 4.68 4.3 L6.7 13.8 A1 1 0 0 0 7.68 14.5 H17.6'], 'c1', { w: 1.4, ol: 0.42 }),
    k.surf(cartBasket(k, 7), 'c1', { shineSize: 0.75 }),
    k.ink([[[10.4, 8.8], [10.8, 12.8]], [[14.6, 8.8], [14.2, 12.8]]], { w: 0.8 }),
    k.surf(k.join(k.circle(8.5, 19.2, 1.7), k.circle(17, 19.2, 1.7)), 'c3', { part: 'a', shine: 'dot', shineSize: 0.45, ol: 0.38 }),
  ],
  // two crossing arrows: sky passes under, sakura over
  shuffle: (icon, k) => [
    k.surf(k.unite(k.stroke('M3 6.5 H5 C10.5 6.5 12 17.5 17.5 17.5 H18.6', 2.2), head(k, [21.2, 17.5], 0, 0.72)), 'c1', { part: 'a', shine: 'none' }),
    k.moat(k.stroke('M5 17.5 C10.5 17.5 12 6.5 17.5 6.5', 2.2), 0.6),
    k.surf(k.unite(k.stroke('M3 17.5 H5 C10.5 17.5 12 6.5 17.5 6.5 H18.6', 2.2), head(k, [21.2, 6.5], 0, 0.72)), 'c2', { part: 'a', shineSize: 0.7 }),
  ],
  // rising green signal bars
  signal: (icon, k) => [
    k.surf(k.rr(3.2, 15.6, 5.8, 20.4, 1.2), 'c4', { shine: 'none' }),
    k.surf(k.rr(8.2, 11.6, 10.8, 20.4, 1.2), 'c4', { shine: 'none' }),
    k.surf(k.rr(13.2, 7.6, 15.8, 20.4, 1.2), 'c4', { shine: 'dot', shineSize: 0.5 }),
    k.surf(k.rr(18.2, 3.6, 20.8, 20.4, 1.2), 'c4', { shineSize: 0.55 }),
  ],
  // a sky brush-script signature over a gold line
  signature: (icon, k) => [
    k.tube(['M3 16.5 C6 15 10 11 10 7 C10 3.5 6 3.5 6 7 C6 10.5 7 16.5 9 16.5 C10.5 16.5 11 13 12.5 13 C14 13 14 16.5 15.5 16.5 C17 16.5 18 14 21 14'], 'c1', { w: 1.4, ol: 0.42 }),
    k.surf(k.pill(2.8, 19.8, 21.2, 21.4), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
  ],
  // a gold post with a sky sign to the right and a sakura sign to the left
  signpost: (icon, k) => [
    k.surf(k.rr(10.9, 6, 13.1, 21.2, 0.8), 'c3', { shine: 'none' }),
    k.surf(k.pill(8.6, 20, 15.4, 21.6), 'c3', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.poly([[5.6, 3], [17, 3], [19.8, 5.5], [17, 8], [5.6, 8]], [1, 0.4, 0.6, 0.4, 1]), 'c1', { shineSize: 0.7 }),
    k.surf(k.poly([[18.4, 12], [7, 12], [4.2, 14.5], [7, 17], [18.4, 17]], [1, 0.4, 0.6, 0.4, 1]), 'c2', { part: 'a', shine: 'none' }),
  ],
  // a coral beacon on a sky base with golden flash rays
  siren: (icon, k) => [
    k.tube([[[12, 2.6], [12, 4.4]], [[4.6, 6], [6, 7.4]], [[19.4, 6], [18, 7.4]]], 'c3', { part: 's', w: 1.2, ol: 0.4 }),
    k.surf(k.path('M7 17.6 V13 A5 5 0 0 1 17 13 V17.6 Z'), 'accent', { shineSize: 0.9 }),
    k.surf(k.rr(4, 17.4, 20, 21.4, 1.4), 'c1', { shine: 'none' }),
  ],
  'skip-back': (icon, k) => [
    k.surf(k.pill(3.4, 5, 6.2, 19), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.path('M19.5 7.73 A1.75 1.75 0 0 0 16.79 6.26 L10.25 10.53 A1.75 1.75 0 0 0 10.25 13.47 L16.79 17.74 A1.75 1.75 0 0 0 19.5 16.27 L19.5 7.73 Z'), 'c2', { shineSize: 0.75 }),
  ],
  'skip-forward': (icon, k) => [
    k.surf(k.pill(17.8, 5, 20.6, 19), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.path('M4.5 7.73 A1.75 1.75 0 0 1 7.21 6.26 L13.75 10.53 A1.75 1.75 0 0 1 13.75 13.47 L7.21 17.74 A1.75 1.75 0 0 1 4.5 16.27 L4.5 7.73 Z'), 'c2', { shineSize: 0.75 }),
  ],
  // sky tracks with sakura, gold and green knobs
  sliders: (icon, k) => [
    k.surf(k.join(k.pill(3, 5.2, 21, 6.8), k.pill(3, 11.2, 21, 12.8), k.pill(3, 17.2, 21, 18.8)), 'c1', { shine: 'none', ol: 0.4 }),
    k.surf(k.rr(14.6, 3.2, 17.4, 8.8, 1.3), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.surf(k.rr(6.6, 9.2, 9.4, 14.8, 1.3), 'c3', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.surf(k.rr(11.6, 15.2, 14.4, 20.8, 1.3), 'c4', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
  ],
}
