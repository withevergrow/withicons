// forge/hand/glass/sleigh.mjs — a Santa sleigh in frosted glass, redrawn so its parts read apart at 16-24px. The
// generated drawing merged runner, struts and body into one blob. Now the body is a slim glass bowl (tall back, low seat,
// curled dash) floating above a distinct runner: a thick opaque violet rail with its own front scroll, joined to the
// body by two posts, with clear air between rail and body. Seat trim is etched on the pane.
// Roles: back/shadow body + runner, pane/frost glass, accent orb, etch trim, shine rim. Motion: body wm-k, runner wm-a.
import { V } from '../../styles/_glass-soft.mjs'
import { parsePath, setD, area as ringArea } from '../../kernel/geom.mjs'
import { setOf, translateSet } from '../../kernel/bool.mjs'

const NAME = 'sleigh'
const BODY = 'M4 14V6.8A1.8 1.8 0 0 1 5.8 5H6.2A1.8 1.8 0 0 1 8 6.8V10.2H13.4C15.4 10.2 16.5 7.5 19 7.5A1.9 1.9 0 0 1 19 11.3C17.7 11.3 17.5 15.3 14.4 15.3H5.3A1.4 1.4 0 0 1 4 14Z'
const D = (set, t = 0.03) => setD(set.filter(r => Math.abs(ringArea(r)) > 0.06), t)
const stop = (offset, color, op = 1) => ['stop', op === 1 ? { offset, 'stop-color': color } : { offset, 'stop-color': color, 'stop-opacity': op }]

export default function render() {
  let n = 0
  const defs = []
  const grad = (tag, a, stops) => { const g = [tag, { id: `wg-glass-${NAME}-${n++}`, ...a, gradientUnits: 'userSpaceOnUse' }, stops]; defs.push(g); return `url(#${g[1].id})` }
  const body = setOf(parsePath(BODY).map(s => s.pts))
  const front = translateSet(body, -0.3, -0.4)
  const back = translateSet(body, 0.6, 0.55)
  const out = []

  const drop = D(translateSet(back, 0, 0.5), 0.06)
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.06, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 1.8, 'stroke-linejoin': 'round', class: 'wm-shadow' }])
  out.push(['path', { d: drop, fill: V.shadow, 'fill-opacity': 0.04, stroke: V.shadow, 'stroke-opacity': 0.06, 'stroke-width': 0.7, 'stroke-linejoin': 'round', class: 'wm-shadow' }])

  // runner: an opaque rail with a front scroll, and two posts up to the body
  const RUN = 'M2.7 19.8H17.3C19.8 19.8 21.4 18.5 21.4 16.5A1.6 1.6 0 0 0 19.8 14.9'
  const rl = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-a' }
  out.push(['path', { d: 'M7.6 14.8V19.5M14.8 14.8V19.5', stroke: V.shadow, 'stroke-width': 1.6, ...rl }])
  out.push(['path', { d: RUN, stroke: V.shadow, 'stroke-width': 1.9, ...rl }])
  out.push(['path', { d: 'M4 19.1H17.2C18.8 19.1 20.1 18.4 20.6 17.2', stroke: V.shine, 'stroke-opacity': 0.5, 'stroke-width': 0.45, ...rl }])

  // body: colour back with an accent orb, frosted pane in front
  const bd = D(back)
  out.push(['path', { d: bd, fill: grad('linearGradient', { x1: 4, y1: 5, x2: 21, y2: 16.5 }, [stop(0, V.c1), stop(1, V.shadow)]), class: 'wm-k' }])
  out.push(['path', { d: bd, fill: grad('radialGradient', { cx: 15.5, cy: 12.5, r: 5.5 }, [stop(0, V.accent, 0.6), stop(0.5, V.accent, 0.22), stop(1, V.accent, 0)]), class: 'wm-k' }])
  out.push(['path', {
    d: D(front), fill: grad('linearGradient', { x1: 3.5, y1: 4.5, x2: 20, y2: 15 }, [stop(0, V.frost, 0.6), stop(0.4, V.tint, 0.55), stop(1, V.tint, 0.42)]),
    stroke: 'currentColor', 'stroke-opacity': 0.2, 'stroke-width': 0.5, 'stroke-linejoin': 'round', class: 'wm-k',
  }])
  // seat trim etched on the pane
  out.push(['path', { d: 'M8.9 13H14', fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.7, 'stroke-linecap': 'round', class: 'wm-k' }])
  // the scroll of the dash
  out.push(['circle', { cx: 18.5, cy: 8.9, r: 0.55, fill: 'none', stroke: V.etch, 'stroke-opacity': 0.62, 'stroke-width': 0.6, class: 'wm-k' }])
  // lit rim: back rest and the curl of the dash
  const rim = { fill: 'none', stroke: V.shine, 'stroke-opacity': 0.9, 'stroke-width': 0.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'wm-shine' }
  out.push(['path', { d: 'M4.7 12.6V6.9Q4.7 5.7 5.9 5.7', ...rim }])
  out.push(['path', { d: 'M13.6 9.7C15.5 9.7 16.7 7.3 19 7.3', ...rim, 'stroke-opacity': 0.75 }])
  return [['defs', {}, defs], ...out]
}
