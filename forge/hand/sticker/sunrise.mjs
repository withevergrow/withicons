// forge/hand/sticker/sunrise.mjs — a die-cut dawn sticker: a big lemon half-sun on an ink horizon with two lemon
// ray tubes, a tangerine up-arrow above it and one small sparkle; replaces the generated drawing, whose tiny sun was
// out-shouted by a bubblegum arrow, bubblegum rays and two sparkles.
const f = v => +v.toFixed(2)
const INK = 'var(--with-sticker-ink, #1D1530)'
const EDGE = 'var(--with-sticker-edge, #FFFFFF)'
const SHINE = 'var(--with-sticker-shine, #FFFFFF)'
const SHADOW = 'var(--with-sticker-shadow, #1D1530)'
const SUN = 'var(--with-sticker-lemon, #FFD43B)'
const ARROW = 'var(--with-sticker-peach, #FF9563)'
const SPARK = 'var(--with-sticker-bubblegum, #FF6FB5)'

const CX = 11.75, HY = 16.6, R = 4.8
// half-sun sitting on the horizon
const sunD = (x = 0, y = 0) => `M${f(CX - R + x)} ${f(HY + y)}A${R} ${R} 0 0 1 ${f(CX + R + x)} ${f(HY + y)}Z`
// two rays on the diagonals, clear of the sun's ink
const ray = (sx, x = 0, y = 0) => {
  const a = Math.SQRT1_2
  return `M${f(CX + sx * 7.9 * a + x)} ${f(HY - 7.9 * a + y)}L${f(CX + sx * 9.1 * a + x)} ${f(HY - 9.1 * a + y)}`
}
const raysD = (x = 0, y = 0) => ray(-1, x, y) + ray(1, x, y)
const arrowD = (x = 0, y = 0) => `M${f(CX + x)} ${f(8.2 + y)}V${f(3.6 + y)}M${f(CX - 2.2 + x)} ${f(5.8 + y)}L${f(CX + x)} ${f(3.6 + y)}L${f(CX + 2.2 + x)} ${f(5.8 + y)}`
const horizonD = (x = 0, y = 0) => `M${f(4.4 + x)} ${f(HY + y)}H${f(19.1 + x)}M${f(8.6 + x)} ${f(19.6 + y)}H${f(14.9 + x)}`
// the die-cut body: sun plus the slab between the horizon and the short line
const bodyD = (x = 0, y = 0) => sunD(x, y) + `M${f(8.6 + x)} ${f(HY + y)}H${f(14.9 + x)}V${f(19.6 + y)}H${f(8.6 + x)}Z`

function paper(x, y, grow, paint) {
  return [
    ['path', { d: bodyD(x, y) + horizonD(x, y), fill: paint, stroke: paint, 'stroke-width': 4.2 + grow }],
    ['path', { d: arrowD(x, y) + raysD(x, y), stroke: paint, 'stroke-width': 5.6 + grow }],
  ]
}

export default function render() {
  const shadow = paper(0.5, 0.8, 0, SHADOW).map(([t, a]) => [t, { ...a, opacity: 0.22, class: 'wm-shadow' }])
  const hair = paper(0, 0, 0.64, 'currentColor').map(([t, a]) => [t, { ...a, opacity: 0.3 }])
  const edge = paper(0, 0, 0, EDGE)
  return [
    ...shadow, ...hair, ...edge,
    // rays: ink-edged lemon tubes
    ['path', { d: raysD(), stroke: INK, 'stroke-width': 3.1, class: 'wm-a' }],
    ['path', { d: raysD(), stroke: SUN, 'stroke-width': 2, class: 'wm-a' }],
    // the sun and the horizon
    ['path', { d: sunD(), fill: SUN }],
    ['path', { d: sunD() + horizonD(), stroke: INK, 'stroke-width': 1.5 }],
    // gloss dash + dot on the sun
    ['path', { d: `M${f(CX - 3.2)} ${f(HY - 1.2)}A3.4 3.4 0 0 1 ${f(CX - 1.2)} ${f(HY - 3.2)}`, stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    ['path', { d: `M${f(CX - 3.45)} ${f(HY - 0.1)}h.01`, stroke: SHINE, 'stroke-width': 1, 'stroke-opacity': 0.92, class: 'wm-shine' }],
    // the rising arrow: ink-edged tangerine tube
    ['path', { d: arrowD(), stroke: INK, 'stroke-width': 3.1, class: 'wm-s' }],
    ['path', { d: arrowD(), stroke: ARROW, 'stroke-width': 2, class: 'wm-s' }],
    // one sparkle in the free corner
    ['path', { d: 'M19.6 2.2Q19.95 3.55 21.3 3.9Q19.95 4.25 19.6 5.6Q19.25 4.25 17.9 3.9Q19.25 3.55 19.6 2.2Z', fill: SPARK, class: 'wm-deco' }],
  ]
}
