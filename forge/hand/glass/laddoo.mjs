// forge/hand/glass/laddoo.mjs — three big frosted spheres in a 2+1 pyramid (the top laddoo drawn last, overlapping the two
// below and casting a soft shade on them so the balls stay separate), resting behind a thick glass rim of a dish; each
// ball has its own colour body, pane, rim light and a few boondi dots. The generated drawing merged the balls into one blob.
const f = v => +v.toFixed(2)
const V = (r, h) => `var(--with-glass-${r}, ${h})`
const SH = V('shadow', '#6A45D6'), AC = V('accent', '#F2679E'), SN = V('shine', '#FFFFFF')
const BACK = V('back', '#7484FF'), FR = V('frost', '#FFFFFF'), PA = V('pane', '#E4E8FF'), ET = V('etch', '#3E3A8C')
const id = n => `wg-glass-laddoo-${n}`
const stop = (o, c, op) => ['stop', op == null ? { offset: o, 'stop-color': c } : { offset: o, 'stop-color': c, 'stop-opacity': op }]

const arc = (cx, cy, r, a0, a1) => {
  const p = a => [f(cx + r * Math.cos(a * Math.PI / 180)), f(cy + r * Math.sin(a * Math.PI / 180))]
  const [x0, y0] = p(a0), [x1, y1] = p(a1)
  return `M${x0} ${y0} A${f(r)} ${f(r)} 0 0 1 ${x1} ${y1}`
}

// dots as offsets of the radius: boondi grains on the lit-away half of each ball
const DOTS = [[0.28, 0.1], [-0.12, 0.42], [0.5, 0.48], [0.02, -0.18]]

function ball(cx, cy, r, shadowOp) {
  const out = []
  out.push(['circle', { cx: f(cx + 0.7), cy: f(cy + 1.1), r: f(r + 0.3), fill: SH, 'fill-opacity': shadowOp, class: 'wm-shadow' }])
  out.push(['circle', { cx: f(cx + 0.5), cy: f(cy + 0.6), r: f(r - 0.15), fill: `url(#${id(0)})`, class: 'wm-k' }])
  out.push(['circle', { cx: f(cx + 0.5), cy: f(cy + 0.6), r: f(r - 0.15), fill: `url(#${id(2)})`, class: 'wm-k' }])
  out.push(['circle', { cx: f(cx), cy: f(cy), r: f(r), fill: `url(#${id(1)})`, stroke: 'currentColor', 'stroke-opacity': '0.25', 'stroke-width': '0.5', class: 'wm-k' }])
  for (const [dx, dy] of DOTS) out.push(['circle', { cx: f(cx + dx * r), cy: f(cy + dy * r), r: '0.45', fill: ET, 'fill-opacity': '0.4', class: 'wm-k' }])
  out.push(['path', { d: arc(cx, cy, r - 1, 192, 272), fill: 'none', stroke: SN, 'stroke-opacity': '0.9', 'stroke-width': '0.9', 'stroke-linecap': 'round', class: 'wm-shine' }])
  return out
}

const BOWL = 'M3.7 18 H20.3 C19.8 20.3 18.2 21.9 16.2 21.9 H7.8 C5.8 21.9 4.2 20.3 3.7 18 Z'
const RIM = 'M2.5 16.7 H21.5 A1 1 0 0 1 21.5 18.7 H2.5 A1 1 0 0 1 2.5 16.7 Z'
const RIM_BACK = 'M3.1 17.4 H22.1 A1 1 0 0 1 22.1 19.4 H3.1 A1 1 0 0 1 3.1 17.4 Z'
const BOWL_SH = 'M3.6 19 H22 C21.4 21.2 19.6 22.4 17.4 22.4 H8.4 C6 22.4 4.1 21.2 3.6 19 Z'

export default function render() {
  const defs = ['defs', {}, [
    ['linearGradient', { id: id(0), x1: '3', y1: '3', x2: '22', y2: '22', gradientUnits: 'userSpaceOnUse' }, [stop('0', BACK), stop('1', SH)]],
    ['linearGradient', { id: id(1), x1: '0.15', y1: '0.05', x2: '0.85', y2: '0.95' }, [stop('0', FR, '0.6'), stop('0.45', PA, '0.46'), stop('1', PA, '0.3')]],
    ['radialGradient', { id: id(2), cx: '0.68', cy: '0.7', r: '0.7' }, [stop('0', AC, '0.7'), stop('0.55', AC, '0.2'), stop('1', AC, '0')]],
  ]]
  const dish = [
    ['path', { d: BOWL_SH, fill: SH, 'fill-opacity': '0.08', class: 'wm-shadow' }],
    ['path', { d: BOWL, fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: BOWL, fill: `url(#${id(1)})`, stroke: 'currentColor', 'stroke-opacity': '0.25', 'stroke-width': '0.5', class: 'wm-a' }],
    ['path', { d: RIM_BACK, fill: `url(#${id(0)})`, class: 'wm-a' }],
    ['path', { d: RIM, fill: `url(#${id(1)})`, stroke: 'currentColor', 'stroke-opacity': '0.3', 'stroke-width': '0.55', class: 'wm-a' }],
    ['path', { d: 'M3.6 17.25 H20', fill: 'none', stroke: SN, 'stroke-opacity': '0.9', 'stroke-width': '0.6', 'stroke-linecap': 'round', class: 'wm-shine' }],
  ]
  return [defs,
    ...ball(7.9, 12.9, 4.4, '0.07'),
    ...ball(16.1, 12.9, 4.4, '0.07'),
    ...ball(12, 7.3, 4.6, '0.16'),
    ...dish]
}
