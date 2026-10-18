// forge/hand/liquid/avatar-monster-fluffy.mjs: a liquid-glass fluffy monster face, hand-drawn.
// A scalloped fur outline in tinted glass, two big deep glass eyes (wm-a, they blink), a dark smiling mouth with two fangs,
// and a soft shine across the top. Deterministic, pure data.
const N = 'avatar-monster-fluffy'
const g = n => `url(#wg-liquid-${N}-${n})`
const v = (r, h) => `var(--with-liquid-${r}, ${h})`
const r2 = x => Math.round(x * 100) / 100

// scalloped fur: 16 bumps on an ellipse around (12, 12.6)
function fur(cx, cy, rx, ry, n, bump) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2
    const x = r2(cx + Math.cos(a) * rx), y = r2(cy + Math.sin(a) * ry)
    if (i === 0) { d += `M${x} ${y}`; continue }
    const m = a - Math.PI / n
    const qx = r2(cx + Math.cos(m) * (rx + bump)), qy = r2(cy + Math.sin(m) * (ry + bump))
    d += `Q${qx} ${qy} ${x} ${y}`
  }
  return d + 'Z'
}

export default function render() {
  const body = fur(12, 12.8, 8.3, 8.1, 16, 1.5)
  return [
    ['defs', {}, [
      ['linearGradient', { id: `wg-liquid-${N}-0`, x1: '3', y1: '3', x2: '21', y2: '22', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': v('c1', '#4A9DFF'), 'stop-opacity': '0.3' }],
        ['stop', { offset: '1', 'stop-color': v('c1', '#4A9DFF'), 'stop-opacity': '0.75' }]]],
      ['linearGradient', { id: `wg-liquid-${N}-1`, x1: '7', y1: '7', x2: '17', y2: '12', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': v('c3', '#1C3F9E'), 'stop-opacity': '0.7' }],
        ['stop', { offset: '1', 'stop-color': v('c3', '#1C3F9E') }]]],
      ['radialGradient', { id: `wg-liquid-${N}-2`, cx: '9', cy: '6.5', r: '8', gradientUnits: 'userSpaceOnUse' }, [
        ['stop', { offset: '0', 'stop-color': v('shine', '#FFFFFF'), 'stop-opacity': '0.85' }],
        ['stop', { offset: '1', 'stop-color': v('shine', '#FFFFFF'), 'stop-opacity': '0' }]]],
    ]],
    ['ellipse', { cx: '12', cy: '22.3', rx: '7', ry: '0.9', fill: v('shadow', '#0C1A3A'), 'fill-opacity': '0.18', class: 'wm-shadow' }],
    ['path', { d: body, fill: g(0), stroke: v('c3', '#1C3F9E'), 'stroke-opacity': '0.7', 'stroke-width': '0.6', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M5.6 9.2C6.6 5.9 9.6 4.4 12.4 4.6', stroke: v('shine', '#FFFFFF'), 'stroke-width': '1', 'stroke-linecap': 'round', 'stroke-opacity': '0.9', class: 'wm-shine' }],
    ['ellipse', { cx: '10', cy: '8.5', rx: '4.5', ry: '3', fill: g(2), class: 'wm-shine' }],
    ['circle', { cx: '9.2', cy: '10.6', r: '2.3', fill: v('edge', '#F4FAFF'), stroke: v('c3', '#1C3F9E'), 'stroke-width': '0.5', class: 'wm-a' }],
    ['circle', { cx: '14.8', cy: '10.6', r: '2.3', fill: v('edge', '#F4FAFF'), stroke: v('c3', '#1C3F9E'), 'stroke-width': '0.5', class: 'wm-a' }],
    ['circle', { cx: '9.5', cy: '10.9', r: '1.2', fill: g(1), class: 'wm-a' }],
    ['circle', { cx: '14.5', cy: '10.9', r: '1.2', fill: g(1), class: 'wm-a' }],
    ['circle', { cx: '9.1', cy: '10.4', r: '0.4', fill: v('shine', '#FFFFFF'), class: 'wm-a' }],
    ['circle', { cx: '14.1', cy: '10.4', r: '0.4', fill: v('shine', '#FFFFFF'), class: 'wm-a' }],
    ['path', { d: 'M8.6 14.3Q12 17.9 15.4 14.3Z', fill: v('c3', '#1C3F9E'), stroke: v('c3', '#1C3F9E'), 'stroke-width': '0.5', 'stroke-linejoin': 'round', class: 'wm-k' }],
    ['path', { d: 'M9.9 14.75L10.5 16.05L11.1 15.2ZM14.1 14.75L13.5 16.05L12.9 15.2Z', fill: v('shine', '#FFFFFF'), class: 'wm-k' }],
    ['ellipse', { cx: '6.3', cy: '13.6', rx: '1', ry: '0.6', fill: v('c4', '#FF7EC1'), 'fill-opacity': '0.6', class: 'wm-deco' }],
    ['ellipse', { cx: '17.7', cy: '13.6', rx: '1', ry: '0.6', fill: v('c4', '#FF7EC1'), 'fill-opacity': '0.6', class: 'wm-deco' }],
  ]
}
