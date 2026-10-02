// BAUHAUS redraws, chunk 10: rainbow … sliders
// Run 10: every icon recomposed against BAUHAUS-GUIDE.md. Bent arrow shafts are one
// continuous stroke() (no overlapping caps at the bends) sunk into the kit's swept head;
// the shield is a softly domed outline split down its axis.

// shield: domed top edges, every corner softened; a = left field, b = right field
const SHIELD = 'M12 2.5 C14.4 3.85 16.9 4.75 19.5 5.25 V12 C19.5 16.5 16.5 19.8 12 21.5 C7.5 19.8 4.5 16.5 4.5 12 V5.25 C7.1 4.75 9.6 3.85 12 2.5 Z'
const shieldShape = p => p.soften(p.path(SHIELD), 1.4, { tmax: 2.4 })
const shield = (p, a = 'c3', b = 'c1') => a === b ? [[a, shieldShape(p)]] : p.split(shieldShape(p), b, a, 12, 12, 90)
// shopping cart: ink handle-and-frame run, red basket, ink wheels
const cart = (p) => [
  ['ink', p.stroke('M2.5 3.5 H3.75 Q4.5 3.5 4.7 4.25 L6.75 13.25 Q6.95 14.25 8 14.25 H17.5', 2.25), p.circle(8.5, 19.5, 1.9), p.circle(17, 19.5, 1.9)],
  ['c1', p.poly([[5, 6.5], [21, 6.5], [18.5, 13.75], [6.75, 13.75]], [1.25, 1.5, 2, 1.5])],
]
// one server unit: a rounded slab, a status light, a cream slot
const rack = (p, y0, role, light) => [[role, p.rr(3, y0, 21, y0 + 7.5, 2.75)], [light, p.circle(7, y0 + 3.75, 1.35)], ['tint', p.pill(10.5, y0 + 2.85, 17.75, y0 + 4.65)]]
const TRI = [2.75, 2.25, 2.75] // play-family triangle rounding (tip in the middle)

