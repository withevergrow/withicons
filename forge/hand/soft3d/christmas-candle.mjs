// forge/hand/soft3d/christmas-candle.mjs — an upright red pillar candle with a flame on top and a pair of holly leaves
// and a red berry at its foot, as in line. The generated candle was a tilted red box with loose orange blobs; here the
// candle stands straight: a round wax body lit down the left, a cream wax pool on top with one drip, a wick and a
// two-tone flame, with green holly leaves left and right of the berry.
// Same studio recipe as the other soft3d objects: contact shadow, shaded wall to the lower right, lit rim upper left.
// Roles: wax c1, flame c2, holly c3, berry c4. Motion: wax + holly wm-k, flame wm-a (it flickers), berry wm-s, shadow wm-shadow.
const N = 'christmas-candle'
const f = n => +(+n).toFixed(2)
const v = (r, h) => `var(--with-soft3d-${r}, ${h})`
const C = { c1: v('c1', '#E5483F'), c2: v('c2', '#FFB02E'), c3: v('c3', '#2E9A4A'), c4: v('c4', '#C8102E'), tint: v('tint', '#FFF6E6'), shine: v('shine', '#FFFFFF'), shadow: v('shadow', '#1D2130') }
const id = n => `wg-soft3d-${N}-${n}`, url = n => `url(#${id(n)})`
const stop = (o, c, a) => ['stop', { offset: o, 'stop-color': c, 'stop-opacity': a }]
const P = (d, a, cls) => ['path', { d, ...a, class: cls }]
const ell = (x, y, rx, ry) => `M${f(x - rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x + rx)} ${f(y)}A${f(rx)} ${f(ry)} 0 1 0 ${f(x - rx)} ${f(y)}Z`
const mv = (d, dx, dy) => d.replace(/([MLCQA])([^MLCQAZ]*)/g, (m, c, s) => c + s.trim().split(/[\s,]+/).filter(Boolean).map(Number)
  .map((x, i) => c === 'A' ? (i % 7 === 5 ? x + dx : i % 7 === 6 ? x + dy : x) : x + (i % 2 ? dy : dx)).map(f).join(' '))
