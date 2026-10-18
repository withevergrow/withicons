// forge/hand/halloween/git-pull-request.mjs — the pumpkin-orange pull request of its git siblings (git-branch, git-fork,
// git-compare: solid candle-lit nodes joined seamlessly to their lines, ink rim, drop shadow, lit shoulders), redrawn
// without the spider that crowded the return arrow, so the arrow and its chevron stay the dominant shape.
const V = (r, h) => `var(--with-halloween-${r}, ${h})`
const INK = V('ink', '#1D1029'), C1 = V('c1', '#FF9F2E'), C2 = V('c2', '#E5530F'), ACCENT = V('accent', '#FFB52E')
const SHADOW = V('shadow', '#2A1642'), SHINE = V('shine', '#FFF6E2')
const id = n => `wg-halloween-git-pull-request-${n}`
const st = (o, c, op) => ['stop', op === undefined ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]
const round = { fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }
const f = v => Math.round(v * 100) / 100
const disc = (x, y, r) => `M${f(x - r)} ${f(y)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`
// an arc on a circle, clockwise on screen from angle a0 to a1 (degrees, 0 = right, 90 = down)
const arc = (x, y, r, a0, a1) => {
  const p = a => [f(x + r * Math.cos(a * Math.PI / 180)), f(y + r * Math.sin(a * Math.PI / 180))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0} ${y0}A${f(r)} ${f(r)} 0 0 1 ${x1} ${y1}`
}

export default function render() {
  const nodes = [[5, 6], [5, 18], [19, 18]], R = 3.4, W = 2.5
  // the lines run into the nodes so they join without a seam
  const lines = 'M5 8V16M12.5 6H17A2 2 0 0 1 19 8V16M15.5 3L12.5 6L15.5 9'
  const linesSh = 'M5.15 8.85V16.85M12.65 6.85H17.15A2 2 0 0 1 19.15 8.85V16.85M15.65 3.85L12.65 6.85L15.65 9.85'
  const body = `url(#${id(0)})`
  return [
    ['defs', {}, [
      ['radialGradient', { id: id(0), cx: 12, cy: 13.46, r: 13.2, fx: 8.8, fy: 8.8, gradientUnits: 'userSpaceOnUse' }, [st(0, C1), st(0.45, C1), st(1, C2)]],
      ['radialGradient', { id: id(1), cx: 12, cy: 12.75, r: 12, gradientUnits: 'userSpaceOnUse' }, [st(0, ACCENT, 0.36), st(0.55, ACCENT, 0.162), st(1, ACCENT, 0)]],
    ]],
    ['path', { d: 'M0 0H24V24H0Z', fill: `url(#${id(1)})`, class: 'wm-deco' }],
    ['path', { d: nodes.map(([x, y]) => disc(x + 0.15, y + 0.85, R)).join(''), fill: SHADOW, 'fill-opacity': 0.3, class: 'wm-shadow' }],
    ['path', { d: linesSh, ...round, stroke: SHADOW, 'stroke-opacity': 0.3, 'stroke-width': W, class: 'wm-shadow' }],
    // ink first (nodes and lines), then the orange on top
    ['path', { d: nodes.map(([x, y]) => disc(x, y, R + 0.36)).join(''), fill: INK, class: 'wm-k' }],
    ['path', { d: lines, ...round, stroke: INK, 'stroke-width': W + 0.72, class: 'wm-k' }],
    ['path', { d: nodes.map(([x, y]) => disc(x, y, R - 0.36)).join(''), fill: body, class: 'wm-k' }],
    ['path', { d: lines, ...round, stroke: body, 'stroke-width': W - 0.72, class: 'wm-k' }],
    // lit upper-left shoulders of the nodes and the lines
    ['path', { d: nodes.map(([x, y]) => arc(x, y, R - 1, 185, 265)).join(''), ...round, stroke: SHINE, 'stroke-opacity': 0.6, 'stroke-width': 0.5, class: 'wm-shine' }],
    ['path', { d: 'M4.62 10V14M13.9 5.62H16.6M18.62 9V13.5', ...round, stroke: SHINE, 'stroke-opacity': 0.55, 'stroke-width': 0.34, class: 'wm-shine' }],
  ]
}
