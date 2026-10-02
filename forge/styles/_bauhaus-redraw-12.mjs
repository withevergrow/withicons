// BAUHAUS redraws, chunk 12: trending-down … zoom-out
// Run 12: every icon redrawn against BAUHAUS-GUIDE.md: rounded, few primitives, one
// construction idea each, family parts from the kit (person, arcArrow, head, slash).

// the user family: the exemplar person (red head over blue half-disc shoulders),
// scaled to leave the upper right free for its modifier
const who = (p, head = 'c1', body = 'c3') => p.person(8.75, 5.7, 0.85, head, body)
// a modifier badge for the user family: a yellow disc, its glyph in ink (shadow)
const mod = (p, kind, cx = 18.25, cy = 9.25, r = 4) => [['c2', p.circle(cx, cy, r)], ['ink', p.glyph(kind, cx, cy, r * 0.5, 1.9)]]
// speaker: a blue flared cone behind a red rounded box
const speaker = (p) => [['c3', p.poly([[4, 8.5], [7.75, 8.5], [12, 4.75], [12, 19.25], [7.75, 15.5], [4, 15.5]], [0, 0.9, 1.25, 1.25, 0.9, 0])], ['c1', p.rr(2.25, 8.25, 8.25, 15.75, 2)]]
// video camera: blue body, red lens flap
const cam = (p, body = 'c3') => [[body, p.rr(2, 5.5, 16, 18.5, 3)], ['c1', p.poly([[15, 10.5], [22, 6.75], [22, 17.25], [15, 13.5]], [0.9, 1.25, 1.25, 0.9])]]
// magnifier (the search exemplar): red handle, blue ring, yellow lens
const magnifier = (p) => [['c1', p.seg2(15.5, 15.5, 20.5, 20.5, 3.25)], ['c3', p.ring(10, 10, 7.5, 5)], ['c2', p.circle(10, 10, 5)]]
// wifi wave: a round-capped band of the circle around the dot
const wave = (p, r, role, w = 2.5) => [role, p.arc(12, 18.5, r, 222, 318, w)]
// the "-off" treatment: the object stays whole in silhouette but every piece the slash's
// page-coloured halo cuts is re-rounded, so no knife-edged shards remain; then the bar.
const SL = [3.25, 3.25, 20.75, 20.75]
const offed = (p, layers, L = SL) => layers.map(([role, ...ss]) => [role, ...ss.map(s => p.soften(p.cut(s, p.seg2(...L, 4.5)), 0.9, { min: 10 }))])
const offBar = (p, L = SL) => [['ink', p.seg2(...L, 2.5)]]
// a soft four-point sparkle (rounded tips, rounded waist)
const sparkle = (p, cx, cy, ro, k = 1.05) => { const R = ro * k; return p.path(`M${cx} ${cy - ro}A${R} ${R} 0 0 0 ${cx + ro} ${cy}A${R} ${R} 0 0 0 ${cx} ${cy + ro}A${R} ${R} 0 0 0 ${cx - ro} ${cy}A${R} ${R} 0 0 0 ${cx} ${cy - ro}Z`) }
// a short pencil on its 45-degree axis, tip at the lower left: yellow body, red cap,
// orange cone, ink point (the pencil family of chunk 9, scaled)
function pencil(p, cx, cy, len = 10, w = 3.75) {
  const r = s => p.rot(s, 45, cx, cy), x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - len / 2, y1 = cy + len / 2
  const cone = len * 0.28, capH = len * 0.2
  return [
    ['c2', r(p.rect(x0, y0 + capH, x1, y1 - cone))],
    ['c1', r(p.rr(x0, y0, x1, y0 + capH, [w / 2, w / 2, 0, 0]))],
    ['c4', r(p.poly([[x0, y1 - cone], [x1, y1 - cone], [cx, y1]], [0, 0, 0.9]))],
    ['ink', r(p.poly([[cx - w * 0.22, y1 - cone * 0.42], [cx + w * 0.22, y1 - cone * 0.42], [cx, y1]], 0.9))],
  ]
}

