// PASTEL redraw chunk 2 of 5 — hand-composed Pastel icons for the names assigned to chunk 2.
// Each entry: 'icon-name': (icon, p) => layers. See forge/styles/PASTEL-GUIDE.md (API, kit, rules).
// Exemplars in _pastel-render.mjs win over entries here. Only this chunk's owner edits this file.
//
// Chunk 2 = icons 101-200 alphabetically (circle-arrow-left .. gem). coffee, cloud, file and
// folder are exemplars and are not redrawn here.

const M = 1.2 // moat (W.MOAT)

// ---------------------------------------------------------------------------------
// local family builders

// a disc button (circle-*): body disc in hue, then whatever sits on it
const discBtn = (p, hue = 'lavender', r = 10) => [hue, p.circle(12, 12, r)]

// the file family: sky sheet, paper fold (A), as the exemplar
const sheet = (p, hue = 'sky') => {
  const f = p.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
  return [[hue, f.sheet], ['paper@A', f.fold]]
}
// a file with short ink text lines over its upper half (room for a bottom-right badge)
const sheetLines = p => ['ink', p.lines(8.25, [13.5, 11.5], [12.25, 15.75])]

// the folder family: peach back, butter front, as the exemplar
const folderBase = p => {
  const f = p.folder(2.25, 4, 21.75, 20.25, 7.5)
  return [['peach', f.back], ['butter', f.front]]
}

// a small magnifier modifier at the bottom right (lavender rim, sky glass, peach handle)
const magLayers = (p, cx = 16.25, cy = 16.25) => [
  ['cut', p.circle(cx, cy, 4 + M), p.seg2(cx + 2.5, cy + 2.5, cx + 5, cy + 5, 2.75 + 2 * M)],
  ['peach@S', p.seg2(cx + 2.6, cy + 2.6, cx + 5, cy + 5, 2.75)],
  ['lavender@S', p.ring(cx, cy, 4, 2.4)],
  ['paper.well@S', p.circle(cx, cy, 2.4)],
]

// a small padlock modifier at the bottom right (peach shackle, lavender body, ink keyhole)
const lockLayers = (p, cx = 17, cy = 17.25) => [
  ['cut', p.arc(cx, cy - 2.25, 2.4, 180, 360, 1.75 + 2 * M), p.seg2(cx - 2.4, cy - 2.25, cx - 2.4, cy, 1.75 + 2 * M), p.seg2(cx + 2.4, cy - 2.25, cx + 2.4, cy, 1.75 + 2 * M), p.rr(cx - 4 - M, cy - 1.25 - M, cx + 4 + M, cy + 4.5 + M, 1.5 + M)],
  ['peach@S', p.arc(cx, cy - 2.25, 2.4, 180, 360, 1.75), p.seg2(cx - 2.4, cy - 2.25, cx - 2.4, cy, 1.75), p.seg2(cx + 2.4, cy - 2.25, cx + 2.4, cy, 1.75)],
  ['lavender@S', p.rr(cx - 4, cy - 1.25, cx + 4, cy + 4.5, 1.5)],
  ['ink@S', p.circle(cx, cy + 1.6, 1.05)],
]

// a moat around a rounded polygon (its outline band plus its body)
const moatPoly = (p, pts, r = 1) => p.join(p.poly(pts, r), p.bar(pts, 2 * M, true))

// coin cylinder: a lit side with a flat top face
const coin = (p, cx, cy, rx, ry, h) => ({
  side: p.unite(p.ellipse(cx, cy, rx, ry), p.rect(cx - rx, cy, cx + rx, cy + h), p.ellipse(cx, cy + h, rx, ry)),
  top: p.ellipse(cx, cy, rx - 0.6, ry - 0.45),
})

// the eye: a lavender almond, a sky iris, an ink pupil, a glint on the iris
const eyeLayers = p => [
  ['lavender', p.lens(1.75, 12, 22.25, 12, 7.25)],
  ['cut', p.circle(12, 12, 5 + 0.9)],
  ['sky@A', p.circle(12, 12, 5)],
  ['ink@A', p.circle(12, 12, 2.1)],
  ['shine', p.arc(12, 12, 3.4, 200, 250, 1.1)],
]

