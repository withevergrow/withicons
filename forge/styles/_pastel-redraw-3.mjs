// PASTEL redraw chunk 3 of 5 — hand-composed Pastel icons for the names assigned to chunk 3.
// Each entry: 'icon-name': (icon, p) => layers. See forge/styles/PASTEL-GUIDE.md (API, kit, rules).
// Exemplars in _pastel-render.mjs win over entries here. Only this chunk's owner edits this file.
//
// Chunk 3 = icons 201-300 alphabetically (gift .. notebook). Exemplars in this range (home, heart,
// lock, mail, music-note) are skipped. Local helpers below are built only from the frozen vocabulary.

// ---------------------------------------------------------------------------------
// local helpers (shapes only)

// a cupped hand from the side: lavender cuff on the left, a peach palm that scoops in the middle
// and rises into a thumb on the right
const cupped = p => ({
  cuff: p.rr(1.75, 13.25, 5.25, 21.75, [1.25, 0.9, 0.9, 1.25]),
  palm: p.path('M4.75 14.75 H7.5 C8.75 14.75 9.5 16 11.25 16 H14.25 C15.1 16 15.6 15.6 16.1 15 L18.4 12.15 C19.1 11.3 20.35 11.15 21.1 11.9 C21.75 12.55 21.8 13.55 21.25 14.3 L17.6 19.4 C16.6 20.8 15.2 21.75 13.4 21.75 H4.75 Z'),
})

// a framed picture: sky frame, mint hills clipped to it, butter sun -> layers
function picture(p, x0, y0, x1, y1, r = 3) {
  const w = x1 - x0, h = y1 - y0
  const frame = p.rr(x0, y0, x1, y1, r)
  const hills = p.clip(p.poly([[x0 - 1, y1 + 1], [x0 - 1, y1 - h * 0.18], [x0 + w * 0.34, y0 + h * 0.46], [x0 + w * 0.6, y0 + h * 0.74], [x0 + w * 0.74, y0 + h * 0.6], [x1 + 1, y1 - h * 0.08], [x1 + 1, y1 + 1]], [0, 0, 1.6, 1, 1.4, 0, 0]), frame)
  return [
    ['sky', frame],
    ['mint', hills],
    ['butter.flat', p.circle(x0 + w * 0.72, y0 + h * 0.3, Math.max(1.35, w * 0.1))],
  ]
}

// round chat bubble with a soft tail at the bottom-left
const roundBubble = p => p.unite(p.circle(12, 11.25, 9.25), p.poly([[4.25, 15], [9, 19.25], [2.75, 21.5]], [1, 1, 1.1]))

// microphone parts
const mic = p => [
  ['lavender', p.pill(8, 2.25, 16, 14.75)],
  ['ink', p.seg2(10.6, 6.5, 13.4, 6.5, 1.35), p.seg2(10.6, 9.5, 13.4, 9.5, 1.35)],
  ['peach@A', p.arc(12, 11, 7, 0, 180, 2.5), p.seg2(12, 17.5, 12, 20.5, 2.5), p.pill(8, 19.75, 16, 22.25)],
]

// horizontal pill ring (a chain link) between x0..x1 at centre y, height h, band w
const linkRing = (p, x0, x1, y, h, w) => p.cut(p.pill(x0, y - h / 2, x1, y + h / 2), p.pill(x0 + w, y - h / 2 + w, x1 - w, y + h / 2 - w))

// a stacked-diamond layer centred at (12, y), half-width a, half-height b
const diamond = (p, y, a = 9.5, b = 5.25) => p.poly([[12, y - b], [12 + a, y], [12, y + b], [12 - a, y]], [1.5, 2, 1.5, 2])

