// forge/hand/halloween/plum-blossom.mjs — a big five-petal plum flower (separate inked petals, a purple heart) on a short
// purple twig with a bud and a tiny bat. The generated drawing shrank the bloom, hung slime off it and drew a spider.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const EDGE = V('edge', '#7344C9'), TINT = V('tint', '#FFF1B8')
const id = n => `wg-halloween-plum-blossom-${n}`
const r2 = v => Math.round(v * 100) / 100
const disc = (cx, cy, r) => `M${r2(cx - r)} ${r2(cy)}a${r} ${r} 0 1 0 ${r2(2 * r)} 0a${r} ${r} 0 1 0 ${r2(-2 * r)} 0z`
const ink = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const stop = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

function BAT(x, y, r) {
  const P = [[0, -0.12], [0.1, -0.36], [0.17, -0.12], [0.42, -0.36], [0.78, -0.42], [1, -0.16]]
  const S = [[1, -0.16], [0.86, 0.02], [0.66, 0.0], [0.56, 0.2], [0.4, 0.12], [0.24, 0.34], [0.12, 0.2], [0, 0.32]]
  const p = ([u, v], m = 1) => r2(x + u * r * m) + ' ' + r2(y + v * r)
  let d = 'M' + p([0, -0.12])
  for (const q of P.slice(1)) d += 'L' + p(q)
  for (let k = 1; k < S.length; k += 2) d += 'Q' + p(S[k]) + ' ' + p(S[k + 1] || S[k])
  const Sm = [...S].reverse()
  for (let k = 1; k < Sm.length; k += 2) d += 'Q' + p(Sm[k], -1) + ' ' + p(Sm[k + 1] || Sm[k], -1)
  for (const q of [...P].reverse().slice(1)) d += 'L' + p(q, -1)
  return d + 'Z'
}

// the bloom: five round petals round a heart
const CX = 14.5, CY = 9.5, D = 4.1, PR = 3.4
const ANG = [-90, -18, 54, 126, 198].map(a => a * Math.PI / 180)
const pet = ANG.map(a => [CX + D * Math.cos(a), CY + D * Math.sin(a), a])
// a short lit arc along the outer upper-left rim of each petal
const rim = ([x, y, a]) => {
  const R = PR - 0.95, a0 = a - 0.95, a1 = a - 0.2
  return `M${r2(x + R * Math.cos(a0))} ${r2(y + R * Math.sin(a0))}A${R} ${R} 0 0 1 ${r2(x + R * Math.cos(a1))} ${r2(y + R * Math.sin(a1))}`
}

export default function render() {
  const out = [
    ['defs', {}, [
      // 0: the petals, lit from the upper left
      ['radialGradient', { id: id(0), cx: CX, cy: CY, r: 8.2, fx: CX - 2.5, fy: CY - 3.6, gradientUnits: 'userSpaceOnUse' }, [
        stop(0, ACCENT), stop(0.4, C1), stop(1, C2)]],
      // 1: the twig
      ['linearGradient', { id: id(1), x1: 3, y1: 15, x2: 10, y2: 21, gradientUnits: 'userSpaceOnUse' }, [stop(0, C3), stop(1, EDGE)]],
      // 2: the heart
      ['radialGradient', { id: id(2), cx: CX, cy: CY + 0.2, r: 2.2, fx: CX - 0.7, fy: CY - 0.7, gradientUnits: 'userSpaceOnUse' }, [
        stop(0, C3), stop(0.5, C3), stop(1, EDGE)]],
      // 3: the halo
      ['radialGradient', { id: id(3), cx: 13, cy: 11, r: 12, gradientUnits: 'userSpaceOnUse' }, [stop(0, ACCENT, 0.3), stop(0.55, ACCENT, 0.13), stop(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(3)})`, class: 'wm-deco' }],
    // the twig and its side shoot (inked rim under a purple core)
    ['path', { d: 'M3 21Q6.9 17.8 8.2 14.5Q9.4 13.3 10.8 12.6M5.9 18.6Q4.5 16.8 3.3 14.7', fill: 'none', stroke: INK, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M3 21Q6.9 17.8 8.2 14.5Q9.4 13.3 10.8 12.6M5.9 18.6Q4.5 16.8 3.3 14.7', fill: 'none', stroke: `url(#${id(1)})`, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-k' }],
    // the bud on the shoot
    ['path', { d: disc(3.1, 13.4, 1.55), fill: `url(#${id(0)})`, ...ink, class: 'wm-k' }],
    // the petals' cast shadow
    ...pet.map(([x, y]) => ['path', { d: disc(x + 0.15, y + 0.8, PR), fill: SHADOW, 'fill-opacity': 0.28, class: 'wm-shadow' }]),
    // the petals, each inked, overlapping clockwise from the top
    ...pet.map(([x, y]) => ['path', { d: disc(x, y, PR), fill: `url(#${id(0)})`, ...ink, class: 'wm-k' }]),
    ...pet.map(p => ['path', { d: rim(p), fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }]),
    // the heart (twinkles)
    ['path', { d: disc(CX, CY, 2.1), fill: `url(#${id(2)})`, ...ink, class: 'wm-s' }],
    ['path', { d: disc(CX - 0.7, CY - 0.75, 0.42), fill: SHINE, 'fill-opacity': 0.75, class: 'wm-s' }],
    // the style's critter
    ['path', { d: BAT(5.2, 5, 2.1), fill: EDGE, stroke: INK, 'stroke-width': 0.3, 'stroke-linejoin': 'round', class: 'wm-deco' }],
    ['path', { d: disc(5.07, 4.9, 0.14) + disc(5.33, 4.9, 0.14), fill: TINT, class: 'wm-deco' }],
  ]
  return out
}
