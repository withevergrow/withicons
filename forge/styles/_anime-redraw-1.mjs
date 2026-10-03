// ANIME redraws, chunk 1: hand-drawn icons for this chunk's batch (see forge/styles/ANIME-GUIDE.md).
// Each entry: name -> (icon, k) => ops, built with the frozen kit (k = prim + kit, see _anime-kit.mjs).
// The exemplars in _anime-render.mjs (EXEMPLAR) win over any entry here.

// ---------------------------------------------------------------------------
// local helpers (built from prim + kit only)

const rotPt = (x, y, deg, cx = 12, cy = 12) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a), dx = x - cx, dy = y - cy
  return [cx + dx * c - dy * s, cy + dx * s + dy * c]
}

// the exemplar arrow (pointing east) rotated by deg, with speed lines trailing behind
const ARROW = k => k.unite(k.rr(6.4, 10.3, 15, 13.7, 1.6), k.poly([[13, 4.6], [21.2, 12], [13, 19.4]], [1, 1.1, 1]))
function arrowAt(k, deg, o = {}) {
  const sc = o.scale ?? 1
  let sh = ARROW(k)
  if (sc !== 1) sh = k.scale(sh, sc, sc, 12, 12)
  sh = k.rot(sh, deg, 12, 12)
  const [sx, sy] = rotPt(12 - (12 - 5.4) * sc, 12, deg)
  return [
    k.speed(sx, sy, 180 + deg, { n: 3, len: 4.6 * sc, gap: 2.5 * sc, w: 0.6 }),
    k.surf(sh, o.role || 'c1', { shineSize: 0.85 }),
  ]
}
// a double-headed arrow along the x axis, rotated
function arrow2(k, deg) {
  const sh = k.unite(k.rr(7, 10.4, 17, 13.6, 1.2), k.poly([[8.6, 5.4], [2.4, 12], [8.6, 18.6]], [1, 1.1, 1]), k.poly([[15.4, 5.4], [21.6, 12], [15.4, 18.6]], [1, 1.1, 1]))
  return [k.surf(k.rot(sh, deg, 12, 12), 'c1', { shineSize: 0.8 })]
}
// a fat glossy chevron (pointing east) at (cx, cy), rotated
function chev(k, cx, cy, deg, o = {}) {
  const h = o.h ?? 5.6, d = o.d ?? 5.4
  const pts = [[cx - d / 2, cy - h], [cx + d / 2, cy], [cx - d / 2, cy + h]].map(([x, y]) => rotPt(x, y, deg, o.rx ?? cx, o.ry ?? cy))
  return k.stroke(pts, o.w ?? 3.2)
}
// white glyph on a badge/disc
const glyph = (k, lines, o = {}) => k.ink(lines, { role: 'tint', w: o.w ?? 1.6, taper: false, shift: 0, part: o.part || 'k' })
// slash for -off icons: moat + coral tube
const slash = k => [
  k.moat(k.seg(3.6, 3.6, 20.4, 20.4, 2.1), 0.9),
  k.surf(k.seg(3.6, 3.6, 20.4, 20.4, 2.1), 'accent', { part: 's', shine: 'none', ol: 0.4 }),
]
// round badge with a glyph, sitting lower right (S plate)
function badge(k, cx, cy, r, role, lines, o = {}) {
  return [
    k.moat(k.circle(cx, cy, r), 0.75),
    k.surf(k.circle(cx, cy, r), role, { part: 's', shine: 'dot', shineSize: 0.6, ol: 0.4 }),
    k.ink(lines, { role: 'tint', w: o.w ?? 1.2, taper: false, shift: 0, part: 's' }),
  ]
}
// the calendar exemplar body (cream page, sakura header, sky rings)
function calBody(k) {
  const body = k.rr(3, 5.2, 21, 21, 2.2)
  return [
    k.surf(body, 'tint', { shine: 'none' }),
    k.surf(k.clip(body, k.rect(2, 4, 22, 10)), 'c2', { cast: false }),
  ]
}
const calRings = k => [
  k.surf(k.pill(7, 2.6, 9, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
  k.surf(k.pill(15, 2.6, 17, 7.6), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
]
// the bell exemplar
const bellOps = (k, o = {}) => [
  k.surf(k.circle(12, 20, 1.9), 'c2', { part: 'a', shine: 'dot' }),
  k.surf(k.ring(12, 4.3, 1.5, 0.6), 'c3', { shine: 'none', ol: 0.45 }),
  k.surf(k.path('M5.9 17 C5.9 11.2 7 5.7 12 5.7 C17 5.7 18.1 11.2 18.1 17 Z'), 'c3', { shineSize: 1.1 }),
  k.surf(k.pill(4, 15.9, 20, 18.9), 'c3', { shine: 'none' }),
]
// a cel wheel: ink tyre with an edge rim light (reads in dark), sky hub cap, cream axle
const wheel = (k, cx, cy, r = 2.1) => [
  k.surf(k.circle(cx, cy, r), 'ink', { shine: 'none', shade: 0, ol: 0.35, rim: true }),
  k.surf(k.circle(cx, cy, r * 0.56), 'c1', { shine: 'none', shade: 0, ol: 0, cast: false, casts: false }),
  k.paint(k.circle(cx, cy, r * 0.22), 'tint'),
]
// scalloped badge (verified rosette)
const rosette = (k, cx = 12, cy = 12, R = 9.4) => k.soften(k.unite(k.circle(cx, cy, R - 1.6), k.around(k.circle(cx, cy - R + 1.7, 1.75), 8, cx, cy)), 0.4)

// the anime anger mark (four bulging vein arcs around a centre)
const angerMark = (k, cx, cy, s = 1) => k.ink([[1, -1], [1, 1], [-1, 1], [-1, -1]].map(([sx, sy]) =>
  k.curve([[0.75, -2.7], [0.95, -1.15], [1.15, -0.95], [2.7, -0.75]]).map(([x, y]) => [cx + x * sx * s, cy - y * sy * s])),
  { role: 'accent', w: 1.05 * s, taper: 0.5, shift: 0, part: 'deco' })

// battery: sky case + nub, dark window, n cells in role
function batteryOps(k, n, role) {
  const cells = [0, 1, 2].slice(0, n).map(i => k.rr(5.2 + i * 4, 9.4, 8.4 + i * 4, 14.6, 0.7))
  return [
    k.surf(k.rr(18.8, 9.8, 21.6, 14.2, [0, 1, 1, 0]), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(2.4, 6.6, 19.6, 17.4, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(4.2, 8.4, 17.8, 15.6, 1.2), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    ...(n ? [k.surf(k.join(...cells), role, { shine: 'none', ol: 0, shade: 0.6, cast: false, casts: false })] : []),
  ]
}

// text-alignment glyph: four glossy pills, spans [[x0, x1] x4]; odd bars sakura, even bars sky;
// only the first bar carries a shine streak (no per-bar dots)
const alignOps = (k, spans) => {
  const bar = i => k.pill(spans[i][0], 4.5 + i * 5 - 1, spans[i][1], 4.5 + i * 5 + 1)
  return [
    k.surf(bar(0), 'c1', { shineSize: 0.5 }),
    k.surf(k.join(bar(2)), 'c1', { shine: 'none' }),
    k.surf(k.join(bar(1), bar(3)), 'c2', { shine: 'none' }),
  ]
}

// ---------------------------------------------------------------------------
export const R = {
  // ---- arrows: copy arrow-right (one united glossy surface + speed lines)
  'arrow-left': (icon, k) => arrowAt(k, 180),
  'arrow-up': (icon, k) => arrowAt(k, 270),
  'arrow-down': (icon, k) => arrowAt(k, 90),
  'arrow-up-right': (icon, k) => arrowAt(k, 315, { scale: 0.95 }),
  'arrow-up-left': (icon, k) => arrowAt(k, 225, { scale: 0.95 }),
  'arrow-down-right': (icon, k) => arrowAt(k, 45, { scale: 0.95 }),
  'arrow-down-left': (icon, k) => arrowAt(k, 135, { scale: 0.95 }),
  'arrow-left-right': (icon, k) => arrow2(k, 0),
  'arrow-up-down': (icon, k) => arrow2(k, 90),

  // ---- chevrons: fat glossy sky strokes
  'chevron-right': (icon, k) => [k.surf(chev(k, 12.4, 12, 0), 'c1', { shineSize: 0.75 })],
  'chevron-left': (icon, k) => [k.surf(chev(k, 11.6, 12, 180), 'c1', { shineSize: 0.75 })],
  'chevron-down': (icon, k) => [k.surf(chev(k, 12, 12.6, 90), 'c1', { shineSize: 0.75 })],
  'chevron-up': (icon, k) => [k.surf(chev(k, 12, 11.4, 270), 'c1', { shineSize: 0.75 })],
  'chevron-last': (icon, k) => [
    k.surf(chev(k, 9.6, 12, 0, { h: 5.4 }), 'c1', { shineSize: 0.7 }),
    k.surf(k.pill(16.2, 5.2, 19.4, 18.8), 'c1', { shineSize: 0.7 }),
  ],
  'chevron-first': (icon, k) => [
    k.surf(k.pill(4.6, 5.2, 7.8, 18.8), 'c1', { shineSize: 0.7 }),
    k.surf(chev(k, 14.4, 12, 180, { h: 5.4 }), 'c1', { shineSize: 0.7 }),
  ],
  'chevrons-right': (icon, k) => [
    k.surf(chev(k, 8.4, 12, 0, { h: 5.4, d: 5 }), 'c1', { shine: 'none' }),
    k.surf(chev(k, 15.4, 12, 0, { h: 5.4, d: 5 }), 'c1', { shineSize: 0.7 }),
  ],
  'chevrons-left': (icon, k) => [
    k.surf(chev(k, 15.6, 12, 180, { h: 5.4, d: 5 }), 'c1', { shine: 'none' }),
    k.surf(chev(k, 8.6, 12, 180, { h: 5.4, d: 5 }), 'c1', { shineSize: 0.7 }),
  ],
  'chevrons-down': (icon, k) => [
    k.surf(chev(k, 12, 8.4, 90, { h: 5.4, d: 5 }), 'c1', { shine: 'none' }),
    k.surf(chev(k, 12, 15.4, 90, { h: 5.4, d: 5 }), 'c1', { shineSize: 0.7 }),
  ],
  'chevrons-up': (icon, k) => [
    k.surf(chev(k, 12, 15.6, 270, { h: 5.4, d: 5 }), 'c1', { shine: 'none' }),
    k.surf(chev(k, 12, 8.6, 270, { h: 5.4, d: 5 }), 'c1', { shineSize: 0.7 }),
  ],
  'chevrons-up-down': (icon, k) => [
    k.surf(chev(k, 12, 6.6, 270, { h: 5, d: 3.8, w: 3 }), 'c1', { shineSize: 0.7 }),
    k.surf(chev(k, 12, 17.4, 90, { h: 5, d: 3.8, w: 3 }), 'c1', { shine: 'none' }),
  ],
  'circle-arrow-down': (icon, k) => [
    k.surf(k.circle(12, 12, 9.4), 'c1', { shineSize: 1 }),
    glyph(k, [[[12, 6.8], [12, 16.6]], [[7.9, 12.6], [12, 16.8], [16.1, 12.6]]], { w: 2 }),
  ],

  // ---- alerts: coral, white glyphs
  'alert-circle': (icon, k) => [
    k.surf(k.circle(12, 12, 9.4), 'accent', { shineSize: 1 }),
    glyph(k, [[[12, 6.9], [12, 12.9]]], { w: 2.3, part: 'a' }),
    k.paint(k.circle(12, 16.7, 1.3), 'tint', { part: 'a' }),
  ],
  'alert-triangle': (icon, k) => [
    k.surf(k.poly([[12, 2.8], [21.6, 19.8], [2.4, 19.8]], [2.2, 1.6, 1.6]), 'accent', { shineSize: 0.9 }),
    glyph(k, [[[12, 8.6], [12, 13.4]]], { w: 2.2, part: 'a' }),
    k.paint(k.circle(12, 16.6, 1.25), 'tint', { part: 'a' }),
  ],
  ban: (icon, k) => [
    k.surf(k.cut(k.circle(12, 12, 9.4), k.circle(12, 12, 6.6)), 'accent', { shineSize: 0.9 }),
    k.surf(k.rot(k.rr(4.6, 10.6, 19.4, 13.4, 0.6), 45), 'accent', { shine: 'none', cast: false, ol: 0 }),
  ],

  // ---- calendars: copy the exemplar
  'calendar-check': (icon, k) => [
    ...calBody(k),
    k.surf(k.stroke([[8.2, 15.2], [11, 18], [16, 12.6]], 2.4), 'c4', { shineSize: 0.6, ol: 0.4, part: 'a' }),
    ...calRings(k),
  ],
  'calendar-days': (icon, k) => [
    ...calBody(k),
    k.paint(k.join(...[7.4, 12, 16.6].flatMap(x => [k.circle(x, 13.4, 0.8), k.circle(x, 17.4, 0.8)]).slice(0, 5)), 'ink', { op: 0.75 }),
    k.surf(k.circle(16.6, 17.4, 1.5), 'c2', { shine: 'dot', shineSize: 0.7, ol: 0.35, part: 'a' }),
    ...calRings(k),
  ],
  'calendar-plus': (icon, k) => [
    ...calBody(k),
    k.ink([[[12, 12.6], [12, 18.4]], [[9.1, 15.5], [14.9, 15.5]]], { w: 1.4, taper: false, part: 'a' }),
    ...calRings(k),
  ],

  // ---- bells
  'bell-ring': (icon, k) => [
    k.tube(['M3.2 9.2 C3.6 6.8 4.6 5.1 6.2 3.8', 'M20.8 9.2 C20.4 6.8 19.4 5.1 17.8 3.8'], 'c3', { part: 'deco', w: 1.1, ol: 0.42, shade: 0 }),
    ...bellOps(k),
  ],
  'bell-off': (icon, k) => [...bellOps(k), ...slash(k)],
  'camera-off': (icon, k) => [
    k.surf(k.pill(4.4, 4.6, 7.8, 6.8), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.rr(2.4, 6.6, 21.6, 20.2, 2.4), k.poly([[8, 7], [9.4, 4.2], [14.6, 4.2], [16, 7]], [0, 0.8, 0.8, 0])), 'c1'),
    k.surf(k.circle(12, 13.4, 4.7), 'ink', { part: 'a', shine: 'none', shade: 0 }),
    k.surf(k.circle(12, 13.4, 3), 'c1', { part: 'a', inset: true, ol: 0, shine: 'glint', shineSize: 0.9, tone: ['ink', 0.35] }),
    ...slash(k),
  ],

  // ---- checks
  'check-check': (icon, k) => [
    k.surf(k.stroke([[2.6, 12.8], [6.6, 16.8], [14.8, 7.6]], 3), 'c4', { shine: 'none' }),
    k.surf(k.stroke([[10.8, 15.8], [11.8, 16.8], [20.8, 7]], 3), 'c4', { shineSize: 0.75 }),
  ],
  'check-circle': (icon, k) => [
    k.surf(k.circle(12, 12, 9.4), 'c4', { shineSize: 1 }),
    glyph(k, [[[7.6, 12.4], [10.7, 15.4], [16.6, 9.2]]], { w: 2.3, part: 'a' }),
  ],
  'check-square': (icon, k) => [
    k.surf(k.rr(3, 3, 21, 21, 4), 'c4', { shineSize: 1 }),
    glyph(k, [[[7.6, 12.4], [10.7, 15.4], [16.6, 9.2]]], { w: 2.3, part: 'a' }),
  ],

  // ---- batch 2
  // sky disc with a cream universal-access figure, arms open
  accessibility: (icon, k) => [
    k.surf(k.circle(12, 12, 9.4), 'c1', { shineSize: 1 }),
    k.surf(k.circle(12, 6.9, 1.6), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.stroke([[[7.1, 10.4], [12, 11.2], [16.9, 10.4]], [[12, 10.8], [12, 14]], [[9.3, 18.1], [12, 14], [14.7, 18.1]]], 1.8), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
  ],
  // a coral heartbeat trace, glossy
  activity: (icon, k) => [
    k.surf(k.stroke([[2.8, 12.4], [6.2, 12.4], [9.4, 5], [14.6, 19], [17.8, 12.4], [21.2, 12.4]], 2.6), 'accent', { shineSize: 0.75 }),
  ],
  // sky address book with gold index tabs and a cream contact card
  'address-book': (icon, k) => [
    k.surf(k.join(k.rr(17.2, 5.8, 20.8, 8.2, 0.9), k.rr(17.2, 10.8, 20.8, 13.2, 0.9), k.rr(17.2, 15.8, 20.8, 18.2, 0.9)), 'c3', { shine: 'none', ol: 0.4 }),
    k.surf(k.rr(3.4, 2.6, 18.6, 21.4, 2.2), 'c1', { shineSize: 0.9 }),
    k.surf(k.rr(6.2, 5.4, 15.8, 18.6, 1.4), 'tint', { inset: true, shine: 'none', ol: 0.4, shade: 0.7 }),
    k.surf(k.circle(11, 9.5, 2.1), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.path('M7.8 16.6 C7.8 14.2 9.2 13.2 11 13.2 C12.8 13.2 14.2 14.2 14.2 16.6 Z'), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
  ],
  // coral twin-bell alarm clock with a cream face and ink hands
  'alarm-clock': (icon, k) => [
    k.surf(k.stroke([[[7, 17.6], [5, 20.4]], [[17, 17.6], [19, 20.4]]], 1.9), 'c3', { shine: 'none', shade: 0, ol: 0.35 }),
    k.surf(k.path('M2.9 7.3 A3.3 3.3 0 0 1 7.3 2.9 Z'), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.path('M16.7 2.9 A3.3 3.3 0 0 1 21.1 7.3 Z'), 'c3', { part: 'a', shine: 'none' }),
    k.surf(k.circle(12, 12.6, 7.6), 'accent', { shineSize: 0.95 }),
    k.surf(k.circle(12, 12.6, 5.4), 'tint', { inset: true, shine: 'none', ol: 0.4, shade: 0.7 }),
    k.ink([[12, 9.2], [12, 12.6], [14.4, 14]], { w: 1.1, part: 'a', taper: 0.6 }),
    k.paint(k.circle(12, 12.6, 0.75), 'accent'),
  ],
  // a cream ambulance with a coral stripe and red cross, sky window, light bar
  ambulance: (icon, k) => [
    k.surf(k.pill(5.6, 2.4, 9.4, 4.6), 'accent', { shine: 'dot', ol: 0.35, shineSize: 0.6 }),
    k.surf(k.path('M2.2 6.4 C2.2 5 3.2 4 4.6 4 H13.6 C14.2 4 14.6 4.2 15 4.7 L18.6 9.6 H19.6 C20.9 9.6 21.8 10.6 21.8 11.9 V16.4 C21.8 17.3 21.1 18 20.2 18 H3.8 C2.9 18 2.2 17.3 2.2 16.4 Z'), 'tint', { shine: 'none' }),
    k.surf(k.clip(k.path('M2.2 6.4 C2.2 5 3.2 4 4.6 4 H13.6 C14.2 4 14.6 4.2 15 4.7 L18.6 9.6 H19.6 C20.9 9.6 21.8 10.6 21.8 11.9 V16.4 C21.8 17.3 21.1 18 20.2 18 H3.8 C2.9 18 2.2 17.3 2.2 16.4 Z'), k.rect(1, 13.6, 23, 15.4)), 'accent', { shine: 'none', cast: false, ol: 0 }),
    k.surf(k.poly([[14.4, 5.6], [17.6, 9.8], [14.4, 9.8]], 0.5), 'ink', { part: 'a', inset: true, ol: 0.35, shine: 'glass', shade: 0 }),
    k.surf(k.unite(k.rr(6.6, 6.6, 8.4, 12.4, 0.4), k.rr(4.6, 8.6, 10.4, 10.4, 0.4)), 'accent', { part: 'a', shine: 'none', ol: 0.35 }),
    ...wheel(k, 6.6, 18.2), ...wheel(k, 17.8, 18.2),
  ],
  // a sky anchor with a gold ring
  anchor: (icon, k) => [
    k.surf(k.unite(
      k.seg(12, 6.8, 12, 20.6, 2.2), k.seg(7.8, 11.4, 16.2, 11.4, 2),
      k.arc(12, 13.6, 7, 25, 155, 2.2),
      k.poly([[2.6, 17.6], [5.6, 12.6], [8, 17.2]], 0.6), k.poly([[21.4, 17.6], [18.4, 12.6], [16, 17.2]], 0.6),
    ), 'c1', { shineSize: 0.8 }),
    k.surf(k.ring(12, 4.9, 2.6, 1.1), 'c3', { part: 'a', shine: 'dot', ol: 0.4, shineSize: 0.6 }),
  ],
  // a fuming coral face: V brows, glaring eyes, a frown and the anime anger mark
  angry: (icon, k) => [
    k.surf(k.circle(11.6, 12.6, 8.8), 'accent', { shine: 'none' }),
    k.ink([[[6.8, 8.9], [10.2, 10.6]], [[16.4, 8.9], [13, 10.6]]], { w: 1.3, part: 'a' }),
    k.paint(k.join(k.ellipse(8.8, 13, 0.85, 1.15), k.ellipse(14.4, 13, 0.85, 1.15)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.6, 12.6, 0.3), k.circle(14.2, 12.6, 0.3))),
    k.ink('M8.8 18 C10.4 16.2 12.8 16.2 14.4 18', { w: 1.1, part: 'a' }),
    angerMark(k, 19.9, 4.1, 0.72),
  ],
  // a sky app window: glossy title bar with traffic lights, cream content pane
  'app-window': (icon, k) => [
    k.surf(k.rr(2.4, 4, 21.6, 20, 2.2), 'tint', { shine: 'none' }),
    k.surf(k.clip(k.rr(2.4, 4, 21.6, 20, 2.2), k.rect(2, 3, 22, 9.4)), 'c1', { cast: false, shineSize: 0.7 }),
    k.paint(k.join(k.circle(5.6, 6.7, 0.85), k.circle(8.4, 6.7, 0.85), k.circle(11.2, 6.7, 0.85)), 'tint', { part: 'a' }),
    k.ink([[[5.6, 12.8], [13.6, 12.8]], [[5.6, 15.8], [11.2, 15.8]]], { w: 0.9, part: 'a' }),
    k.surf(k.rr(14.6, 12.2, 18.6, 17.4, 1), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
  ],
  // a glossy coral apple with a cocoa stem and a green leaf
  apple: (icon, k) => [
    k.surf(k.seg(12, 9.4, 11, 4.2, 1.4), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.25 }),
    k.surf(k.path('M12 10 C14.5 7.5 20 8 20 13.5 C20 18 17 21.5 14.5 21.5 C13.5 21.5 13 21 12 21 C11 21 10.5 21.5 9.5 21.5 C7 21.5 4 18 4 13.5 C4 8 9.5 7.5 12 10 Z'), 'accent', { shineSize: 1 }),
    k.surf(k.lens(12.6, 6, 18, 2.9, 1.4), 'c4', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  // archive box: cream body, sky lid casting onto it, an ink handle slot
  archive: (icon, k) => [
    k.surf(k.rr(4.4, 7.6, 19.6, 20.6, [0, 0, 2, 2]), 'tint', { shine: 'none' }),
    k.surf(k.pill(9.4, 11.4, 14.6, 13.8), 'ink', { part: 'a', inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.surf(k.rr(2.8, 3.4, 21.2, 8.6, 1.6), 'c1', { shineSize: 0.85 }),
  ],
  // sky at sign as one glossy stroke
  'at-sign': (icon, k) => [
    k.surf(k.unite(k.ring(12, 12, 4.6, 2.4), k.stroke('M16.6 8 V13.6 C16.6 15.4 17.6 16.4 18.9 16.4 C20.4 16.4 21.2 14.8 21.2 12 C21.2 6.8 17.2 2.8 12 2.8 C6.8 2.8 2.8 6.8 2.8 12 C2.8 17.2 6.8 21.2 12 21.2 C13.9 21.2 15.5 20.7 16.8 19.8', 2.2)), 'c1', { shineSize: 0.8 }),
  ],
  // three sky orbits around a sakura nucleus
  atom: (icon, k) => [
    k.tube([0, 60, 120].map(d => ({ pts: k.rot(k.ellipse(12, 12, 9.4, 3.6), d)[0], closed: true })), 'c1', { w: 1.3, ol: 0.42 }),
    k.surf(k.circle(12, 12, 2.6), 'c2', { part: 'a', shine: 'dot', shineSize: 0.8, ol: 0.45 }),
    k.sparkleAt(20.2, 4, 1.7, { mx: -1, my: 1 }),
  ],
  // sakura sound bars
  'audio-lines': (icon, k) => [
    k.surf(k.join(k.pill(2.4, 9.8, 4.6, 14.2), k.pill(6.4, 6.4, 8.6, 17.6), k.pill(10.4, 2.8, 12.6, 21.2), k.pill(14.4, 7.6, 16.6, 16.4), k.pill(18.4, 10.2, 20.6, 13.8)), 'c2', { part: 'a', shine: 'dot', shineSize: 0.55 }),
  ],
  // a gold medal on sakura and sky ribbons, with a star
  award: (icon, k) => [
    k.surf(k.poly([[7.6, 13], [5.6, 21.4], [8.4, 20.2], [10, 22], [11.6, 14.6]], 0.5), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.poly([[16.4, 13], [18.4, 21.4], [15.6, 20.2], [14, 22], [12.4, 14.6]], 0.5), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.circle(12, 9.2, 6.6), 'c3', { shineSize: 0.9 }),
    k.surf(k.starShape(12, 9.5, 3.4, 1.6, 0.4), 'tint', { inset: true, ol: 0, shine: 'none', shade: 0, tone: ['accent', 0.3] }),
  ],
  // sky backpack: top loop, flap, front pocket, gold buckles
  backpack: (icon, k) => [
    k.surf(k.arc(12, 5.2, 2.4, 180, 360, 1.3), 'c1', { shine: 'none', ol: 0.35 }),
    k.surf(k.rr(4.2, 5.4, 19.8, 21.4, [5, 5, 2.4, 2.4]), 'c1', { shineSize: 0.9 }),
    k.surf(k.rr(7.4, 13.4, 16.6, 19.6, 1.6), 'c2', { part: 'a', shine: 'none', ol: 0.4 }),
    k.ink([[7.8, 15.6], [16.2, 15.6]], { w: 0.8, part: 'a' }),
    k.surf(k.rr(10.8, 9.4, 13.2, 11.6, 0.6), 'c3', { shine: 'none', ol: 0.35 }),
  ],
  // a sky verified rosette with a white check
  'badge-check': (icon, k) => [
    k.surf(rosette(k), 'c1', { shineSize: 1 }),
    glyph(k, [[[8, 12.2], [10.8, 15], [16.2, 9.4]]], { w: 2.2, part: 'a' }),
  ],
  // a green rosette with a white percent
  'badge-percent': (icon, k) => [
    k.surf(rosette(k), 'c4', { shineSize: 0.6 }),
    glyph(k, [[[15.4, 8.6], [8.6, 15.4]]], { w: 1.8, part: 'a' }),
    k.paint(k.join(k.circle(9, 9, 1.35), k.circle(15, 15, 1.35)), 'tint', { part: 'a' }),
  ],
  // a sakura balloon with a knot and a curly string
  balloon: (icon, k) => [
    k.ink('M12 17.4 C10.4 18.6 13.6 19.6 12 21.6', { w: 0.85, part: 'a' }),
    k.surf(k.poly([[12, 15.8], [13.4, 17.8], [10.6, 17.8]], 0.4), 'c2', { shine: 'none', ol: 0.35 }),
    k.surf(k.path('M12 2.6 C16.2 2.6 18.6 5.8 18.6 9.6 C18.6 13.6 15.4 16.6 12 16.6 C8.6 16.6 5.4 13.6 5.4 9.6 C5.4 5.8 7.8 2.6 12 2.6 Z'), 'c2', { shineSize: 1.1 }),
    k.sparkleAt(20.4, 15.6, 1.7, { mx: -1, my: -1 }),
  ],
  // a cream plaster with a sakura pad and air holes
  bandage: (icon, k) => {
    const R = s => k.rot(s, -45, 12, 12)
    return [
      k.surf(R(k.pill(2.2, 7.8, 21.8, 16.2)), 'tint', { shine: 'none' }),
      k.surf(R(k.rr(8.6, 8.4, 15.4, 15.6, 1)), 'c2', { shine: 'none', ol: 0.4, cast: false }),
      k.paint(R(k.join(k.circle(10.8, 10.8, 0.55), k.circle(13.2, 10.8, 0.55), k.circle(10.8, 13.2, 0.55), k.circle(13.2, 13.2, 0.55))), 'tint', { part: 'a' }),
    ]
  },
  // a green banknote with a gold coin medallion
  banknote: (icon, k) => [
    k.surf(k.rr(2.2, 5.6, 21.8, 18.4, 2), 'c4', { shineSize: 0.85 }),
    k.surf(k.rr(4.2, 7.6, 19.8, 16.4, 1.2), 'c4', { inset: true, ol: 0.35, shine: 'none', shade: 0.6 }),
    k.surf(k.circle(12, 12, 3), 'c3', { part: 'a', shine: 'dot', ol: 0.4, shineSize: 0.6 }),
    k.paint(k.join(k.circle(6.6, 12, 0.8), k.circle(17.4, 12, 0.8)), 'ink', { op: 0.6 }),
  ],

  // ---- batch 3
  // cream label with ink bars of varying weight
  barcode: (icon, k) => [
    k.surf(k.rr(2.4, 4.6, 21.6, 19.4, 2), 'tint', { shine: 'none' }),
    k.paint(k.join(...[[5.2, 1.2], [7.4, 0.6], [9, 1.5], [11.4, 0.6], [12.9, 0.9], [14.8, 1.6], [17.2, 0.6], [18.4, 1.2]].map(([x, w]) => k.rr(x, 7.4, x + w, 16.6, 0.25))), 'ink', { part: 'a' }),
  ],
  // an amber basketball with ink seams
  basketball: (icon, k) => [
    k.surf(k.circle(12, 12, 9.4), 'c3', { shineSize: 1, tone: ['accent', 0.55] }),
    k.ink(['M12 2.8 V21.2', 'M2.8 12 H21.2', 'M5.6 5.4 C8.6 8.6 8.6 15.4 5.6 18.6', 'M18.4 5.4 C15.4 8.6 15.4 15.4 18.4 18.6'], { w: 0.85, taper: false, part: 'a' }),
  ],
  // cream tub with gold feet, a sky faucet and bubbles
  bath: (icon, k) => [
    k.surf(k.stroke([[[6.4, 18.6], [5.4, 20.6]], [[17.6, 18.6], [18.6, 20.6]]], 1.6), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.stroke('M5 11 V6.4 C5 4.9 6.1 3.8 7.5 3.8 C8.9 3.8 10 4.9 10 6.4 V7.2', 1.5), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.join(k.circle(12.6, 9, 1.5), k.circle(15.6, 8.2, 1.1), k.circle(17.9, 9.6, 0.9)), 'edge', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.35 }),
    k.surf(k.path('M3.4 11 H20.6 V14 C20.6 16.8 18.3 19.1 15.5 19.1 H8.5 C5.7 19.1 3.4 16.8 3.4 14 Z'), 'tint', { shineSize: 0.9 }),
    k.surf(k.pill(2.2, 10, 21.8, 12.4), 'c1', { shine: 'none', ol: 0.4 }),
  ],
  // sky battery case, green cells in a dark window
  battery: (icon, k) => batteryOps(k, 3, 'c4'),
  'battery-low': (icon, k) => batteryOps(k, 1, 'accent'),
  'battery-charging': (icon, k) => [
    ...batteryOps(k, 0, 'c4'),
    k.moat(k.poly([[12.8, 3.4], [8.2, 12.6], [11.8, 12.6], [10.4, 20.6], [15.6, 10.8], [12, 10.8]], 0.3), 0.6),
    k.surf(k.poly([[12.8, 3.4], [8.2, 12.6], [11.8, 12.6], [10.4, 20.6], [15.6, 10.8], [12, 10.8]], 0.3), 'c3', { part: 's', shine: 'none', ol: 0.4 }),
  ],
  // a cosy bed: gold headboard, cream pillow, sakura blanket
  bed: (icon, k) => [
    k.surf(k.join(k.rr(2.2, 15.4, 4.2, 20.4, 0.6), k.rr(19.6, 15.4, 21.6, 20.4, 0.6)), 'c3', { shine: 'none', ol: 0.35 }),
    k.surf(k.rr(2.2, 4.2, 5, 18, 1.2), 'c3', { shineSize: 0.6 }),
    k.surf(k.rr(4.6, 12.4, 21.6, 17.2, 1.2), 'c1', { shine: 'none' }),
    k.surf(k.rr(5.4, 8.6, 10.8, 12.6, 1.6), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(10, 10.4, 21.2, 14.4, [1.8, 2, 0.8, 0.8]), 'c2', { shine: 'none', ol: 0.45 }),
  ],
  // a gold beer mug with a cream foam crown and glass handle
  beer: (icon, k) => [
    k.surf(k.cut(k.rr(14, 10.8, 20.6, 18.8, 2.4), k.rr(15.8, 12.8, 18.6, 16.8, 1)), 'edge', { shine: 'none', ol: 0.45 }),
    k.surf(k.rr(4, 8.2, 16, 21.4, [0, 0, 2.2, 2.2]), 'c3', { shineSize: 1 }),
    k.ink([[[8, 13.4], [8, 18]], [[12, 13.4], [12, 18]]], { w: 0.85, role: 'tint', shift: 0 }),
    k.surf(k.path('M3.6 9.8 C2.2 7.6 4.4 4.8 7 5.6 C8 3 12.6 2.6 13.6 5 C15.8 4.6 17.8 7.2 16.4 9.8 C14.8 10.8 13.4 9.6 12.4 10.6 C11 11.6 9.4 10.2 8 10.8 C6.4 11.4 4.8 10.8 3.6 9.8 Z'), 'tint', { part: 'a', shine: 'none' }),
  ],
  // sky bicycle frame between two ink wheels, sakura saddle
  bike: (icon, k) => [
    k.surf(k.ring(5.5, 16.5, 3.6, 2.3), 'c1', { shine: 'none', ol: 0.38 }),
    k.surf(k.ring(18.5, 16.5, 3.6, 2.3), 'c1', { shine: 'none', ol: 0.38 }),
    k.surf(k.stroke([[[5.5, 16.5], [9, 10], [15, 10]], [[9, 10], [12, 16.5], [15, 10]], [[12, 16.5], [5.5, 16.5]], [[15, 10], [18.5, 16.5]], [[15, 10], [13.6, 5.8], [16.2, 5.8]], [[9, 10], [8.6, 7.6]]], 1.3), 'accent', { part: 'a', shine: 'none', ol: 0.38 }),
    k.surf(k.pill(6.6, 6.4, 10.6, 8.2), 'c2', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.35 }),
    k.surf(k.join(k.circle(5.5, 16.5, 0.9), k.circle(18.5, 16.5, 0.9), k.circle(12, 16.5, 1.1)), 'c3', { shine: 'none', ol: 0.3, shade: 0 }),
  ],
  // sky binoculars with dark glass lenses and a gold bridge
  binoculars: (icon, k) => [
    k.surf(k.rr(8.4, 9.6, 15.6, 12.6, 0.6), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.unite(k.circle(6, 16.8, 3.7), k.poly([[2.4, 16.6], [4, 5.6], [8, 5.6], [9.6, 16.6]], [0, 1, 1, 0])), 'c1', { shine: 'none' }),
    k.surf(k.unite(k.circle(18, 16.8, 3.7), k.poly([[14.4, 16.6], [16, 5.6], [20, 5.6], [21.6, 16.6]], [0, 1, 1, 0])), 'c1', { shineSize: 0.8 }),
    k.surf(k.circle(6, 16.8, 2.3), 'ink', { inset: true, ol: 0, shine: 'glint', shineSize: 0.7, shade: 0 }),
    k.surf(k.circle(18, 16.8, 2.3), 'ink', { inset: true, ol: 0, shine: 'glint', shineSize: 0.7, shade: 0 }),
  ],
  // a chubby sky songbird: gold beak, pink cheek, wing, catch-light eye
  bird: (icon, k) => [
    k.surf(k.stroke([[[10, 17.6], [10, 20.8]], [[13.5, 17], [13.5, 20.8]]], 1.2), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.poly([[18.6, 6.6], [21.6, 8], [18.6, 9.4]], 0.4), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.path('M19 8 C19 13.5 15.5 18 10.5 18 C7.75 18 5.75 16.75 4.75 14.5 L2.5 9.5 L7.25 11.25 C8.75 10.25 10.25 9.5 12 9 C12 6.5 13.5 4.5 15.5 4.5 C17.4 4.5 19 6 19 8 Z'), 'c1', { shine: 'none' }),
    k.shine(k.lens(12.9, 7.6, 14.6, 5.5, 0.45)),
    k.surf(k.path('M14.8 11 C14.8 14 12 15.6 8.2 14 C9.6 12.2 11.8 10.8 14.8 11 Z'), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.paint(k.ellipse(15.9, 7.7, 0.6, 0.85), 'ink'),
    k.shine(k.circle(15.75, 7.4, 0.24)),
    k.paint(k.ellipse(17.2, 10.2, 1, 0.6), 'c2', { op: 0.85 }),
  ],
  // a sky badge carrying the white rune
  bluetooth: (icon, k) => [
    k.surf(k.rr(5, 2.4, 19, 21.6, 7), 'c1', { shineSize: 0.9 }),
    glyph(k, [[[8.2, 8.4], [15.6, 15.4], [12, 18.8], [12, 5.2], [15.6, 8.6], [8.2, 15.6]]], { w: 1.6 }),
  ],
  // a closed sky book: cream page block, sakura ribbon, gold title plate
  book: (icon, k) => [
    k.surf(k.rr(4.2, 2.6, 19.6, 21.4, [1.4, 2, 2, 2.6]), 'c1', { shineSize: 0.9 }),
    k.surf(k.rr(6.6, 16.8, 19.6, 21.4, [1.6, 0, 1.2, 1.6]), 'tint', { shine: 'none', ol: 0.4 }),
    k.ink([[[8.4, 18.6], [18.4, 18.6]]], { w: 0.6, taper: 0.6 }),
    k.surf(k.poly([[14.2, 2.8], [16.8, 2.8], [16.8, 9.6], [15.5, 8.4], [14.2, 9.6]], 0.3), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.rr(8.6, 6, 12.4, 7.6, 0.6), 'c3', { shine: 'none', ol: 0.3, shade: 0 }),
  ],
  // an open book: sky cover, two cream pages with text lines
  'book-open': (icon, k) => [
    k.surf(k.path('M1.8 6.6 H22.2 V19.4 H13.6 C13 20.4 11 20.4 10.4 19.4 H1.8 Z'), 'c1', { shine: 'none' }),
    k.surf(k.path('M3.2 4.8 H8.6 C10.4 4.8 12 6.2 12 8 V19 C11.2 18.2 10 17.8 8.8 17.8 H3.2 Z'), 'tint', { part: 'a', shine: 'none', ol: 0.45 }),
    k.surf(k.path('M20.8 4.8 H15.4 C13.6 4.8 12 6.2 12 8 V19 C12.8 18.2 14 17.8 15.2 17.8 H20.8 Z'), 'tint', { part: 'a', shine: 'none', ol: 0.45 }),
    k.ink([[[5, 9], [9.8, 9]], [[5, 12], [9.8, 12]], [[14.2, 9], [19, 9]], [[14.2, 12], [19, 12]], [[14.2, 15], [17.4, 15]]], { w: 0.7, part: 'a' }),
  ],
  // glossy sakura bookmark ribbon
  bookmark: (icon, k) => [
    k.surf(k.poly([[5.6, 2.6], [18.4, 2.6], [18.4, 21.2], [12, 16.4], [5.6, 21.2]], [2, 2, 0.8, 0.6, 0.8]), 'c2', { shineSize: 1 }),
  ],
  'bookmark-plus': (icon, k) => [
    k.surf(k.poly([[5.6, 2.6], [18.4, 2.6], [18.4, 21.2], [12, 16.4], [5.6, 21.2]], [2, 2, 0.8, 0.6, 0.8]), 'c2', { shine: 'none' }),
    glyph(k, [[[12, 6.4], [12, 12.4]], [[9, 9.4], [15, 9.4]]], { w: 1.8, part: 's' }),
  ],
  // a friendly sky robot head with a dark visor and glowing eyes
  bot: (icon, k) => [
    k.surf(k.join(k.pill(1.6, 12, 3.8, 16.6), k.pill(20.2, 12, 22.4, 16.6)), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.seg(12, 4.6, 12, 8.4, 1.2), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.25 }),
    k.surf(k.circle(12, 3.8, 1.5), 'accent', { part: 'a', shine: 'dot', shineSize: 0.5, ol: 0.4 }),
    k.surf(k.rr(4.8, 8, 19.2, 20.6, 3.2), 'c1', { shineSize: 0.9 }),
    k.surf(k.rr(6.8, 10.6, 17.2, 16.6, 2.4), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.paint(k.join(k.ellipse(9.6, 13.6, 1, 1.3), k.ellipse(14.4, 13.6, 1, 1.3)), 'edge', { part: 'a' }),
    k.shine(k.join(k.circle(9.3, 13.1, 0.35), k.circle(14.1, 13.1, 0.35))),
    k.ink('M10.4 18.6 C11.4 19.2 12.6 19.2 13.6 18.6', { w: 0.8, part: 'a' }),
  ],
  // a sakura brain with ink folds
  brain: (icon, k) => [
    k.surf(k.path('M12 5.5 A3 3 0 0 0 6.5 6 A3.5 3.5 0 0 0 3.5 12 A3.5 3.5 0 0 0 6 18 A3.25 3.25 0 0 0 12 19 A3.25 3.25 0 0 0 18 18 A3.5 3.5 0 0 0 20.5 12 A3.5 3.5 0 0 0 17.5 6 A3 3 0 0 0 12 5.5 Z'), 'c2', { shineSize: 0.9 }),
    k.ink(['M12 6 V18.6', 'M6.6 6.4 C7.5 7.1 8 8 8 9.2', 'M3.9 12 C5.7 12 7 12.8 7.5 14.4', 'M17.4 6.4 C16.5 7.1 16 8 16 9.2', 'M20.1 12 C18.3 12 17 12.8 16.5 14.4'], { w: 0.85, part: 'a' }),
  ],
  // a gold briefcase with a clasp band and sky handle
  briefcase: (icon, k) => [
    k.surf(k.cut(k.rr(8.2, 3.4, 15.8, 8.2, 1.6), k.rr(9.8, 5, 14.2, 8.4, 0.6)), 'c1', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(2.4, 6.8, 21.6, 20.6, 2.2), 'c3', { shineSize: 0.9 }),
    k.ink([[2.8, 12.6], [21.2, 12.6]], { w: 0.85 }),
    k.surf(k.rr(10.4, 11.2, 13.6, 14.2, 0.6), 'c1', { shine: 'none', ol: 0.35 }),
  ],
  // a coral medical case with a white cross
  'briefcase-medical': (icon, k) => [
    k.surf(k.cut(k.rr(8.2, 3.4, 15.8, 8.2, 1.6), k.rr(9.8, 5, 14.2, 8.4, 0.6)), 'tint', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.rr(2.4, 6.8, 21.6, 20.6, 2.2), 'accent', { shineSize: 0.9 }),
    k.surf(k.unite(k.rr(10.6, 9.8, 13.4, 18, 0.5), k.rr(7.9, 12.5, 16.1, 15.3, 0.5)), 'tint', { shine: 'none', ol: 0, shade: 0, cast: false, casts: false }),
  ],

  // ---- batch 4
  // a ladybug: coral shell with ink spots, ink head and legs, sky antennae tips
  bug: (icon, k) => [
    k.ink([[[7, 11.5], [3.5, 10]], [[7, 15.5], [3, 15.5]], [[9, 19], [5.5, 21]], [[17, 11.5], [20.5, 10]], [[17, 15.5], [21, 15.5]], [[15, 19], [18.5, 21]]], { w: 1.1 }),
    k.ink([[[10.5, 6.6], [8.6, 3.6]], [[13.5, 6.6], [15.4, 3.6]]], { w: 0.9, part: 'a' }),
    k.surf(k.join(k.circle(8.5, 3.5, 0.9), k.circle(15.5, 3.5, 0.9)), 'c2', { part: 'a', shine: 'none', ol: 0.3, shade: 0 }),
    k.surf(k.path('M8.6 9.4 C8.6 7.4 10.1 5.8 12 5.8 C13.9 5.8 15.4 7.4 15.4 9.4 Z'), 'ink', { shine: 'none', shade: 0, ol: 0.35, rim: true }),
    k.surf(k.path('M6.6 11.4 C6.6 9.9 7.8 8.8 9.2 8.8 H14.8 C16.2 8.8 17.4 9.9 17.4 11.4 V14.6 C17.4 17.8 15 20.4 12 20.4 C9 20.4 6.6 17.8 6.6 14.6 Z'), 'accent', { shineSize: 0.9 }),
    k.ink([[12, 9.2], [12, 20]], { w: 0.9, part: 'a', taper: false }),
    k.paint(k.join(k.circle(9.4, 13.4, 1.1), k.circle(14.6, 13.4, 1.1), k.circle(9.8, 17.2, 0.85), k.circle(14.2, 17.2, 0.85)), 'ink'),
  ],
  // a sky office tower with warm gold lit windows and a gold door
  building: (icon, k) => [
    k.surf(k.rr(5, 2.6, 19, 21.4, [2, 2, 0, 0]), 'c1', { shineSize: 0.85 }),
    k.surf(k.join(...[6.6, 10.4, 14.2].flatMap(y => [k.rr(8.2, y - 0.9, 10.8, y + 0.9, 0.5), k.rr(13.2, y - 0.9, 15.8, y + 0.9, 0.5)])), 'c3', { part: 'a', inset: true, shine: 'none', ol: 0.3, shade: 0 }),
    k.surf(k.rr(10, 17.6, 14, 21.6, [1, 1, 0, 0]), 'c3', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.pill(2.6, 20.4, 21.4, 22), 'c4', { shine: 'none', ol: 0.35, shade: 0 }),
  ],
  // a stacked burger: gold bun with seeds, green lettuce, cocoa patty, bottom bun
  burger: (icon, k) => [
    k.surf(k.rr(3.4, 16.6, 20.6, 21.4, [1, 1, 2.6, 2.6]), 'c3', { shine: 'none' }),
    k.surf(k.pill(2.6, 13.2, 21.4, 16.8), 'ink', { part: 'a', shine: 'none', shade: 0, ol: 0.3, tone: ['accent', 0.3] }),
    k.surf(k.path('M2.4 12.6 C3.6 11.4 5 11.4 6.2 12.4 C7.6 13.6 9 11.6 10.4 12.6 C11.8 13.6 13.2 11.6 14.6 12.6 C16 13.6 17.4 11.6 18.8 12.6 C19.8 13.2 20.8 12.6 21.6 12.2 L21.4 14 H2.6 Z'), 'c4', { part: 'a', shine: 'none', ol: 0.4 }),
    k.surf(k.path('M3.2 10.6 C3.2 6.2 7 3.2 12 3.2 C17 3.2 20.8 6.2 20.8 10.6 C20.8 11.2 20.4 11.6 19.8 11.6 H4.2 C3.6 11.6 3.2 11.2 3.2 10.6 Z'), 'c3', { shineSize: 0.95 }),
    k.paint(k.join(k.ellipse(9, 6.8, 0.6, 0.35, -20), k.ellipse(12.6, 5.6, 0.6, 0.35, 10), k.ellipse(15.6, 7.6, 0.6, 0.35, 25), k.ellipse(11.4, 8.6, 0.6, 0.35, -5)), 'tint'),
  ],
  // a gold school bus: sky windscreen, ink wheels, white headlights
  bus: (icon, k) => [
    k.surf(k.join(k.rr(5.6, 18.6, 8.4, 21.6, [0, 0, 1, 1]), k.rr(15.6, 18.6, 18.4, 21.6, [0, 0, 1, 1])), 'ink', { shine: 'none', shade: 0, ol: 0.3, rim: true }),
    k.paint(k.join(k.rr(6.3, 20.1, 7.7, 20.9, 0.4), k.rr(16.3, 20.1, 17.7, 20.9, 0.4)), 'c1'),
    k.surf(k.rr(3.8, 2.6, 20.2, 20, 2.6), 'c3', { shineSize: 0.85 }),
    k.surf(k.rr(5.6, 6.6, 18.4, 12.4, 1), 'c1', { inset: true, ol: 0.4, shine: 'glass', shade: 0.6 }),
    k.surf(k.join(k.circle(7.8, 16, 1.2), k.circle(16.2, 16, 1.2)), 'tint', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.ink([[9.8, 4.6], [14.2, 4.6]], { w: 0.85 }),
  ],
  // a sakura butterfly with sky lower wings and an ink body
  butterfly: (icon, k) => [
    k.ink([[[12, 8], [10.6, 4.4]], [[12, 8], [13.4, 4.4]]], { w: 0.8, part: 'a' }),
    k.surf(k.path('M11.6 10 C10 8 8.4 3.8 5 3.5 C3 3.5 2.5 5.2 2.5 7.5 C2.8 10 5.2 12 8.5 12.5 C10 12.6 11.4 12.2 11.6 11 Z'), 'c2', { part: 'a', shineSize: 0.7 }),
    k.surf(k.path('M12.4 10 C14 8 15.6 3.8 19 3.5 C21 3.5 21.5 5.2 21.5 7.5 C21.2 10 18.8 12 15.5 12.5 C14 12.6 12.6 12.2 12.4 11 Z'), 'c2', { part: 'a', shine: 'none' }),
    k.surf(k.path('M11.6 13 C10 12.6 6.2 13.6 5 15.6 C4.2 17.4 5 20.6 8.4 20 C10.4 19.4 11.4 16.6 11.6 14.6 Z'), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.path('M12.4 13 C14 12.6 17.8 13.6 19 15.6 C19.8 17.4 19 20.6 15.6 20 C13.6 19.4 12.6 16.6 12.4 14.6 Z'), 'c1', { part: 'a', shine: 'none' }),
    k.surf(k.pill(11, 7.4, 13, 19.4), 'ink', { shine: 'none', shade: 0, ol: 0.3 }),
    k.paint(k.join(k.circle(6.4, 7, 1), k.circle(17.6, 7, 1)), 'tint', { part: 'a', op: 0.9 }),
  ],
  // a strawberry cake: cream sponge, sakura frosting drips, a candle with a flame
  cake: (icon, k) => [
    k.surf(k.drop(12, 5.2, 1.4, 12, 1.8), 'c3', { part: 'a', shine: 'none', ol: 0.35, tone: ['accent', 0.5] }),
    k.surf(k.rr(11.1, 7.2, 12.9, 11.6, 0.4), 'c1', { shine: 'none', ol: 0.3 }),
    k.surf(k.rr(3.8, 11, 20.2, 20.8, [2.2, 2.2, 0.6, 0.6]), 'tint', { shine: 'none' }),
    k.surf(k.path('M3.8 13.2 C3.8 12 4.8 11 6 11 H18 C19.2 11 20.2 12 20.2 13.2 V15 C20.2 16.2 18.4 16.2 18.2 15.2 C18 14.2 16.4 14 16.1 15.4 C15.8 17 13.8 17 13.6 15.4 C13.4 14.2 11.6 14 11.3 15.2 C11 16.6 9 16.6 8.8 15.2 C8.6 14 7 14.2 6.6 15.6 C6.2 17 3.8 16.8 3.8 15 Z'), 'c2', { cast: false, shineSize: 0.7 }),
    k.surf(k.pill(2.2, 20.2, 21.8, 22), 'c1', { shine: 'none', ol: 0.35, shade: 0 }),
  ],
  // a sky calculator: pale display, gold and sakura keys
  calculator: (icon, k) => [
    k.surf(k.rr(4.4, 2.4, 19.6, 21.6, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(7, 5, 17, 9.8, 1), 'edge', { part: 'a', inset: true, ol: 0.4, shine: 'glass', shade: 0.5 }),
    k.surf(k.join(k.circle(8.6, 13.6, 1.15), k.circle(12, 13.6, 1.15), k.circle(8.6, 17.6, 1.15), k.circle(12, 17.6, 1.15)), 'tint', { part: 'a', shine: 'none', ol: 0.35 }),
    k.surf(k.join(k.circle(15.4, 13.6, 1.15), k.circle(15.4, 17.6, 1.15)), 'c2', { part: 'a', shine: 'none', ol: 0.35 }),
  ],
  // a dark screen with cream and sakura caption bars
  captions: (icon, k) => [
    k.surf(k.rr(2.2, 4, 21.8, 20, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(4.2, 6, 19.8, 18, 1.4), 'ink', { inset: true, ol: 0, shine: 'none', shade: 0 }),
    k.paint(k.join(k.pill(6, 11.2, 8.6, 12.8), k.pill(10.6, 11.2, 18, 12.8), k.pill(6, 14.8, 13.4, 16.4)), 'tint', { part: 'a' }),
    k.paint(k.pill(15.4, 14.8, 18, 16.4), 'c2', { part: 'a' }),
  ],
  // a glossy coral hatchback, sky windows, ink tyres, speed lines behind
  car: (icon, k) => [
    k.speed(2.6, 7.4, 180, { n: 2, len: 2, gap: 1.6, w: 0.6 }),
    k.surf(k.path('M2.4 12.2 C2.4 11 3.4 10 4.6 10 H5.6 L7.6 5.8 C7.9 5.2 8.4 4.9 9 4.9 H13.2 C13.7 4.9 14.1 5.1 14.4 5.5 L17.8 10 H19.4 C20.6 10 21.6 11 21.6 12.2 V15.2 C21.6 16 21 16.6 20.2 16.6 H3.8 C3 16.6 2.4 16 2.4 15.2 Z'), 'accent', { shineSize: 0.9 }),
    k.surf(k.poly([[8.6, 6.6], [12.8, 6.6], [15.6, 10], [7, 10]], [0.6, 0.6, 0.3, 0.3]), 'edge', { part: 'a', inset: true, ol: 0.35, shine: 'glass', shade: 0.5 }),
    k.surf(k.join(k.rr(19.6, 11.6, 21.2, 13, 0.5)), 'c3', { shine: 'none', ol: 0.25, shade: 0 }),
    ...wheel(k, 7.2, 16.6, 2.3), ...wheel(k, 16.8, 16.6, 2.3),
  ],
  // a sky screen with dark glass and three cast arcs in gold
  cast: (icon, k) => [
    k.surf(k.rr(2.2, 4, 21.8, 20, 2.4), 'c1', { shineSize: 0.85 }),
    k.surf(k.rr(4.2, 6, 19.8, 18, 1.4), 'ink', { inset: true, ol: 0, shine: 'glass', shade: 0 }),
    k.moat(k.join(k.sector(2.6, 20.4, 2.6, 270, 360), k.arc(2.6, 20.4, 6, 270, 360, 1.7), k.arc(2.6, 20.4, 10, 270, 360, 1.7)), 1.1),
    k.surf(k.join(k.sector(2.6, 20.4, 2.6, 270, 360), k.arc(2.6, 20.4, 6, 270, 360, 1.7), k.arc(2.6, 20.4, 10, 270, 360, 1.7)), 'c3', { part: 'a', shine: 'none', ol: 0.4 }),
  ],
  // a cream kitten face: sakura inner ears, big anime eyes with catch-lights, pink nose and blush
  cat: (icon, k) => [
    k.surf(k.path('M12 20.6 C7 20.6 3.4 18 3.4 13.8 C3.4 11.8 3.8 10.2 4.4 9 V4.6 C4.4 3.9 5.1 3.5 5.7 3.8 L9.6 6.4 C10.4 6.1 11.2 6 12 6 C12.8 6 13.6 6.1 14.4 6.4 L18.3 3.8 C18.9 3.5 19.6 3.9 19.6 4.6 V9 C20.2 10.2 20.6 11.8 20.6 13.8 C20.6 18 17 20.6 12 20.6 Z'), 'c3', { shine: 'none' }),
    k.paint(k.join(k.poly([[5.8, 5.6], [8.4, 7.4], [5.8, 9]], 0.5), k.poly([[18.2, 5.6], [15.6, 7.4], [18.2, 9]], 0.5)), 'c2'),
    k.paint(k.join(k.ellipse(8.6, 12.8, 1.15, 1.5), k.ellipse(15.4, 12.8, 1.15, 1.5)), 'ink', { part: 'a' }),
    k.shine(k.join(k.circle(8.25, 12.2, 0.45), k.circle(15.05, 12.2, 0.45), k.circle(9.05, 13.6, 0.2), k.circle(15.85, 13.6, 0.2))),
    k.paint(k.poly([[11, 15.6], [13, 15.6], [12, 16.8]], 0.35), 'c2', { part: 'a' }),
    k.ink('M10.4 17.4 C11.2 18.1 11.8 17.8 12 17 C12.2 17.8 12.8 18.1 13.6 17.4', { w: 0.6, part: 'a' }),
    k.paint(k.join(k.ellipse(6.4, 15.6, 1.2, 0.7), k.ellipse(17.6, 15.6, 1.2, 0.7)), 'c2', { op: 0.7 }),
  ],
  // cream axes, a sky area under a gold crest line
  'chart-area': (icon, k) => [
    k.surf(k.poly([[7.4, 17.2], [7.4, 12], [11.5, 8], [15, 11.5], [20.6, 5.6], [20.6, 17.2]], [0.6, 0.8, 0.8, 0.8, 0.6, 0.6]), 'c1', { shineSize: 0.8 }),
    k.surf(k.stroke([[7.4, 12], [11.5, 8], [15, 11.5], [20.6, 5.6]], 1.2), 'c3', { part: 'a', shine: 'none', ol: 0.35, shade: 0 }),
    k.surf(k.stroke([[3.6, 3.6], [3.6, 18.6], [4.2, 20], [5.6, 20.4], [20.6, 20.4]], 1.6), 'tint', { part: 'a', shine: 'none', ol: 0.5 }),
  ],
  // three bars: sky, sakura, gold, standing on an ink base line
  'chart-bar': (icon, k) => [
    k.surf(k.rr(4.4, 12, 8.6, 20.4, [1.2, 1.2, 0, 0]), 'c1', { shine: 'none' }),
    k.surf(k.rr(10, 4, 14.2, 20.4, [1.2, 1.2, 0, 0]), 'c2', { shineSize: 0.7 }),
    k.surf(k.rr(15.6, 8.6, 19.8, 20.4, [1.2, 1.2, 0, 0]), 'c3', { shine: 'none' }),
    k.surf(k.pill(2.4, 19.8, 21.6, 21.4), 'tint', { part: 'a', shine: 'none', ol: 0.5 }),
  ],
  // a rising sky trend line over ink axes, gold dot at the peak
  'chart-line': (icon, k) => [
    k.surf(k.stroke([[3.6, 3.6], [3.6, 18.6], [4.2, 20], [5.6, 20.4], [20.6, 20.4]], 1.6), 'tint', { part: 'a', shine: 'none', ol: 0.5 }),
    k.surf(k.stroke([[7.6, 15.4], [11.5, 10], [15, 13.4], [19.6, 7]], 2.4), 'c1', { shineSize: 0.7 }),
    k.surf(k.circle(19.8, 6.8, 1.7), 'c3', { shine: 'dot', shineSize: 0.5, ol: 0.4 }),
  ],
  // a sky pie with a sakura slice lifted out
  'chart-pie': (icon, k) => [
    k.surf(k.path('M10 14 V6.4 A7.6 7.6 0 1 0 17.6 14 Z'), 'c1', { shineSize: 0.9 }),
    k.surf(k.path('M14 10 V2.4 A7.6 7.6 0 0 1 21.6 10 Z'), 'c2', { part: 'a', shine: 'dot', shineSize: 0.6 }),
  ],
  // a puffy cream chef hat with a pleated band
  'chef-hat': (icon, k) => [
    k.surf(k.unite(k.circle(8.4, 10.2, 3.9), k.circle(12, 7.4, 4), k.circle(15.6, 10.2, 3.9), k.rr(6.6, 10, 17.4, 17.2, 0)), 'tint', { shine: 'none', rim: true }),
    k.ink([[[10, 16.8], [10, 13.8]], [[14, 16.8], [14, 13.8]]], { w: 0.8, part: 'a' }),
    k.surf(k.rr(6.4, 16.6, 17.6, 21.2, [0.8, 0.8, 2, 2]), 'c2', { part: 'a', shine: 'none' }),
  ],

  // ---- batch 5: text glyphs as glossy sky pills
  'align-left': (icon, k) => alignOps(k, [[3, 21], [3, 13], [3, 21], [3, 13]]),
  'align-right': (icon, k) => alignOps(k, [[3, 21], [11, 21], [3, 21], [11, 21]]),
  'align-center': (icon, k) => alignOps(k, [[3, 21], [7, 17], [3, 21], [7, 17]]),
  'align-justify': (icon, k) => alignOps(k, [[3, 21], [3, 21], [3, 21], [3, 21]]),
  // a fat glossy sky B with dark counters
  bold: (icon, k) => [
    k.surf(k.cut(
      k.path('M5.6 3.4 H12.6 C15.4 3.4 17.2 5.2 17.2 7.4 C17.2 8.8 16.6 10 15.6 10.8 C17.4 11.6 18.6 13.2 18.6 15.4 C18.6 18.4 16.2 20.6 13.2 20.6 H5.6 Z'),
      k.rr(9.4, 6.6, 13.2, 9.8, [0, 1.6, 1.6, 0]), k.rr(9.4, 13, 14.2, 17.4, [0, 2.2, 2.2, 0])), 'c1', { shineSize: 0.85 }),
  ],
  // sakura curly braces as glossy strokes
  braces: (icon, k) => [
    k.surf(k.stroke(['M9 3.6 H8.5 C7 3.6 6 4.6 6 6.1 V9.5 C6 11 5 12 3.6 12 C5 12 6 13 6 14.5 V17.9 C6 19.4 7 20.4 8.5 20.4 H9', 'M15 3.6 H15.5 C17 3.6 18 4.6 18 6.1 V9.5 C18 11 19 12 20.4 12 C19 12 18 13 18 14.5 V17.9 C18 19.4 17 20.4 15.5 20.4 H15'], 2.3), 'c4', { shineSize: 0.7 }),
  ],
}