export const R = {
  // three concentric bands standing on one base line: red, yellow, a blue half-disc core
  rainbow: ({ arc, half, soften }) => [
    ['c1', arc(12, 17.5, 9, 180, 360, 2.5)],
    ['c2', arc(12, 17.5, 5.5, 180, 360, 2.5)],
    ['c3', soften(half(12, 17.5, 3.5, 'n'), 1)],
  ],
  // yellow slip with two bites torn out of its foot, ink lines, a red total
  receipt: ({ rr, cut, circle, seg2 }) => [
    ['c2', cut(rr(4.5, 2.5, 19.5, 21.5, [2.5, 2.5, 1, 1]), circle(8.5, 21.6, 2.4), circle(15.5, 21.6, 2.4))],
    ['ink', seg2(8.5, 7.5, 15.5, 7.5, 2), seg2(8.5, 11.5, 15.5, 11.5, 2)],
    ['c1', seg2(8.5, 15.5, 12.5, 15.5, 2)],
  ],
  // one ink U-turn run sunk into a red swept head
  redo: ({ stroke, head }) => [['ink', stroke('M16 9.5 H9.25 A5.5 5.5 0 0 0 9.25 20.5 H14.5', 2.5)], ['c1', head(21, 9.5, 0, 6.5, 6.25)]],
  // (refresh is an art-director exemplar in _bauhaus-render.mjs; this entry is shadowed)
  refresh: (p) => [...p.arcArrow(12, 12, 8, 190, 335, { role: 'c3', tip: 'c3', len: 6, half: 4.5 }), ...p.arcArrow(12, 12, 8, 10, 155, { role: 'c1', tip: 'c1', len: 6, half: 4.5 })],
  // cabinet split at the freezer line: red top, blue bottom, cream handles
  refrigerator: ({ rr, halves, pill }) => [...halves(rr(5, 2.5, 19, 21.5, 3), 'c1', 'c3', 'h', 9.5), ['tint', pill(7.75, 4.75, 9.75, 7.25), pill(7.75, 12, 9.75, 17)]],
  // blue T bar on an ink stem, a red x badge in the corner
  'remove-formatting': ({ stroke, seg2, badge }) => [
    ['c3', stroke('M3.75 7 V5.5 Q3.75 4 5.25 4 H14.75 Q16.25 4 16.25 5.5 V7', 2.75), seg2(10, 4.5, 10, 19.75, 2.75)],
    ...badge('x', 'c1', 17.5, 17.5, 4.25),
  ],
  // two bent runs, blue up top and red below, each sunk into its own head
  repeat: ({ stroke, head }) => [
    ['c3', stroke('M4 11.5 V10 A3.5 3.5 0 0 1 7.5 6.5 H16', 2.5)],
    ['c1', stroke('M20 12.5 V14 A3.5 3.5 0 0 1 16.5 17.5 H8', 2.5)],
    ['c3', head(21, 6.5, 0, 5.75, 5)], ['c1', head(3, 17.5, 180, 5.75, 5)],
  ],
  'repeat-1': ({ stroke, head, bar }) => [
    ['c3', stroke('M4 11 V9 A3.5 3.5 0 0 1 7.5 5.5 H16', 2.5)],
    ['c1', stroke('M20 13 V15 A3.5 3.5 0 0 1 16.5 18.5 H8', 2.5)],
    ['c3', head(21, 5.5, 0, 5.75, 5)], ['c1', head(3, 18.5, 180, 5.75, 5)],
    ['ink', bar([[10.6, 10.75], [12.4, 9.75], [12.4, 14.25]], 2)],
  ],
  reply: ({ stroke, head }) => [['ink', stroke('M9.5 9.5 H13 A7 7 0 0 1 20 16.5 V19.75', 2.5)], ['c1', head(3, 9.5, 180, 6.5, 6.25)]],
  'reply-all': ({ stroke, head }) => [
    ['ink', stroke('M13.25 9.5 H13.5 A7 7 0 0 1 20.5 16.5 V19.75', 2.5)],
    ['c1', head(8, 9.5, 180, 6, 5.75)],
    ['c3', head(2, 9.5, 180, 4.75, 5.5)],
  ],
  // two play triangles running left: the leading one red
  rewind: ({ poly }) => [['c3', poly([[21.5, 5], [12, 12], [21.5, 19]], TRI)], ['c1', poly([[12, 5], [2.5, 12], [12, 19]], TRI)]],
  // blue band round a still yellow pivot, the red head riding the curve
  'rotate-ccw': (p) => [...p.arcArrow(12, 12.5, 8.25, 205, 505, { ccw: true, len: 6.25, half: 4.75, r: 1.1, rb: 1.1 }), ['c2', p.circle(12, 12.5, 2.25)]],
  'rotate-cw': (p) => [...p.arcArrow(12, 12.5, 8.25, 35, 335, { len: 6.25, half: 4.75, r: 1.1, rb: 1.1 }), ['c2', p.circle(12, 12.5, 2.25)]],
  route: ({ circle, stroke }) => [
    ['ink', stroke('M8 18.5 H15.25 A3.25 3.25 0 0 0 15.25 12 H8.75 A3.25 3.25 0 0 1 8.75 5.5 H16', 2.25)],
    ['c3', circle(5, 18.5, 3)],
    ['c1', circle(19, 5.5, 3)],
  ],
  router: ({ rr, seg2, circle, pill }) => [
    ['ink', seg2(6.5, 13.5, 5, 5.5, 2.25), seg2(17.5, 13.5, 19, 5.5, 2.25)],
    ['c3', rr(2, 12.5, 22, 20.5, 3)],
    ['c2', circle(6.25, 16.5, 1.35)],
    ['c1', circle(9.75, 16.5, 1.35)],
    ['tint', pill(13, 15.6, 18.5, 17.4)],
  ],
  rss: ({ circle, arc }) => [['c1', circle(5.5, 18.5, 2.5)], ['c2', arc(5.5, 18.5, 7.5, 270, 360, 2.75)], ['c3', arc(5.5, 18.5, 13.75, 270, 360, 2.75)]],
  // a soft slab split yellow | red across its length, ink ticks held inside it
  ruler: ({ rot, rr, pill, halves }) => {
    const r = s => rot(s, -45, 12, 12)
    return [...halves(rr(1.5, 7.5, 22.5, 16.5, 2.75), 'c2', 'c1', 'v', 12).map(([k, s]) => [k, r(s)]), ['ink', r(pill(5.25, 9.25, 7, 13.25)), r(pill(9.25, 9.25, 11, 11.75)), r(pill(13.25, 9.25, 15, 13.25)), r(pill(17.25, 9.25, 19, 11.75))]]
  },
  salad: ({ half, lens, circle, pill }) => [
    ['accent', lens(12.5, 12, 5.5, 4, 2.75)],
    ['c1', circle(17, 8, 2.75)],
    ['c3', half(12, 11.5, 9.5, 's')],
    ['c2', pill(2, 10.75, 22, 13.25)],
  ],
  // blue disk with its clipped corner, cream shutter, yellow label
  save: ({ poly, rr }) => [
    ['c3', poly([[3, 3], [16.25, 3], [21, 7.75], [21, 21], [3, 21]], [3, 1.5, 2, 3, 3])],
    ['tint', rr(7.5, 3, 14.5, 8.25, [0, 0, 1.75, 1.75])],
    ['c2', rr(6.5, 13.5, 17.5, 21, [2.25, 2.25, 0, 0])],
  ],
  scale: ({ seg2, half, pill, bar, soften }) => [
    ['ink', seg2(12, 3, 12, 20.5, 2.5), pill(6.5, 19.75, 17.5, 22), seg2(4.5, 6.5, 19.5, 6.5, 2.25), bar([[2.75, 13.5], [5, 6.5], [7.25, 13.5]], 1.75), bar([[16.75, 13.5], [19, 6.5], [21.25, 13.5]], 1.75)],
    ['c1', soften(half(5, 13.25, 3.75, 's'), 1)],
    ['c3', soften(half(19, 13.25, 3.75, 's'), 1)],
  ],
  // four blue rounded corner brackets round a yellow face
  'scan-face': ({ stroke, circle, arc }) => [
    ['c3', stroke('M3 7.5 V5.75 A2.75 2.75 0 0 1 5.75 3 H7.5', 2.5), stroke('M16.5 3 H18.25 A2.75 2.75 0 0 1 21 5.75 V7.5', 2.5), stroke('M21 16.5 V18.25 A2.75 2.75 0 0 1 18.25 21 H16.5', 2.5), stroke('M7.5 21 H5.75 A2.75 2.75 0 0 1 3 18.25 V16.5', 2.5)],
    ['c2', circle(12, 12, 6.5)],
    ['ink', circle(9.5, 10.5, 1.15), circle(14.5, 10.5, 1.15), arc(12, 12.5, 3, 30, 150, 1.75)],
  ],
  // blue wings, a yellow gabled hall, red arched door, red pennant on an ink pole
  school: ({ poly, rr, arch, seg2 }) => [
    ['ink', seg2(12, 2.5, 12, 8.5, 1.75)],
    ['c1', poly([[12.5, 2], [17, 3.75], [12.5, 5.5]], [0, 1, 0])],
    ['c3', rr(2.5, 14, 21.5, 21, [2.25, 2.25, 1.5, 1.5])],
    ['c2', poly([[6.75, 21], [6.75, 12], [12, 7.5], [17.25, 12], [17.25, 21]], [0, 1.25, 1.75, 1.25, 0])],
    ['c1', arch(10, 15.5, 14, 21)],
  ],
  // two ink blades crossing on a yellow pivot, red and blue finger rings
  scissors: ({ ring, seg2, circle }) => [['ink', seg2(8.4, 7.8, 20, 16.5, 2.5), seg2(8.4, 16.2, 20, 7.5, 2.5)], ['c2', circle(13.9, 12, 1.3)], ['c1', ring(6, 6, 3.75, 1.75)], ['c3', ring(6, 18, 3.75, 1.75)]],
  // yellow sheet between two red rolls, ink text lines
  'scroll-text': ({ rect, pill, seg2 }) => [
    ['c2', rect(6, 4.5, 18, 19.5)],
    ['c1', pill(3, 2.5, 21, 6.25), pill(3, 17.75, 21, 21.5)],
    ['ink', seg2(9, 10, 15, 10, 2), seg2(9, 14, 13, 14, 2)],
  ],
  send: ({ poly, clip }) => {
    const pl = poly([[21.5, 2.5], [2.5, 10], [10.5, 13.5], [14, 21.5]], [2, 1.75, 1, 1.75])
    return [['c3', pl], ['c1', clip(pl, poly([[21.5, 2.5], [10.5, 13.5], [24, 24]], 0))]]
  },
  server: (p) => [...rack(p, 2.5, 'c3', 'c2'), ...rack(p, 14, 'c1', 'c2')],
  share: ({ circle, seg2 }) => [['ink', seg2(6.5, 12, 17.5, 5.5, 2.25), seg2(6.5, 12, 17.5, 18.5, 2.25)], ['c1', circle(6.5, 12, 3.5)], ['c3', circle(17.5, 5.5, 3.5)], ['c2', circle(17.5, 18.5, 3.5)]],
  'share-2': ({ rr, seg2, head }) => [['c3', rr(4.5, 10, 19.5, 21, 3)], ['cut', rr(8.5, 7, 15.5, 13.5, 3.5)], ['ink', seg2(12, 16.5, 12, 7.5, 2.5)], ['c1', head(12, 2, 270, 6, 5.5)]],
  shield: (p) => shield(p),
  'shield-alert': (p) => [...shield(p, 'c1', 'c1'), ['tint', p.glyph('bang', 12, 10.75, 4.25, 2.5)]],
  'shield-check': (p) => [...shield(p, 'c3', 'c3'), ['tint', p.glyph('check', 12, 11.5, 4, 2.5)]],
  'shield-off': (p) => [...shield(p), ...p.slash()],
  'shield-user': (p) => [...shield(p, 'c3', 'c3'), ['c2', p.circle(12, 8.75, 2.75), p.clip(p.half(12, 18.5, 5.25, 'n'), shieldShape(p))]],
  ship: ({ poly, rr, stroke }) => [
    ['c1', rr(10, 3, 14, 8.5, [1.25, 1.25, 0, 0])],
    ['c2', rr(6.5, 7.5, 17.5, 12.5, [1.75, 1.75, 0, 0])],
    ['c3', poly([[2.5, 12], [21.5, 12], [18.75, 16.75], [5.25, 16.75]], [1, 1, 1.5, 1.5])],
    ['ink', stroke('M2.5 20.5 Q4.25 19 6 20.5 T9.5 20.5 T13 20.5 T16.5 20.5 T20 20.5', 2)],
  ],
  'shopping-bag': ({ poly, arc, circle }) => [
    ['ink', arc(12, 7.5, 3.5, 180, 360, 2.25)],
    ['c1', poly([[5, 7.5], [19, 7.5], [20, 21.5], [4, 21.5]], [1.5, 1.5, 2.25, 2.25])],
    ['c2', circle(8.5, 10.75, 1.25), circle(15.5, 10.75, 1.25)],
  ],
  'shopping-basket': ({ poly, arc, pill }) => [
    ['ink', arc(12, 10, 5.5, 180, 360, 2.25)],
    ['c2', poly([[4, 10], [20, 10], [18.5, 21], [5.5, 21]], [0, 0, 2.25, 2.25])],
    ['c1', pill(2, 8.5, 22, 11.5)],
    ['c1', pill(7.25, 13.75, 8.75, 18), pill(11.25, 13.75, 12.75, 18), pill(15.25, 13.75, 16.75, 18)],
  ],
  'shopping-cart': (p) => cart(p),
  'shopping-cart-plus': (p) => [...cart(p), ['tint', p.glyph('plus', 12.75, 10.1, 2.25, 1.75)]],
  shuffle: ({ stroke, head }) => [
    ['c3', stroke('M3 17.5 H5 C10.5 17.5 12 6.5 17.5 6.5 H17.75', 2.5)],
    ['c1', stroke('M3 6.5 H5 C10.5 6.5 12 17.5 17.5 17.5 H17.75', 2.5)],
    ['c3', head(22, 6.5, 0, 5.25, 4.75)], ['c1', head(22, 17.5, 0, 5.25, 4.75)],
  ],
  sidebar: ({ rr, half }) => [['c3', rr(3, 3, 21, 21, 3)], ['c1', rr(3, 3, 9.5, 21, [3, 0, 0, 3])], ['c2', half(9.5, 12, 3.5, 'e')]],
  // four rising round-ended columns in palette order: yellow, red, blue, ink
  signal: ({ pill }) => [['c2', pill(3, 14.5, 6.5, 20.5)], ['c1', pill(8, 10.5, 11.5, 20.5)], ['c3', pill(13, 6.5, 16.5, 20.5)], ['ink', pill(18, 2.5, 21.5, 20.5)]],
  signature: ({ stroke, seg2 }) => [['c3', stroke('M3 16.5 C6 15 10 11 10 7 C10 3.5 6 3.5 6 7 C6 10.5 7 16.5 9 16.5 C10.5 16.5 11 13 12.5 13 C14 13 14 16.5 15.5 16.5 C17 16.5 18 14 21 14', 2.25)], ['ink', seg2(3, 20.5, 21, 20.5, 2.25)]],
  signpost: ({ poly, pill, seg2 }) => [
    ['ink', seg2(12, 6, 12, 20.5, 2.5), pill(8.5, 19.75, 15.5, 22.25)],
    ['c1', poly([[5, 2.75], [17, 2.75], [20, 5.5], [17, 8.25], [5, 8.25]], [1.5, 1, 2, 1, 1.5])],
    ['c3', poly([[19, 11.75], [7, 11.75], [4, 14.5], [7, 17.25], [19, 17.25]], [1.5, 1, 2, 1, 1.5])],
  ],
  // red arched dome with a cream glint on a blue base, ink rays
  siren: ({ arch, rr, seg2, arc }) => [
    ['ink', seg2(12, 2.25, 12, 4.25, 2.25), seg2(4.5, 5.75, 6, 7.25, 2.25), seg2(19.5, 5.75, 18, 7.25, 2.25)],
    ['c1', arch(6.5, 7.5, 17.5, 18.5)],
    ['tint', arc(12, 13, 2.5, 180, 270, 1.75)],
    ['c3', rr(3.5, 17.5, 20.5, 21.5, 2)],
  ],
  'skip-back': ({ poly, pill }) => [['c1', poly([[20, 5], [8.5, 12], [20, 19]], TRI)], ['ink', pill(3.5, 4.5, 6.5, 19.5)]],
  'skip-forward': ({ poly, pill }) => [['c1', poly([[4, 5], [15.5, 12], [4, 19]], TRI)], ['ink', pill(17.5, 4.5, 20.5, 19.5)]],
  // three ink tracks, each with an upright capsule knob in its own primary
  sliders: ({ seg2, pill }) => [['ink', seg2(3.25, 6, 20.75, 6, 2), seg2(3.25, 12, 20.75, 12, 2), seg2(3.25, 18, 20.75, 18, 2)], ['c1', pill(14.4, 2.6, 17.6, 9.4)], ['c3', pill(6.4, 8.6, 9.6, 15.4)], ['c2', pill(11.4, 14.6, 14.6, 21.4)]],
}