export const R = {
  // ink zigzag, red swept head; the last leg sinks into the head's notch
  'trending-down': (p) => [
    ['ink', p.bar([[2.75, 6.5], [8.5, 12.25], [12.5, 8.25], [17.5, 13.25]], 2.5)],
    ['c1', p.head(21.25, 17, 45, 6.75, 5.75)],
  ],
  'trending-up': (p) => [
    ['ink', p.bar([[2.75, 17.5], [8.5, 11.75], [12.5, 15.75], [17.5, 10.75]], 2.5)],
    ['c1', p.head(21.25, 7, -45, 6.75, 5.75)],
  ],
  // a soft yellow triangle with a red sun rising from its base
  triangle: ({ poly, half, clip }) => {
    const t = poly([[12, 2.75], [22, 20.5], [2, 20.5]], [2.5, 2.25, 2.25])
    return [['c2', t], ['c1', clip(half(12, 20.5, 5.75, 'n'), t)]]
  },
  // yellow cup (an arch turned down), blue handle loops tucked under it, ink stem, red foot
  trophy: ({ arch, arc, rr, seg2, circle }) => [
    ['c3', arc(7, 7.75, 2.75, 90, 270, 2.25), arc(17, 7.75, 2.75, -90, 90, 2.25)],
    ['ink', seg2(12, 13, 12, 17.5, 2.5)],
    ['c2', arch(6.75, 3, 17.25, 13.75, 's', 1.75)],
    ['c1', circle(12, 7.75, 1.9), rr(7.5, 17, 16.5, 21.25, 2)],
  ],
  // blue quarter-disc cab, red box, yellow quarter window, ink wheels with cream hubs
  truck: ({ rr, quarter, circle, soften }) => [
    ['c3', soften(quarter(13.5, 17, 8.25, 'ne'), 1.1)],
    ['c1', rr(2, 4.5, 14.5, 17, [2.75, 2.75, 0, 2.5])],
    ['c2', soften(quarter(15.25, 15.25, 3.75, 'ne'), 0.9)],
    ['cut', circle(6.75, 18.25, 3.5), circle(17.25, 18.25, 3.5)],
    ['ink', circle(6.75, 18.25, 2.5), circle(17.25, 18.25, 2.5)],
    ['tint', circle(6.75, 18.25, 0.9), circle(17.25, 18.25, 0.9)],
  ],
  // a red dome shell with a yellow inner dome (its plate), ink half-disc feet, blue head
  turtle: ({ circle, half, soften }) => [
    ['ink', soften(half(5.75, 16.25, 2.25, 's'), 0.9), soften(half(14.75, 16.25, 2.25, 's'), 0.9)],
    ['c3', circle(19.5, 13.5, 2.75)],
    ['c1', soften(half(10.25, 16.25, 8.25, 'n'), 1.1)],
    ['c2', soften(half(10.25, 16.25, 4.5, 'n'), 0.9)],
  ],
  // red cabinet, yellow screen with a blue sun rising, ink antennae
  tv: ({ rr, seg2, half, clip, circle }) => {
    const s = rr(4.75, 9.25, 19.25, 18.25, 1.75)
    return [
      ['ink', seg2(8, 2.75, 12, 6.75, 2.25), seg2(16, 2.75, 12, 6.75, 2.25)],
      ['c1', rr(2, 6.5, 22, 21, 3)],
      ['c2', s],
      ['c3', clip(half(12, 18.25, 4.75, 'n'), s)],
    ]
  },
  // a blue crossbar with drop serifs, ink stem, red foot
  type: ({ bar, seg2 }) => [
    ['ink', seg2(12, 4.5, 12, 19.5, 3)],
    ['c3', bar([[4.75, 7], [4.75, 4.25], [19.25, 4.25], [19.25, 7]], 2.75)],
    ['c1', seg2(8.25, 20, 15.75, 20, 2.75)],
  ],
  // scalloped canopy in three upright panels (red, yellow, red), ink J handle
  umbrella: (p) => {
    const k = 19 / 6, xs = [12 - 2 * k, 12, 12 + 2 * k]
    const canopy = p.soften(p.cut(p.half(12, 12.5, 9.5, 'n'), ...xs.map(x => p.circle(x, 12.5, k))), 1.1, { min: 8, tmax: 2.2 })
    const [[, left], [, rest]] = p.halves(canopy, 'c1', 'c2', 'v', 12 - k)
    const [[, mid], [, right]] = p.halves(rest, 'c2', 'c1', 'v', 12 + k)
    return [['ink', p.stroke('M12 10.5 V18.75 A2 2 0 0 1 8 18.75', 2.25)], ['c1', left, right], ['c2', mid]]
  },
  underline: ({ arc, seg2 }) => [
    ['ink', seg2(6.5, 4, 6.5, 10, 2.75), seg2(17.5, 4, 17.5, 10, 2.75), arc(12, 10, 5.5, 0, 180, 2.75)],
    ['c1', seg2(4.5, 20.25, 19.5, 20.25, 2.75)],
  ],
  // ink U-turn (one round-capped run), red swept head; the top leg sinks into its notch
  undo: ({ arcEnds, seg2, head, join }) => [
    ['ink', join(arcEnds(14.75, 15, 5.5, 270, 450, 2.5, 'flat', 'flat'), seg2(14.75, 20.5, 9.5, 20.5, 2.5), seg2(14.75, 9.5, 8.5, 9.5, 2.5))],
    ['c1', head(3, 9.5, 180, 6.5, 5.5)],
  ],
  // two link rings pulled apart, blue and red, two ink break marks in the gap
  unlink: ({ rot, pill, cut, seg2 }) => {
    const r = (cx, cy) => rot(cut(pill(cx - 5.75, cy - 3.5, cx + 5.75, cy + 3.5), pill(cx - 3.25, cy - 1.15, cx + 3.25, cy + 1.15)), -45, cx, cy)
    return [['c3', r(6.75, 17.25)], ['c1', r(17.25, 6.75)], ['ink', seg2(6.75, 6.75, 8.75, 8.75, 2.25), seg2(15.25, 15.25, 17.25, 17.25, 2.25)]]
  },
  // the lock exemplar opened: ink shackle swung up, body split yellow over red, ink keyhole
  unlock: ({ arc, seg2, rr, circle, pill, halves }) => [
    ['ink', arc(12, 7.25, 4.5, 180, 335, 2.5), seg2(7.5, 7.25, 7.5, 11.5, 2.5)],
    ...halves(rr(4, 10.5, 20, 21.5, 3), 'c2', 'c1', 'h', 16.5),
    ['ink', circle(12, 15, 1.75), pill(11.1, 15, 12.9, 18.75)],
  ],
  // blue tray, ink shaft sunk into the notch of a red swept head
  upload: ({ rr, seg2, head }) => [
    ['c3', rr(3, 14.5, 21, 21.5, [1.25, 1.25, 5, 5])],
    ['ink', seg2(12, 12.5, 12, 8, 2.5)],
    ['c1', head(12, 2.5, 270, 6.75, 6)],
  ],
  // the trident: ink stem and branches, red tip, yellow disc, red square, blue base disc
  usb: ({ seg2, circle, rr, bar, poly }) => [
    ['ink', seg2(12, 6, 12, 17, 2.25), bar([[5.75, 10.5], [5.75, 12], [12, 15.25]], 2), bar([[18.25, 10.5], [18.25, 11.75], [12, 13.75]], 2)],
    ['c1', poly([[12, 1.75], [15.5, 7], [8.5, 7]], [1, 0.9, 0.9]), rr(16, 7, 20.5, 11.5, 1.25)],
    ['c2', circle(5.75, 9.25, 2.25)],
    ['c3', circle(12, 19.25, 2.75)],
  ],
  'user-check': (p) => [...who(p), ...mod(p, 'check')],
  // blue disc, red head, yellow shoulders clipped to the disc
  'user-circle': ({ circle, half, clip }) => {
    const d = circle(12, 12, 9.75)
    return [['c3', d], ['c1', circle(12, 9.25, 3.5)], ['c2', clip(half(12, 22.25, 7.25, 'n'), d)]]
  },
  // a yellow gear (the settings exemplar, small) cut into the shoulders
  'user-cog': (p) => [...who(p), ['cut', p.circle(17.25, 16.5, 6)], ['c2', p.around(p.pill(16.25, 10.75, 18.25, 14), 6, 17.25, 16.5), p.circle(17.25, 16.5, 3.5)], ['ink', p.circle(17.25, 16.5, 1.4)]],
  'user-minus': (p) => [...who(p), ...mod(p, 'minus')],
  'user-pen': (p) => [...who(p), ['cut', p.rot(p.pill(14.75, 10, 20.75, 25), 45, 17.25, 16.75)], ...pencil(p, 17.25, 16.75, 10, 3.5)],
  'user-plus': (p) => [...who(p), ...mod(p, 'plus')],
  // the search exemplar, small: blue ring, yellow lens, red handle, cut into the shoulders
  'user-search': (p) => [...who(p), ['cut', p.circle(16.5, 15.75, 5.5), p.seg2(18.75, 18, 21, 20.25, 4.5)], ['c1', p.seg2(18.75, 18, 21, 20.25, 2.5)], ['c3', p.ring(16.5, 15.75, 4.25, 2.5)], ['c2', p.circle(16.5, 15.75, 2.5)]],
  'user-x': (p) => [...who(p), ...mod(p, 'x')],
  // the exemplar person in front, a yellow companion behind, cleared by a moat
  users: ({ half, circle, soften, cut }) => [
    ['c2', ...[half(16.5, 21, 5.75, 'n'), circle(16, 7.5, 3.25)].map(s => soften(cut(s, half(9, 21, 8, 'n'), circle(9, 8.5, 4.75)), 1, { min: 10 }))],
    ['c3', soften(half(9, 21, 6.75, 'n'), 1)],
    ['c1', circle(9, 8.5, 3.5)],
  ],
  // blue fork (three pill tines over a bowl), red blade, ink handles
  utensils: ({ path, pill, half, seg2 }) => [
    ['ink', seg2(7.5, 9, 7.5, 21.25, 2.5), seg2(18, 13.5, 18, 21.25, 2.5)],
    ['c3', half(7.5, 6.75, 4.25, 's'), pill(3.25, 2.25, 5.25, 7.5), pill(6.5, 2.25, 8.5, 7.5), pill(9.75, 2.25, 11.75, 7.5)],
    ['c1', path('M20.5 2.5 V15 H15.25 V10.25 C15.25 6.25 17.25 3.5 20.5 2.5 Z')],
  ],
  'video-call': (p) => [...cam(p), ['c2', p.circle(9, 10.25, 2.25), p.clip(p.half(9, 18.5, 4, 'n'), p.rr(2, 5.5, 16, 18.5, 3))]],
  'video-camera': (p) => [...cam(p), ['c2', p.circle(6.5, 9.5, 1.5)]],
  // the slash runs just clear of the lens flap, so only the body is parted
  'video-off': (p) => { const L = [2.5, 4.5, 19.25, 21.25]; return [...offed(p, cam(p), L), ...offBar(p, L)] },
  // three swirled panels meeting at the centre (yellow, blue, red), each opened by one
  // page-coloured seam that runs from the rim to the next panel
  volleyball: ({ path, arc, cut, soften }) => {
    const soft = s => soften(s, 0.9)
    const seam = (cx, cy, a0, a1) => arc(cx, cy, 13.5, a0, a1, 1.1)
    return [
      ['c2', soft(cut(path('M12 12 A9.5 9.5 0 0 0 20.23 7.25 A9.5 9.5 0 0 1 12 21.5 A9.5 9.5 0 0 1 12 12 Z'), seam(12, 2.5, 38, 102)))],
      ['c3', soft(cut(path('M12 12 A9.5 9.5 0 0 0 12 21.5 A9.5 9.5 0 0 1 3.77 7.25 A9.5 9.5 0 0 1 12 12 Z'), seam(20.23, 16.75, 158, 222)))],
      ['c1', soft(cut(path('M12 12 A9.5 9.5 0 0 0 3.77 7.25 A9.5 9.5 0 0 1 20.23 7.25 A9.5 9.5 0 0 1 12 12 Z'), seam(3.77, 16.75, -82, -18)))],
    ]
  },
  volume: (p) => [...speaker(p), ['c3', p.arc(13.25, 12, 3.5, -48, 48, 2.5)], ['ink', p.arc(13.25, 12, 7.75, -48, 48, 2.5)]],
  'volume-1': (p) => [...speaker(p), ['c3', p.arc(13.25, 12, 3.75, -48, 48, 2.5)]],
  'volume-off': (p) => [...speaker(p), ['ink', p.glyph('x', 18.25, 12, 3.25, 2.5)]],
  // red card tilted out of a blue wallet, yellow half-disc clasp with an ink stud
  wallet: ({ rr, half, circle, rot }) => [
    ['c1', rot(rr(4, 3, 17, 9.5, 2), -8, 4, 9.5)],
    ['c3', rr(3, 7.5, 21, 20.5, 3)],
    ['c2', half(21, 14, 3.75, 'w')],
    ['ink', circle(19, 14, 1.15)],
  ],
  // ink wand with a red tip, a yellow and a blue soft sparkle
  wand: (p) => {
    const stick = p.seg2(4.5, 19.5, 13.25, 10.75, 3)
    const [[, tip], [, rod]] = p.split(stick, 'c1', 'ink', 10.75, 13.25, 45)
    return [['ink', rod], ['c1', tip], ['c2', sparkle(p, 17.5, 6.5, 4)], ['c3', sparkle(p, 9.75, 4.75, 2.75)]]
  },
  // blue hangar arch, yellow door with ink slats
  warehouse: ({ arch, rr, pill }) => [
    ['c3', arch(2.5, 3.5, 21.5, 21)],
    ['c2', rr(6.5, 12, 17.5, 21, [1.75, 1.75, 0, 0])],
    ['ink', pill(6.5, 14.75, 17.5, 16.5), pill(6.5, 18, 17.5, 19.75)],
  ],
  // blue cabinet, cream porthole, drum split red over yellow (it shows the spin)
  'washing-machine': (p) => [
    ['c3', p.rr(4, 2.5, 20, 21.5, 3)],
    ['tint', p.circle(12, 14, 5.25)],
    ...p.splitDisc(12, 14, 3.5, 'c1', 'c2', 'd'),
    ['c2', p.pill(6.25, 4.75, 8.75, 6.5)],
    ['c1', p.pill(10, 4.75, 12.5, 6.5)],
  ],
  // blue strap, red case, cream face, ink hands
  watch: ({ rr, circle, bar }) => [
    ['c3', rr(8.75, 2, 15.25, 22, 2.5)],
    ['c1', circle(12, 12, 7)],
    ['tint', circle(12, 12, 5)],
    ['ink', bar([[12, 9], [12, 12], [14, 13.25]], 1.9)],
  ],
  // blue eye on an ink neck, red half-disc foot, yellow lens with an ink pupil
  webcam: ({ circle, half, seg2, soften }) => [
    ['ink', seg2(12, 16, 12, 19.5, 2.5)],
    ['c1', soften(half(12, 21.5, 4.5, 'n'), 1)],
    ['c3', circle(12, 9.75, 7.5)],
    ['c2', circle(12, 9.75, 3.75)],
    ['ink', circle(12, 9.75, 1.5)],
  ],
  // three nodes on one ring, each arc in the colour of the node it leaves
  webhook: ({ arc, circle }) => [
    ['c1', arc(12, 12.5, 7, 270, 390, 2.5)],
    ['c3', arc(12, 12.5, 7, 30, 150, 2.5)],
    ['c2', arc(12, 12.5, 7, 150, 270, 2.5)],
    ['c1', circle(12, 5.5, 3)],
    ['c3', circle(18.06, 16, 3)],
    ['c2', circle(5.94, 16, 3)],
    ['ink', circle(12, 5.5, 1.1), circle(18.06, 16, 1.1), circle(5.94, 16, 1.1)],
  ],
  wifi: (p) => [['c1', p.circle(12, 18.5, 2)], wave(p, 4.75, 'c2'), wave(p, 8.75, 'c3'), wave(p, 12.75, 'ink')],
  'wifi-off': (p) => [...offed(p, [['c1', p.circle(12, 18.5, 2)], wave(p, 4.75, 'c2'), wave(p, 8.75, 'c3'), wave(p, 12.75, 'ink')]), ...offBar(p)],
  wind: ({ stroke }) => [
    ['c3', stroke('M3 12 H18 A3 3 0 1 0 15.4 7.5', 2.5)],
    ['ink', stroke('M3 8 H9 A2.75 2.75 0 1 0 6.62 3.87', 2.25)],
    ['c1', stroke('M3 16 H13.5 A2.75 2.75 0 1 1 11.12 20.13', 2.25)],
  ],
  // the bowl (an arch turned down) split yellow glass over red wine, ink stem and foot
  wine: ({ arch, seg2, pill, halves }) => [
    ['ink', seg2(12, 13, 12, 20.5, 2.5), pill(7.5, 19.75, 16.5, 22)],
    ...halves(arch(6, 2.5, 18, 14.25, 's', 1.5), 'c2', 'c1', 'h', 7.25),
  ],
  // ink lines, the blue middle line wraps round a half turn into a red swept head
  'wrap-text': ({ seg2, arcEnds, join, head }) => [
    ['ink', seg2(3.25, 5, 20.75, 5, 2.5), seg2(3.25, 19, 7.5, 19, 2.5)],
    ['c3', join(seg2(3.25, 12, 17.25, 12, 2.5), arcEnds(17.25, 15.5, 3.5, 270, 450, 2.5, 'flat', 'flat'), seg2(17.25, 19, 14, 19, 2.5))],
    ['c1', head(10, 19, 180, 5.5, 4.75)],
  ],
  // blue handle, red head disc with its jaw cut open, cream hanging hole
  wrench: ({ circle, seg2, cut }) => [
    ['c3', seg2(5.25, 18.75, 13, 11, 3.75)],
    ['c1', cut(circle(15.75, 8.25, 5.5), seg2(16.25, 7.75, 23, 1, 3.25))],
    ['tint', circle(5.25, 18.75, 0.9)],
  ],
  'x-circle': (p) => [...p.disc('c1'), ['tint', p.glyph('x', 12, 12, 5, 2.75)]],
  // the bolt split across its step: yellow over red
  zap: ({ poly, split }) => split(poly([[13.5, 2], [4, 14], [11, 14], [10.5, 22], [20, 10], [13, 10]], [1.25, 1.25, 0.9, 1.25, 1.25, 0.9]), 'c2', 'c1', 12, 12, -14),
  'zoom-in': (p) => [...magnifier(p), ['ink', p.glyph('plus', 10, 10, 2.75, 2.25)]],
  'zoom-out': (p) => [...magnifier(p), ['ink', p.glyph('minus', 10, 10, 2.75, 2.25)]],
}
