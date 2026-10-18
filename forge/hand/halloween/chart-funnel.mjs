// forge/hand/halloween/chart-funnel.mjs — a three-tier conversion funnel: two candle-orange tiers that narrow step by
// step and a witch-purple stem at the bottom, separated by clear gaps so the taper reads as a funnel (the generated one
// was a fat stack that looked like a hat). Tiers wm-k, the last (output) tier wm-a (drop / jelly about 12,20.5).
import { C } from '../../styles/_halloween-palettes.mjs'
import { num } from '../../styles/_halloween-core.mjs'

const NAME = 'chart-funnel'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }

// polygon with every corner rounded by r (quadratic corners)
function rpoly(P, r) {
  const n = P.length
  let d = ''
  P.forEach((p, i) => {
    const a = P[(i + n - 1) % n], b = P[(i + 1) % n]
    const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lb = Math.hypot(b[0] - p[0], b[1] - p[1])
    const ra = Math.min(r, la / 2), rb = Math.min(r, lb / 2)
    const s = [p[0] + (a[0] - p[0]) / la * ra, p[1] + (a[1] - p[1]) / la * ra]
    const e = [p[0] + (b[0] - p[0]) / lb * rb, p[1] + (b[1] - p[1]) / lb * rb]
    d += `${i ? 'L' : 'M'}${num(s[0])} ${num(s[1])}Q${num(p[0])} ${num(p[1])} ${num(e[0])} ${num(e[1])}`
  })
  return d + 'Z'
}
function shift(d, dx, dy) {
  return d.replace(/([MLHVCQAZ])([^MLHVCQAZ]*)/g, (_, c, args) => {
    const v = args.trim() ? args.trim().split(/[\s,]+/).map(Number) : []
    return c + v.map((x, i) => num(i % 2 ? x + dy : x + dx)).join(' ')
  })
}

const T1 = rpoly([[2.5, 3], [21.5, 3], [19.6, 7.8], [4.4, 7.8]], 1.2)
const T2 = rpoly([[5.3, 10], [18.7, 10], [16.2, 14.6], [7.8, 14.6]], 1.2)
const T3 = rpoly([[9.3, 16.8], [14.7, 16.8], [14.1, 21], [9.9, 21]], 1.1)

export default function render() {
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13, r: 13, fx: 8, fy: 5, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['linearGradient', { id: id(1), x1: 9, y1: 0, x2: 15, y2: 0, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.3, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shift(T1 + T2 + T3, 0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: T1, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: T2, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: T3, fill: url(1), ...INK, class: 'wm-a' }],
    ['path', { d: 'M5 5H10.5M7.4 11.9H11M10.8 18.4V19', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.55, 'stroke-width': 0.55, class: 'wm-shine' }],
  ]
}
