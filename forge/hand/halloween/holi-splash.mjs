// hand-drawn halloween holi-splash: an irregular pumpkin-orange paint splat with a purple blot in its middle and three
// flung drops (slime, purple, candle). Splat wm-k, blot and drops wm-a, halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'
import { parsePath, setD } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'holi-splash'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const SPLAT = 'M11.36 5.93C11.59 5.17 11.78 2.6 12 2.6C12.22 2.6 12.33 5.14 12.64 5.93C12.95 6.72 13.33 7.05 13.83 7.24C14.33 7.43 15.05 7.19 15.59 7.06C16.12 6.94 16.79 6.36 16.95 6.5C17.11 6.65 16.61 7.39 16.53 7.92C16.46 8.45 16.27 9.16 16.5 9.61C16.74 10.05 17.15 10.33 17.92 10.52C18.69 10.72 20.98 10.52 21.01 10.73C21.04 10.95 18.79 11.35 18.1 11.79C17.4 12.23 17.08 12.73 16.93 13.32C16.77 13.91 16.99 14.66 17.17 15.23C17.35 15.8 18.12 16.51 17.99 16.68C17.86 16.85 16.95 16.3 16.39 16.24C15.83 16.18 15.13 16.06 14.7 16.33C14.28 16.59 14.02 16.99 13.89 17.8C13.75 18.61 14.15 21.05 13.93 21.1C13.72 21.14 13.12 18.76 12.64 18.07C12.16 17.37 11.68 17.12 11.11 17.02C10.55 16.92 9.84 17.27 9.33 17.48C8.81 17.7 8.26 18.39 8.08 18.28C7.89 18.16 8.26 17.34 8.24 16.81C8.23 16.27 8.29 15.54 7.98 15.14C7.67 14.74 7.18 14.55 6.43 14.48C5.67 14.41 3.6 14.96 3.54 14.75C3.47 14.54 5.46 13.8 6.03 13.27C6.61 12.74 6.87 12.21 6.91 11.64C6.95 11.07 6.56 10.42 6.27 9.91C5.97 9.41 5.07 8.86 5.17 8.67C5.26 8.47 6.3 8.79 6.83 8.77C7.35 8.74 8 8.81 8.27 8.52C8.54 8.23 8.51 7.74 8.41 7.06C8.32 6.39 7.51 4.66 7.7 4.55C7.89 4.44 9.01 6 9.52 6.43C10.03 6.86 10.37 7.16 10.68 7.07C10.99 6.99 11.14 6.69 11.36 5.93Z'
const BLOT = 'M12.48 9.29C13.69 9.58 15.15 10.6 15.24 11.72C15.32 12.83 14.12 13.83 12.86 14.35C11.6 14.87 10.19 14.95 9.51 14.09C8.83 13.23 9.09 11.48 9.75 10.42C10.4 9.37 11.27 9.01 12.48 9.29Z'
const DROPS = [[15.5, 3.1, 1.25, 'c4'], [17.2, 20.1, 1.2, 'c3'], [2.4, 11.4, 1.25, 'accent']]
const disc = (x, y, r) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0z`

export default function render() {
  const all = `${SPLAT}${DROPS.map(([x, y, r]) => disc(x, y, r)).join('')}`
  const shadow = setD(translateSet(setOf(parsePath(all, 0.1).map(s => s.pts)), 0.15, 0.85))
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 12.4, r: 9.5, fx: 9.4, fy: 8.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent), st(0.4, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12.2, cy: 12, r: 3.8, fx: 10.8, fy: 10.4, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(0.5, C.c3), st(1, C.edge)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 12.8, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.162), st(1, C.accent, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: shadow, fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ...DROPS.map(([x, y, r, c]) => ['circle', { cx: x, cy: y, r, fill: C[c], ...INK, class: 'wm-a' }]),
    ['path', { d: SPLAT, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: BLOT, fill: url(1), ...INK, 'stroke-width': 0.6, class: 'wm-a' }],
    ['path', { d: 'M7.4 9.6C8.4 9.9 9.3 9.8 10 9', fill: 'none', stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ['path', { d: 'M10.2 11.2C10.6 10.5 11.3 10.2 11.9 10.2', fill: 'none', stroke: C.shine, 'stroke-opacity': 0.7, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: 'wm-shine' }],
    ...DROPS.map(([x, y, r]) => ['circle', { cx: x - r * 0.35, cy: y - r * 0.35, r: 0.3, fill: C.shine, 'fill-opacity': 0.8, class: 'wm-shine' }]),
  ]
}