const wall = (d, dx, dy, n = 4) => Array.from({ length: n }, (_, i) => mv(d, dx * (i + 1) / n, dy * (i + 1) / n)).join('')
const S = (d, stroke, w, extra, cls) => P(d, { fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, cls)
const slab = (d, col, g, cls, dx = 0.7, dy = 0.55) => {
  const W = wall(d, dx, dy, 3)
  return [P(W, { fill: col }, cls), P(W, { fill: C.shadow, 'fill-opacity': 0.3 }, cls), P(d, { fill: col }, cls), P(d, { fill: url(g) }, cls)]
}

const BODY = 'M8.4 10.2C8.4 9.2 9.1 8.6 10 8.6L14 8.6C14.9 8.6 15.6 9.2 15.6 10.2L15.6 18.2L8.4 18.2Z'
const TOP = ell(12, 8.9, 3.6, 1.15)
const DRIP = 'M13.7 9.5L15.4 9.5L15.4 12.2A0.85 0.85 0 0 1 13.7 12.2Z'
const FLAME = 'M12 1.9C13.3 3.3 14.3 4.6 14.3 5.8A2.3 2.3 0 0 1 9.7 5.8C9.7 4.6 10.7 3.3 12 1.9Z'
const CORE = 'M12 4.1C12.75 4.9 13.25 5.5 13.25 6.2A1.25 1.25 0 0 1 10.75 6.2C10.75 5.5 11.25 4.9 12 4.1Z'
// a holly leaf: two wavy sides from the stem point out to a sharp tip
const LEAF_L = 'M10.9 19.2C10 18 9.4 16.9 8.2 16.9C7.6 16.9 7.3 17.2 6.9 17.5C6.5 16.8 5.6 16.5 4.7 16.9C4.1 17.2 3.6 17.5 3 18C3.6 18.2 3.8 18.8 3.5 19.4C4.3 19.2 4.9 19.8 4.8 20.5C5.6 20.3 6.4 20.6 6.8 21.1C7.6 20.6 8.5 20.3 9.3 20.3C9.9 20.1 10.4 19.8 10.9 19.2Z'
const LEAF_R = 'M13.1 19.2C14 18 14.6 16.9 15.8 16.9C16.4 16.9 16.7 17.2 17.1 17.5C17.5 16.8 18.4 16.5 19.3 16.9C19.9 17.2 20.4 17.5 21 18C20.4 18.2 20.2 18.8 20.5 19.4C19.7 19.2 19.1 19.8 19.2 20.5C18.4 20.3 17.6 20.6 17.2 21.1C16.4 20.6 15.5 20.3 14.7 20.3C14.1 20.1 13.6 19.8 13.1 19.2Z'

export default function render() {
  return [
    ['defs', {}, [
      ['linearGradient', { id: id(0), x1: 0, y1: 0, x2: 1, y2: 1 }, [stop(0, C.shine, 0.34), stop(0.42, C.shine, 0), stop(0.62, C.shadow, 0), stop(1, C.shadow, 0.2)]],
      // the candle's roundness: lit down the left, shaded on the right
      ['linearGradient', { id: id(1), x1: 0, y1: 0, x2: 1, y2: 0 }, [stop(0, C.shine, 0.3), stop(0.2, C.shine, 0.48), stop(0.45, C.shine, 0), stop(0.65, C.shadow, 0), stop(1, C.shadow, 0.3)]],
      ['radialGradient', { id: id(2), cx: 0.36, cy: 0.3, r: 0.78 }, [stop(0, C.shine, 0.7), stop(0.5, C.shine, 0), stop(0.8, C.shadow, 0.05), stop(1, C.shadow, 0.22)]],
    ]],
    P(ell(12.2, 21.5, 9.6, 1.3), { fill: C.shadow, 'fill-opacity': 0.06 }, 'wm-shadow'),
    P(ell(12.2, 21.5, 7.6, 1), { fill: C.shadow, 'fill-opacity': 0.08 }, 'wm-shadow'),
    P(ell(12.2, 21.5, 5.4, 0.75), { fill: C.shadow, 'fill-opacity': 0.11 }, 'wm-shadow'),
    // the wax pillar: shaded wall, round lit face, a pool of cream wax on top and one drip down the right
    ...slab(BODY, C.c1, 1, 'wm-k'),
    P(TOP, { fill: C.tint }, 'wm-k'), P(TOP, { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-k'),
    P(DRIP, { fill: C.tint }, 'wm-k'), P(DRIP, { fill: C.shadow, 'fill-opacity': 0.1 }, 'wm-k'),
    P(ell(11.7, 8.8, 2.1, 0.55), { fill: C.shadow, 'fill-opacity': 0.14 }, 'wm-k'),
    S('M9.2 10.6L9.2 16.8', C.shine, 0.65, { 'stroke-opacity': 0.8 }, 'wm-shine'),
    S('M9.5 8.3C10.4 7.95 11.4 7.8 12.4 7.9', C.shine, 0.45, { 'stroke-opacity': 0.9 }, 'wm-shine'),
    // the wick and the two-tone flame
    S('M12 8.6L12 7.4', C.shadow, 0.8, { 'stroke-opacity': 0.8 }, 'wm-a'),
    P(FLAME, { fill: C.c2 }, 'wm-a'), P(FLAME, { fill: url(2) }, 'wm-a'),
    P(CORE, { fill: C.tint }, 'wm-a'),
    // holly leaves either side of the berry, with their centre veins
    ...slab(LEAF_L, C.c3, 0, 'wm-k', 0.5, 0.4),
    ...slab(LEAF_R, C.c3, 0, 'wm-k', 0.5, 0.4),
    S('M10.4 19.5C8.6 19.1 6.6 18.9 4.4 18.6M13.6 19.5C15.4 19.1 17.4 18.9 19.6 18.6', C.shadow, 0.45, { 'stroke-opacity': 0.3 }, 'wm-k'),
    S('M8 17.5C6.9 17.5 5.9 17.5 4.9 17.7M16 17.5C17.1 17.5 18.1 17.5 19.1 17.7', C.shine, 0.4, { 'stroke-opacity': 0.55 }, 'wm-shine'),
    // the berry
    P(ell(12.2, 19.6, 1.75, 1.75), { fill: C.shadow, 'fill-opacity': 0.3 }, 'wm-s'),
    P(ell(12, 19.4, 1.75, 1.75), { fill: C.c4 }, 'wm-s'),
    P(ell(12, 19.4, 1.75, 1.75), { fill: url(2) }, 'wm-s'),
    S('M11 18.7C11.2 18.4 11.5 18.2 11.8 18.2', C.shine, 0.45, { 'stroke-opacity': 0.95 }, 'wm-shine'),
  ]
}
