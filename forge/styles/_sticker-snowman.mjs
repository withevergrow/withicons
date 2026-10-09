// STICKER hand-drawn snowman (forge/icons/snowman.json stays the base; this replaces only Sticker's drawing).
// A die-cut vinyl snowman: icy snowballs in thick printed ink, a dapper ink top hat with a bubblegum band and a
// mint holly sprig, a mint scarf with paper-white stripes, tangerine carrot nose, bubblegum mittens on twig arms,
// a puffy white paper border with a hairline, a soft offset shadow, a gloss dash + dot and two sparkles.
// Candy slots in order of first appearance: body sky (c1), hat band bubblegum (c2), scarf mint (c3), nose peach (c4).
const f = v => +v.toFixed(2)
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const spark = (x, y, r) => `M${f(x)} ${f(y - r)}Q${f(x + r * 0.25)} ${f(y - r * 0.25)} ${f(x + r)} ${f(y)}Q${f(x + r * 0.25)} ${f(y + r * 0.25)} ${f(x)} ${f(y + r)}Q${f(x - r * 0.25)} ${f(y + r * 0.25)} ${f(x - r)} ${f(y)}Q${f(x - r * 0.25)} ${f(y - r * 0.25)} ${f(x)} ${f(y - r)}Z`

const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const BODY = 'var(--with-sticker-sky, #E6F5FF)'
const BAND = 'var(--with-sticker-bubblegum, #FF6FB5)'
const SCARF = 'var(--with-sticker-mint, #3FDDA4)'
const NOSE = 'var(--with-sticker-peach, #FF9563)'
const LEMON = 'var(--with-sticker-lemon, #FFD43B)'

// art geometry (24 grid)
const hatD = (x = 0, y = 0) => `M${f(9.4 + x)} ${f(7.6 + y)}V${f(2.5 + y)}H${f(14.6 + x)}V${f(7.6 + y)}Z`
const brimD = (x = 0, y = 0) => `M${f(7.6 + x)} ${f(6.9 + y)}H${f(16.4 + x)}V${f(8.4 + y)}H${f(7.6 + x)}Z`
const BODY_D = disc(12, 16.5, 4.9)
const HEAD_D = disc(12, 10.1, 3.55)
const HAT_D = hatD(), BRIM_D = brimD()
const ARMS_D = 'M7.4 15.2L4.4 12.8M16.6 15.2L19.6 12.8'
const MITT_D = disc(3.9, 12.3, 1.25) + disc(20.1, 12.3, 1.25)
const SCARF_D = 'M8.6 12.6Q12 14.3 15.4 12.6L15.8 14.2Q12 16.2 8.2 14.2Z' + 'M13.2 14.8L15.3 14.4L15.9 18L13.8 18.3Z'
// the die-cut silhouette: every art piece, outlined fat
const cutD = (x = 0, y = 0) => disc(12 + x, 16.5 + y, 4.9) + disc(12 + x, 10.1 + y, 3.55) + hatD(x, y) + brimD(x, y) +
  disc(3.9 + x, 12.3 + y, 1.25) + disc(20.1 + x, 12.3 + y, 1.25) + `M${f(7.4 + x)} ${f(15.2 + y)}L${f(4.4 + x)} ${f(12.8 + y)}M${f(16.6 + x)} ${f(15.2 + y)}L${f(19.6 + x)} ${f(12.8 + y)}`
const CUT_D = cutD()

export function stickerSnowman() {
  const ink = (d, w, extra = {}) => ['path', { d, fill: 'none', stroke: INK, 'stroke-width': w, ...extra }]
  return [
    // soft offset shadow, the paper hairline, the paper
    ['path', { d: cutD(0.45, 0.75), fill: SHADOW, stroke: SHADOW, 'stroke-width': 4.3, opacity: 0.2, class: 'wm-shadow' }],
    ['path', { d: CUT_D, fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 4.6, opacity: 0.3 }],
    ['path', { d: CUT_D, fill: EDGE, stroke: EDGE, 'stroke-width': 4 }],
    // twig arms and mittens
    ink(ARMS_D, 1.3, { class: 'wm-a' }),
    // snowballs
    ['path', { d: BODY_D, fill: BODY, stroke: INK, 'stroke-width': 1.25 }],
    ['path', { d: HEAD_D, fill: BODY, stroke: INK, 'stroke-width': 1.25 }],
    // top hat: ink crown and brim, bubblegum band, holly sprig
    ['path', { d: HAT_D + BRIM_D, fill: INK, stroke: INK, 'stroke-width': 1, class: 'wm-a' }],
    ['path', { d: 'M9.4 5.4H14.6V6.9H9.4Z', fill: BAND, class: 'wm-a' }],
    ['path', { d: MITT_D, fill: BAND, stroke: INK, 'stroke-width': 0.95, class: 'wm-a' }],
    // scarf with paper-white stripes
    ['path', { d: SCARF_D, fill: SCARF, stroke: INK, 'stroke-width': 0.95, class: 'wm-a' }],
    ['path', { d: 'M10.6 13.5L10.4 15.1M13.4 16.1L15.5 15.75', fill: 'none', stroke: EDGE, 'stroke-width': 0.7, class: 'wm-a' }],
    // holly: two mint leaves and a bubblegum berry on the hat band
    ['path', { d: 'M13.1 6.2Q14.3 4.9 15.6 5.5Q14.5 6.8 13.1 6.2ZM13.1 6.2Q12.6 4.6 13.4 3.6Q14.1 5 13.1 6.2Z', fill: SCARF, stroke: INK, 'stroke-width': 0.45, class: 'wm-a' }],
    ['path', { d: disc(12.95, 6.25, 0.55), fill: BAND, stroke: INK, 'stroke-width': 0.45, class: 'wm-a' }],
    // face: ink eyes, carrot nose, smile
    ['path', { d: disc(10.65, 9.75, 0.55) + disc(13.35, 9.75, 0.55), fill: INK }],
    ['path', { d: 'M11.85 10.5L15.5 11.3L11.85 11.95Z', fill: NOSE, stroke: INK, 'stroke-width': 0.55, 'stroke-linejoin': 'round' }],
    ink('M10.9 12.25Q12 12.9 13.1 12.25', 0.6),
    // two ink buttons
    ['path', { d: disc(11.3, 17.2, 0.6) + disc(11.3, 19.3, 0.6), fill: INK }],
    // gloss dash + dot
    ['path', { d: 'M8.6 15.1Q8.9 14 9.9 13.4M8.7 9.4Q9 8.6 9.6 8.3', fill: 'none', stroke: SHINE, 'stroke-width': 0.9, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: disc(8.4, 16.5, 0.4), fill: SHINE, 'fill-opacity': 0.92, class: 'wm-shine' }],
    // sparkles in the free corners
    ['path', { d: spark(20.6, 3.6, 1.5) + spark(3.4, 20.6, 1.05), fill: LEMON, class: 'wm-deco' }],
  ]
}
