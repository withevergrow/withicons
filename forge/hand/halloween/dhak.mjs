// hand-drawn halloween dhak: a sideways barrel drum on its side, pumpkin-orange body, bone-cream head on the left with a
// purple ring, an X of purple lacing, and a tuft of three plumes on top (purple, slime, ember).
// Body wm-k, head wm-k, lacing wm-s, plumes wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'dhak'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r2 = v => Math.round(v * 100) / 100
const BODY = 'M5.25 11H18.5C21.25 13 21.25 19.5 18.5 21.5H5.25Z'
const LACE = 'M8.6 11.4L13.5 21.1L18.4 11.4M8.6 21.1L13.5 11.4L18.4 21.1'
const HEAD = { cx: 5.25, cy: 16.25, rx: 2.4, ry: 5.25 }

// a leaf-shaped plume from its base to its tip
function leaf(bx, by, tx, ty, w) {
  const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux
  const mx = bx + dx * 0.5, my = by + dy * 0.5, k = w * 1.9
  const p = (x, y) => `${r2(x)} ${r2(y)}`
  return `M${p(bx - nx * w, by - ny * w)}Q${p(mx - nx * k, my - ny * k)} ${p(tx, ty)}Q${p(mx + nx * k, my + ny * k)} ${p(bx + nx * w, by + ny * w)}Z`
}
const ell = (cx, cy, rx, ry) => `M${r2(cx - rx)} ${cy}a${rx} ${ry} 0 1 0 ${r2(rx * 2)} 0a${rx} ${ry} 0 1 0 ${r2(-rx * 2)} 0z`

export default function render() {
  const all = `${BODY}${ell(HEAD.cx, HEAD.cy, HEAD.rx, HEAD.ry)}`
  const shadow = setD(translateSet(setOf(parsePath(all, 0.12).map(s => s.pts)), 0.15, 0.85))
  const plumes = [
    [leaf(15.4, 11.4, 12.2, 2.6, 1.15), C.c3],
    [leaf(16.2, 11.4, 17.4, 2.0, 1.15), C.c4],
    [leaf(17, 11.4, 21.6, 5.6, 1.15), C.c2],
  ]
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 13, cy: 17, r: 9, fx: 11, fy: 12.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent), st(0.4, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 5.25, cy: 16.25, r: 5.4, fx: 4.4, fy: 13.6, gradientUnits: 'userSpaceOnUse' }, [st(0, C.shine), st(0.55, C.tint), st(1, C.accent)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ...plumes.map(([d, c]) => ['path', { d, fill: c, ...INK, class: 'wm-a' }]),
    ['path', { d: BODY, fill: url(0), class: 'wm-k' }],
    ['path', { d: 'M6.2 12.5C9.6 13.5 14.8 12.1 18 12.3', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.7, class: 'wm-shine' }],
    ['path', { d: LACE, ...ROUND, 'stroke-linecap': 'butt', stroke: C.ink, 'stroke-width': 2.2, class: 'wm-s' }],
    ['path', { d: LACE, ...ROUND, 'stroke-linecap': 'butt', stroke: C.c3, 'stroke-width': 1.05, class: 'wm-s' }],
    ['path', { d: BODY, fill: 'none', ...INK, class: 'wm-k' }],
    ['ellipse', { ...HEAD, fill: url(1), ...INK, class: 'wm-k' }],
    ['ellipse', { cx: 5.25, cy: 16.25, rx: 1.1, ry: 3.9, ...ROUND, stroke: C.c3, 'stroke-width': 0.9, class: 'wm-s' }],
  ]
}