// ---------------------------------------------------------------------------------
export const R = {
  // ---- circle buttons: a calm disc, the glyph in the disc's own ink ----
  'circle-arrow-left': (icon, p) => [discBtn(p), ['ink@A', p.arrow(16.75, 12, 7, 12, { w: 2.5, head: 4.5 })]],
  'circle-arrow-right': (icon, p) => [discBtn(p), ['ink@A', p.arrow(7.25, 12, 17, 12, { w: 2.5, head: 4.5 })]],
  'circle-arrow-up': (icon, p) => [discBtn(p), ['ink@A', p.arrow(12, 16.75, 12, 7, { w: 2.5, head: 4.5 })]],
  'circle-chevron-down': (icon, p) => [discBtn(p), ['ink@A', p.chevron(12, 14.75, 90, 5.25, 2.5)]],
  'circle-chevron-right': (icon, p) => [discBtn(p), ['ink@A', p.chevron(14.75, 12, 0, 5.25, 2.5)]],
  // one solid ink dot (never a ring): reads as a radio / record point, not a target
  'circle-dot': (icon, p) => [discBtn(p), ['ink@A', p.circle(12, 12, 3.4)]],
  'circle-pause': (icon, p) => [discBtn(p), ['ink@A', p.pill(8.4, 7.5, 10.9, 16.5), p.pill(13.1, 7.5, 15.6, 16.5)]],
  'circle-play': (icon, p) => [discBtn(p), ['ink@A', p.poly([[9.25, 7], [17.25, 12], [9.25, 17]], [1.5, 1.5, 1.5])]],
  'circle-stop': (icon, p) => [discBtn(p), ['ink@A', p.rr(8, 8, 16, 16, 2)]],
  circle: (icon, p) => [discBtn(p, 'lavender', 10)],

  // ---- media ----
  // lavender slate, a paper clapper stick with ink stripes, tilted open (A)
  // lavender slate with a striped paper band, a striped paper clapper tilted open (A)
  clapperboard: (icon, p) => {
    const stick = p.rot(p.rr(2.75, 5.25, 21, 9, 1.5), -14, 3.75, 9)
    const stripes = x0 => p.join(...[0, 4.5, 9, 13.5].map(d => p.seg2(x0 + d, 3.5, x0 + d + 3, 10.5, 1.8)))
    const band = p.rr(2.75, 10.5, 21.25, 14, [3, 3, 0, 0])
    return [
      ['lavender', p.rr(2.75, 10.5, 21.25, 21.25, 3)],
      ['paper', band],
      ['ink', p.clip(p.move(stripes(4.25), 0, 7), band)],
      ['paper@A', stick],
      ['ink@A', p.clip(p.rot(stripes(5), -14, 3.75, 9), stick)],
    ]
  },
  // ---- clipboards: peach board, paper sheet, lavender clip ----
  clipboard: (icon, p) => [
    ['peach', p.rr(3.75, 4, 20.25, 21.75, 3)],
    ['paper', p.rr(6.25, 7.25, 17.75, 19.5, 1.75)],
    ['lavender@A', p.rr(8.25, 2.25, 15.75, 7, 1.6)],
    ['cut', p.rr(10.25, 3.75, 13.75, 5, 0.6)],
  ],
  'clipboard-check': (icon, p) => [
    ['peach', p.rr(3.75, 4, 20.25, 21.75, 3)],
    ['paper', p.rr(6.25, 7.25, 17.75, 19.5, 1.75)],
    ['mint.flat@S', p.check([[8.75, 13.25], [11, 15.75], [15.5, 10.5]], 2.25)],
    ['lavender@A', p.rr(8.25, 2.25, 15.75, 7, 1.6)],
    ['cut', p.rr(10.25, 3.75, 13.75, 5, 0.6)],
  ],
  'clipboard-list': (icon, p) => [
    ['peach', p.rr(3.75, 4, 20.25, 21.75, 3)],
    ['paper', p.rr(6.25, 7.25, 17.75, 19.5, 1.75)],
    ['ink', p.circle(9, 11, 1), p.circle(9, 14.25, 1), p.circle(9, 17.25 - 0.25, 1), p.lines(11.5, [15.25, 15.25, 13.5], [11, 14.25, 17])],
    ['lavender@A', p.rr(8.25, 2.25, 15.75, 7, 1.6)],
    ['cut', p.rr(10.25, 3.75, 13.75, 5, 0.6)],
  ],

  // ---- time: sky case, paper face, ink hands ----
  clock: (icon, p) => [
    ['sky', p.circle(12, 12, 10)],
    ['paper', p.circle(12, 12, 7.25)],
    ['ink@A', p.seg2(12, 12, 12, 7.25, 1.75), p.seg2(12, 12, 15.25, 13.75, 1.75)],
    ['ink', p.circle(12, 12, 1.4)],
  ],
  // one blush x
  close: (icon, p) => [['blush', p.join(p.seg2(5.5, 5.5, 18.5, 18.5, 3.5), p.seg2(18.5, 5.5, 5.5, 18.5, 3.5))]],

  // ---- weather: sky cloud plus what falls from it ----
  'cloud-download': (icon, p) => [
    ['sky', p.cloud(12, 11.75, 1.02)],
    ['cut', p.arrow(12, 8.75, 12, 18, { w: 2.75 + 2 * M, head: 4.25 })],
    ['lavender@A', p.arrow(12, 8.75, 12, 18, { w: 2.75, head: 4.25 })],
  ],
  'cloud-upload': (icon, p) => [
    ['sky', p.cloud(12, 11.75, 1.02)],
    ['cut', p.arrow(12, 18.25, 12, 8.5, { w: 2.75 + 2 * M, head: 4.25 })],
    ['lavender@A', p.arrow(12, 18.25, 12, 8.5, { w: 2.75, head: 4.25 })],
  ],
  'cloud-lightning': (icon, p) => {
    const bolt = [[12.75, 9.25], [7.75, 15.5], [11.25, 15.5], [9.75, 22], [16.5, 13.5], [13, 13.5], [15, 9.25]]
    return [
      ['sky', p.cloud(12, 9.75, 0.98)],
      ['cut', moatPoly(p, bolt, 0.9)],
      ['butter@A', p.poly(bolt, [1, 0.9, 0.9, 1, 1, 0.9, 1])],
    ]
  },
  'cloud-off': (icon, p) => [
    ['sky', p.cloud(12, 13, 1.02)],
    ...p.slashLayers('blush', [3.5, 3.5], [20.5, 20.5], 2.5),
  ],
  'cloud-rain': (icon, p) => [
    ['sky', p.cloud(12, 9.75, 0.98)],
    ['lavender.flat@A', p.seg2(8, 17.25, 7, 20.25, 2.25), p.seg2(12.25, 17.25, 11.25, 20.25, 2.25), p.seg2(16.5, 17.25, 15.5, 20.25, 2.25)],
  ],
  'cloud-snow': (icon, p) => [
    ['sky', p.cloud(12, 9.75, 0.98)],
    ['lavender.flat@A', p.circle(7.75, 18, 1.35), p.circle(12, 18, 1.35), p.circle(16.25, 18, 1.35), p.circle(9.9, 21.25, 1.35), p.circle(14.1, 21.25, 1.35)],
  ],
  // butter sun with short rays (A), behind a sky cloud
  // butter sun with short rays (A), behind a sky cloud
  'cloud-sun': (icon, p) => {
    const rays = [180, 225, 270, 315].map(a => {
      const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180)
      return p.seg2(9.25 + c * 7, 9 + s * 7, 9.25 + c * 8.5, 9 + s * 8.5, 2.1)
    })
    return [
      ['butter@K', p.circle(9.25, 9, 5)],
      ['butter.flat@A', ...rays],
      ['cut', p.cloud(13.75, 15.25, 0.98)],
      ['sky', p.cloud(13.75, 15.25, 0.86)],
    ]
  },
  // ---- code: lavender brackets, a peach slash ----
  code: (icon, p) => [
    ['lavender', p.chevron(3, 12, 180, 6.25, 3), p.chevron(21, 12, 0, 6.25, 3)],
    ['peach@A', p.seg2(14, 4.75, 10, 19.25, 2.75)],
  ],

  // ---- money ----
  // two coin stacks: peach behind, butter in front
  coins: (icon, p) => {
    const a = coin(p, 9, 5.75, 6.5, 2.75, 4.5), b = coin(p, 15, 13.25, 6.5, 2.75, 4.75)
    const moat = p.unite(p.ellipse(15, 13.25, 6.5 + M, 2.75 + M), p.rect(15 - 6.5 - M, 13.25, 15 + 6.5 + M, 18), p.ellipse(15, 18, 6.5 + M, 2.75 + M))
    return [
      ['butter', b.side],
      ['butter.flat', b.top],
      ['ink', p.clip(p.stroke('M7.75 16.25 A7.25 2.9 0 0 0 22.25 16.25', 1.35), p.rect(9.25, 0, 20.75, 24))],
      ['peach@A', p.cut(a.side, moat)],
      ['peach.flat@A', p.cut(a.top, moat)],
    ]
  },
  'dollar-sign': (icon, p) => [
    ['mint', p.unite(
      p.stroke('M16.5 7.75 C15.6 6.25 14 5.5 12 5.5 C9.4 5.5 7.6 6.85 7.6 8.85 C7.6 13.25 16.4 10.9 16.4 15.2 C16.4 17.3 14.6 18.5 12 18.5 C9.7 18.5 8.1 17.75 7.25 16.25', 3),
      p.seg2(12, 2.5, 12, 21.5, 3))],
  ],
  euro: (icon, p) => [
    ['mint', p.unite(p.arc(13.5, 12, 7, 45, 315, 3), p.seg2(3.5, 10, 12.5, 10, 2.5), p.seg2(3.5, 14.25, 12.5, 14.25, 2.5))],
  ],
  'credit-card': (icon, p) => {
    const card = p.rr(2, 4.75, 22, 19.25, 3)
    return [
      ['lavender', card],
      ['ink', p.clip(p.rect(0, 8.25, 24, 10.75), card)],
      ['butter.flat', p.rr(5, 13, 9.25, 16.5, 1.2)],
      ['ink', p.seg2(12.5, 15.75, 18.25, 15.75, 1.6)],
    ]
  },

  // ---- layout ----
  columns: (icon, p) => [
    ['lavender', p.rr(2.5, 3, 21.5, 21, 3.25)],
    ['sky.well', p.rr(5.25, 5.75, 10.9, 18.25, 1.5), p.rr(13.1, 5.75, 18.75, 18.25, 1.5)],
  ],
  copy: (icon, p) => [
    ['lavender', p.rr(2.75, 2.75, 15.25, 15.25, 3)],
    ['cut', p.rr(8.75 - M, 8.75 - M, 21.25 + M, 21.25 + M, 3 + M)],
    ['sky@A', p.rr(8.75, 8.75, 21.25, 21.25, 3)],
  ],
  'drag-handle': (icon, p) => [
    ['lavender.flat', ...[5.5, 12, 18.5].flatMap(y => [p.circle(9, y, 2), p.circle(15, y, 2)])],
  ],
  'gallery-horizontal': (icon, p) => [
    ['sky', p.rr(6.75, 3, 17.25, 21, 3)],
    ['lavender', p.rr(2, 6, 4.75, 18, 1.4), p.rr(19.25, 6, 22, 18, 1.4)],
  ],

  // ---- navigation ----
  compass: (icon, p) => {
    const k = Math.SQRT1_2, c = 12
    const tip = [c + 6.6 * k, c - 6.6 * k], tail = [c - 6.6 * k, c + 6.6 * k]
    const s1 = [c + 2.9 * k, c + 2.9 * k], s2 = [c - 2.9 * k, c - 2.9 * k]
    return [
      ['mint', p.circle(12, 12, 10)],
      ['paper', p.circle(12, 12, 7.5)],
      ['blush@A', p.poly([tip, s1, s2], [0.9, 0.9, 0.9])],
      ['lavender@A', p.poly([tail, s2, s1], [0.9, 0.9, 0.9])],
    ]
  },
  crosshair: (icon, p) => [
    ['lavender', p.unite(p.ring(12, 12, 8.4, 5.9), p.seg2(12, 2, 12, 6.5, 2.5), p.seg2(12, 17.5, 12, 22, 2.5), p.seg2(2, 12, 6.5, 12, 2.5), p.seg2(17.5, 12, 22, 12, 2.5))],
    ['blush.flat@A', p.circle(12, 12, 2.4)],
  ],
  cursor: (icon, p) => [
    ['lavender', p.poly([[5, 2.75], [5, 18.75], [9.25, 15.25], [11.75, 21], [15, 19.6], [12.5, 13.9], [18, 13.5]], [1.5, 1.3, 0.9, 1.1, 1.1, 0.9, 1.3])],
  ],
  'corner-down-left': (icon, p) => [
    ['lavender', p.unite(p.stroke('M19.25 3.75 V10 A4.25 4.25 0 0 1 15 14.25 H5', 3), p.chevron(4.75, 14.25, 180, 5.25, 3))],
  ],
  'corner-down-right': (icon, p) => [
    ['lavender', p.unite(p.stroke('M4.75 3.75 V10 A4.25 4.25 0 0 0 9 14.25 H19', 3), p.chevron(19.25, 14.25, 0, 5.25, 3))],
  ],
  forward: (icon, p) => [
    ['lavender', p.unite(p.stroke('M4 19.75 V15 A5.75 5.75 0 0 1 9.75 9.25 H19.5', 3), p.chevron(19.75, 9.25, 0, 5.25, 3))],
  ],
  'fast-forward': (icon, p) => [
    ['lavender@K', p.poly([[2.25, 5.25], [12, 12], [2.25, 18.75]], 1.6), p.poly([[12, 5.25], [21.75, 12], [12, 18.75]], 1.6)],
  ],
  crop: (icon, p) => [
    ['lavender', p.bar([[6.25, 2.5], [6.25, 17.75], [21.5, 17.75]], 3)],
    ['peach@A', p.bar([[2.5, 6.25], [17.75, 6.25], [17.75, 21.5]], 3)],
  ],
  download: (icon, p) => [
    ['sky', p.rr(2.75, 13.25, 21.25, 21.25, 3)],
    ['cut', p.arrow(12, 2.5, 12, 16, { w: 3 + 2 * M, head: 5.25 })],
    ['lavender@A', p.arrow(12, 2.5, 12, 16, { w: 3, head: 5.25 })],
  ],
  'external-link': (icon, p) => [
    ['sky', p.rr(2.75, 5.25, 18.75, 21.25, 3)],
    ['cut', p.arrow(10.5, 13.5, 20.5, 3.5, { w: 3 + 2 * M, head: 5.5 }), p.rr(13, 1, 23, 11, 2)],
    ['lavender@A', p.arrow(10.5, 13.5, 20.5, 3.5, { w: 3, head: 5.5 })],
  ],
  filter: (icon, p) => [
    ['lavender', p.poly([[2.75, 4], [21.25, 4], [14.25, 12.5], [14.25, 19], [9.75, 21.5], [9.75, 12.5]], [2, 2, 1.2, 1.2, 1.2, 1.2])],
  ],

  // ---- food ----
  cookie: (icon, p) => {
    const body = p.cut(p.circle(12, 12, 10), p.circle(20.25, 4.5, 3.6), p.circle(22, 9.75, 2.4))
    return [
      ['peach', body],
      ['ink', p.circle(8, 8.75, 1.25), p.circle(12.75, 7.75, 1.05), p.circle(7.25, 14, 1.15), p.circle(12, 12.75, 1.25), p.circle(16.25, 12.5, 1.05), p.circle(11.25, 17.5, 1.2), p.circle(16, 16.75, 1.15)],
    ]
  },
  'cooking-pot': (icon, p) => [
    ['peach', p.unite(p.rr(3.75, 10.75, 20.25, 21, [1.25, 1.25, 4.5, 4.5]), p.pill(1.5, 12.25, 5, 14.75), p.pill(19, 12.25, 22.5, 14.75))],
    ['lavender@A', p.unite(p.pill(2.5, 7.75, 21.5, 10.5), p.rr(10, 4.5, 14, 8.5, 1.4))],
  ],
  'cup-soda': (icon, p) => {
    const lid = p.pill(4, 6.75, 20, 9.75)
    return [
      ['peach', p.poly([[5.25, 8.5], [18.75, 8.5], [17.25, 21.25], [6.75, 21.25]], [1, 1, 2.25, 2.25])],
      ['paper', p.clip(p.rect(0, 12.75, 24, 16), p.poly([[5.25, 8.5], [18.75, 8.5], [17.25, 21.25], [6.75, 21.25]], [1, 1, 2.25, 2.25]))],
      ['blush.flat@A', p.cut(p.bar([[12.75, 7.5], [14.25, 2.75], [18.25, 2.75]], 2), lid)],
      ['lavender@A', lid],
    ]
  },
  donut: (icon, p) => {
    const icing = p.unite(p.circle(12, 12, 7.25), p.around(p.circle(12, 4.6, 1.55), 10, 12, 12, 18))
    return [
      ['peach', p.circle(12, 12, 10)],
      ['blush', icing],
      ['ink', p.seg2(8.25, 8.5, 9.5, 7.75, 1.3), p.seg2(14.5, 7.5, 15.75, 8.25, 1.3), p.seg2(16.25, 13.5, 16.5, 14.9, 1.3), p.seg2(7.25, 14, 7.75, 15.25, 1.3), p.seg2(11.25, 17, 12.75, 17.25, 1.3)],
      ['cut', p.circle(12, 12, 2.85)],
    ]
  },
  egg: (icon, p) => [
    ['peach', p.path('M12 2.25 C16.6 2.25 19.5 9 19.5 14.1 C19.5 18.6 16.25 21.75 12 21.75 C7.75 21.75 4.5 18.6 4.5 14.1 C4.5 9 7.4 2.25 12 2.25 Z')],
    ['ink', p.circle(14.75, 15.25, 0.8), p.circle(9.25, 17.25, 0.65), p.circle(15.25, 10.25, 0.6)],
  ],
  fish: (icon, p) => [
    ['sky', p.ellipse(9.5, 12, 7.5, 5.75)],
    ['peach@A', p.cut(p.poly([[13.5, 12], [22.5, 5.75], [22.5, 18.25]], [1.4, 1.8, 1.8]), p.ellipse(9.5, 12, 7.5 + 0.4, 5.75 + 0.4))],
    ['ink', p.circle(5.75, 11, 1.15), p.stroke('M10 8.4 C11.25 10.4 11.25 13.6 10 15.6', 1.5)],
  ],
  // ---- computing ----
  cpu: (icon, p) => {
    const pins = []
    for (const v of [8.5, 12, 15.5]) {
      pins.push(p.seg2(v, 2, v, 5.5, 1.9), p.seg2(v, 18.5, v, 22, 1.9), p.seg2(2, v, 5.5, v, 1.9), p.seg2(18.5, v, 22, v, 1.9))
    }
    const body = p.rr(4.75, 4.75, 19.25, 19.25, 3)
    return [
      ['lavender', body],
      ['butter.flat', p.cut(p.join(...pins), p.rr(4, 4, 20, 20, 3.5))],
      ['sky@A', p.rr(8.75, 8.75, 15.25, 15.25, 1.75)],
    ]
  },
  database: (icon, p) => {
    const body = p.unite(p.ellipse(12, 6, 8.25, 3.25), p.rect(3.75, 6, 20.25, 18), p.ellipse(12, 18, 8.25, 3.25))
    return [
      ['lavender', body],
      ['sky@A', p.ellipse(12, 6, 7.5, 2.6)],
      ['ink', p.clip(p.join(p.stroke('M3 10.75 A9 3.4 0 0 0 21 10.75', 1.5), p.stroke('M3 15 A9 3.4 0 0 0 21 15', 1.5)), p.rect(4.6, 0, 19.4, 24))],
    ]
  },
  disc: (icon, p) => [
    ['lavender', p.circle(12, 12, 10)],
    ['paper@A', p.circle(12, 12, 4.25)],
    ['cut', p.circle(12, 12, 1.8)],
    ['shine', p.arc(12, 12, 7.25, 200, 250, 1.2)],
  ],
  gamepad: (icon, p) => [
    ['lavender', p.unite(p.rr(2, 6.5, 22, 15.75, 4.5), p.circle(6.5, 15.25, 4.25), p.circle(17.5, 15.25, 4.25))],
    ['ink@A', p.glyph('plus', 7.25, 11.25, 2.5, 1.75)],
    ['blush.flat@A', p.circle(16, 10.25, 1.35)],
    ['mint.flat@A', p.circle(18.5, 12.75, 1.35)],
  ],

  // ---- science / nature ----
  dna: (icon, p) => [
    ['mint', p.stroke('M7 2.5 C7 7.5 17 7.5 17 12 C17 16.5 7 16.5 7 21.5', 2.6)],
    ['lavender.flat', p.seg2(9.25, 3.5, 14.75, 3.5, 1.6), p.seg2(9.25, 20.5, 14.75, 20.5, 1.6), p.seg2(10.5, 12, 13.5, 12, 1.6)],
    ['cut', p.stroke('M17 2.5 C17 7.5 7 7.5 7 12 C7 16.5 17 16.5 17 21.5', 2.6 + 2 * M)],
    ['lavender@A', p.stroke('M17 2.5 C17 7.5 7 7.5 7 12 C7 16.5 17 16.5 17 21.5', 2.6)],
  ],
  droplet: (icon, p) => [
    ['sky', p.drop(12, 14.5, 7, 12, 2.25, 1.1)],
  ],
  flame: (icon, p) => [
    ['peach', p.path('M12 2 C13.75 5.5 19 8.5 19 14.25 C19 18.5 15.75 21.75 12 21.75 C8.25 21.75 5 18.5 5 14.25 C5 11 6.75 9 8.25 7.75 C8.5 10 9.5 11.25 10.5 11.75 C10.25 8 11 4.75 12 2 Z')],
    ['butter@A', p.drop(12, 17.25, 3.25, 12, 10.75, 0.9)],
  ],
  'flask-conical': (icon, p) => {
    const body = p.poly([[9.5, 3], [14.5, 3], [14.5, 9.25], [20, 18.75], [18, 21.5], [6, 21.5], [4, 18.75], [9.5, 9.25]], [0.9, 0.9, 1.4, 1.6, 2, 2, 1.6, 1.4])
    return [
      ['sky', body],
      ['mint.flat@A', p.clip(p.rect(0, 14.25, 24, 24), body)],
      ['lavender', p.pill(7.75, 2, 16.25, 4.75)],
      ['mint.flat@deco', p.circle(18.5, 7.25, 1.4)],
    ]
  },
  flower: (icon, p) => [
    ['blush', p.unite(p.around(p.circle(12, 6.5, 4.25), 5, 12, 12))],
    ['butter@A', p.circle(12, 12, 3.4)],
  ],
  // a pale lavender pad with concentric open ridges in ink (never a silhouette of strokes)
  fingerprint: (icon, p) => [
    ['lavender@K', p.ellipse(12, 12, 8.75, 10.25)],
    ['ink', p.join(
      p.stroke('M10.5 18.25 V12.5 A1.5 1.5 0 0 1 13.5 12.5 V15', 1.6),
      p.stroke('M7.25 16.25 V12.5 A4.75 4.75 0 0 1 16.75 12.5 V18.5', 1.6),
      p.stroke('M13.5 21 C13.6 20.4 13.75 19.75 13.75 19', 1.6),
      p.arc(12, 12.5, 7.75, 200, 340, 1.6),
    )],
  ],

  // ---- people / animals ----
  // peach head, pointed lavender ears hanging (A), paper muzzle; light, small ink details
  dog: (icon, p) => [
    ['peach', p.rr(6.25, 4, 17.75, 20.75, [5.5, 5.5, 6, 6])],
    ['lavender@A', p.drop(5.25, 12.25, 2.75, 7.5, 3.25, 0.9), p.drop(18.75, 12.25, 2.75, 16.5, 3.25, 0.9)],
    ['paper', p.ellipse(12, 16.5, 4.25, 3.25)],
    ['ink', p.ellipse(12, 15, 1.6, 1.1), p.seg2(12, 15.75, 12, 17.25, 1.1)],
    ['ink', p.circle(9.4, 10.75, 1), p.circle(14.6, 10.75, 1)],
  ],
  frown: (icon, p) => [
    ['butter', p.circle(12, 12, 10)],
    ['ink', p.circle(8.75, 9.75, 1.35), p.circle(15.25, 9.75, 1.35)],
    ['ink@A', p.arc(12, 19.5, 4.25, 225, 315, 1.75)],
  ],

  // ---- buildings / objects ----
  'door-open': (icon, p) => [
    ['peach', p.rr(4.5, 2.25, 19.5, 21.75, [3, 3, 1.25, 1.25])],
    ['butter.well', p.rr(7.25, 5, 16.75, 21.75, [1.5, 1.5, 0, 0])],
    ['lavender@A', p.poly([[7.25, 5], [13.5, 3.25], [13.5, 22.25], [7.25, 21.75]], [1, 1.2, 0.9, 0])],
    ['ink@A', p.circle(11.75, 13.25, 1)],
  ],
  factory: (icon, p) => [
    ['lavender', p.rr(15, 2.5, 19.75, 12, 1.5)],
    ['peach', p.poly([[2.5, 21.5], [2.5, 10.5], [8.25, 7.25], [8.25, 10.5], [14, 7.25], [14, 10.5], [21.5, 10.5], [21.5, 21.5]], [2.25, 1.2, 0.9, 0.9, 0.9, 0.9, 1.2, 2.25])],
    ['butter.well', p.rr(5.5, 14.25, 8.5, 17.25, 1), p.rr(10.5, 14.25, 13.5, 17.25, 1), p.rr(15.5, 14.25, 18.5, 17.25, 1)],
  ],
  fuel: (icon, p) => [
    ['peach', p.rr(3.75, 2.75, 14.25, 20, [3, 3, 0, 0])],
    ['lavender', p.rr(2.5, 19, 15.5, 21.75, 1.2)],
    ['paper.well', p.rr(6.25, 5.5, 11.75, 10.25, 1.25)],
    ['lavender.flat@A', p.stroke('M14.25 11 H16 C17 11 17.75 11.75 17.75 12.75 V16.5 C17.75 17.5 18.5 18.25 19.5 18.25 C20.5 18.25 21.25 17.5 21.25 16.5 V8.25 L18.75 5.5', 2)],
  ],
  crown: (icon, p) => [
    ['butter', p.poly([[3, 7.5], [8, 12], [12, 4.5], [16, 12], [21, 7.5], [19.25, 17.25], [4.75, 17.25]], [1.1, 1, 1.3, 1, 1.1, 1, 1])],
    ['peach', p.rr(4.75, 18.5, 19.25, 21.25, 1.35)],
    ['blush.flat@A', p.circle(12, 13.25, 1.6)],
  ],
  dumbbell: (icon, p) => [
    ['lavender', p.seg2(5, 12, 19, 12, 2.6)],
    ['mint@A', p.rr(4.5, 5.5, 8.25, 18.5, 1.75), p.rr(15.75, 5.5, 19.5, 18.5, 1.75), p.rr(1.5, 8.5, 4.75, 15.5, 1.4), p.rr(19.25, 8.5, 22.5, 15.5, 1.4)],
  ],
  edit: (icon, p) => {
    const T = s => p.rot(s, 45, 15.25, 8.75)
    const pen = p.rr(13.25, 0.5, 17.25, 13.5, [1.4, 1.4, 0, 0])
    const tip = p.poly([[13.25, 13.25], [17.25, 13.25], [15.25, 17.5]], [0, 0, 0.9])
    return [
      ['sky', p.rr(2.75, 4.75, 18.25, 21.25, 3)],
      ['cut', T(p.rr(13.25 - M, 0.5 - M, 17.25 + M, 13.5, 2.2)), T(p.poly([[13.25 - M, 13.25], [17.25 + M, 13.25], [15.25, 19.2]], 1.2))],
      ['butter@A', T(pen)],
      ['peach.flat@A', T(p.rr(13.25, 0.5, 17.25, 3.5, [1.4, 1.4, 0, 0]))],
      ['paper.flat@A', T(tip)],
      ['ink@A', T(p.circle(15.25, 16.6, 0.85))],
    ]
  },
  eraser: (icon, p) => {
    const T = s => p.rot(s, 45, 12, 11)
    return [
      ['blush', T(p.rr(8, 1.5, 16, 12, [2.25, 2.25, 0, 0]))],
      ['sky', T(p.rr(8, 11.25, 16, 19.75, [0, 0, 2.25, 2.25]))],
    ]
  },
  'eye': (icon, p) => eyeLayers(p),
  'eye-off': (icon, p) => [...eyeLayers(p), ...p.slashLayers('blush', [3.5, 3.5], [20.5, 20.5], 2.5)],
  flag: (icon, p) => [
    ['lavender@K', p.seg2(5, 3, 5, 21.5, 2.6)],
    ['blush@A', p.path('M6.25 4.25 C9.25 2.75 12 5.5 15.25 4.25 C17.25 3.5 19 3.5 20.25 4.25 V14.25 C18.75 13.5 17 13.75 15.25 14.5 C12 15.75 9.25 13 6.25 14.5 Z')],
  ],
  football: (icon, p) => {
    const R = a => [Math.cos((a - 90) * Math.PI / 180), Math.sin((a - 90) * Math.PI / 180)]
    const patches = [0, 72, 144, 216, 288].map(a => { const [c, s] = R(a); return p.poly(p.ngon(12 + 9.6 * c, 12 + 9.6 * s, 2.9, 5, a + 90), 0.9) })
    const spokes = [0, 72, 144, 216, 288].map(a => { const [c, s] = R(a); return p.seg2(12 + 3.4 * c, 12 + 3.4 * s, 12 + 7 * c, 12 + 7 * s, 1.35) })
    return [
      ['sky', p.circle(12, 12, 10)],
      ['ink', ...spokes],
      ['lavender.flat@A', p.poly(p.ngon(12, 12, 3.75, 5), 1), p.clip(p.join(...patches), p.circle(12, 12, 9.6))],
    ]
  },
  gauge: (icon, p) => {
    const dial = p.clip(p.circle(12, 13, 10), p.rect(0, 0, 24, 20.5))
    return [
      ['lavender', dial],
      ['paper', p.clip(p.circle(12, 13, 7.5), p.rect(0, 0, 24, 18.75))],
      ['mint.flat', p.arcEnds(12, 13, 5.6, 200, 268, 1.9, 'round', 'round')],
      ['blush.flat', p.arcEnds(12, 13, 5.6, 280, 340, 1.9, 'round', 'round')],
      ['ink@A', p.seg2(12, 13, 15.25, 9.75, 1.75), p.circle(12, 13, 1.6)],
    ]
  },
  gem: (icon, p) => {
    const gem = p.poly([[6.5, 3.25], [17.5, 3.25], [21.75, 9], [12, 21.25], [2.25, 9]], [1.4, 1.4, 1.2, 1.6, 1.2])
    return [
      ['sky@K', gem],
      ['paper', p.poly([[6.9, 3.9], [17.1, 3.9], [20.6, 8.75], [3.4, 8.75]], [1, 1, 0.9, 0.9])],
      ['shade', p.clip(p.poly([[12, 8.75], [24, 8.75], [12, 24]], 0), gem)],
    ]
  },

  // ---- files: sky sheet + paper fold, the meaning on the sheet ----
  'file-text': (icon, p) => [...sheet(p), ['ink', p.lines(8.25, [15.75, 15.75, 12.5], [12, 15.25, 18.5])]],
  'file-check': (icon, p) => [...sheet(p), sheetLines(p), ...p.badgeLayers('check', 'mint')],
  'file-plus': (icon, p) => [...sheet(p), sheetLines(p), ...p.badgeLayers('plus', 'mint')],
  'file-minus': (icon, p) => [...sheet(p), sheetLines(p), ...p.badgeLayers('minus', 'blush')],
  'file-x': (icon, p) => [...sheet(p), sheetLines(p), ...p.badgeLayers('x', 'blush')],
  'file-search': (icon, p) => [...sheet(p), sheetLines(p), ...magLayers(p, 15.75, 15.75)],
  'file-lock': (icon, p) => [...sheet(p), sheetLines(p), ...lockLayers(p)],
  'file-down': (icon, p) => [...sheet(p), ['ink@A', p.arrow(12, 9.25, 12, 18.25, { w: 1.9, head: 3.75 })]],
  'file-up': (icon, p) => [...sheet(p), ['ink@A', p.arrow(12, 18.25, 12, 9.25, { w: 1.9, head: 3.75 })]],
  'file-code': (icon, p) => [...sheet(p), ['ink@A', p.chevron(7.75, 14.25, 180, 3.5, 1.9), p.chevron(16.25, 14.25, 0, 3.5, 1.9)]],
  'file-audio': (icon, p) => [
    ...sheet(p),
    ['ink@A', p.unite(p.seg2(13, 17.25, 13, 9.5, 1.75), p.seg2(13, 9.5, 15.75, 10.75, 1.75))],
    ['blush.flat@A', p.rot(p.ellipse(10.75, 17.5, 2.6, 2.1), -18, 10.75, 17.5)],
  ],
  'file-video': (icon, p) => [...sheet(p), ['ink@A', p.poly([[9.25, 10.75], [15.75, 14.75], [9.25, 18.75]], 1.1)]],
  'file-image': (icon, p) => {
    const f = p.page(4.5, 2.25, 19.5, 21.75, 5.75, 2.75)
    return [
      ['sky', f.sheet],
      ['paper@A', f.fold],
      ['mint.flat', p.clip(p.poly([[3, 23], [3, 20], [9.5, 13.25], [13, 17], [15.25, 14.75], [21, 20.5], [21, 23]], [0, 0, 1.2, 1, 1.2, 0, 0]), f.sheet)],
      ['butter.flat', p.circle(9.5, 9, 1.85)],
    ]
  },
  'file-pdf': (icon, p) => [
    ...sheet(p),
    ['ink', p.lines(8.25, [13.5, 11.5], [8.75, 11.5])],
    ['cut', p.rr(2.5 - M, 13 - M, 15.5 + M, 20.25 + M, 2 + M)],
    ['blush@S', p.rr(2.5, 13, 15.5, 20.25, 2)],
    ['ink@S', p.seg2(6.25, 14.9, 6.25, 18.4, 1.5), p.stroke('M6.25 14.9 H8.6 A1.3 1.3 0 0 1 8.6 17.5 H6.25', 1.5)],
  ],
  'file-spreadsheet': (icon, p) => [
    ...sheet(p),
    ['mint.flat', p.rr(7.25, 10, 16.75, 18.75, 1.4)],
    ['ink', p.seg2(7.75, 13, 16.25, 13, 1.35), p.seg2(7.75, 15.85, 16.25, 15.85, 1.35), p.seg2(11, 10.5, 11, 18.25, 1.35)],
  ],
  'file-archive': (icon, p) => [
    ...sheet(p),
    ['ink', ...[4.25, 6.75, 9.25].map(y => p.rr(9.75, y, 12, y + 1.4, 0.6)), ...[5.5, 8, 10.5].map(y => p.rr(12, y, 14.25, y + 1.4, 0.6))],
    ['butter@A', p.rr(9.5, 12.75, 14.25, 19, 1.6)],
    ['ink@A', p.seg2(11.9, 15.25, 11.9, 16.9, 1.4)],
  ],
  files: (icon, p) => {
    const f = p.page(8, 2.25, 20.75, 18.25, 4.75, 2.5)
    return [
      ['lavender', p.rr(3.25, 6, 15.25, 21.75, 2.5)],
      ['cut', p.rr(8 - M, 2.25 - M, 20.75 + M, 18.25 + M, 2.5 + M)],
      ['sky@A', f.sheet],
      ['paper@A', f.fold],
      ['ink@A', p.lines(10.75, [16.75, 14.25], [11.5, 14.75])],
    ]
  },
  film: (icon, p) => {
    const holes = []
    for (const y of [4.75, 8.75, 12.75, 16.75]) holes.push(p.rr(3.6, y, 5.4, y + 2.25, 0.6), p.rr(18.6, y, 20.4, y + 2.25, 0.6))
    return [
      ['lavender', p.rr(2, 2.5, 22, 21.5, 3)],
      ['sky.well@A', p.rr(7, 4.75, 17, 11.25, 1.5), p.rr(7, 12.75, 17, 19.25, 1.5)],
      ['cut', ...holes],
    ]
  },

  // ---- folders: peach back, butter front, then the modifier ----
  'folder-plus': (icon, p) => [...folderBase(p), ...p.badgeLayers('plus', 'mint')],
  'folder-minus': (icon, p) => [...folderBase(p), ...p.badgeLayers('minus', 'blush')],
  'folder-search': (icon, p) => [...folderBase(p), ...magLayers(p, 16, 15.5)],
  'folder-open': (icon, p) => {
    const f = p.folder(2.25, 4, 21.75, 20.25, 7.5)
    return [
      ['peach', f.back],
      ['paper@A', p.rr(5, 7.75, 19, 15, 1.5)],
      ['butter@A', p.poly([[5.5, 10.75], [22.75, 10.75], [19.75, 20.25], [2.25, 20.25]], [1.6, 1.6, 3, 3])],
    ]
  },
}
