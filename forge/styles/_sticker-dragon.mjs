// STICKER hand-drawn dragon head (forge/icons/dragon-head.json stays the base; this replaces only Sticker's drawing).
// A die-cut vinyl Lunar New Year dragon, front view: two tall branching gold antlers, a red head that narrows into
// a long snout with a big bulbous nose and two nostrils, cream fur tufts at the cheeks, angry cream brows over bright
// eyes, an orange pearl on the forehead, an open mouth with a row of white teeth, long gold whiskers sweeping out
// level then curling, and a cream beard fringe. Puffy white paper border, offset shadow, gloss.
// G (the shared front-view geometry) is also used by the glass, kawaii and retro dragons.
const f = v => +v.toFixed(2)
export const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
export const oval = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`

export const G = {
  // antlers (stroke): trunk up and out, an inner tine and an outer tine
  antlers: 'M9.3 7.2C9 5.2 8.2 3.6 6.9 1.9M8.55 4.6L10.2 2.6M7.9 3.45L5.2 3.2' +
    'M14.7 7.2C15 5.2 15.8 3.6 17.1 1.9M15.45 4.6L13.8 2.6M16.1 3.45L18.8 3.2',
  // head: a wide brow narrowing into a long snout
  head: 'M12 5.7C16.1 5.7 18.5 7.6 18.5 10.5C18.5 12.3 17.2 13.3 16.5 14.4C16.1 15.2 16.6 16.2 16.6 17.4' +
    'C16.6 19.5 14.6 20.7 12 20.7C9.4 20.7 7.4 19.5 7.4 17.4C7.4 16.2 7.9 15.2 7.5 14.4C6.8 13.3 5.5 12.3 5.5 10.5' +
    'C5.5 7.6 7.9 5.7 12 5.7Z',
  // cream fur tufts at the cheeks
  tufts: 'M6.4 8.1C4.7 7 2.9 6.9 1.7 7.6C2.9 8.3 3.5 9.1 3.2 10C2.9 10.7 2.3 11.2 1.7 11.8C3.5 12.5 5.1 12.5 6.2 13Z M17.6 8.1C19.3 7 21.1 6.9 22.3 7.6C21.1 8.3 20.5 9.1 20.8 10C21.1 10.7 21.7 11.2 22.3 11.8C20.5 12.5 18.9 12.5 17.8 13Z',
  // angry brows (thick, slanted down to the middle)
  brows: 'M6.7 8.9L10.7 10.4L10.3 11.2L6.6 10.1Z M17.3 8.9L13.3 10.4L13.7 11.2L17.4 10.1Z',
  eyes: [[9.3, 11.9], [14.7, 11.9]],
  pearl: [12, 8.1, 1.15],
  // the bulbous nose across the snout
  nose: 'M8.9 15.7C8.9 14.3 10.2 13.8 12 13.8C13.8 13.8 15.1 14.3 15.1 15.7C15.1 16.8 14.1 17.1 13.3 16.6C12.8 16.3 12.3 16.3 12 16.8C11.7 16.3 11.2 16.3 10.7 16.6C9.9 17.1 8.9 16.8 8.9 15.7Z',
  nostrils: oval(10.6, 15.35, 0.5, 0.36) + oval(13.4, 15.35, 0.5, 0.36),
  // open mouth and a row of teeth
  mouth: 'M9 17.9H15Q14.6 19.7 12 19.7Q9.4 19.7 9 17.9Z',
  teeth: 'M9.6 17.9L10.25 19L10.9 17.9Z M11.35 17.9L12 19.2L12.65 17.9Z M13.1 17.9L13.75 19L14.4 17.9Z',
  // beard fringe under the jaw
  beard: 'M8.3 19.1L8.8 22.5L10.6 20.9L12 23.2L13.4 20.9L15.2 22.5L15.7 19.1Z',
  // whiskers: out level from the snout, then curling up at the tips (stroke)
  whiskers: 'M7.6 16.3C5.8 16.1 4.4 16.9 2.9 16.6C1.8 16.4 1.6 15 2.7 14.8' +
    'M16.4 16.3C18.2 16.1 19.6 16.9 21.1 16.6C22.2 16.4 22.4 15 21.3 14.8',
}

const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const RED = 'var(--with-sticker-bubblegum, #F0434F)'
const GOLD = 'var(--with-sticker-lemon, #FFC83B)'
const CREAM = 'var(--with-sticker-sky, #FFF4D6)'
const PEARL = 'var(--with-sticker-peach, #FF8A3D)'

const CUT_D = G.head + G.tufts + G.beard

export function stickerDragon() {
  const ink = (d, w, extra = {}) => ['path', { d, fill: 'none', stroke: INK, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }]
  const sil = (d, color, w, extra = {}) => ['path', { d, fill: color, stroke: color, 'stroke-width': w, 'stroke-linejoin': 'round', ...extra }]
  const lines = G.antlers + G.whiskers
  return [
    // hairline, paper (fill + fat strokes around the line parts)
    sil(CUT_D, 'currentColor', 4.5, { opacity: 0.3 }),
    ['path', { d: lines, fill: 'none', stroke: 'currentColor', 'stroke-width': 4.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.3 }],
    sil(CUT_D, EDGE, 3.9),
    ['path', { d: lines, fill: 'none', stroke: EDGE, 'stroke-width': 4.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }],
    // antlers and whiskers: gold cores with an ink casing
    ink(G.antlers, 2, { class: 'wm-a' }),
    ['path', { d: G.antlers, fill: 'none', stroke: GOLD, 'stroke-width': 1.05, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }],
    ink(G.whiskers, 1.7, { class: 'wm-a' }),
    ['path', { d: G.whiskers, fill: 'none', stroke: GOLD, 'stroke-width': 0.85, 'stroke-linecap': 'round', class: 'wm-a' }],
    // beard and tufts behind the head
    ['path', { d: G.beard + G.tufts, fill: CREAM, stroke: INK, 'stroke-width': 0.65, 'stroke-linejoin': 'round' }],
    // head
    ['path', { d: G.head, fill: RED, stroke: INK, 'stroke-width': 1, class: 'wm-k' }],
    // nose, nostrils
    ['path', { d: G.nose, fill: RED, stroke: INK, 'stroke-width': 0.6 }],
    ['path', { d: G.nostrils, fill: INK }],
    // mouth and teeth
    ['path', { d: G.mouth, fill: INK, stroke: INK, 'stroke-width': 0.4, 'stroke-linejoin': 'round' }],
    ['path', { d: G.teeth, fill: EDGE, class: 'wm-s' }],
    // eyes
    ['path', { d: disc(...G.eyes[0], 0.95) + disc(...G.eyes[1], 0.95), fill: EDGE, stroke: INK, 'stroke-width': 0.6 }],
    ['path', { d: disc(G.eyes[0][0] + 0.15, G.eyes[0][1] + 0.1, 0.5) + disc(G.eyes[1][0] - 0.15, G.eyes[1][1] + 0.1, 0.5), fill: INK }],
    // brows
    ['path', { d: G.brows, fill: CREAM, stroke: INK, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-a' }],
    // pearl
    ['path', { d: disc(...G.pearl), fill: PEARL, stroke: INK, 'stroke-width': 0.7, class: 'wm-s' }],
    // gloss
    ['path', { d: 'M7.3 9.2Q7.7 7.7 9.1 7M11.6 7.75Q11.75 7.45 12 7.4', fill: 'none', stroke: SHINE, 'stroke-width': 0.75, 'stroke-linecap': 'round', 'stroke-opacity': 0.9, class: 'wm-shine' }],
  ]
}