export const R = {
  // blush box, butter lid (A), a lavender ribbon and bow over both
  gift: (icon, p) => [
    ['blush', p.rr(4, 11.25, 20, 21.5, [0.75, 0.75, 2.75, 2.75])],
    ['butter@A', p.rr(2.75, 7.5, 21.25, 12, 2)],
    ['lavender.flat', p.rect(10.4, 12, 13.6, 21.5)],
    ['lavender.flat@A', p.rect(10.4, 7.5, 13.6, 12)],
    ['lavender@A', p.rot(p.ellipse(8.4, 5, 3.4, 2), 22, 8.4, 5), p.rot(p.ellipse(15.6, 5, 3.4, 2), -22, 15.6, 5)],
    ['lavender.flat@A', p.circle(12, 6.4, 1.6)],
  ],
  // git family: lavender branch bars, every commit node the same peach with a paper core
  'git-branch': (icon, p) => [
    ['lavender@K', p.seg2(6.5, 6, 6.5, 18, 2.75), p.stroke('M17.5 8 C17.5 13.5 12 14.5 7.25 16.25', 2.75)],
    ['peach@K', p.circle(6.5, 5.5, 3), p.circle(6.5, 18.5, 3)],
    ['peach@A', p.circle(17.5, 6, 3)],
    ['paper.flat@K', p.circle(6.5, 5.5, 1.2), p.circle(6.5, 18.5, 1.2)],
    ['paper.flat@A', p.circle(17.5, 6, 1.2)],
  ],
  // a lavender track through one peach commit with a paper core
  'git-commit': (icon, p) => [
    ['lavender', p.seg2(2.5, 12, 21.5, 12, 2.75)],
    ['peach', p.circle(12, 12, 5.5)],
    ['paper.well', p.circle(12, 12, 2.3)],
  ],
  'git-merge': (icon, p) => [
    ['lavender@K', p.seg2(6.5, 6, 6.5, 18, 2.75), p.stroke('M6.5 8 C7 11.5 10.5 12 15 12', 2.75)],
    ['peach@K', p.circle(6.5, 5.75, 3), p.circle(6.5, 18.25, 3)],
    ['peach@A', p.circle(17.5, 12, 3)],
    ['paper.flat@K', p.circle(6.5, 5.75, 1.2), p.circle(6.5, 18.25, 1.2)],
    ['paper.flat@A', p.circle(17.5, 12, 1.2)],
  ],
  'git-pull-request': (icon, p) => [
    ['lavender@K', p.seg2(6, 6, 6, 18, 2.75)],
    ['lavender@A', p.stroke('M18 16 V9.5 A3 3 0 0 0 15 6.5 H11.5', 2.75), p.chevron(10.5, 6.5, 180, 3.75, 2.75)],
    ['peach@K', p.circle(6, 5.5, 3), p.circle(6, 18.5, 3)],
    ['peach@A', p.circle(18, 18.5, 3)],
    ['paper.flat@K', p.circle(6, 5.5, 1.2), p.circle(6, 18.5, 1.2)],
    ['paper.flat@A', p.circle(18, 18.5, 1.2)],
  ],
  // a sky ocean (body) with soft mint continents (part)
  globe: (icon, p) => {
    const g = p.circle(12, 12, 9.75)
    return [
      ['sky@K', g],
      ['mint@A', p.clip(p.join(
        p.path('M3.5 8.5 C5 5.5 9 5.25 10.75 7.75 C11.75 9.5 9.75 10.5 9.75 12.75 C9.75 15.25 8 16.75 6.5 15.75 C4.75 14.5 2 12 3.5 8.5 Z'),
        p.path('M13.75 3 C17 3 20.5 5 21.5 8.25 C19.5 9.5 16.5 8.25 15.25 10 C14.25 11.5 16.75 12.5 17.75 14.25 C18.75 16.25 16.25 20.5 13.75 21.25 C12.75 19 13.5 16.75 12.5 15 C11.5 13 12.75 10.25 13 8.25 C13.25 6.25 12.5 4.25 13.75 3 Z'),
      ), p.circle(12, 12, 9.25))],
    ]
  },
  // sky cap band under a lavender mortarboard, butter tassel (A)
  'graduation-cap': (icon, p) => [
    ['sky', p.path('M6 11 V15.75 C6 18 9 19.75 12 19.75 C15 19.75 18 18 18 15.75 V11 Z')],
    ['lavender', p.poly([[12, 3.75], [22.5, 9], [12, 14.25], [1.5, 9]], [1.25, 1.5, 1.25, 1.5])],
    ['butter.flat@A', p.seg2(19.5, 10.25, 19.5, 15.5, 1.75)],
    ['butter@A', p.drop(19.5, 17.5, 1.9, 19.5, 14.5, 0.6)],
    ['ink', p.circle(12, 9, 1.3)],
  ],
  // peach handle, lavender head with a striking face (A), drawn upright then swung 45deg
  hammer: (icon, p) => {
    const T = s => p.move(p.rot(s, 45, 12, 12), 0.5, 0.25)
    return [
      ['peach@K', T(p.rr(10.4, 8, 13.6, 22.5, [0.75, 0.75, 1.6, 1.6]))],
      ['lavender@A', T(p.unite(p.rr(6.5, 2.5, 19, 8.75, [1.25, 3, 3, 1.25]), p.rr(3.75, 3.25, 7, 8, 1)))],
      ['ink@A', T(p.seg2(10, 5.6, 14, 5.6, 1.35))],
    ]
  },
  // a cupped peach palm (thumb up on the right) holding one butter coin stack
  'hand-coins': (icon, p) => {
    const h = cupped(p)
    return [
      ['peach@K', h.palm],
      ['lavender@K', h.cuff],
      ['butter@A', p.unite(p.pill(8.25, 12.25, 15.75, 15.75), p.pill(8.75, 8.75, 16.25, 12.25), p.pill(8, 5.25, 15.5, 8.75))],
      ['ink@A', p.seg2(9.75, 12.25, 14.25, 12.25, 1.2), p.seg2(10, 8.75, 14.75, 8.75, 1.2)],
    ]
  },
  'hand-heart': (icon, p) => {
    const h = cupped(p)
    return [
      ['peach@K', h.palm],
      ['lavender@K', h.cuff],
      ['blush@A', p.heart(12, 8.25, 0.62)],
    ]
  },
  // two clasped mitts: a butter hand behind reaching left, a peach hand in front reaching right,
  // lavender cuffs, a moat and ink finger gaps where the peach fingers wrap over
  handshake: (icon, p) => {
    const T = sh => p.rot(sh, -12, 12, 12)
    return [
      ['butter@K', T(p.rr(6.25, 6.5, 19.75, 13.25, [3.35, 1.25, 1.25, 3.35]))],
      ['lavender@K', T(p.rr(18.75, 5.25, 22.5, 14.5, [1.25, 1.5, 1.5, 1.25]))],
      ['cut', T(p.rr(3.1, 10.1, 18.9, 19.15, [1.75, 4.5, 4.5, 1.75]))],
      ['peach@K', T(p.rr(4.25, 11.25, 17.75, 18, [1.25, 3.35, 3.35, 1.25]))],
      ['ink@K', T(p.seg2(12.5, 13.5, 16.25, 13.5, 1.3)), T(p.seg2(12.5, 15.75, 16.25, 15.75, 1.3))],
      ['lavender@K', T(p.rr(1.5, 10, 5.25, 19.25, [1.5, 1.25, 1.25, 1.5]))],
    ]
  },
  // lavender drive, a paper platter well with a butter spindle, peach read arm (A), ink LED
  'hard-drive': (icon, p) => [
    ['lavender', p.rr(4, 2.5, 20, 21.5, 3.25)],
    ['paper.well', p.circle(12, 10.25, 5.5)],
    ['butter.flat', p.circle(12, 10.25, 1.5)],
    ['peach.flat@A', p.seg2(16.75, 18, 13.25, 12, 2)],
    ['ink', p.circle(7.5, 18.25, 1.15)],
  ],
  // text formatting family: one lavender field each
  hash: (icon, p) => [
    ['lavender', p.unite(p.seg2(9.75, 3.5, 7.75, 20.5, 3), p.seg2(16.25, 3.5, 14.25, 20.5, 3), p.seg2(4, 8.75, 20.5, 8.75, 3), p.seg2(3.5, 15.25, 20, 15.25, 3))],
  ],
  heading: (icon, p) => [
    ['lavender', p.unite(p.seg2(6, 4, 6, 20, 3.5), p.seg2(18, 4, 18, 20, 3.5), p.seg2(6, 12, 18, 12, 3))],
  ],
  // lavender band, sky ear cups with paper cushions
  headphones: (icon, p) => [
    ['lavender@K', p.arc(12, 13, 8.5, 180, 360, 2.75), p.seg2(3.5, 13, 3.5, 15, 2.75), p.seg2(20.5, 13, 20.5, 15, 2.75)],
    ['sky', p.rr(2.5, 12.75, 8.25, 21, 2.5), p.rr(15.75, 12.75, 21.5, 21, 2.5)],
    ['paper.flat', p.rr(6, 14.25, 8.25, 19.5, [0.9, 0, 0, 0.9]), p.rr(15.75, 14.25, 18, 19.5, [0, 0.9, 0.9, 0])],
  ],
  headset: (icon, p) => [
    ['lavender@K', p.arc(12, 12.5, 8.5, 180, 360, 2.75), p.seg2(3.5, 12.5, 3.5, 14, 2.75), p.seg2(20.5, 12.5, 20.5, 14, 2.75)],
    ['peach.flat@A', p.stroke('M19 18.5 C19 20.5 17.5 21.5 14.5 21.5', 2)],
    ['sky', p.rr(2.5, 11.75, 8.25, 19.25, 2.5), p.rr(15.75, 11.75, 21.5, 19.25, 2.5)],
    ['paper.flat', p.rr(6, 13.25, 8.25, 17.75, [0.9, 0, 0, 0.9]), p.rr(15.75, 13.25, 18, 17.75, [0, 0.9, 0.9, 0])],
    ['peach@A', p.pill(10.5, 20, 15, 23)],
  ],
  // one blush heart split along a zigzag; the right half (A) can drift
  'heart-crack': (icon, p) => {
    const H = p.heart(12, 12.75, 1.02)
    const zig = [[12, 3.5], [12, 5], [10.25, 9.25], [13.75, 12.25], [11, 16.25], [12, 22]]
    const left = p.poly([[0, 0], ...zig, [12, 24], [0, 24]], 0)
    const right = p.poly([[24, 0], [12, 0], ...zig, [12, 24], [24, 24]], 0)
    return [
      ['blush', p.clip(H, left)],
      ['blush@A', p.clip(H, right)],
      ['cut', p.bar(zig, 1.3)],
    ]
  },
  'heart-pulse': (icon, p) => [
    ['blush', p.heart(12, 12.75, 1.02)],
    ['ink', p.bar([[5, 12.25], [8.25, 12.25], [9.75, 9.5], [12.25, 15.5], [14, 11], [15.25, 12.25], [19, 12.25]], 1.6)],
  ],
  'help-circle': (icon, p) => [
    ['sky', p.circle(12, 12, 9.75)],
    ['ink', p.stroke('M9.25 9.5 C9.25 7.6 10.5 6.6 12 6.6 C13.7 6.6 14.85 7.7 14.85 9.2 C14.85 11.3 12 11.5 12 13.6', 2.1), p.circle(12, 17.1, 1.35)],
  ],
  hexagon: (icon, p) => [
    ['lavender', p.poly(p.ngon(12, 12, 10, 6, -90), 2.75)],
  ],
  // lavender barrel, sky collar, butter tip (A), a butter highlight swipe on the page
  highlighter: (icon, p) => {
    const T = s => p.move(p.rot(s, 45, 12, 12), 1.25, -1.25)
    return [
      ['lavender@K', T(p.rr(8.5, 1.5, 15.5, 12.75, [2.5, 2.5, 0.75, 0.75]))],
      ['sky.flat@K', T(p.rr(8, 12.5, 16, 15.25, 0.9))],
      ['butter.flat', p.pill(2.5, 19.75, 12.5, 22.25)],
      ['butter@A', T(p.poly([[9.25, 15.25], [14.75, 15.25], [13.5, 19.75], [10, 20.75]], [0.9, 0.9, 1, 1]))],
    ]
  },
  // a sky clock face with ink hands inside a lavender counter-clockwise arrow
  history: (icon, p) => [
    ['lavender', p.arc(12, 12, 9.25, -140, 160, 2.6), p.chevron(4.9, 6.05, 130, 5.25, 2.75)],
    ['sky', p.circle(12, 12, 5.9)],
    ['ink@A', p.bar([[12, 8.75], [12, 12.25], [14.25, 13.5]], 1.6)],
  ],
  // sky wings, a mint tower with a blush cross, a paper doorway
  hospital: (icon, p) => [
    ['sky', p.rr(2.5, 9.5, 21.5, 21.5, [2.5, 2.5, 2, 2])],
    ['mint', p.rr(7.25, 3, 16.75, 21.5, [2.75, 2.75, 0, 0])],
    ['blush.flat', p.glyph('plus', 12, 8.25, 2.6, 2.3)],
    ['paper.well@A', p.arch(9.75, 15, 14.25, 21.5)],
    ['ink', p.circle(4.85, 13, 0.95), p.circle(4.85, 16.75, 0.95), p.circle(19.15, 13, 0.95), p.circle(19.15, 16.75, 0.95)],
  ],
  // lavender tower, warm butter windows, a paper doorway with a blush awning
  hotel: (icon, p) => [
    ['lavender@K', p.rr(4.5, 2.5, 19.5, 21.5, [3, 3, 1.5, 1.5])],
    ['butter.flat', ...[6, 10.75].flatMap(y => [p.rr(7, y, 10.5, y + 3, 1), p.rr(13.5, y, 17, y + 3, 1)])],
    ['paper.well@A', p.arch(9.5, 15.5, 14.5, 21.5)],
  ],
  // lavender end caps, sky glass, butter sand falling (A)
  hourglass: (icon, p) => {
    const glass = p.path('M6.25 4.5 H17.75 C17.75 9 14 10.5 13.25 12 C14 13.5 17.75 15 17.75 19.5 H6.25 C6.25 15 10 13.5 10.75 12 C10 10.5 6.25 9 6.25 4.5 Z')
    return [
      ['lavender', p.pill(4.25, 2.25, 19.75, 5.25), p.pill(4.25, 18.75, 19.75, 21.75)],
      ['sky', glass],
      ['butter.flat@A', p.clip(glass, p.rect(0, 8.25, 24, 12.25)), p.clip(glass, p.rect(0, 15.75, 24, 24))],
    ]
  },
  // peach waffle cone with ink cross-hatch, a scalloped blush scoop
  'ice-cream': (icon, p) => {
    const cone = p.poly([[5.75, 10.5], [18.25, 10.5], [12, 22.5]], [1.5, 1.5, 1.4])
    return [
      ['peach', cone],
      ['ink', p.clip(p.join(p.seg2(6, 11, 13.5, 20.5, 1.3), p.seg2(10, 11, 15, 17.5, 1.3), p.seg2(18, 11, 10.5, 20.5, 1.3), p.seg2(14, 11, 9, 17.5, 1.3)), p.poly([[6.75, 12], [17.25, 12], [12, 21.25]], 1))],
      ['blush', p.unite(p.circle(12, 7.5, 5.5), p.circle(7.75, 10.4, 2.2), p.circle(12, 11, 2.2), p.circle(16.25, 10.4, 2.2))],
    ]
  },
  // sky card, paper photo well with a peach head and lavender shoulders, ink text lines
  'id-card': (icon, p) => {
    const photo = p.rr(4.25, 7, 11.5, 17, 1.75)
    return [
      ['sky', p.rr(1.75, 4.25, 22.25, 19.75, 3)],
      ['paper.well', photo],
      ['lavender.flat', p.clip(p.rr(4.75, 13.25, 11, 18, [3, 3, 0, 0]), photo)],
      ['peach.flat', p.circle(7.875, 10.6, 2.15)],
      ['ink', p.lines(14, [19.75, 18], [10.25, 13.75])],
    ]
  },
  image: (icon, p) => picture(p, 2, 3.5, 22, 20.5, 3),
  'image-plus': (icon, p) => [...picture(p, 2, 3.5, 22, 20.5, 3), ...p.badgeLayers('plus', 'mint', 18, 18, 4.75)],
  // a sky print behind a sky picture, with a gap between them
  images: (icon, p) => [
    ['sky', p.rr(6.5, 2.25, 22, 16.25, 2.75)],
    ['cut', p.rr(0.75, 5.75, 18.75, 22.75, 4)],
    ...picture(p, 2, 7, 17.5, 21.5, 2.75),
  ],
  // lavender back of the tray, a paper letter (A), the sky front with its dip
  inbox: (icon, p) => [
    ['lavender', p.poly([[6.25, 4], [17.75, 4], [21.75, 13.5], [2.25, 13.5]], [2, 2, 1, 1])],
    ['paper@A', p.rr(7.5, 6.5, 16.5, 15, 1.4)],
    ['ink@A', p.lines(9.5, [14.5, 13], [9.25, 11.75], 1.35)],
    ['sky', p.path('M2.25 13 H7.25 C7.9 13 8.3 13.3 8.6 13.85 L9.35 15.15 C9.65 15.7 10.05 16 10.7 16 H13.3 C13.95 16 14.35 15.7 14.65 15.15 L15.4 13.85 C15.7 13.3 16.1 13 16.75 13 H21.75 V18.25 A3 3 0 0 1 18.75 21.25 H5.25 A3 3 0 0 1 2.25 18.25 Z')],
  ],
  'indent-decrease': (icon, p) => [
    ['lavender', p.seg2(3.5, 5.5, 20.5, 5.5, 2.75), p.seg2(12.5, 12, 20.5, 12, 2.75), p.seg2(3.5, 18.5, 20.5, 18.5, 2.75)],
    ['peach@A', p.arrow(9.25, 12, 3.75, 12, { w: 2.75, head: 3.6 })],
  ],
  'indent-increase': (icon, p) => [
    ['lavender', p.seg2(3.5, 5.5, 20.5, 5.5, 2.75), p.seg2(12.5, 12, 20.5, 12, 2.75), p.seg2(3.5, 18.5, 20.5, 18.5, 2.75)],
    ['mint@A', p.arrow(3.75, 12, 9.25, 12, { w: 2.75, head: 3.6 })],
  ],
  // one mint rupee glyph
  'indian-rupee': (icon, p) => [
    ['mint', p.seg2(6.5, 4.25, 17.75, 4.25, 3), p.seg2(6.5, 9, 17.75, 9, 3), p.stroke('M6.5 4.25 H9.25 C12.5 4.25 14.25 6.5 14.25 9 C14.25 11.75 12.25 13.75 9 13.75 H7 L15.25 20.5', 3)],
  ],
  'info-circle': (icon, p) => [
    ['sky', p.circle(12, 12, 9.75)],
    ['ink', p.circle(12, 7.6, 1.45), p.seg2(12, 11, 12, 17, 2.2)],
  ],
  italic: (icon, p) => [
    ['lavender', p.unite(p.seg2(14, 4.5, 10, 19.5, 3.25), p.seg2(10, 4.5, 18.5, 4.5, 3), p.seg2(5.5, 19.5, 14, 19.5, 3))],
  ],
  // lavender board, three paper cards at different lengths, each with an ink title line
  kanban: (icon, p) => [
    ['lavender', p.rr(2.5, 2.5, 21.5, 21.5, 3.5)],
    ['paper.flat', p.rr(5.5, 5.5, 9.5, 16.75, 1.4), p.rr(10, 5.5, 14, 12.5, 1.4), p.rr(14.5, 5.5, 18.5, 18.5, 1.4)],
    ['ink', p.seg2(6.75, 7.9, 8.25, 7.9, 1.25), p.seg2(11.25, 7.9, 12.75, 7.9, 1.25), p.seg2(15.75, 7.9, 17.25, 7.9, 1.25)],
  ],
  // one butter key with a see-through bow
  key: (icon, p) => [
    ['butter', p.unite(p.circle(7.5, 16.5, 5), p.seg2(10.5, 13.5, 20.25, 3.75, 2.9), p.seg2(17.25, 7, 19.75, 9.5, 2.6), p.seg2(14.4, 9.85, 16.4, 11.85, 2.6))],
    ['cut', p.circle(7, 17, 1.9)],
  ],
  // lavender keyboard, ink keys, an ink space bar
  keyboard: (icon, p) => [
    ['lavender', p.rr(1.75, 5.25, 22.25, 18.75, 3.25)],
    ['ink', ...[5.5, 9.17, 12.83, 16.5].flatMap(x => [p.rr(x - 0.95, 7.85, x + 0.95, 9.75, 0.6), p.rr(x - 0.95, 11.05, x + 0.95, 12.95, 0.6)]), p.pill(7.75, 14.4, 16.25, 16.2)],
  ],
  // butter shade, lavender stand, a peach pull cord (A)
  lamp: (icon, p) => [
    ['lavender', p.seg2(12, 11.5, 12, 19.5, 2.5), p.pill(6.25, 18.75, 17.75, 21.75)],
    ['butter@A', p.poly([[8, 2.75], [16, 2.75], [19.75, 12.25], [4.25, 12.25]], [1.6, 1.6, 1.4, 1.4])],
    ['peach.flat@A', p.seg2(16.5, 12.25, 16.5, 15.25, 1.4), p.circle(16.5, 15.75, 1.05)],
  ],
  // lavender pediment and plinth, sky columns
  landmark: (icon, p) => [
    ['lavender', p.poly([[2.25, 9], [12, 2.5], [21.75, 9], [21.75, 10.75], [2.25, 10.75]], [1, 1.75, 1, 0.9, 0.9]), p.rr(2.25, 18.5, 21.75, 21.75, 1.6)],
    ['sky', p.rr(4.75, 11.75, 7.25, 17.75, 1), p.rr(8.75, 11.75, 11.25, 17.75, 1), p.rr(12.75, 11.75, 15.25, 17.75, 1), p.rr(16.75, 11.75, 19.25, 17.75, 1)],
    ['ink', p.circle(12, 7.6, 1.15)],
  ],
  // a lavender card with a wen glyph behind a blush card with an A
  language: (icon, p) => [
    ['lavender', p.rr(2, 2.5, 14.5, 14.5, 2.75)],
    ['ink', p.seg2(5, 6, 11.5, 6, 1.35), p.seg2(8.25, 4.6, 8.25, 6, 1.35), p.stroke('M5.6 7.6 C7 10.6 9 11.6 11.3 12.1', 1.35), p.stroke('M10.9 7.6 C9.5 10.6 7.5 11.6 5.2 12.1', 1.35)],
    ['cut', p.rr(8.25, 8.25, 23.25, 23, 4)],
    ['blush@A', p.rr(9.5, 9.5, 22, 21.75, 2.75)],
    ['ink@A', p.bar([[12.75, 19], [15.75, 12.25], [18.75, 19]], 1.6), p.seg2(13.9, 16.75, 17.6, 16.75, 1.5)],
  ],
  // lavender lid with a sky screen well, lavender base with an ink notch
  laptop: (icon, p) => [
    ['lavender', p.rr(3.75, 3.5, 20.25, 16, 2.5), p.path('M1.5 16.75 H22.5 V17.75 A2.25 2.25 0 0 1 20.25 20 H3.75 A2.25 2.25 0 0 1 1.5 17.75 Z')],
    ['sky.well', p.rr(5.75, 5.5, 18.25, 14, 1.25)],
    ['ink', p.pill(10, 17.4, 14, 18.6)],
  ],
  // butter face, closed happy eyes, a blush open laugh
  laugh: (icon, p) => [
    ['butter', p.circle(12, 12, 9.75)],
    ['ink', p.arc(8.5, 10, 1.6, 180, 360, 1.6), p.arc(15.5, 10, 1.6, 180, 360, 1.6)],
    ['blush.well@A', p.path('M6.75 13 H17.25 C17.25 16.25 15 18.5 12 18.5 C9 18.5 6.75 16.25 6.75 13 Z')],
  ],
  // three stacked plates: lavender, sky, blush (top), each with a gap
  layers: (icon, p) => [
    ['lavender@K', diamond(p, 16)],
    ['cut', diamond(p, 12.25, 11.25, 6.5)],
    ['sky@A', diamond(p, 12.25)],
    ['cut', diamond(p, 8.5, 11.25, 6.5)],
    ['blush@A', diamond(p, 8.5)],
  ],
  'layout-dashboard': (icon, p) => [
    ['lavender', p.rr(2.75, 2.75, 10.75, 13.75, 2.5), p.rr(13.25, 10.25, 21.25, 21.25, 2.5)],
    ['sky', p.rr(2.75, 16.25, 10.75, 21.25, 2.25), p.rr(13.25, 2.75, 21.25, 7.75, 2.25)],
  ],
  'layout-grid': (icon, p) => [
    ['lavender', p.rr(2.75, 2.75, 10.75, 10.75, 2.5), p.rr(2.75, 13.25, 10.75, 21.25, 2.5), p.rr(13.25, 13.25, 21.25, 21.25, 2.5)],
    ['butter', p.rr(13.25, 2.75, 21.25, 10.75, 2.5)],
  ],
  'layout-list': (icon, p) => [
    ['lavender', p.rr(2.75, 3.25, 10, 10.5, 2.25), p.rr(2.75, 13.5, 10, 20.75, 2.25)],
    ['sky', p.seg2(13.75, 5.25, 21, 5.25, 2.5), p.seg2(13.75, 8.75, 18.5, 8.75, 2.5), p.seg2(13.75, 15.5, 21, 15.5, 2.5), p.seg2(13.75, 19, 18.5, 19, 2.5)],
  ],
  'layout-template': (icon, p) => [
    ['lavender', p.rr(2.75, 2.75, 21.25, 9.5, 2.5)],
    ['butter', p.rr(2.75, 12, 11, 21.25, 2.5)],
    ['sky', p.seg2(14.5, 13.5, 20, 13.5, 2.5), p.seg2(14.5, 17, 20, 17, 2.5), p.seg2(14.5, 20.5, 18, 20.5, 2.5)],
  ],
  // one mint leaf with an ink vein, a short mint stem
  leaf: (icon, p) => [
    ['mint', p.path('M20.75 3.25 C11.5 3 4 7.5 4 15 C4 16.75 4.6 18.4 5.4 19.4 C13 20.25 21 15 20.75 3.25 Z')],
    ['mint.flat', p.seg2(3, 21, 6.5, 17.5, 2.25)],
    ['ink', p.stroke('M7.25 16.75 C10 13.5 13.25 10.25 17 7.5', 1.5)],
  ],
  // two upright books and one leaning, on a peach shelf (3 hues)
  library: (icon, p) => [
    ['lavender', p.rr(3, 3.25, 7.75, 19.75, [1.5, 1.5, 0.5, 0.5])],
    ['sky', p.rr(8.75, 5.5, 13, 19.75, [1.5, 1.5, 0.5, 0.5])],
    ['peach', p.rr(1.75, 19.75, 22.25, 22, 1.1)],
    ['lavender@A', p.rot(p.rr(14, 4.5, 18.5, 19.75, [1.5, 1.5, 0.5, 0.5]), 16, 14, 19.75)],
    ['ink', p.seg2(4.5, 6.75, 6.25, 6.75, 1.3), p.seg2(4.5, 16.25, 6.25, 16.25, 1.3), p.seg2(10.15, 8.75, 11.6, 8.75, 1.3)],
  ],
  // butter bulb with an ink filament, lavender screw base
  lightbulb: (icon, p) => [
    ['butter', p.path('M12 2.25 C16.4 2.25 19 5.5 19 9.1 C19 11.6 17.75 13.15 16.3 14.6 C15.5 15.4 15.25 16.1 15.25 16.9 H8.75 C8.75 16.1 8.5 15.4 7.7 14.6 C6.25 13.15 5 11.6 5 9.1 C5 5.5 7.6 2.25 12 2.25 Z')],
    ['ink', p.bar([[9.75, 10], [11, 11.75], [12, 10], [13, 11.75], [14.25, 10]], 1.35), p.seg2(12, 12, 12, 15.75, 1.35)],
    ['lavender@A', p.rr(8.5, 17.25, 15.5, 20, 1.1), p.pill(10, 19.5, 14, 22.25)],
  ],
  // two interlocked chain links, lavender and sky
  link: (icon, p) => {
    const T = s => p.rot(s, -45, 12, 12)
    return [
      ['lavender', T(linkRing(p, -0.5, 14.5, 12, 8, 2.75))],
      ['cut', T(p.cut(p.pill(8.3, 6.8, 25.7, 17.2), p.pill(11.95, 10.45, 22.05, 13.55)))],
      ['sky@A', T(linkRing(p, 9.5, 24.5, 12, 8, 2.75))],
    ]
  },
  'list-checks': (icon, p) => [
    ['lavender', p.seg2(12.75, 6, 21, 6, 2.6), p.seg2(12.75, 12, 21, 12, 2.6), p.seg2(12.75, 18, 21, 18, 2.6)],
    ['mint@A', p.check([[3.25, 6.25], [5.5, 8.5], [9.25, 4]], 2.6), p.check([[3.25, 18.25], [5.5, 20.5], [9.25, 16]], 2.6)],
  ],
  'list-filter': (icon, p) => [
    ['lavender', p.seg2(3.25, 6, 20.75, 6, 3), p.seg2(6.75, 12, 17.25, 12, 3)],
    ['sky@A', p.seg2(10, 18, 14, 18, 3)],
  ],
  'list-music': (icon, p) => [
    ['sky', p.seg2(3, 6, 14, 6, 2.6), p.seg2(3, 12, 14, 12, 2.6), p.seg2(3, 18, 9.5, 18, 2.6)],
    ['lavender@A', p.unite(p.seg2(18.75, 17.25, 18.75, 4, 2.3), p.stroke('M19 3.75 C19.75 6 21.5 6.5 21.5 9', 2.3))],
    ['blush@A', p.rot(p.ellipse(16, 17.75, 3.1, 2.5), -18, 16, 17.75)],
  ],
  // peach numerals, lavender rows
  'list-ordered': (icon, p) => [
    ['lavender', p.seg2(11, 6, 21, 6, 2.6), p.seg2(11, 12, 21, 12, 2.6), p.seg2(11, 18, 21, 18, 2.6)],
    ['peach', p.unite(p.seg2(5.5, 3.5, 5.5, 9.25, 2.1), p.seg2(3.9, 4.5, 5.5, 3.5, 2.1)), p.stroke('M3.5 14.6 C3.75 13.1 7 12.6 7.25 14.35 C7.5 15.85 3.5 17.5 3.5 19.75 H7.5', 2)],
  ],
  'list-plus': (icon, p) => [
    ['lavender', p.seg2(3.25, 5.5, 20.75, 5.5, 2.75), p.seg2(3.25, 11.75, 20.75, 11.75, 2.75), p.seg2(3.25, 18, 11.5, 18, 2.75)],
    ['mint@S', p.glyph('plus', 17.75, 18, 3.25, 2.75)],
  ],
  list: (icon, p) => [
    ['lavender.flat', p.seg2(9.25, 6, 21, 6, 2.25), p.seg2(9.25, 12, 21, 12, 2.25), p.seg2(9.25, 18, 21, 18, 2.25)],
    ['peach.flat', p.circle(4.5, 6, 1.9), p.circle(4.5, 12, 1.9), p.circle(4.5, 18, 1.9)],
    ['shade.peach', p.circle(4.5, 6, 1.9), p.circle(4.5, 12, 1.9), p.circle(4.5, 18, 1.9)],
  ],
  // eight soft rays: long lavender cardinals, short sky diagonals
  loader: (icon, p) => [
    ['lavender', p.around(p.seg2(12, 2.75, 12, 7, 2.9), 4, 12, 12)],
    ['sky', p.around(p.seg2(12, 4, 12, 7.25, 2.6), 4, 12, 12, 45)],
  ],
  // a lavender door, a mint arrow going in (moat around it)
  'log-in': (icon, p) => [
    ['lavender', p.rr(13.25, 2.75, 21, 21.25, [1.75, 3.25, 3.25, 1.75])],
    ['ink', p.circle(15.75, 12, 1)],
    ['cut', p.seg2(1, 12, 15, 12, 5.2), p.bar([[10.5, 7.25], [15.25, 12], [10.5, 16.75]], 5.2)],
    ['mint@A', p.arrow(3, 12, 15.25, 12, { w: 2.8, head: 4.75 })],
  ],
  'log-out': (icon, p) => [
    ['lavender', p.rr(3, 2.75, 10.75, 21.25, [3.25, 1.75, 1.75, 3.25])],
    ['cut', p.seg2(7, 12, 21.5, 12, 5.2)],
    ['blush@A', p.arrow(8.75, 12, 21, 12, { w: 2.8, head: 4.75 })],
  ],
  // peach case, lavender handle and wheels, butter straps
  luggage: (icon, p) => {
    const body = p.rr(4.5, 6.25, 19.5, 19.75, 3)
    return [
      ['peach', body],
      ['butter.flat', p.clip(p.join(p.rect(8, 6, 10, 20), p.rect(14, 6, 16, 20)), body)],
      ['lavender@A', p.stroke('M9 6.5 V4.4 A1.4 1.4 0 0 1 10.4 3 H13.6 A1.4 1.4 0 0 1 15 4.4 V6.5', 2)],
      ['lavender', p.circle(8, 21, 1.4), p.circle(16, 21, 1.4)],
    ]
  },
  'mail-check': (icon, p) => [
    ['sky', p.rr(2, 4.5, 22, 19.5, 3)],
    ['paper@A', p.poly([[3, 5.6], [21, 5.6], [12, 13.25]], [1.6, 1.6, 2.2])],
    ...p.badgeLayers('check', 'mint', 18, 18, 4.75),
  ],
  // lavender back with the open flap, a paper letter (A), sky front pocket
  'mail-open': (icon, p) => [
    ['lavender', p.path('M2 10.25 L10.4 3.9 C11.35 3.2 12.65 3.2 13.6 3.9 L22 10.25 V17.75 A3 3 0 0 1 19 20.75 H5 A3 3 0 0 1 2 17.75 Z')],
    ['paper@A', p.rr(5.5, 6.75, 18.5, 15.5, 1.5)],
    ['ink@A', p.lines(8.25, [15.75, 13.5], [9.5, 12.25], 1.35)],
    ['sky', p.path('M2 11.25 L12 17 L22 11.25 V17.75 A3 3 0 0 1 19 20.75 H5 A3 3 0 0 1 2 17.75 Z')],
  ],
  // blush pin with a paper well
  'map-pin': (icon, p) => [
    ['blush', p.drop(12, 9.75, 7.25, 12, 22.25, 1.1)],
    ['paper.well', p.circle(12, 9.75, 2.7)],
  ],
  // a folded map: mint, sky, mint panels; a blush spot
  map: (icon, p) => [
    ['mint', p.poly([[2.25, 5.75], [8.5, 3.5], [8.5, 18.25], [2.25, 20.5]], [1.75, 0, 0, 1.75]), p.poly([[15.5, 5.75], [21.75, 3.5], [21.75, 18.25], [15.5, 20.5]], [0, 1.75, 1.75, 0])],
    ['sky', p.poly([[8.5, 3.5], [15.5, 5.75], [15.5, 20.5], [8.5, 18.25]], [0, 0, 0, 0])],
    ['blush.flat', p.drop(12, 10, 2, 12, 14.25, 0.5)],
  ],
  maximize: (icon, p) => [
    ['lavender', p.arrow(13.75, 10.25, 20.25, 3.75, { w: 2.9, head: 5 }), p.arrow(10.25, 13.75, 3.75, 20.25, { w: 2.9, head: 5 })],
  ],
  // blush and lavender ribbon straps, a butter medal with an ink star
  medal: (icon, p) => [
    ['butter', p.circle(12, 14.75, 7)],
    ['ink', p.poly(p.star(12, 15, 3.6, 1.65, 5), 0.45)],
    ['cut', p.poly([[5, 1.5], [11, 1.5], [14.5, 9.5], [9.5, 10.5]], 1.5), p.poly([[19, 1.5], [13, 1.5], [9.5, 9.5], [14.5, 10.5]], 1.5)],
    ['blush@A', p.poly([[5.5, 2.5], [10.5, 2.5], [13.6, 9.6], [10, 10.4]], [1, 1, 1, 1])],
    ['lavender@A', p.poly([[18.5, 2.5], [13.5, 2.5], [10.4, 9.6], [14, 10.4]], [1, 1, 1, 1])],
  ],
  // peach back and grip, a lavender horn, a butter mouth rim
  megaphone: (icon, p) => [
    ['lavender', p.path('M6 9 L16.5 4.4 V19.6 L6 15 Z')],
    ['peach', p.rr(2.25, 8.5, 7.25, 15.5, 1.75)],
    ['peach.flat@A', p.rr(6.25, 14.5, 9, 20.5, [0.5, 0.5, 1.2, 1.2])],
    ['butter', p.pill(16, 3, 21, 21)],
  ],
  meh: (icon, p) => [
    ['butter', p.circle(12, 12, 9.75)],
    ['ink', p.circle(8.75, 10, 1.35), p.circle(15.25, 10, 1.35), p.seg2(8.25, 15.5, 15.75, 15.5, 1.75)],
  ],
  menu: (icon, p) => [
    ['lavender.flat', p.seg2(4, 6, 20, 6, 2.25), p.seg2(4, 12, 20, 12, 2.25), p.seg2(4, 18, 20, 18, 2.25)],
  ],
  // chat family: sky bubbles, ink details
  'message-circle-more': (icon, p) => [
    ['sky', roundBubble(p)],
    ['ink', p.circle(8, 11.25, 1.35), p.circle(12, 11.25, 1.35), p.circle(16, 11.25, 1.35)],
  ],
  'message-circle': (icon, p) => [
    ['sky', roundBubble(p)],
  ],
  'message-square-text': (icon, p) => [
    ['sky', p.bubble(2.25, 3.25, 21.75, 17.25)],
    ['ink', p.lines(6.5, [17.5, 14], [8.25, 12.25])],
  ],
  'message-square': (icon, p) => [
    ['sky', p.bubble(2.25, 3.25, 21.75, 17.25)],
  ],
  // a lavender reply behind a sky message, with a gap
  messages: (icon, p) => [
    ['lavender@K', p.unite(p.rr(8.25, 8.5, 21.75, 18.25, 3.25), p.poly([[14.5, 17.5], [19.5, 17], [20.5, 21.75]], [1, 1, 1.1]))],
    ['cut', p.unite(p.rr(1, 1.25, 16.5, 14, 4.25), p.poly([[3, 10], [10.5, 12], [1.5, 17.5]], 1.5))],
    ['sky', p.unite(p.rr(2.25, 2.5, 15.25, 12.75, 3.25), p.poly([[4, 12], [9, 12.5], [3, 16.25]], [1, 1, 1.1]))],
  ],
  microphone: (icon, p) => mic(p),
  'microphone-off': (icon, p) => [...mic(p), ...p.slashLayers('blush', [3.5, 3.5], [20.5, 20.5])],
  // sky eyepiece tube (A), lavender arm and foot, butter stage
  microscope: (icon, p) => [
    ['lavender', p.stroke('M13.5 9.5 C18 10 19.75 13.5 18.75 16.5 C18.25 18 17 19.25 15.25 19.75', 2.6), p.pill(3.5, 19.5, 20.5, 22.25)],
    ['butter.flat', p.rr(5, 15.25, 13.5, 17.25, 1)],
    ['sky@A', p.rot(p.rr(7.75, 1.75, 12.25, 12.5, 1.75), -32, 10, 12.5)],
    ['paper.flat@A', p.rot(p.rr(8.75, 12.25, 11.25, 14.5, 0.9), -32, 10, 12.5)],
  ],
  minimize: (icon, p) => [
    ['lavender', p.arrow(20.25, 3.75, 14, 10, { w: 2.9, head: 5 }), p.arrow(3.75, 20.25, 10, 14, { w: 2.9, head: 5 })],
  ],
  'minus-circle': (icon, p) => [
    ['blush', p.circle(12, 12, 9.75)],
    ['ink', p.seg2(7.5, 12, 16.5, 12, 2.4)],
  ],
  minus: (icon, p) => [
    ['blush', p.seg2(4.25, 12, 19.75, 12, 3.4)],
  ],
  // lavender bezel and stand, a sky screen well
  monitor: (icon, p) => [
    ['lavender', p.unite(p.rr(1.75, 3, 22.25, 16.75, 3), p.rr(10.5, 16, 13.5, 20, 0)), p.pill(7, 19.25, 17, 21.75)],
    ['sky.well', p.rr(4, 5.25, 20, 14.5, 1.5)],
  ],
  // a lavender crescent with a butter sparkle in its bite
  moon: (icon, p) => [
    ['lavender', p.cut(p.circle(11, 12.75, 9), p.circle(16.75, 8.25, 7.25))],
    ['butter@deco', p.sparkle(18.5, 6.5, 2.5)],
  ],
  'more-horizontal': (icon, p) => [
    // solid dots: a flat disc with its own shade laid over it (no hollow-ring read)
    ['lavender.flat', p.circle(5.5, 12, 2), p.circle(12, 12, 2), p.circle(18.5, 12, 2)],
    ['shade.lavender', p.circle(5.5, 12, 2), p.circle(12, 12, 2), p.circle(18.5, 12, 2)],
  ],
  'more-vertical': (icon, p) => [
    ['lavender.flat', p.circle(12, 5.5, 2), p.circle(12, 12, 2), p.circle(12, 18.5, 2)],
    ['shade.lavender', p.circle(12, 5.5, 2), p.circle(12, 12, 2), p.circle(12, 18.5, 2)],
  ],
  // a peach tank, seat and fork; lavender wheels with hubs (A)
  motorcycle: (icon, p) => [
    ['peach@K', p.poly([[3.25, 10.25], [9.75, 10.25], [12, 8.75], [16, 8.75], [16.75, 10.75], [13.75, 16], [9.5, 16]], [1.5, 1, 1.4, 1.25, 1, 1.25, 1.5])],
    ['peach.flat@K', p.seg2(18.5, 16.75, 15.75, 7, 2.25), p.seg2(13.75, 6.25, 17.5, 6.25, 2.25)],
    ['lavender@A', p.ring(5.5, 16.75, 4.25, 1.9), p.ring(18.5, 16.75, 4.25, 1.9)],
    ['lavender.flat@A', p.circle(5.5, 16.75, 1.35), p.circle(18.5, 16.75, 1.35)],
  ],
  // a sky peak behind a mint peak with a paper snow cap
  mountain: (icon, p) => {
    const big = p.poly([[1.75, 20.75], [9.5, 5], [17.75, 20.75]], [1.5, 1.6, 1.5])
    return [
      ['sky', p.poly([[10.5, 20.75], [16.25, 10.5], [22.25, 20.75]], [1.5, 1.5, 1.5])],
      ['mint', big],
      ['paper.flat', p.clip(big, p.path('M0 0 H24 V10.25 H13 L11.5 12 L9.5 10 L7.5 12 L6 10.25 H0 Z'))],
    ]
  },
  // sky mouse, a lavender scroll wheel (A)
  mouse: (icon, p) => [
    ['sky', p.rr(5.25, 2.25, 18.75, 21.75, 6.75)],
    ['ink', p.seg2(12, 2.75, 12, 12.25, 1.35)],
    ['cut', p.pill(9.85, 5, 14.15, 11.5)],
    ['lavender.flat@A', p.pill(10.6, 5.75, 13.4, 10.75)],
  ],
  // four lavender arrows with a butter hub
  move: (icon, p) => [
    ['lavender', p.arrow(12, 12, 12, 2.75, { w: 2.75, head: 3.6 }), p.arrow(12, 12, 12, 21.25, { w: 2.75, head: 3.6 }), p.arrow(12, 12, 2.75, 12, { w: 2.75, head: 3.6 }), p.arrow(12, 12, 21.25, 12, { w: 2.75, head: 3.6 })],
    ['butter.flat', p.circle(12, 12, 2.3)],
  ],
  // an origami pointer folded along its spine: sky wing, lavender wing
  navigation: (icon, p) => {
    const N = p.poly([[0.75, 10.5], [23, 1], [13.5, 23.25], [11.2, 12.8]], [0.9, 0.9, 0.9, 1])
    return [
      ['sky', N],
      ['lavender', p.clip(N, p.poly([[23.5, 0.5], [26, 26], [11.2, 12.8]], 0))],
    ]
  },
  // lavender root box and connectors, three sky leaves
  network: (icon, p) => [
    ['lavender@K', p.seg2(12, 7, 12, 16, 2.1), p.bar([[5.25, 16], [5.25, 12], [18.75, 12], [18.75, 16]], 2.1), p.rr(8.75, 2.25, 15.25, 8.25, 1.9)],
    ['sky', p.rr(2.25, 15.5, 8.25, 21.5, 1.9), p.rr(9, 15.5, 15, 21.5, 1.9), p.rr(15.75, 15.5, 21.75, 21.5, 1.9)],
  ],
  // a lavender front page over a peach back flap, butter photo block, ink lines
  newspaper: (icon, p) => [
    ['peach', p.rr(2, 7.25, 7, 20.75, [1.4, 0, 0, 2.6])],
    ['lavender', p.rr(5.25, 3.25, 22, 20.75, 2.75)],
    ['butter.flat', p.rr(8.5, 6.5, 18.75, 10.75, 1.1)],
    ['ink', p.lines(8.75, [18.5, 15.5], [14, 17.5])],
  ],
  // lavender cover, peach spiral rings (A), a paper label with an ink line
  notebook: (icon, p) => [
    ['lavender', p.rr(5, 2.25, 20.25, 21.75, [2, 3.25, 3.25, 2])],
    ['paper.flat', p.rr(10, 5.75, 17.5, 9.75, 1.25)],
    ['ink', p.seg2(11.75, 7.75, 15.75, 7.75, 1.35)],
    ['peach.flat@A', p.pill(2.75, 5.75, 7.75, 7.75), p.pill(2.75, 10.25, 7.75, 12.25), p.pill(2.75, 14.75, 7.75, 16.75)],
  ],
}
