// forge/hand/halloween/toran.mjs — a door garland: a purple rail with three evenly spaced mango-leaf drops of one clear
// shape (green, orange, green), each on its own short string, nothing overlapping. The generated drawing tangled the
// leaves into bats and feathers.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), C3 = V('c3', '#8B55E0')
const C4 = V('c4', '#86D13A'), ACCENT = V('accent', '#FFB52E'), SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const EDGE = V('edge', '#7344C9')
const id = n => `wg-halloween-toran-${n}`
const r2 = v => Math.round(v * 100) / 100
const ink = { stroke: INK, 'stroke-width': 0.72, 'stroke-linejoin': 'round' }
const stop = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

const XS = [5.5, 12, 18.5]
const TOP = 7.4, BOT = 19.6
// the leaf: pointed at both ends, belly high, hung at (x, TOP)
const leaf = (x, dx = 0, dy = 0) => {
  const X = x + dx, T = TOP + dy, B = BOT + dy
  return `M${r2(X)} ${r2(T)}C${r2(X + 4.1)} ${r2(T + 3)} ${r2(X + 3.7)} ${r2(B - 4)} ${r2(X)} ${r2(B)}C${r2(X - 3.7)} ${r2(B - 4)} ${r2(X - 4.1)} ${r2(T + 3)} ${r2(X)} ${r2(T)}Z`
}
const rail = (dx = 0, dy = 0) => `M${3.5 + dx} ${r2(3.1 + dy)}H${20.5 + dx}A1.2 1.2 0 0 1 ${20.5 + dx} ${r2(5.5 + dy)}H${3.5 + dx}A1.2 1.2 0 0 1 ${3.5 + dx} ${r2(3.1 + dy)}Z`

export default function render() {
  const out = [
    ['defs', {}, [
      // 0: the rail, witch purple lit from the left
      ['linearGradient', { id: id(0), x1: 12, y1: 3.1, x2: 12, y2: 5.5, gradientUnits: 'userSpaceOnUse' }, [stop(0, C3), stop(1, EDGE)]],
      // 1,4,5: leaf gradients, one per leaf so each is lit the same way (green, orange, green)
      ...XS.map((x, i) => ['radialGradient', { id: id(i === 1 ? 2 : i === 0 ? 1 : 4), cx: x, cy: 13.5, r: 6.5, fx: x - 1.6, fy: 10, gradientUnits: 'userSpaceOnUse' }, i === 1 ? [stop(0, ACCENT), stop(0.4, C1), stop(1, C2)] : [stop(0, C4), stop(0.45, C4), stop(1, EDGE)]]),
      ['radialGradient', { id: id(3), cx: 12, cy: 11.5, r: 12, gradientUnits: 'userSpaceOnUse' }, [stop(0, ACCENT, 0.3), stop(0.55, ACCENT, 0.13), stop(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(3)})`, class: 'wm-deco' }],
    // shadows
    ['path', { d: rail(0.15, 0.8), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ...XS.map(x => ['path', { d: leaf(x, 0.15, 0.8), fill: SHADOW, 'fill-opacity': 0.28, class: 'wm-shadow' }]),
    // strings
    ['path', { d: XS.map(x => `M${x} 5.4V${TOP + 0.4}`).join(''), fill: 'none', stroke: INK, 'stroke-width': 0.9, 'stroke-linecap': 'round', class: 'wm-k' }],
  ]
  // the three leaves: the outer two swing (part A), the middle one is the body
  XS.forEach((x, i) => {
    const mid = i === 1, cls = mid ? 'wm-k' : 'wm-a'
    out.push(['path', { d: leaf(x), fill: `url(#${id(mid ? 2 : i === 0 ? 1 : 4)})`, ...ink, class: cls }])
    // midrib
    out.push(['path', { d: `M${x} ${TOP + 1.8}V${BOT - 2.2}`, fill: 'none', stroke: mid ? C2 : EDGE, 'stroke-opacity': 0.8, 'stroke-width': 0.6, 'stroke-linecap': 'round', class: cls }])
    // lit left shoulder
    out.push(['path', { d: `M${r2(x - 1.7)} ${TOP + 4.3}Q${r2(x - 1.6)} ${TOP + 2.8} ${r2(x - 0.4)} ${TOP + 1.7}`, fill: 'none', stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, 'stroke-linecap': 'round', class: 'wm-shine' }])
  })
  // the rail on top, with a bead at each string
  out.push(['path', { d: rail(), fill: `url(#${id(0)})`, ...ink, class: 'wm-k' }])
  out.push(['path', { d: 'M4.9 3.75H9.5', fill: 'none', stroke: SHINE, 'stroke-opacity': 0.5, 'stroke-width': 0.45, 'stroke-linecap': 'round', class: 'wm-shine' }])
  return out
}
