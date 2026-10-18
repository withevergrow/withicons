// forge/hand/halloween/file-archive.mjs — a pumpkin-orange page like file-down/file-plus (same body, fold and flap)
// with a clear zipper: a witch-purple track running from the top edge, midnight teeth alternating down it, ending
// in a big purple pull-tab with a hole. The generated drawing had scattered dots and a tiny box that read as noise.
// Motion: the pull tab is wm-a; page wm-k; halo wm-deco.
import { C } from '../../styles/_halloween-palettes.mjs'

const NAME = 'file-archive'
const id = n => `wg-halloween-${NAME}-${n}`, url = n => `url(#${id(n)})`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const INK = { stroke: C.ink, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const ROUND = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const r = v => Math.round(v * 100) / 100

const page = (x, y) => { const X = v => r(v + x), Y = v => r(v + y)
  return `M${X(14)} ${Y(2.5)}H${X(7)}A2 2 0 0 0 ${X(5)} ${Y(4.5)}V${Y(19.5)}A2 2 0 0 0 ${X(7)} ${Y(21.5)}H${X(17)}A2 2 0 0 0 ${X(19)} ${Y(19.5)}V${Y(7.5)}Z` }

export default function render() {
  const body = 'M13 2.5H7A2 2 0 0 0 5 4.5V19.5A2 2 0 0 0 7 21.5H17A2 2 0 0 0 19 19.5V8.5H15.5A2.5 2.5 0 0 1 13 6Z'
  const flap = 'M15 3.5L18 6.5H15.5A.5 .5 0 0 1 15 6Z'
  const tab = 'M9.9 13.4H12.1A1.1 1.1 0 0 1 13.2 14.5V17.6A1.1 1.1 0 0 1 12.1 18.7H9.9A1.1 1.1 0 0 1 8.8 17.6V14.5A1.1 1.1 0 0 1 9.9 13.4Z'
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.69, r: 13.85, fx: 9.44, fy: 8.23, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c1), st(0.45, C.c1), st(1, C.c2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 14.1, r: 13.01, gradientUnits: 'userSpaceOnUse' }, [st(0, C.tint), st(0.5, C.accent), st(1, C.c1)]],
      ['radialGradient', { id: id(2), cx: 12, cy: 13.06, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, C.accent, 0.36), st(0.55, C.accent, 0.16), st(1, C.accent, 0)]],
      ['linearGradient', { id: id(3), x1: 11, y1: 2.5, x2: 11, y2: 18.7, gradientUnits: 'userSpaceOnUse' }, [st(0, C.c3), st(1, C.edge)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: url(2), class: 'wm-deco' }],
    ['path', { d: page(0.15, 0.85), fill: C.shadow, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: page(0, 0), fill: url(1), class: 'wm-shine' }],
    ['path', { d: body, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: flap, fill: url(0), ...INK, class: 'wm-k' }],
    ['path', { d: 'M5.75 18.9V4.6Q5.75 3.25 7.1 3.25H12.4', ...ROUND, stroke: C.shine, 'stroke-opacity': 0.45, 'stroke-width': 0.5, class: 'wm-shine' }],
    // the zipper: purple track from the top edge, midnight teeth alternating down it
    ['path', { d: 'M11 2.5V13.6', fill: 'none', 'stroke-linecap': 'butt', stroke: C.ink, 'stroke-width': 3, class: 'wm-k' }],
    ['path', { d: 'M10 4.4H11.2M10.8 6.4H12M10 8.4H11.2M10.8 10.4H12M10 12.4H11.2', ...ROUND, stroke: C.tint, 'stroke-width': 0.9, class: 'wm-k' }],
    // the pull tab, with a hole
    ['path', { d: tab, fill: url(3), ...INK, class: 'wm-a' }],
    ['circle', { cx: 11, cy: 16.3, r: 0.95, fill: C.ink, class: 'wm-a' }],
  ]
}
