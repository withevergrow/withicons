// KAWAII hand-drawn snowman (forge/icons/snowman.json stays the base; this replaces only Kawaii's drawing).
// Line-art cute: two chubby snowballs on a little snow mound, a strawberry knit beanie with a lemon cuff and a
// snowy pompom, a mint scarf with a hanging end, twig arms waving three fingers, low wide-set dot eyes, pink blush,
// a round peach nose, a tiny smile, three peach buttons and a few falling snow dots.
// Slots in order of first appearance: body fill-5 (c1), beanie fill-1 (c2), scarf fill-4 (c3), nose fill-2 (c4);
// the cuff is the sparkle (accent), the blush --with-kawaii-blush, the face --with-kawaii-face.
const f = v => +v.toFixed(2)
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
const oval = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`

const BODY = 'var(--with-kawaii-fill-5, #F2F8FF)'
const HAT = 'var(--with-kawaii-fill-1, #FF6F8E)'
const SCARF = 'var(--with-kawaii-fill-4, #3CCFB4)'
const NOSE = 'var(--with-kawaii-fill-2, #FF9A66)'
const CUFF = 'var(--with-kawaii-sparkle, #FFD23A)'
const BLUSH = 'var(--with-kawaii-blush, #FF6F9C)'
const FACE = 'var(--with-kawaii-face, currentColor)'
const SHINE = 'var(--with-kawaii-shine, #FFFFFF)'

export function kawaiiSnowman() {
  const filled = (d, fill, extra = {}) => ['path', { d, fill, ...extra }]
  const ARMS = 'M7.2 15.1L3.9 12.2M3.9 12.2L3.5 10.2M3.9 12.2L2.2 11.6M5.5 13.6L5.6 11.9' +
    'M16.8 15.1L20.1 12.2M20.1 12.2L20.5 10.2M20.1 12.2L21.8 11.6M18.5 13.6L18.4 11.9'
  return [
    // falling snow (decoration, still)
    ['path', { d: disc(3, 4.6, 0.55) + disc(21, 3.8, 0.55) + disc(2.1, 8.4, 0.4) + disc(21.9, 8, 0.4) + disc(19.1, 6.6, 0.32), fill: 'currentColor', 'fill-opacity': 0.32, stroke: 'none', class: 'wm-deco' }],
    // twig arms (behind the body)
    ['path', { d: ARMS, 'stroke-width': 1.2, class: 'wm-a' }],
    // snow mound under the body, then the two snowballs
    filled('M2.6 21.9C3.8 19.9 7.4 19.3 12 19.3C16.6 19.3 20.2 19.9 21.4 21.9Z', BODY, { 'fill-opacity': 0.75, 'stroke-width': 1.1 }),
    filled(disc(12, 16.3, 4.9), BODY, { 'stroke-width': 1.4 }),
    filled(disc(12, 9.6, 4.1), BODY, { 'stroke-width': 1.4 }),
    ['path', { d: 'M8.9 14.4Q9.3 13.3 10.3 12.9', stroke: SHINE, 'stroke-width': 0.85, 'stroke-opacity': 0.9, class: 'wm-shine' }],
    // beanie: dome, cuff, pompom
    filled('M8.1 7.4C8.1 2.7 15.9 2.7 15.9 7.4Z', HAT, { 'stroke-width': 1.2, class: 'wm-a' }),
    ['path', { d: 'M10.6 4.6L10.6 6.4M12 4.1L12 6.4M13.4 4.6L13.4 6.4', stroke: 'currentColor', 'stroke-opacity': 0.35, 'stroke-width': 0.6, class: 'wm-a' }],
    filled('M8 6.6H16A0.9 0.9 0 0 1 16 8.4H8A0.9 0.9 0 0 1 8 6.6Z', CUFF, { 'stroke-width': 1.05, class: 'wm-a' }),
    filled(disc(12, 2.35, 1.25), BODY, { 'stroke-width': 1.05, class: 'wm-a' }),
    // scarf: wrap + hanging end
    filled('M8.1 12.6Q12 14.5 15.9 12.6L16.3 14.3Q12 16.4 7.7 14.3Z', SCARF, { 'stroke-width': 1.05, class: 'wm-a' }),
    filled('M13.4 14.9L15.6 14.5L16.3 18.3L14.1 18.6Z', SCARF, { 'stroke-width': 1.05, class: 'wm-a' }),
    // face: blush, dot eyes, round nose, tiny smile
    filled(oval(9.45, 11.15, 0.8, 0.5) + oval(14.55, 11.15, 0.8, 0.5), BLUSH, { 'fill-opacity': 0.6, stroke: 'none' }),
    filled(disc(10.4, 10.05, 0.6) + disc(13.6, 10.05, 0.6), FACE, { stroke: 'none' }),
    filled(disc(10.2, 9.85, 0.2) + disc(13.4, 9.85, 0.2), SHINE, { stroke: 'none', class: 'wm-shine' }),
    filled(disc(12, 10.95, 0.62), NOSE, { 'stroke-width': 0.5 }),
    ['path', { d: 'M11.2 11.95Q12 12.6 12.8 11.95', stroke: FACE, 'stroke-width': 0.62 }],
    // three buttons
    filled(disc(12, 15.6, 0.55) + disc(12, 17.4, 0.55) + disc(12, 19.2, 0.55), NOSE, { 'stroke-width': 0.5 }),
  ]
}
